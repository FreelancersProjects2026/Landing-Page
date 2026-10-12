import type { Locale } from '@modules/company-profile'

type LanguageLinksProps = {
  langs: readonly Locale[]
  current: Locale
}

export function LanguageLinks({ langs, current }: LanguageLinksProps) {
  return langs.map((lang) => (
    <a
      key={lang}
      href={`/${lang}`}
      hrefLang={lang}
      lang={lang}
      aria-current={lang === current ? 'page' : undefined}
      className={`transition-opacity ${lang === current ? 'font-medium' : 'opacity-60 hover:opacity-100'}`}
    >
      {lang.toUpperCase()}
    </a>
  ))
}
