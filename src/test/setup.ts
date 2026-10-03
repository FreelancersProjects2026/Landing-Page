import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom no implementa IntersectionObserver ni el canvas que usan las secciones animadas.
vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  },
)
HTMLCanvasElement.prototype.getContext = () => null

afterEach(() => {
  cleanup()
})
