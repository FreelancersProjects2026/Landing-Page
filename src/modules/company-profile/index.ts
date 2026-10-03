import { createGetLandingContent } from './application/landingContent.ts'
import { landingContentSource } from './infrastructure/landingContentSource.ts'

export { buildWhatsAppUrl } from './application/landingContent.ts'
export { isLocale, locales } from './domain/landingContent.ts'
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

export const getLandingContent = createGetLandingContent(landingContentSource)
