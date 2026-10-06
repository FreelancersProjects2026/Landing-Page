import React from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import {
  buildLanguageAlternates,
  buildLocaleUrl,
  getLandingContent,
  locales,
  siteUrl,
  type Locale,
} from '@modules/company-profile'
import { fontVariables } from '../fonts'
import '../globals.css'

const openGraphLocale: Record<Locale, string> = { es: 'es_CR', en: 'en_US' }

type LayoutParams = { params: Promise<{ lang: string }> }

const siteIcon = '/logo/icono/LogoPJM.jpeg'
// Google pide favicons cuadrados en múltiplos de 48 px; el JPEG mide 1024.
const favicon = '/logo/icono/LogoPJM-192.png'

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { lang } = await params
  const { seo, company, locale } = getLandingContent(lang)
  const canonical = buildLocaleUrl(siteUrl, locale)

  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(siteUrl),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      locale: openGraphLocale[locale],
      siteName: company.name,
      type: 'website',
    },
    // Next genera los <link> de la pestaña y del ícono de iOS.
    icons: { icon: favicon, apple: siteIcon },
  }
}

export const dynamicParams = false

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<LayoutParams & { children: React.ReactNode }>) {
  const { lang } = await params

  return (
    <html lang={lang}>
      <body
        suppressHydrationWarning
        className={`${fontVariables} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
