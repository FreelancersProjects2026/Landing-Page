import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

const label = 'Escríbenos por WhatsApp'
const options = [
  { label: 'Cotizar', url: 'https://wa.me/50664400832?text=Cotizar' },
  { label: 'Soporte', url: 'https://wa.me/50664400832?text=Soporte' },
]

// next/dynamic guarda el componente cargado: un módulo nuevo por prueba muestra siempre el
// botón provisional primero. Precargar el menú hace que su llegada sea inmediata y determinista.
async function renderLazyButton() {
  vi.resetModules()
  await import('./whatsapp-button')
  const { WhatsAppButtonLazy } = await import('./whatsapp-button-lazy')
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
    await renderLazyButton()

    expect(screen.getByRole('button', { name: label })).not.toHaveAttribute(
      'aria-haspopup',
    )
    await waitFor(() =>
      expect(screen.getByRole('button', { name: label })).toHaveAttribute(
        'aria-haspopup',
        'menu',
      ),
    )
  })

  it('tras cargar el menú diferido, un clic muestra cada opción con su enlace', async () => {
    await renderLazyButton()
    const button = await screen.findByRole('button', {
      name: label,
      expanded: false,
    })

    await userEvent.click(button)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(
      screen.getAllByRole('menuitem').map((item) => ({
        label: item.textContent,
        url: item.getAttribute('href'),
      })),
    ).toEqual(options)
  })
  it('si el botón provisional tenía el foco, el botón real lo recibe al cargar', async () => {
    await renderLazyButton()
    const fallback = screen.getByRole('button', { name: label })
    expect(fallback).not.toHaveAttribute('aria-haspopup')
    fallback.focus()

    const button = await screen.findByRole('button', {
      name: label,
      expanded: false,
    })

    expect(button).toHaveFocus()
  })

  it('si el foco salió del botón provisional, el botón real no lo roba al cargar', async () => {
    await renderLazyButton()
    render(<button type="button">Otro elemento</button>)
    const other = screen.getByRole('button', { name: 'Otro elemento' })
    const fallback = screen.getByRole('button', { name: label })
    expect(fallback).not.toHaveAttribute('aria-haspopup')
    fallback.focus()
    other.focus()

    const button = await screen.findByRole('button', {
      name: label,
      expanded: false,
    })

    expect(button).not.toHaveFocus()
    expect(other).toHaveFocus()
  })

  it('si el botón provisional no tenía el foco, el botón real no lo toma', async () => {
    await renderLazyButton()
    expect(screen.getByRole('button', { name: label })).not.toHaveAttribute(
      'aria-haspopup',
    )

    const button = await screen.findByRole('button', {
      name: label,
      expanded: false,
    })

    expect(button).not.toHaveFocus()
  })
})
