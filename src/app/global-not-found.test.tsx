import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import GlobalNotFound, { metadata } from './global-not-found'

vi.mock('./fonts', () => ({ fontVariables: 'fuentes' }))

describe('global-not-found', () => {
  const { notFound } = getLandingContent('es')

  it('muestra un documento completo en español con enlace a /es', () => {
    const html = renderToString(<GlobalNotFound />)

    expect(html).toMatch(/^<html lang="es"/)
    expect(html).toContain('class="fuentes font-sans antialiased"')
    expect(html).toContain(notFound.title)
    expect(html).toContain(`alt="${notFound.imageAlt}"`)
    expect(html).toMatch(/<a[^>]*href="\/es"[^>]*>.*Volver al inicio<\/a>/)
  })

  it('titula la pestaña con el título de la 404', () => {
    expect(metadata.title).toBe(notFound.title)
  })
})
