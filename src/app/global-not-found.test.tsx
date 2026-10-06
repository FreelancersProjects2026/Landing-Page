import { usePathname } from 'next/navigation'
import { connection } from 'next/server'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import GlobalNotFound, { metadata } from './global-not-found'

vi.mock('./fonts', () => ({ fontVariables: 'fuentes' }))
vi.mock('next/navigation', () => ({ usePathname: vi.fn() }))
vi.mock('next/server', () => ({ connection: vi.fn(async () => {}) }))

async function renderAt(pathname: string) {
  vi.mocked(usePathname).mockReturnValue(pathname)
  return renderToString(await GlobalNotFound())
}

describe('global-not-found', () => {
  it('se renderiza por petición: prerenderizada, el SSR no vería la ruta real', async () => {
    await renderAt('/en/xyz')

    expect(connection).toHaveBeenCalled()
  })

  it('atiende toda URL desconocida con un documento completo', async () => {
    const html = await renderAt('/xyz')

    expect(html).toMatch(/^<html lang="es"/)
    expect(html).toContain('class="fuentes font-sans antialiased"')
  })

  it.each([
    ['/en/xyz', 'en'],
    ['/es/xyz', 'es'],
    ['/fr', 'es'],
    ['/xyz', 'es'],
    ['/fr/abc', 'es'],
  ])(
    'en %s muestra la 404 en %s con enlace a su inicio',
    async (pathname, lang) => {
      const { notFound } = getLandingContent(lang)
      const html = await renderAt(pathname)

      expect(html).toContain(`>${notFound.title}</h1>`)
      expect(html).toContain(`alt="${notFound.imageAlt}"`)
      expect(html).toMatch(
        new RegExp(`<a[^>]*href="/${lang}"[^>]*>.*${notFound.cta}</a>`),
      )
    },
  )

  it('titula la pestaña con el título de la 404 y usa los íconos del sitio', () => {
    expect(metadata.title).toBe(getLandingContent('es').notFound.title)
    expect(metadata.icons).toEqual({
      icon: '/logo/icono/LogoPJM-192.png',
      apple: '/logo/icono/LogoPJM.jpeg',
    })
  })
})
