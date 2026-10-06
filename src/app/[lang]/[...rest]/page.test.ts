import { notFound } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'

import CatchAllPage from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

describe('[lang]/[...rest]', () => {
  it('responde con la 404 del idioma para cualquier ruta desconocida', () => {
    expect(() => CatchAllPage()).toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})
