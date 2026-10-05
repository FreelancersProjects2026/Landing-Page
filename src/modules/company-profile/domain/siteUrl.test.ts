import { describe, expect, it } from 'vitest'

import { defaultLocale, locales } from './landingContent.ts'
import { InvalidSiteUrlError, validateSiteUrl } from './siteUrl.ts'

describe('validateSiteUrl', () => {
  it('acepta un origen https con www', () => {
    expect(validateSiteUrl('https://www.solutionspjm.com')).toBe(
      'https://www.solutionspjm.com',
    )
  })

  it.each([
    ['sin protocolo https', 'http://www.solutionspjm.com'],
    ['sin www', 'https://solutionspjm.com'],
    ['con barra final', 'https://www.solutionspjm.com/'],
    ['con ruta', 'https://www.solutionspjm.com/es'],
    ['con parámetros', 'https://www.solutionspjm.com?a=1'],
    ['que no es URL', 'www.solutionspjm.com'],
    ['vacía', ''],
  ])('rechaza una URL %s', (_, value) => {
    expect(() => validateSiteUrl(value)).toThrow(InvalidSiteUrlError)
  })
})

describe('defaultLocale', () => {
  it('es español y pertenece a los idiomas publicados', () => {
    expect(defaultLocale).toBe('es')
    expect(locales).toContain(defaultLocale)
  })
})
