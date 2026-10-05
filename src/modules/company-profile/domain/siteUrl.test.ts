import { describe, expect, it } from 'vitest'

import { defaultLocale, locales } from './landingContent.ts'
import { InvalidSiteUrlError, validateSiteUrl } from './siteUrl.ts'

describe('validateSiteUrl', () => {
  it('acepta un origen https sin www', () => {
    expect(validateSiteUrl('https://solutionspjm.com')).toBe(
      'https://solutionspjm.com',
    )
  })

  it.each([
    ['sin protocolo https', 'http://solutionspjm.com'],
    ['con www', 'https://www.solutionspjm.com'],
    ['con barra final', 'https://solutionspjm.com/'],
    ['con ruta', 'https://solutionspjm.com/es'],
    ['con parámetros', 'https://solutionspjm.com?a=1'],
    ['que no es URL', 'solutionspjm.com'],
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
