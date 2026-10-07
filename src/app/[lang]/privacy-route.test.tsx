import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getLandingContent, getPrivacyPolicy } from '@modules/company-profile'

import * as privacidad from './privacidad/page'
import * as privacy from './privacy/page'

const languages = {
  es: 'https://solutionspjm.com/es/privacidad',
  en: 'https://solutionspjm.com/en/privacy',
  'x-default': 'https://solutionspjm.com/es/privacidad',
}

describe.each([
  ['es', privacidad, 'https://solutionspjm.com/es/privacidad', 'es_CR'],
  ['en', privacy, 'https://solutionspjm.com/en/privacy', 'en_US'],
] as const)('política de privacidad en %s', (lang, route, canonical, og) => {
  const policy = getPrivacyPolicy(lang)

  // Las rutas de otro idioma (/en/privacidad, /es/privacy) caen en la 404 global.
  it('genera solo su idioma y no acepta otros', async () => {
    expect(await route.generateStaticParams()).toEqual([{ lang }])
    expect(route.dynamicParams).toBe(false)
  })

  it('publica title, description, canonical y alternates cruzados', async () => {
    expect(await route.generateMetadata()).toEqual({
      title: policy.seo.title,
      description: policy.seo.description,
      alternates: { canonical, languages },
      openGraph: {
        title: policy.seo.title,
        description: policy.seo.description,
        url: canonical,
        locale: og,
        siteName: 'solutionsPJM',
        type: 'website',
      },
    })
  })

  it('muestra la política y vuelve al inicio del idioma', () => {
    render(route.default())

    expect(
      screen.getByRole('heading', { level: 1, name: policy.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: getLandingContent(lang).notFound.cta,
      }),
    ).toHaveAttribute('href', `/${lang}`)
  })
})
