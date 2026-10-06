import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { WhatsAppButton } from './whatsapp-button'

const label = 'Escríbenos por WhatsApp'
const options = [
  { label: 'Cotizar', url: 'https://wa.me/50664400832?text=Cotizar' },
  { label: 'Soporte', url: 'https://wa.me/50664400832?text=Soporte' },
]

function renderButton() {
  render(<WhatsAppButton label={label} options={options} />)
  return screen.getByRole('button', { name: label })
}

describe('WhatsAppButton', () => {
  it('al abrir con clic muestra cada opción como enlace externo', async () => {
    const button = renderButton()
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    for (const { label: name, url } of options) {
      const link = screen.getByRole('menuitem', { name })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('abre con Enter, cierra con Esc y devuelve el foco al botón', async () => {
    const user = userEvent.setup()
    const button = renderButton()

    button.focus()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('menuitem')).toHaveLength(options.length)

    await user.keyboard('{Escape}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
  })

  it('flota abajo a la derecha, fuera del área segura y sobre el contenido', () => {
    expect(renderButton()).toHaveClass(
      'fixed',
      'right-4',
      'bottom-[calc(1rem+env(safe-area-inset-bottom))]',
      'z-30',
    )
  })
})
