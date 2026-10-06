import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { WhatsAppButton } from './whatsapp-button'

const label = 'Escríbenos por WhatsApp'
const name = 'solutionsPJM'
const greeting = 'Cuéntanos qué problema quieres resolver.'
const options = [
  { label: 'Cotizar', url: 'https://wa.me/50664400832?text=Cotizar' },
  { label: 'Soporte', url: 'https://wa.me/50664400832?text=Soporte' },
]

function renderButton() {
  render(
    <WhatsAppButton
      label={label}
      name={name}
      greeting={greeting}
      options={options}
    />,
  )
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

  it('al abrir se ve como una conversación: nombre, saludo y respuestas', async () => {
    await userEvent.click(renderButton())
    const menu = screen.getByRole('menu')

    expect(within(menu).getByText(name)).toBeVisible()
    expect(within(menu).getByText(greeting)).toBeVisible()
    expect(menu).toHaveAccessibleDescription(greeting)
    // El avatar es decorativo: no aporta nombre accesible.
    expect(menu.querySelector('img')).toHaveAttribute('alt', '')
    expect(within(menu).queryByRole('img')).not.toBeInTheDocument()
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.getAttribute('href')),
    ).toEqual(options.map(({ url }) => url))
  })

  it('al abrir no bloquea el scroll ni los clics de la página', async () => {
    const user = userEvent.setup()
    const onPageClick = vi.fn()
    render(
      <>
        <WhatsAppButton
          label={label}
          name={name}
          greeting={greeting}
          options={options}
        />
        <button type="button" onClick={onPageClick}>
          Otro botón de la página
        </button>
      </>,
    )

    await user.click(screen.getByRole('button', { name: label }))
    expect(screen.getByRole('menu')).toBeVisible()
    // Protege contra el bloqueo de scroll de Radix modal; detalle de react-remove-scroll.
    expect(document.body).not.toHaveAttribute('data-scroll-locked')

    await user.click(
      screen.getByRole('button', { name: 'Otro botón de la página' }),
    )
    expect(onPageClick).toHaveBeenCalledOnce()
  })

  it('el botón abre y cierra el menú como un interruptor', async () => {
    const user = userEvent.setup()
    const button = renderButton()

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu')).toBeVisible()
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
