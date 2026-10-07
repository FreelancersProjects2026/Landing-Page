import { createGetLandingContent } from './application/landingContent.ts'
import { createGetPrivacyPolicy } from './application/privacyPolicy.ts'
import { landingContentSource } from './infrastructure/landingContentSource.ts'
import { privacyPolicySource } from './infrastructure/privacyPolicySource.ts'

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
  NotFoundContent,
  PostalAddress,
  Project,
  Seo,
  Service,
  Step,
  TeamMember,
  FaqItem,
} from './domain/landingContent.ts'
export {
  buildPrivacyAlternates,
  buildPrivacyPath,
  buildPrivacyUrl,
  privacyPaths,
} from './application/privacyPolicy.ts'
export type { PrivacyPolicy, PrivacySection } from './domain/privacyPolicy.ts'
export { siteUrl } from './infrastructure/landingContentSource.ts'

export const getLandingContent = createGetLandingContent(landingContentSource)
export const getPrivacyPolicy = createGetPrivacyPolicy(privacyPolicySource)
