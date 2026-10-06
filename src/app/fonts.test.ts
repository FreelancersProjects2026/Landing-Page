import { describe, expect, it, vi } from 'vitest'

import { fontVariables } from './fonts'

vi.mock('next/font/google', () => {
  const font =
    (variable: string) =>
    ({ variable: name }: { variable: string }) => ({
      variable: `${variable}:${name}`,
    })
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
})
