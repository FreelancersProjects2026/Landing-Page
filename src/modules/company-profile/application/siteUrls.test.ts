import { describe, expect, it } from 'vitest'

import { buildLanguageAlternates, buildLocaleUrl } from './siteUrls.ts'

const siteUrl = 'https://solutionspjm.com'

describe('buildLocaleUrl', () => {
  it.each([
    ['es', 'https://solutionspjm.com/es'],
    ['en', 'https://solutionspjm.com/en'],
  ] as const)('construye la URL absoluta de %s', (locale, url) => {
    expect(buildLocaleUrl(siteUrl, locale)).toBe(url)
  })
})

describe('buildLanguageAlternates', () => {
  it('incluye cada idioma y x-default apuntando al idioma por defecto', () => {
    expect(buildLanguageAlternates(siteUrl)).toEqual({
      es: 'https://solutionspjm.com/es',
      en: 'https://solutionspjm.com/en',
      'x-default': 'https://solutionspjm.com/es',
    })
  })
})
