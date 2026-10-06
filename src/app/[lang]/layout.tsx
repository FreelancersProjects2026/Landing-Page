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
import { siteIcons } from '../icons'
import '../globals.css'

const openGraphLocale: Record<Locale, string> = { es: 'es_CR', en: 'en_US' }

type LayoutParams = { params: Promise<{ lang: string }> }

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
    icons: siteIcons,
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
