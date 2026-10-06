'use client'

import { useParams } from 'next/navigation'
import type { NotFoundContent } from '@modules/company-profile'

import { NotFoundView } from './not-found-view'

type LocalizedTexts = NotFoundContent & { homeHref: string }

type LocalizedNotFoundProps = {
  byLocale: Readonly<Record<string, LocalizedTexts>>
  fallbackLocale: string
  imageSrc: string
}

// not-found.tsx no recibe params: el idioma solo se conoce en el cliente.
export function LocalizedNotFound({
  byLocale,
  fallbackLocale,
  imageSrc,
}: LocalizedNotFoundProps) {
  const lang = useParams()?.lang
  const locale =
    typeof lang === 'string' && Object.hasOwn(byLocale, lang)
      ? lang
      : fallbackLocale

  return <NotFoundView {...byLocale[locale]} imageSrc={imageSrc} />
}
