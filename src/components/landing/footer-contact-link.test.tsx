import { render, screen } from '@testing-library/react'
import { Instagram } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { FooterContactLink } from './footer-contact-link'

const accent = '#E1306C'

function renderLink(external = false) {
  render(
    <FooterContactLink
      href="https://instagram.com/x"
      icon={Instagram}
      accent={accent}
      external={external}
    >
      Instagram
    </FooterContactLink>,
  )
  return screen.getByRole('link', { name: 'Instagram' })
}

describe('FooterContactLink', () => {
  it('muestra el ícono dentro de un orbe oculto a lectores con el acento recibido', () => {
    const link = renderLink()
    const orb = link.querySelector('.contact-orb')

    expect(orb).toHaveAttribute('aria-hidden', 'true')
    expect(orb?.querySelector('svg.lucide-instagram')).not.toBeNull()
    expect((orb as HTMLElement).style.getPropertyValue('--orb-accent')).toBe(
      accent,
    )
    expect(link.querySelector('.lucide-arrow-up-right')).toBeNull()
  })

  it('es un enlace táctil con foco visible que no se transforma', () => {
    const link = renderLink()

    expect(link).toHaveClass(
      'group',
      'inline-flex',
      'items-center',
      'gap-3',
      'min-h-12',
    )
    expect(link.className).toContain('focus-visible:ring')
    expect(link.className).not.toMatch(/translate|rotate|scale/)
  })

  it('abre en otra pestaña solo si es externo', () => {
    expect(renderLink(true)).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link')).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })

  it('sin external no tiene target', () => {
    expect(renderLink()).not.toHaveAttribute('target')
  })
})
