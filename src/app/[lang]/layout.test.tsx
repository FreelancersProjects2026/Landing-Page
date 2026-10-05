import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import RootLayout, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from './layout'

vi.mock('next/font/google', () => {
  const font = () => ({ variable: 'font' })
  return {
    Instrument_Sans: font,
    Instrument_Serif: font,
    JetBrains_Mono: font,
  }
})
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => null }))

function renderLayout(lang: string) {
  return RootLayout({
    children: <main>contenido</main>,
    params: Promise.resolve({ lang }),
  })
}

describe('RootLayout', () => {
  it('genera solo las rutas /es y /en', async () => {
    expect(await generateStaticParams()).toEqual([
      { lang: 'es' },
      { lang: 'en' },
    ])
    expect(dynamicParams).toBe(false)
  })

  it.each([
    ['es', 'es_CR'],
    ['en', 'en_US'],
  ])('publica los metadatos de %s', async (lang, ogLocale) => {
    const { seo, company } = getLandingContent(lang)
    const canonical = `https://solutionspjm.com/${lang}`

    expect(
      await generateMetadata({ params: Promise.resolve({ lang }) }),
    ).toEqual({
      metadataBase: new URL('https://solutionspjm.com'),
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical,
        languages: {
          es: 'https://solutionspjm.com/es',
          en: 'https://solutionspjm.com/en',
          'x-default': 'https://solutionspjm.com/es',
        },
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: canonical,
        locale: ogLocale,
        siteName: company.name,
        type: 'website',
      },
    })
  })

  it.each(['es', 'en'])('fija lang="%s" en el documento', async (lang) => {
    const html = renderToString(await renderLayout(lang))

    expect(html).toMatch(new RegExp(`^<html lang="${lang}"`))
  })

  it('tolera atributos que las extensiones del navegador añaden a <body>', async () => {
    const layout = await renderLayout('es')
    const serverHtml = new DOMParser().parseFromString(
      renderToString(layout),
      'text/html',
    )
    for (const { name, value } of serverHtml.documentElement.attributes) {
      document.documentElement.setAttribute(name, value)
    }
    document.documentElement.innerHTML = serverHtml.documentElement.innerHTML
    // Lo que inyecta la extensión ColorZilla antes de que React hidrate.
    document.body.setAttribute('cz-shortcut-listen', 'true')
    const onRecoverableError = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const root = await act(async () =>
      hydrateRoot(document, layout, { onRecoverableError }),
    )

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    act(() => root.unmount())
    consoleError.mockRestore()
  })
})
