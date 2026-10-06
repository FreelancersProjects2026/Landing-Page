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
      areaServed: 'Costa Rica',
      phone: '+506 6440-0832',
      email: 'solutionspjm@gmail.com',
    })
    expect(en.company).toEqual(es.company)
  })

  it('comparte proyectos e integrantes con sus enlaces entre idiomas', () => {
    expect(en.projects.items.map(({ name }) => name)).toEqual(
      es.projects.items.map(({ name }) => name),
    )
    expect(en.team.members.map(({ name, links }) => ({ name, links }))).toEqual(
      es.team.members.map(({ name, links }) => ({ name, links })),
    )
    expect(es.team.members).toHaveLength(3)
    expect(es.projects.items).toHaveLength(3)
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

  it.each([es, en])('el eslogan en $locale no termina en punto', (content) => {
    expect(content.hero.slogan).not.toMatch(/\.$/)
  })

  it('no publica enlaces en los proyectos', () => {
    const projects = JSON.stringify([es.projects, en.projects])

    expect(projects).not.toMatch(/https?:|www\./)
  })

  it.each([es, en])(
    'copia literalmente de contenido.md los textos en $locale',
    (content) => {
      // Datos técnicos que no se muestran: el idioma y el código ISO del país (JSON-LD).
      const technical = [content.locale, content.company.address.country]
      const missing = collectTexts(content).filter(
        (text) => !technical.includes(text) && !approvedContent.includes(text),
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
