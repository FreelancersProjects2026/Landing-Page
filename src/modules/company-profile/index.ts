import { createGetLandingContent } from './application/landingContent.ts'
import { landingContentSource } from './infrastructure/landingContentSource.ts'

export {
  buildMailtoUrl,
  buildWhatsAppUrl,
} from './application/landingContent.ts'
export {
  buildLanguageAlternates,
  buildLocaleUrl,
  type LanguageAlternates,
} from './application/siteUrls.ts'
export { defaultLocale, isLocale, locales } from './domain/landingContent.ts'
export type {
  Contact,
  ExternalLink,
  LandingContent,
  Locale,
  PostalAddress,
  Project,
  Seo,
  Service,
  Step,
  TeamMember,
} from './domain/landingContent.ts'
export { siteUrl } from './infrastructure/landingContentSource.ts'

export const getLandingContent = createGetLandingContent(landingContentSource)
