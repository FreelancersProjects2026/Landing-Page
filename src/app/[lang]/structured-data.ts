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
    areaServed: company.areaServed,
  }
}

// Mismas preguntas que la sección visible: Google exige que el FAQPage coincida con la página.
export function buildFaqStructuredData({ faq, locale }: LandingContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: faq.items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
