import { act, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import { ServicesSection } from './services-section'

const content = getLandingContent('es')

let notify: (entries: Partial<IntersectionObserverEntry>[]) => void

function stubObserver() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof notify) {
        notify = callback
      }
      observe() {}
      disconnect() {}
    },
  )
}

function renderSection() {
  render(
    <ServicesSection label={content.menu.services} {...content.services} />,
  )
  return screen.getByRole('region', { name: content.services.title })
}

describe('ServicesSection', () => {
  it('numera los servicios con dos dígitos en orden', () => {
    const section = renderSection()

    content.services.items.forEach((_, index) => {
      const number = String(index + 1).padStart(2, '0')
      expect(within(section).getByText(number)).toBeInTheDocument()
    })
  })

  it('oculta el contenido hasta que la sección entra en pantalla', () => {
    stubObserver()
    const section = renderSection()
    const title = within(section).getByRole('heading', {
      level: 2,
      name: content.services.title,
    })
    expect(title).toHaveClass('opacity-0', 'translate-y-8')

    act(() => notify([{ isIntersecting: true }]))

    expect(title).toHaveClass('opacity-100', 'translate-y-0')
    expect(within(section).getByText(content.services.intro)).toHaveClass(
      'opacity-100',
    )
  })
})
