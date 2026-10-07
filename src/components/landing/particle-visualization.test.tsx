import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ParticleVisualization } from './particle-visualization'

let reducedMotion = false
let onIntersect: (entries: { isIntersecting: boolean }[]) => void
const disconnect = vi.fn()
const requestFrame = vi.fn(() => 1)
const cancelFrame = vi.fn()
const arc = vi.fn()

function setVisible(isIntersecting: boolean) {
  act(() => onIntersect([{ isIntersecting }]))
}

beforeEach(() => {
  reducedMotion = false
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    scale: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc,
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D)
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
  }))
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof onIntersect) {
        onIntersect = callback
      }
      observe() {}
      disconnect = disconnect
    },
  )
  vi.stubGlobal('requestAnimationFrame', requestFrame)
  vi.stubGlobal('cancelAnimationFrame', cancelFrame)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  // Vuelve a los simulacros globales de src/test/setup.ts.
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  HTMLCanvasElement.prototype.getContext = () => null
  requestFrame.mockClear()
  cancelFrame.mockClear()
  disconnect.mockClear()
  arc.mockClear()
})

describe('ParticleVisualization', () => {
  it('no pide frames con movimiento reducido', () => {
    reducedMotion = true

    render(<ParticleVisualization />)

    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('con movimiento reducido redibuja el frame estático al redimensionar', () => {
    reducedMotion = true
    render(<ParticleVisualization />)
    arc.mockClear()

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(arc).toHaveBeenCalled()
  })

  it('pausa la animación fuera de pantalla y la reanuda al volver', () => {
    render(<ParticleVisualization />)

    setVisible(true)
    expect(requestFrame).toHaveBeenCalledTimes(1)

    setVisible(false)
    expect(cancelFrame).toHaveBeenCalledWith(1)

    setVisible(true)
    expect(requestFrame).toHaveBeenCalledTimes(2)
  })

  it('al desmontar desconecta el observer y cancela el frame', () => {
    const { unmount } = render(<ParticleVisualization />)
    setVisible(true)

    unmount()

    expect(disconnect).toHaveBeenCalled()
    expect(cancelFrame).toHaveBeenCalledWith(1)
  })
})
