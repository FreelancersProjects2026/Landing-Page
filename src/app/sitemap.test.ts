import { describe, expect, it } from 'vitest'

import sitemap from './sitemap'

const languages = {
  es: 'https://solutionspjm.com/es',
  en: 'https://solutionspjm.com/en',
  'x-default': 'https://solutionspjm.com/es',
}

const privacyLanguages = {
  es: 'https://solutionspjm.com/es/privacidad',
  en: 'https://solutionspjm.com/en/privacy',
  'x-default': 'https://solutionspjm.com/es/privacidad',
}

// Fecha del build: la ruta es estática.
const lastModified = expect.any(Date)

describe('sitemap', () => {
  it('lista la landing y la política por idioma con fecha y alternativas, sin la raíz', () => {
    expect(sitemap()).toEqual([
      { url: 'https://solutionspjm.com/es', lastModified, alternates: { languages } },
      { url: 'https://solutionspjm.com/en', lastModified, alternates: { languages } },
      {
        url: 'https://solutionspjm.com/es/privacidad',
        lastModified,
        alternates: { languages: privacyLanguages },
      },
      {
        url: 'https://solutionspjm.com/en/privacy',
        lastModified,
        alternates: { languages: privacyLanguages },
      },
    ])
  })
})
