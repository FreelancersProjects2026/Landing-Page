import { fireEvent, render, screen } from '@testing-library/react'
import { track } from '@vercel/analytics'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ContactClickTracker } from './contact-click-tracker'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

function renderWithLinks() {
  render(
    <>
      <ContactClickTracker />
      <a href="https://wa.me/50664400832?text=Hola">
        <span>WhatsApp</span>
      </a>
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info%40solutionspjm.com">
        Correo
      </a>
      <a href="https://www.instagram.com/solutionspjm">Instagram</a>
    </>,
  )
}

describe('ContactClickTracker', () => {
  beforeEach(() => vi.mocked(track).mockClear())

  it('envía el evento Contacto con canal whatsapp, también al hacer clic en un hijo del enlace', () => {
    renderWithLinks()

    fireEvent.click(screen.getByText('WhatsApp'))

    expect(track).toHaveBeenCalledExactlyOnceWith('Contacto', {
      canal: 'whatsapp',
    })
  })

  it('envía el evento Contacto con canal correo', () => {
    renderWithLinks()

    fireEvent.click(screen.getByRole('link', { name: 'Correo' }))

    expect(track).toHaveBeenCalledExactlyOnceWith('Contacto', {
      canal: 'correo',
    })
  })

  it('no envía nada en enlaces que no son de contacto', () => {
    renderWithLinks()

    fireEvent.click(screen.getByRole('link', { name: 'Instagram' }))

    expect(track).not.toHaveBeenCalled()
  })

  it('deja de escuchar al desmontarse', () => {
    const { unmount } = render(<ContactClickTracker />)
    unmount()
    render(<a href="https://wa.me/50664400832">WhatsApp</a>)

    fireEvent.click(screen.getByRole('link', { name: 'WhatsApp' }))

    expect(track).not.toHaveBeenCalled()
  })
})
