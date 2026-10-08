import { describe, expect, it } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import {
  buildFaqStructuredData,
  buildStructuredData,
  serializeJsonLd,
} from './structured-data'

describe('buildStructuredData', () => {
  it.each(['es', 'en'])(
    'describe a solutionsPJM como ProfessionalService con la URL de %s',
    (lang) => {
      const content = getLandingContent(lang)

      expect(buildStructuredData(content)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'solutionsPJM',
        alternateName: 'solutions PJM',
        url: `https://solutionspjm.com/${lang}`,
        description: content.seo.description,
        telephone: '+506 6440-0832',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paraíso',
          addressRegion: 'Cartago',
          addressCountry: 'CR',
        },
        areaServed: 'Worldwide',
      })
    },
  )
})

describe('buildFaqStructuredData', () => {
  it.each(['es', 'en'])(
    'publica las preguntas frecuentes en %s como FAQPage',
    (lang) => {
      const content = getLandingContent(lang)

      expect(buildFaqStructuredData(content)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lang,
        mainEntity: content.faq.items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      })
    },
  )
})

describe('serializeJsonLd', () => {
  it('escapa < para que el JSON no pueda cerrar la etiqueta <script>', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)' })

    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)' })
  })
})
