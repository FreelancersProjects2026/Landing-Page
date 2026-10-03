export const locales = ['es', 'en'] as const

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export interface Seo {
  readonly title: string
  readonly description: string
}

export interface Contact {
  readonly name: string
  readonly location: string
  readonly phone: string
}

export interface Service {
  readonly title: string
  readonly description: string
}

export interface Step {
  readonly title: string
  readonly description: string
}

export interface Project {
  readonly name: string
  /** Traducción del nombre cuando este se conserva en otro idioma. */
  readonly nameTranslation?: string
  readonly description: string
}

export interface ExternalLink {
  readonly label: string
  readonly url: string
}

export interface TeamMember {
  readonly name: string
  readonly role: string
  readonly links: readonly ExternalLink[]
}

export interface LandingContent {
  readonly locale: Locale
  readonly company: Contact
  readonly seo: Seo
  readonly whatsappMessage: string
  readonly menu: {
    readonly services: string
    readonly process: string
    readonly projects: string
    readonly team: string
    readonly contact: string
  }
  readonly hero: {
    readonly heading: string
    readonly slogan: string
    readonly subtitle: string
    readonly cta: string
  }
  readonly services: {
    readonly title: string
    readonly intro: string
    readonly items: readonly Service[]
  }
  readonly process: {
    readonly title: string
    readonly steps: readonly Step[]
    readonly differentiatorsTitle: string
    readonly differentiators: readonly string[]
  }
  readonly projects: {
    readonly title: string
    readonly items: readonly Project[]
  }
  readonly team: {
    readonly title: string
    readonly intro: string
    readonly members: readonly TeamMember[]
  }
  readonly contact: {
    readonly title: string
    readonly text: string
    readonly cta: string
  }
  readonly footer: {
    readonly text: string
    readonly rights: string
  }
}

export const MAX_TITLE_LENGTH = 60
export const MAX_DESCRIPTION_LENGTH = 160

// La palabra clave principal se valida en dos partes para admitir redacciones naturales.
const primaryKeyword: Record<Locale, readonly string[]> = {
  es: ['desarrollo de software a medida', 'costa rica'],
  en: ['custom software development', 'costa rica'],
}

const PENDING_MARK = '[PENDIENTE]'

export class InvalidLandingContentError extends Error {
  readonly problems: readonly string[]

  constructor(problems: readonly string[]) {
    super(`El contenido de la landing no es válido: ${problems.join('; ')}`)
    this.name = 'InvalidLandingContentError'
    this.problems = problems
  }
}

function collectTexts(value: unknown, path: string): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (typeof value !== 'object' || value === null) return []
  return Object.entries(value).flatMap(([key, child]) =>
    collectTexts(child, path ? `${path}.${key}` : key),
  )
}

function hasPrimaryKeyword(text: string, locale: Locale): boolean {
  const normalized = text.toLowerCase()
  return primaryKeyword[locale].every((part) => normalized.includes(part))
}

export function validateLandingContent(
  content: LandingContent,
): LandingContent {
  const problems: string[] = []
  const { seo, hero, locale } = content

  if (seo.title.length > MAX_TITLE_LENGTH) {
    problems.push(`el título supera ${MAX_TITLE_LENGTH} caracteres`)
  }
  if (seo.description.length > MAX_DESCRIPTION_LENGTH) {
    problems.push(`la descripción supera ${MAX_DESCRIPTION_LENGTH} caracteres`)
  }
  for (const [label, text] of [
    ['el título', seo.title],
    ['la descripción', seo.description],
    ['el H1', hero.heading],
  ]) {
    if (!hasPrimaryKeyword(text, locale)) {
      problems.push(`falta la palabra clave principal en ${label}`)
    }
  }
  for (const [path, text] of collectTexts(content, '')) {
    if (text.trim().length === 0) problems.push(`${path} está vacío`)
    if (text.includes(PENDING_MARK)) {
      problems.push(`${path} está marcado como ${PENDING_MARK}`)
    }
  }

  if (problems.length > 0) throw new InvalidLandingContentError(problems)
  return content
}
