import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getLandingContent, locales } from '@modules/company-profile'

import { OgImageCard } from './og-image-card'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Prerenderiza una imagen por idioma, como la página.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

async function readLogoDataUrl(logoPath: string): Promise<string> {
  const logo = await readFile(join(process.cwd(), 'public', logoPath))
  return `data:image/jpeg;base64,${logo.toString('base64')}`
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const { company, seo } = getLandingContent(lang)

  return new ImageResponse(
    <OgImageCard
      name={company.name}
      text={seo.description}
      logoSrc={await readLogoDataUrl(company.logo)}
    />,
    size,
  )
}
