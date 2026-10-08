import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { validateLandingContent } from '../domain/landingContent.ts'
import { validateEmail } from '../domain/email.ts'
import { validateSiteUrl } from '../domain/siteUrl.ts'
import { landingContentSource, siteUrl } from './landingContentSource.ts'

const { es, en } = landingContentSource

// Vitest se ejecuta desde la raíz del repositorio.
const approvedContent = readFileSync(
  'docs/specs/003-generarContenido/contenido.md',
  'utf8',
).replace(/\s+/g, ' ')

// Preguntas frecuentes aprobadas por el negocio (Spec 008).
const faqContent = readFileSync(
  'docs/specs/008-faq/contenido.md',
  'utf8',
).replace(/\s+/g, ' ')

// Los textos de la 404 son marcadores de la Spec 006 hasta que el negocio los apruebe (T13).
const notFoundSpec = readFileSync('docs/specs/006-pagina-404/spec.md', 'utf8')

function collectTexts(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (typeof value !== 'object' || value === null) return []
  return Object.values(value).flatMap(collectTexts)
}

describe('landingContentSource', () => {
  it.each([es, en])('el contenido en $locale es válido', (content) => {
    expect(() => validateLandingContent(content)).not.toThrow()
  })

  it('comparte nombre, ubicación y WhatsApp entre idiomas', () => {
    expect(es.company).toEqual({
      name: 'solutionsPJM',
      location: 'Paraíso de Cartago, Costa Rica',
      address: { locality: 'Paraíso', region: 'Cartago', country: 'CR' },
      areaServed: 'Worldwide',
      phone: '+506 6440-0832',
      email: 'solutionspjm@gmail.com',
    })
    expect(en.company).toEqual(es.company)
  })

  it('comparte proyectos e integrantes con sus enlaces entre idiomas', () => {
    expect(en.projects.items.map(({ name, link }) => ({ name, link }))).toEqual(
      es.projects.items.map(({ name, link }) => ({ name, link })),
    )
    expect(en.team.members.map(({ name, links }) => ({ name, links }))).toEqual(
      es.team.members.map(({ name, links }) => ({ name, links })),
    )
    expect(es.team.members).toHaveLength(3)
    expect(es.projects.items).toHaveLength(4)
  })

  it('ofrece las mismas opciones de WhatsApp en ambos idiomas', () => {
    expect(es.whatsapp.options.length).toBeGreaterThan(0)
    expect(en.whatsapp.options).toHaveLength(es.whatsapp.options.length)
  })

  it.each([es, en])(
    'el correo en $locale pasa la validación de dominio',
    (content) => {
      expect(validateEmail(content.company.email)).toBe(content.company.email)
    },
  )

  it('la descripción SEO anuncia el alcance internacional aprobado', () => {
    expect(es.seo.description).toBe(
      'Desarrollo de software a medida desde Costa Rica para negocios de cualquier país: sistemas de gestión, control y métricas. Cotiza tu proyecto por WhatsApp.',
    )
    expect(en.seo.description).toBe(
      'Custom software development from Costa Rica for businesses anywhere: management, tracking and metrics systems. Get a quote for your project on WhatsApp.',
    )
  })

  it('copia de la tabla de la Spec 006 los textos de la 404 por idioma', () => {
    const rows = {
      title: 'Título',
      text: 'Texto',
      cta: 'Botón',
      imageAlt: '`alt` imagen',
    } as const

    expect(Object.keys(es.notFound)).toEqual(Object.keys(rows))
    for (const [field, label] of Object.entries(rows)) {
      const key = field as keyof typeof rows
      expect(notFoundSpec).toContain(
        `| ${label} | ${es.notFound[key]} | ${en.notFound[key]} |`,
      )
    }
  })

  it.each([es, en])('el eslogan en $locale no termina en punto', (content) => {
    expect(content.hero.slogan).not.toMatch(/\.$/)
  })

  it('publica las mismas siete preguntas frecuentes en ambos idiomas', () => {
    expect(es.faq.items).toHaveLength(7)
    expect(en.faq.items).toHaveLength(es.faq.items.length)
  })

  it('solo Orgánico CR enlaza a su sitio y ninguna descripción lleva URLs', () => {
    for (const { projects } of [es, en]) {
      expect(projects.items.filter(({ link }) => link)).toEqual([
        expect.objectContaining({
          name: 'Orgánico CR',
          link: { label: 'organicocr.store', url: 'https://organicocr.store' },
        }),
      ])
      expect(
        JSON.stringify(projects.items.map(({ description }) => description)),
      ).not.toMatch(/https?:|www\./)
    }
  })

  it('describe Orgánico CR al final de los proyectos en cada idioma', () => {
    expect(es.projects.items.at(-1)?.description).toBe(
      'Tienda en línea de productos orgánicos de productores locales de Costa Rica: catálogo, carrito, cuenta de usuario y pedidos por WhatsApp con entrega a domicilio.',
    )
    expect(en.projects.items.at(-1)?.description).toBe(
      'Online store for organic produce from local Costa Rican growers: catalog, shopping cart, user accounts and WhatsApp ordering with home delivery.',
    )
  })

  it('Patrick conserva su GitHub y no publica LinkedIn', () => {
    const patrick = es.team.members.find(
      ({ name }) => name === 'Patrick Jackson Gómez',
    )

    expect(patrick?.links.map(({ label }) => label)).toEqual(['GitHub'])
  })

  it.each([es, en])(
    'copia literalmente de contenido.md los textos en $locale',
    (content) => {
      // Datos técnicos que no se muestran: el idioma y el código ISO del país (JSON-LD).
      const technical = [content.locale, content.company.address.country]
      const missing = collectTexts({
        ...content,
        notFound: {},
        faq: {},
        menu: { ...content.menu, faq: '' },
      }).filter(
        (text) =>
          text !== '' &&
          !technical.includes(text) &&
          !approvedContent.includes(text),
      )

      expect(missing).toEqual([])
    },
  )

  it.each([es, en])(
    'copia literalmente de la Spec 008 las preguntas frecuentes en $locale',
    (content) => {
      const missing = collectTexts([content.faq, content.menu.faq]).filter(
        (text) => !faqContent.includes(text),
      )

      expect(missing).toEqual([])
    },
  )
})

describe('siteUrl', () => {
  it('es el dominio canónico de producción y pasa la validación', () => {
    expect(siteUrl).toBe('https://solutionspjm.com')
    expect(validateSiteUrl(siteUrl)).toBe(siteUrl)
  })
})
