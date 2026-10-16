import { render, screen, waitFor } from '@testing-library/react'
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
  it('pinta el botón sin menú de inmediato y lo sustituye por el que abre el menú', async () => {
    renderLazyButton()

    expect(screen.getByRole('button', { name: label })).not.toHaveAttribute(
      'aria-haspopup',
    )
    await waitFor(
      () =>
        expect(screen.getByRole('button', { name: label })).toHaveAttribute(
          'aria-haspopup',
          'menu',
        ),
      { timeout: 5000 },
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
