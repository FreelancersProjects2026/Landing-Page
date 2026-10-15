import {
  buildLocaleUrl,
  siteUrl,
  type LandingContent,
  type OpeningHours,
} from '@modules/company-profile'

function buildOpeningHoursSpecification({ days, opens, closes }: OpeningHours) {
  return [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes },
  ]
}

export function buildStructuredData({ company, seo, locale }: LandingContent) {
  const logoUrl = `${siteUrl}${company.logo}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
    alternateName: company.alternateName,
    url: buildLocaleUrl(siteUrl, locale),
    description: seo.description,
    telephone: company.phone,
    email: company.email,
    logo: logoUrl,
    image: logoUrl,
    sameAs: company.socialProfiles.map(({ url }) => url),
    openingHoursSpecification: buildOpeningHoursSpecification(
      company.openingHours,
    ),
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
