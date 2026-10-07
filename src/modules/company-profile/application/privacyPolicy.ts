import type { Locale } from '../domain/landingContent.ts'
import type { PrivacyPolicy } from '../domain/privacyPolicy.ts'

export type PrivacyPolicySource = Readonly<Record<Locale, PrivacyPolicy>>
