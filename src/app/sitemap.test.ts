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

describe('sitemap', () => {
  it('lista la landing y la política por idioma con sus alternativas, sin la raíz', () => {
    expect(sitemap()).toEqual([
      { url: 'https://solutionspjm.com/es', alternates: { languages } },
      { url: 'https://solutionspjm.com/en', alternates: { languages } },
      {
        url: 'https://solutionspjm.com/es/privacidad',
        alternates: { languages: privacyLanguages },
      },
      {
        url: 'https://solutionspjm.com/en/privacy',
        alternates: { languages: privacyLanguages },
      },
    ])
  })
})
