import type { MetadataRoute } from 'next'

import {
  buildLanguageAlternates,
  buildLocaleUrl,
  buildPrivacyAlternates,
  buildPrivacyUrl,
  locales,
  siteUrl,
} from '@modules/company-profile'

// `/` no se lista: redirige a `/es`.
// lastModified: fecha del build (ruta estática); cada deploy publica contenido nuevo.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    [buildLocaleUrl, buildLanguageAlternates(siteUrl)],
    [buildPrivacyUrl, buildPrivacyAlternates(siteUrl)],
  ] as const
  const lastModified = new Date()
  return pages.flatMap(([buildUrl, languages]) =>
    locales.map((locale) => ({
      url: buildUrl(siteUrl, locale),
      lastModified,
      alternates: { languages },
    })),
  )
}
