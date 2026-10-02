import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from './page'

describe('Home', () => {
  it('renderiza todas las secciones de la plantilla en orden', () => {
    const { container } = render(<Home />)

    const sections = Array.from(
      container.querySelector('main')?.children ?? [],
    ).map((element) => element.id || element.tagName.toLowerCase())

    expect(sections).toEqual([
      'header',
      'section',
      'features',
      'how-it-works',
      'infra',
      'section',
      'integrations',
      'security',
      'developers',
      'section',
      'pricing',
      'section',
      'footer',
    ])
  })
})
