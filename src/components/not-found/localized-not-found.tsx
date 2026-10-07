'use client'

import { usePathname } from 'next/navigation'
import type { Locale, NotFoundContent } from '@modules/company-profile'

import { NotFoundView } from './not-found-view'

type LocalizedTexts = NotFoundContent & { homeHref: string }

type LocalizedNotFoundProps = {
  byLocale: Readonly<Record<Locale, LocalizedTexts>>
  fallbackLocale: Locale
  imageSrc: string
}

// La 404 global no recibe params ni la ruta en headers(); usePathname sí la da,
// también en el SSR, así que el HTML sale ya en el idioma de la URL.
export function LocalizedNotFound({
  byLocale,
  fallbackLocale,
  imageSrc,
}: LocalizedNotFoundProps) {
  const lang = usePathname()?.split('/')[1]
  const locale =
    typeof lang === 'string' && Object.hasOwn(byLocale, lang)
      ? (lang as Locale)
      : fallbackLocale

  return (
    <NotFoundView {...byLocale[locale]} lang={locale} imageSrc={imageSrc} />
  )
}
