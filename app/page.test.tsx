import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from './page'

describe('Home', () => {
  it('renderiza todas las secciones de la plantilla en orden', () => {
    const { container } = render(<Home />)

    // Cada sección se identifica por su título; navegación y pie, por su etiqueta.
    const sections = Array.from(
      container.querySelector('main')?.children ?? [],
    ).map(
      (element) =>
        element.querySelector('h1, h2')?.textContent ??
        element.tagName.toLowerCase(),
    )

    expect(sections).toEqual([
      'header',
      expect.stringContaining('Distributed compute'),
      expect.stringContaining('Intelligent'),
      expect.stringContaining('Define.'),
      expect.stringContaining('Global by'),
      expect.stringContaining('Real-time'),
      expect.stringContaining('Connect'),
      expect.stringContaining('Autonomous,'),
      expect.stringContaining('Code your agents.'),
      expect.stringContaining('Trusted by teams worldwide.'),
      expect.stringContaining('Pay for'),
      expect.stringContaining('Ready to delegate'),
      'footer',
    ])
  })
})
