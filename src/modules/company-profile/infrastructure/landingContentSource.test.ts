import { describe, expect, it } from 'vitest'

import { validateLandingContent } from '../domain/landingContent.ts'
import { landingContentSource } from './landingContentSource.ts'

const { es, en } = landingContentSource

describe('landingContentSource', () => {
  it.each([es, en])('el contenido en $locale es válido', (content) => {
    expect(() => validateLandingContent(content)).not.toThrow()
  })

  it('comparte nombre, ubicación y WhatsApp entre idiomas', () => {
    expect(es.company).toEqual({
      name: 'PJM Solutions',
      location: 'Paraíso de Cartago, Costa Rica',
      address: { locality: 'Paraíso', region: 'Cartago', country: 'CR' },
      areaServed: 'Costa Rica',
      phone: '+506 6440-0832',
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
    expect(es.projects.items).toHaveLength(2)
  })

  it('no publica enlaces en los proyectos', () => {
    const projects = JSON.stringify([es.projects, en.projects])

    expect(projects).not.toMatch(/https?:|www\./)
  })
})
