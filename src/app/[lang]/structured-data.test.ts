import { describe, expect, it } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import { buildStructuredData, serializeJsonLd } from './structured-data'

describe('buildStructuredData', () => {
  it('describe a PJM Solutions como ProfessionalService sin URL', () => {
    const content = getLandingContent('es')

    expect(buildStructuredData(content)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'PJM Solutions',
      description: content.seo.description,
      telephone: '+506 6440-0832',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Paraíso',
        addressRegion: 'Cartago',
        addressCountry: 'CR',
      },
      areaServed: { '@type': 'Country', name: 'Costa Rica' },
    })
  })
})

describe('serializeJsonLd', () => {
  it('escapa < para que el JSON no pueda cerrar la etiqueta <script>', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)' })

    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)' })
  })
})
