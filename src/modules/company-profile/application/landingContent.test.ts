import { describe, expect, it } from 'vitest'

import type { LandingContent } from '../domain/landingContent.ts'
import {
  buildEmailComposeUrl,
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

describe('buildEmailComposeUrl', () => {
  it('arma el enlace para redactar en Gmail web con el correo codificado', () => {
    expect(buildEmailComposeUrl('solutionspjm@gmail.com')).toBe(
      'https://mail.google.com/mail/?view=cm&fs=1&to=solutionspjm%40gmail.com',
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
