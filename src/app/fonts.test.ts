import { describe, expect, it, vi } from 'vitest'

import { fontVariables } from './fonts'

type FontOptions = { variable: string; preload?: boolean }

const fontOptions = vi.hoisted(() => new Map<string, FontOptions>())

vi.mock('next/font/google', () => {
  const font = (variable: string) => (options: FontOptions) => {
    fontOptions.set(variable, options)
    return { variable: `${variable}:${options.variable}` }
  }
  return {
    Instrument_Sans: font('sans'),
    Instrument_Serif: font('serif'),
    JetBrains_Mono: font('mono'),
  }
})

describe('fonts', () => {
  it('une las variables de las tres fuentes para el <body>', () => {
    expect(fontVariables).toBe(
      'sans:--font-instrument serif:--font-instrument-serif mono:--font-jetbrains',
    )
  })

  it('no precarga JetBrains Mono y sí las fuentes Instrument', () => {
    expect(fontOptions.get('mono')?.preload).toBe(false)
    expect(fontOptions.get('sans')).not.toHaveProperty('preload')
    expect(fontOptions.get('serif')).not.toHaveProperty('preload')
  })
})
