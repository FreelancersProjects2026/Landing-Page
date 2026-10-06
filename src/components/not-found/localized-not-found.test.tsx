import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LocalizedNotFound } from './localized-not-found'

vi.mock('next/navigation', () => ({ useParams: vi.fn() }))

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

function renderWith(params: Record<string, string> | null) {
  vi.mocked(useParams).mockReturnValue(params as never)
  render(
    <LocalizedNotFound
      byLocale={byLocale}
      fallbackLocale="es"
      imageSrc="/404/404-raices-obsidiana.webp"
    />,
  )
}

describe('LocalizedNotFound', () => {
  beforeEach(() => vi.mocked(useParams).mockReset())

  it('usa los textos y el inicio del idioma de la URL', () => {
    renderWith({ lang: 'en' })

    expect(
      screen.getByRole('heading', { name: 'Lost page' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/en',
    )
  })

  it.each([
    ['un idioma desconocido', { lang: 'fr' }],
    ['una clave heredada del prototipo', { lang: 'toString' }],
    ['una URL sin idioma', {}],
    ['sin parámetros', null],
  ])('con %s usa el idioma por defecto', (_, params) => {
    renderWith(params)

    expect(
      screen.getByRole('heading', { name: 'Página perdida' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Volver al inicio' }),
    ).toHaveAttribute('href', '/es')
  })
})
