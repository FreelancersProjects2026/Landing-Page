import { render, screen } from '@testing-library/react'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NotFoundView } from './not-found-view'

vi.mock('next/link', () => ({
  default: vi.fn((props: ComponentProps<'a'>) => <a {...props} />),
}))

const props = {
  lang: 'es',
  title: 'Esta página se perdió entre las raíces',
  text: 'El enlace que seguiste no existe o cambió de lugar.',
  cta: 'Volver al inicio',
  imageAlt: 'Error 404: la página no existe',
  imageSrc: '/404/404-raices-obsidiana.webp',
  homeHref: '/es',
}

describe('NotFoundView', () => {
  it('muestra el título, el texto y la imagen con su alt', () => {
    render(<NotFoundView {...props} />)

    expect(
      screen.getByRole('heading', { level: 1, name: props.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(props.text)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: props.imageAlt })).toHaveAttribute(
      'src',
      expect.stringContaining('404-raices-obsidiana.webp'),
    )
  })

  it('ofrece un solo enlace, al inicio del idioma, con el texto del botón', () => {
    render(<NotFoundView {...props} />)

    const [link, ...others] = screen.getAllByRole('link')
    expect(others).toEqual([])
    expect(link).toHaveAccessibleName(props.cta)
    expect(link).toHaveAttribute('href', '/es')
    expect(link).toHaveClass(
      'btn-obsidian',
      'motion-safe:animate-obsidian-glow',
    )
  })

  // La 404 global es otro layout raíz: una navegación de cliente a /es solo cambia la URL.
  it('vuelve al inicio con un <a> nativo para forzar la carga completa', () => {
    render(<NotFoundView {...props} />)

    expect(Link).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: props.cta })).toHaveAttribute(
      'href',
      '/es',
    )
  })
})
