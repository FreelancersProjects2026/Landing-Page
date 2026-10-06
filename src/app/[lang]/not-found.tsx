import {
  defaultLocale,
  getLandingContent,
  locales,
  type Locale,
  type NotFoundContent,
} from '@modules/company-profile'

import { LocalizedNotFound } from '@/components/not-found/localized-not-found'
import { notFoundImageSrc } from '@/components/not-found/not-found-image'

// `locales` define el tipo Locale, así que el objeto trae todos los idiomas.
const byLocale = Object.fromEntries(
  locales.map((locale) => [
    locale,
    { ...getLandingContent(locale).notFound, homeHref: `/${locale}` },
  ]),
) as Record<Locale, NotFoundContent & { homeHref: string }>

export default function NotFound() {
  return (
    <LocalizedNotFound
      byLocale={byLocale}
      fallbackLocale={defaultLocale}
      imageSrc={notFoundImageSrc}
    />
  )
}
