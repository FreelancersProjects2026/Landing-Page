import type { Metadata } from 'next'
import { connection } from 'next/server'
import {
  defaultLocale,
  getLandingContent,
  locales,
  type Locale,
  type NotFoundContent,
} from '@modules/company-profile'

import { LocalizedNotFound } from '@/components/not-found/localized-not-found'
import { notFoundImageSrc } from '@/components/not-found/not-found-image'

import { fontVariables } from './fonts'
import { siteIcons } from './icons'
import './globals.css'

// Atiende toda URL sin ruta (/fr, /xyz, /es/xyz). El idioma sale del primer segmento
// en el cliente; <html lang> queda en el idioma por defecto (limitación en plan.md).
// `locales` define el tipo Locale, así que el objeto trae todos los idiomas.
const byLocale = Object.fromEntries(
  locales.map((locale) => [
    locale,
    { ...getLandingContent(locale).notFound, homeHref: `/${locale}` },
  ]),
) as Record<Locale, NotFoundContent & { homeHref: string }>

export const metadata: Metadata = {
  title: byLocale[defaultLocale].title,
  icons: siteIcons,
}

export default async function GlobalNotFound() {
  // Sin esto Next la prerenderiza y el SSR de /en/xyz saldría en español.
  await connection()

  return (
    <html lang={defaultLocale}>
      <body
        suppressHydrationWarning
        className={`${fontVariables} font-sans antialiased`}
      >
        <LocalizedNotFound
          byLocale={byLocale}
          fallbackLocale={defaultLocale}
          imageSrc={notFoundImageSrc}
        />
      </body>
    </html>
  )
}
