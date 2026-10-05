import {
  buildLocaleUrl,
  siteUrl,
  type LandingContent,
} from '@modules/company-profile'

export function buildStructuredData({ company, seo, locale }: LandingContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
    url: buildLocaleUrl(siteUrl, locale),
    description: seo.description,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    areaServed: { '@type': 'Country', name: company.areaServed },
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
