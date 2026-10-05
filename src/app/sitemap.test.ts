import { describe, expect, it } from 'vitest'

import sitemap from './sitemap'

const languages = {
  es: 'https://solutionspjm.com/es',
  en: 'https://solutionspjm.com/en',
  'x-default': 'https://solutionspjm.com/es',
}

describe('sitemap', () => {
  it('lista una URL absoluta por idioma con sus alternativas, sin la raíz', () => {
    expect(sitemap()).toEqual([
      { url: 'https://solutionspjm.com/es', alternates: { languages } },
      { url: 'https://solutionspjm.com/en', alternates: { languages } },
    ])
  })
})
