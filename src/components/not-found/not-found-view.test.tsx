import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NotFoundView } from './not-found-view'

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
})
