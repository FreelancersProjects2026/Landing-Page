import type { Metadata } from 'next'
import { defaultLocale, getLandingContent } from '@modules/company-profile'

import { NotFoundView } from '@/components/not-found/not-found-view'
import { notFoundImageSrc } from '@/components/not-found/not-found-image'

import { fontVariables } from './fonts'
import { siteIcons } from './icons'
import './globals.css'

// URL sin idioma válido (/fr, /xyz): Next la sirve sin layout, en el idioma por defecto.
const { notFound } = getLandingContent(defaultLocale)

export const metadata: Metadata = { title: notFound.title, icons: siteIcons }

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale}>
      <body
        suppressHydrationWarning
        className={`${fontVariables} font-sans antialiased`}
      >
        <NotFoundView
          {...notFound}
          imageSrc={notFoundImageSrc}
          homeHref={`/${defaultLocale}`}
        />
      </body>
    </html>
  )
}
