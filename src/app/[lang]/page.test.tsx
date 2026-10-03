import { act, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import Home from './page'
import { buildStructuredData } from './structured-data'

function renderPage(lang: string) {
  return Home({ params: Promise.resolve({ lang }) })
}

describe('Home', () => {
  it.each(['es', 'en'])('publica el JSON-LD de %s', async (lang) => {
    const { container } = render(await renderPage(lang))
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(JSON.parse(script?.textContent ?? '')).toEqual(
      buildStructuredData(getLandingContent(lang)),
    )
  })

  it('renderiza todas las secciones de la plantilla en orden', async () => {
    const { container } = render(await renderPage('es'))

    // Cada sección se identifica por su título; navegación y pie, por su etiqueta.
    const sections = Array.from(
      container.querySelector('main')?.children ?? [],
    ).map(
      (element) =>
        element.querySelector('h1, h2')?.textContent ??
        element.tagName.toLowerCase(),
    )

    expect(sections).toEqual([
      'header',
      expect.stringContaining('Distributed compute'),
      expect.stringContaining('Intelligent'),
      expect.stringContaining('Define.'),
      expect.stringContaining('Global by'),
      expect.stringContaining('Real-time'),
      expect.stringContaining('Connect'),
      expect.stringContaining('Autonomous,'),
      expect.stringContaining('Code your agents.'),
      expect.stringContaining('Trusted by teams worldwide.'),
      expect.stringContaining('Pay for'),
      expect.stringContaining('Ready to delegate'),
      'footer',
    ])
  })

  it('se hidrata sin errores a partir del HTML del servidor', async () => {
    const page = await renderPage('es')
    const container = document.createElement('div')
    container.innerHTML = renderToString(page)
    document.body.appendChild(container)
    const onRecoverableError = vi.fn()

    const root = await act(async () =>
      hydrateRoot(container, page, { onRecoverableError }),
    )

    expect(onRecoverableError).not.toHaveBeenCalled()
    act(() => root.unmount())
    container.remove()
  })
})
