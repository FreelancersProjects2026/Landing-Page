import { describe, expect, it } from 'vitest'

import { UnknownLocaleError } from './landingContent.ts'
import {
  buildPrivacyAlternates,
  buildPrivacyPath,
  buildPrivacyUrl,
  createGetPrivacyPolicy,
  privacyPaths,
  type PrivacyPolicySource,
} from './privacyPolicy.ts'

const siteUrl = 'https://solutionspjm.com'

describe('URLs de la política de privacidad', () => {
  it('usa un slug por idioma', () => {
    expect(privacyPaths).toEqual({ es: 'privacidad', en: 'privacy' })
  })

  it.each([
    ['es', '/es/privacidad'],
    ['en', '/en/privacy'],
  ] as const)('construye la ruta y la URL absoluta de %s', (locale, path) => {
    expect(buildPrivacyPath(locale)).toBe(path)
    expect(buildPrivacyUrl(siteUrl, locale)).toBe(`${siteUrl}${path}`)
  })

  it('cruza las alternativas por idioma, con x-default hacia español', () => {
    expect(buildPrivacyAlternates(siteUrl)).toEqual({
      es: 'https://solutionspjm.com/es/privacidad',
      en: 'https://solutionspjm.com/en/privacy',
      'x-default': 'https://solutionspjm.com/es/privacidad',
    })
  })
})

describe('createGetPrivacyPolicy', () => {
  const source = {
    es: { locale: 'es' },
    en: { locale: 'en' },
  } as unknown as PrivacyPolicySource

  it('devuelve la política del idioma pedido', () => {
    const get = createGetPrivacyPolicy(source)

    expect(get('en')).toBe(source.en)
    expect(get('es')).toBe(source.es)
  })

  it('rechaza un idioma no soportado', () => {
    expect(() => createGetPrivacyPolicy(source)('fr')).toThrow(
      UnknownLocaleError,
    )
  })
})
