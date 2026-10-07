import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from '../domain/landingContent.ts'
import type { PrivacyPolicy } from '../domain/privacyPolicy.ts'
import { UnknownLocaleError } from './landingContent.ts'
import type { LanguageAlternates } from './siteUrls.ts'

export type PrivacyPolicySource = Readonly<Record<Locale, PrivacyPolicy>>

export type GetPrivacyPolicy = (locale: string) => PrivacyPolicy

// Slug por idioma (spec 007): /en/privacy y /es/privacidad no existen.
export const privacyPaths: Readonly<Record<Locale, string>> = {
  es: 'privacidad',
  en: 'privacy',
}

export function buildPrivacyPath(locale: Locale): string {
  return `/${locale}/${privacyPaths[locale]}`
}

export function buildPrivacyUrl(siteUrl: string, locale: Locale): string {
  return `${siteUrl}${buildPrivacyPath(locale)}`
}

export function buildPrivacyAlternates(siteUrl: string): LanguageAlternates {
  const byLocale = Object.fromEntries(
    locales.map((locale) => [locale, buildPrivacyUrl(siteUrl, locale)]),
  ) as Record<Locale, string>
  return { ...byLocale, 'x-default': byLocale[defaultLocale] }
}

export function createGetPrivacyPolicy(
  source: PrivacyPolicySource,
): GetPrivacyPolicy {
  return (locale) => {
    if (!isLocale(locale)) throw new UnknownLocaleError(locale)
    return source[locale]
  }
}
