import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

// Spec 012: Google pide /favicon.ico; debe incluir un tamaño múltiplo de 48 px.
describe('public/favicon.ico', () => {
  it('es un ICO con imágenes de 16, 32 y 48 px', () => {
    const ico = readFileSync(join(process.cwd(), 'public/favicon.ico'))

    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0])
    const count = ico.readUInt16LE(4)
    // En el directorio ICO, 0 significa 256 px.
    const sizes = Array.from(
      { length: count },
      (_, i) => ico[6 + i * 16] || 256,
    )
    expect(sizes).toEqual(expect.arrayContaining([16, 32, 48]))
  })
})
