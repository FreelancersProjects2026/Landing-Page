import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { revealClass, useInView } from './use-in-view'

const observer = {
  callback: (() => {}) as (
    entries: Partial<IntersectionObserverEntry>[],
  ) => void,
  options: undefined as IntersectionObserverInit | undefined,
  observed: [] as Element[],
  disconnect: vi.fn(),
}

vi.stubGlobal(
  'IntersectionObserver',
  class {
    constructor(
      callback: typeof observer.callback,
      options?: IntersectionObserverInit,
    ) {
      observer.callback = callback
      observer.options = options
    }
    observe(element: Element) {
      observer.observed.push(element)
    }
    disconnect = observer.disconnect
  },
)

function Probe({ threshold }: { threshold: number }) {
  const { ref, isVisible } = useInView<HTMLDivElement>(threshold)
  return <div ref={ref}>{isVisible ? 'visible' : 'oculto'}</div>
}

describe('useInView', () => {
  it('observa el elemento con el umbral dado y se marca visible al entrar', () => {
    const { unmount } = render(<Probe threshold={0.2} />)
    const element = screen.getByText('oculto')

    expect(observer.options).toEqual({ threshold: 0.2 })
    expect(observer.observed).toContain(element)

    act(() => observer.callback([{ isIntersecting: false }]))
    expect(element).toHaveTextContent('oculto')

    act(() => observer.callback([{ isIntersecting: true }]))
    expect(element).toHaveTextContent('visible')

    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
  })
})

describe('revealClass', () => {
  it('muestra el elemento cuando es visible y aplica el desplazamiento si no', () => {
    expect(revealClass(true, 'translate-y-8')).toBe('opacity-100 translate-y-0')
    expect(revealClass(false, 'translate-y-8')).toBe('opacity-0 translate-y-8')
  })
})
