import React from 'react'
import type { Metadata } from 'next'
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import {
  getLandingContent,
  locales,
  type Locale,
} from '@modules/company-profile'
import '../globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const openGraphLocale: Record<Locale, string> = { es: 'es_CR', en: 'en_US' }

type LayoutParams = { params: Promise<{ lang: string }> }

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { lang } = await params
  const { seo, company, locale } = getLandingContent(lang)

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: openGraphLocale[locale],
      siteName: company.name,
      type: 'website',
    },
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
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
