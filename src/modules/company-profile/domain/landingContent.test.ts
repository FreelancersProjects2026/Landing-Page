import { describe, expect, it } from 'vitest'

import {
  InvalidLandingContentError,
  validateLandingContent,
  type LandingContent,
} from './landingContent.ts'

function validContent(): LandingContent {
  return {
    locale: 'es',
    company: {
      name: 'solutionsPJM',
      location: 'Paraíso de Cartago, Costa Rica',
      address: { locality: 'Paraíso', region: 'Cartago', country: 'CR' },
      areaServed: 'Costa Rica',
      phone: '+506 6440-0832',
    },
    seo: {
      title: 'Desarrollo de software a medida Costa Rica | solutionsPJM',
      description: 'Desarrollo de software a medida en Costa Rica.',
    },
    whatsappMessage: 'Hola solutionsPJM',
    menu: {
      services: 'Servicios',
      process: 'Cómo trabajamos',
      projects: 'Proyectos',
      team: 'Equipo',
      contact: 'Contacto',
      toggleLabel: 'Menú',
    },
    hero: {
      heading: 'Desarrollo de software a medida en Costa Rica',
      slogan: 'Software que comienza por entender tu negocio',
      sloganWords: ['negocio', 'empresa'],
      subtitle: 'Desarrollamos software a medida.',
      cta: 'Cotiza por WhatsApp',
    },
    services: {
      title: 'Aplicaciones web a medida',
      intro: 'Construimos la herramienta que necesitas.',
      items: [{ title: 'Sistemas de gestión', description: 'Centraliza.' }],
    },
    process: {
      title: 'Primero entendemos tu negocio',
      steps: [{ title: 'Entender', description: 'Conversamos contigo.' }],
      differentiatorsTitle: 'Diferenciadores',
      differentiators: ['Trato directo.'],
    },
    projects: {
      title: 'Proyectos',
      items: [{ name: 'Agromonitoreo', description: 'Software agrícola.' }],
    },
    team: {
      title: 'Equipo',
      intro: 'Somos tres.',
      members: [
        {
          name: 'Jason Moya Brenes',
          role: 'Desarrollador full-stack.',
          links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/x/' }],
        },
      ],
    },
    contact: {
      title: '¿Listo?',
      text: 'Cuéntanos.',
      cta: 'Escríbenos por WhatsApp',
    },
    footer: { text: 'solutionsPJM — desarrollo.', rights: '© 2026 PJM' },
  }
}

describe('validateLandingContent', () => {
  it('acepta un contenido válido', () => {
    const content = validContent()

    expect(validateLandingContent(content)).toBe(content)
  })

  it('rechaza un título de más de 60 caracteres', () => {
    const content = validContent()
    const seo = {
      ...content.seo,
      title: `${content.seo.title} ${'x'.repeat(10)}`,
    }

    expect(() => validateLandingContent({ ...content, seo })).toThrow(/título/)
  })

  it('rechaza una meta description de más de 160 caracteres', () => {
    const content = validContent()
    const description = `${content.seo.description} ${'x'.repeat(120)}`

    expect(() =>
      validateLandingContent({
        ...content,
        seo: { ...content.seo, description },
      }),
    ).toThrow(/descripción/)
  })

  it.each([
    ['título', 'title'],
    ['descripción', 'description'],
  ] as const)('exige la palabra clave y «Costa Rica» en el %s', (_, field) => {
    const content = validContent()

    expect(() =>
      validateLandingContent({
        ...content,
        seo: { ...content.seo, [field]: 'Software en Costa Rica' },
      }),
    ).toThrow(InvalidLandingContentError)
    expect(() =>
      validateLandingContent({
        ...content,
        seo: {
          ...content.seo,
          [field]: 'Desarrollo de software a medida | PJM',
        },
      }),
    ).toThrow(InvalidLandingContentError)
  })

  it('exige la palabra clave en el H1 sin distinguir mayúsculas', () => {
    const content = validContent()
    const hero = {
      ...content.hero,
      heading: 'DESARROLLO DE SOFTWARE A MEDIDA EN COSTA RICA',
    }

    expect(() => validateLandingContent({ ...content, hero })).not.toThrow()
    expect(() =>
      validateLandingContent({
        ...content,
        hero: { ...content.hero, heading: 'Software para tu negocio' },
      }),
    ).toThrow(/H1/)
  })

  it('usa la palabra clave en inglés para el contenido en inglés', () => {
    const content = validContent()

    expect(() => validateLandingContent({ ...content, locale: 'en' })).toThrow(
      InvalidLandingContentError,
    )
  })

  it('rechaza textos vacíos en cualquier sección', () => {
    const content = validContent()

    expect(() =>
      validateLandingContent({
        ...content,
        projects: {
          ...content.projects,
          items: [{ name: 'Agromonitoreo', description: '  ' }],
        },
      }),
    ).toThrow(/vacío/)
  })

  it('rechaza textos marcados como [PENDIENTE]', () => {
    const content = validContent()

    expect(() =>
      validateLandingContent({
        ...content,
        footer: { ...content.footer, text: '[PENDIENTE]' },
      }),
    ).toThrow(/PENDIENTE/)
  })

  it('exige que el eslogan contenga la primera palabra rotativa', () => {
    const content = validContent()

    expect(() =>
      validateLandingContent({
        ...content,
        hero: { ...content.hero, sloganWords: ['empresa', 'negocio'] },
      }),
    ).toThrow(/palabra rotativa/)
  })
})
