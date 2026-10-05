import type { MetadataRoute } from 'next'

import {
  buildLanguageAlternates,
  buildLocaleUrl,
  locales,
  siteUrl,
} from '@modules/company-profile'

// `/` no se lista: redirige a `/es`.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = buildLanguageAlternates(siteUrl)
  return locales.map((locale) => ({
    url: buildLocaleUrl(siteUrl, locale),
    alternates: { languages },
  }))
}
