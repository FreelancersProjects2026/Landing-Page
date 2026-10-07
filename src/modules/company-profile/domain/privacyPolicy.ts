import {
  collectTexts,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  type Locale,
  type Seo,
} from './landingContent.ts'

export interface PrivacySection {
  readonly heading: string
  /** Lista que se muestra antes de los párrafos (sección «Qué datos tratamos»). */
  readonly items?: readonly string[]
  readonly paragraphs: readonly string[]
}

export interface PrivacyPolicy {
  readonly locale: Locale
  readonly seo: Seo
  readonly footerLink: string
  readonly title: string
  readonly updated: string
  readonly intro: string
  readonly sections: readonly PrivacySection[]
}

export class InvalidPrivacyPolicyError extends Error {
  readonly problems: readonly string[]

  constructor(problems: readonly string[]) {
    super(`La política de privacidad no es válida: ${problems.join('; ')}`)
    this.name = 'InvalidPrivacyPolicyError'
    this.problems = problems
  }
}

export function validatePrivacyPolicy(policy: PrivacyPolicy): PrivacyPolicy {
  const problems: string[] = []
  const { seo, sections } = policy

  if (seo.title.length > MAX_TITLE_LENGTH) {
    problems.push(`el título supera ${MAX_TITLE_LENGTH} caracteres`)
  }
  if (seo.description.length > MAX_DESCRIPTION_LENGTH) {
    problems.push(`la descripción supera ${MAX_DESCRIPTION_LENGTH} caracteres`)
  }
  if (sections.length === 0) problems.push('falta al menos una sección')
  for (const { heading, paragraphs, items = [] } of sections) {
    if (paragraphs.length + items.length === 0) {
      problems.push(`la sección «${heading}» está vacía`)
    }
  }
  for (const [path, text] of collectTexts(policy, '')) {
    if (text.trim().length === 0) problems.push(`${path} está vacío`)
  }

  if (problems.length > 0) throw new InvalidPrivacyPolicyError(problems)
  return policy
}
