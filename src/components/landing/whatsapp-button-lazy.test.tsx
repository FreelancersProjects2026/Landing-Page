import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { WhatsAppButtonLazy } from './whatsapp-button-lazy'

const label = 'Escríbenos por WhatsApp'
const options = [
  { label: 'Cotizar', url: 'https://wa.me/50664400832?text=Cotizar' },
  { label: 'Soporte', url: 'https://wa.me/50664400832?text=Soporte' },
]

function renderLazyButton() {
  render(
    <WhatsAppButtonLazy
      label={label}
      name="solutionsPJM"
      greeting="Cuéntanos qué problema quieres resolver."
      options={options}
    />,
  )
}

describe('WhatsAppButtonLazy', () => {
  it('pinta el botón flotante de inmediato, en su posición fija', () => {
    renderLazyButton()

    expect(screen.getByRole('button', { name: label })).toHaveClass(
      'fixed',
      'right-4',
      'bottom-[calc(1rem+env(safe-area-inset-bottom))]',
      'z-30',
    )
  })

  it('tras cargar el menú diferido, un clic muestra cada opción con su enlace', async () => {
    renderLazyButton()
    const button = await screen.findByRole(
      'button',
      { name: label, expanded: false },
      { timeout: 5000 },
    )

    await userEvent.click(button)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(
      screen.getAllByRole('menuitem').map((item) => ({
        label: item.textContent,
        url: item.getAttribute('href'),
      })),
    ).toEqual(options)
  })
})
