import {
  defaultLocale,
  locales,
  type Locale,
} from '../domain/landingContent.ts'

export type LanguageAlternates = Readonly<Record<Locale | 'x-default', string>>

export function buildLocaleUrl(siteUrl: string, locale: Locale): string {
  return `${siteUrl}/${locale}`
}

// Alternativas hreflang: una por idioma publicado y x-default hacia el idioma por defecto.
export function buildLanguageAlternates(siteUrl: string): LanguageAlternates {
  const byLocale = Object.fromEntries(
    locales.map((locale) => [locale, buildLocaleUrl(siteUrl, locale)]),
  ) as Record<Locale, string>
  return { ...byLocale, 'x-default': byLocale[defaultLocale] }
}
