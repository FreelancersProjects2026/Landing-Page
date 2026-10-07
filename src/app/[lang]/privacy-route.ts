import type { Metadata } from 'next'
import {
  buildPrivacyAlternates,
  buildPrivacyUrl,
  getLandingContent,
  getPrivacyPolicy,
  siteUrl,
  type Locale,
} from '@modules/company-profile'

import { openGraphLocale } from './open-graph'

// Armado compartido de /es/privacidad y /en/privacy: cada page.tsx fija su idioma.
export function privacyMetadata(locale: Locale): Metadata {
  const { seo } = getPrivacyPolicy(locale)
  const canonical = buildPrivacyUrl(siteUrl, locale)

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical, languages: buildPrivacyAlternates(siteUrl) },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      locale: openGraphLocale[locale],
      siteName: getLandingContent(locale).company.name,
      type: 'website',
    },
  }
}

export function privacyPageProps(locale: Locale) {
  return {
    policy: getPrivacyPolicy(locale),
    homeHref: `/${locale}`,
    homeLabel: getLandingContent(locale).notFound.cta,
    headerImageSrc: '/privacidad/escudo-privacidad.webp',
  }
}
