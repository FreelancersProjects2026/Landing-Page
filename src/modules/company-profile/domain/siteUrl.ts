export class InvalidSiteUrlError extends Error {
  constructor(value: string) {
    super(
      `La URL del sitio no es válida: "${value}". Debe ser un origen https con www, sin ruta ni barra final.`,
    )
    this.name = 'InvalidSiteUrlError'
  }
}

// La URL del sitio es un origen canónico: toda URL publicada (canonical, hreflang, sitemap) parte de él.
export function validateSiteUrl(value: string): string {
  if (!URL.canParse(value)) throw new InvalidSiteUrlError(value)
  const url = new URL(value)
  const isCanonicalOrigin =
    url.protocol === 'https:' &&
    url.hostname.startsWith('www.') &&
    url.origin === value
  if (!isCanonicalOrigin) throw new InvalidSiteUrlError(value)
  return value
}
