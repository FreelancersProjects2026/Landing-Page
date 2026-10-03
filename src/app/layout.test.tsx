import { act } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import RootLayout from './layout'

vi.mock('next/font/google', () => {
  const font = () => ({ variable: 'font' })
  return {
    Instrument_Sans: font,
    Instrument_Serif: font,
    JetBrains_Mono: font,
  }
})
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => null }))

describe('RootLayout', () => {
  it('tolera atributos que las extensiones del navegador añaden a <body>', async () => {
    const layout = (
      <RootLayout>
        <main>contenido</main>
      </RootLayout>
    )
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
