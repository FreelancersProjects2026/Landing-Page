import React from 'react'
import type { Metadata } from 'next'
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { locales } from '@modules/company-profile'
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

export const metadata: Metadata = {
  title: 'COMPUTE - AI Agents for Distributed Computing',
  description:
    'Deploy autonomous AI agents on distributed infrastructure. Offload complex tasks to intelligent workers that run 24/7.',
  generator: 'v0.app',
}

export const dynamicParams = false

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
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
