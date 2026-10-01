import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App.tsx'

describe('App', () => {
  it('compone y muestra el perfil de PJM Solutions', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: /software que comienza por entender tu negocio/i,
      }),
    ).toBeInTheDocument()
  })
})
