export const locales = ['es', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export interface Seo {
  readonly title: string
  readonly description: string
}

export interface PostalAddress {
  readonly locality: string
  readonly region: string
  readonly country: string
}

export interface Contact {
  readonly name: string
  readonly location: string
  readonly address: PostalAddress
  readonly areaServed: string
  readonly phone: string
  readonly email: string
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
  /** Sitio público del proyecto, si se puede visitar. */
  readonly link?: ExternalLink
}

export interface ExternalLink {
  readonly label: string
  readonly url: string
}

export interface WhatsAppOption {
  readonly label: string
  readonly message: string
}

export interface TeamMember {
  readonly name: string
  readonly role: string
  readonly links: readonly ExternalLink[]
}

export interface FaqItem {
  readonly question: string
  readonly answer: string
}

export interface NotFoundContent {
  readonly title: string
  readonly text: string
  readonly cta: string
  readonly imageAlt: string
}

export interface LandingContent {
  readonly locale: Locale
  readonly company: Contact
  readonly seo: Seo
  readonly whatsappMessage: string
  /** Botón flotante: cada opción abre WhatsApp con su mensaje predefinido. */
  readonly whatsapp: {
    readonly label: string
    readonly options: readonly WhatsAppOption[]
  }
  readonly menu: {
    readonly services: string
    readonly process: string
    readonly projects: string
    readonly team: string
    readonly faq: string
    readonly contact: string
    readonly toggleLabel: string
  }
  readonly hero: {
    readonly heading: string
    readonly slogan: string
    /** Palabras que rotan en el eslogan; la primera es la que aparece en `slogan`. */
    readonly sloganWords: readonly string[]
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
  readonly faq: {
    readonly title: string
    readonly items: readonly FaqItem[]
  }
  readonly contact: {
    readonly title: string
    readonly text: string
    readonly cta: string
    readonly emailLabel: string
  }
  readonly footer: {
    readonly text: string
    readonly rights: string
  }
  readonly notFound: NotFoundContent
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

export function collectTexts(value: unknown, path: string): [string, string][] {
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
  const [firstWord] = hero.sloganWords
  if (!firstWord || !hero.slogan.includes(firstWord)) {
    problems.push('el eslogan no contiene la primera palabra rotativa')
  }
  if (content.whatsapp.options.length === 0) {
    problems.push('falta al menos una opción de WhatsApp')
  }
  if (content.faq.items.length === 0) {
    problems.push('falta al menos una pregunta frecuente')
  }
  const questions = content.faq.items.map(({ question }) => question)
  for (const question of new Set(questions)) {
    if (questions.indexOf(question) !== questions.lastIndexOf(question)) {
      problems.push(`la pregunta frecuente «${question}» está repetida`)
    }
  }
  content.projects.items.forEach(({ link }, index) => {
    if (
      link &&
      !(URL.canParse(link.url) && new URL(link.url).protocol === 'https:')
    ) {
      problems.push(`projects.items.${index}.link.url no usa https`)
    }
  })
  for (const [path, text] of collectTexts(content, '')) {
    if (text.trim().length === 0) problems.push(`${path} está vacío`)
    if (text.includes(PENDING_MARK)) {
      problems.push(`${path} está marcado como ${PENDING_MARK}`)
    }
  }

  if (problems.length > 0) throw new InvalidLandingContentError(problems)
  return content
}
