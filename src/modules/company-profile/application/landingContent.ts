import {
  isLocale,
  type LandingContent,
  type Locale,
} from '../domain/landingContent.ts'

export type LandingContentSource = Readonly<Record<Locale, LandingContent>>

export type GetLandingContent = (locale: string) => LandingContent

export class UnknownLocaleError extends Error {
  constructor(locale: string) {
    super(`Idioma no soportado: ${locale}`)
    this.name = 'UnknownLocaleError'
  }
}

export function createGetLandingContent(
  source: LandingContentSource,
): GetLandingContent {
  return (locale) => {
    if (!isLocale(locale)) throw new UnknownLocaleError(locale)
    return source[locale]
  }
}

export function buildMailtoUrl(email: string): string {
  return `mailto:${email}`
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
