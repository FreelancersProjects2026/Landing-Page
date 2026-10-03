import type { LandingContent } from '@modules/company-profile'

// Sin `url` hasta que exista el dominio (pendiente de la spec 003).
export function buildStructuredData({ company, seo }: LandingContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
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
