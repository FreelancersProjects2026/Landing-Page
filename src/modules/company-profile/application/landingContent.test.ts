import { describe, expect, it } from 'vitest'

import type { LandingContent } from '../domain/landingContent.ts'
import {
  buildWhatsAppUrl,
  createGetLandingContent,
  UnknownLocaleError,
} from './landingContent.ts'

describe('buildWhatsAppUrl', () => {
  it('usa solo los dígitos del teléfono y codifica el mensaje', () => {
    expect(buildWhatsAppUrl('+506 6440-0832', 'Hola PJM, ¿cotizas?')).toBe(
      'https://wa.me/50664400832?text=Hola%20PJM%2C%20%C2%BFcotizas%3F',
    )
  })
})

describe('createGetLandingContent', () => {
  const es = { locale: 'es' } as LandingContent
  const en = { locale: 'en' } as LandingContent
  const getLandingContent = createGetLandingContent({ es, en })

  it('devuelve el contenido de cada idioma', () => {
    expect(getLandingContent('es')).toBe(es)
    expect(getLandingContent('en')).toBe(en)
  })

  it('rechaza un idioma desconocido', () => {
    expect(() => getLandingContent('fr')).toThrow(UnknownLocaleError)
  })
})
