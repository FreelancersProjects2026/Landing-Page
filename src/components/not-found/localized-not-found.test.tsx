import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LocalizedNotFound } from './localized-not-found'

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }))

const byLocale = {
  es: {
    title: 'Página perdida',
    text: 'No existe.',
    cta: 'Volver al inicio',
    imageAlt: 'Error 404',
    homeHref: '/es',
  },
  en: {
    title: 'Lost page',
    text: "Doesn't exist.",
    cta: 'Back to home',
    imageAlt: 'Error 404',
    homeHref: '/en',
  },
}

function renderAt(pathname: string | null) {
  vi.mocked(usePathname).mockReturnValue(pathname as never)
  render(
    <LocalizedNotFound
      byLocale={byLocale}
      fallbackLocale="es"
      imageSrc="/404/404-raices-obsidiana.webp"
    />,
  )
}

describe('LocalizedNotFound', () => {
  beforeEach(() => vi.mocked(usePathname).mockReset())

  it('usa los textos y el inicio del idioma del primer segmento de la ruta', () => {
    renderAt('/en/xyz')

    expect(
      screen.getByRole('heading', { name: 'Lost page' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/en',
    )
  })

  it.each([
    ['/es/xyz'],
    ['/fr'],
    ['/xyz'],
    ['/fr/abc'],
    ['/toString/x'],
    ['/'],
    [null],
  ])('en %s usa el español', (pathname) => {
    renderAt(pathname)

    expect(
      screen.getByRole('heading', { name: 'Página perdida' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Volver al inicio' }),
    ).toHaveAttribute('href', '/es')
  })
})
