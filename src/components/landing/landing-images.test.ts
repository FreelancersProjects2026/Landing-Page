import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const MAX_BYTES = 250 * 1024

const SECTION_WEBPS = [
  'public/ComoTrabajamos/como-trabajamos.webp',
  'public/Proyectos/proyectos.webp',
  'public/Servicios/servicios.webp',
  'public/footer/footer.webp',
]

describe('imágenes de sección de la landing', () => {
  it.each(SECTION_WEBPS)(
    '%s existe, es WebP y pesa como máximo 250 KB',
    (path) => {
      const bytes = readFileSync(path)

      expect(bytes.length).toBeLessThanOrEqual(MAX_BYTES)
      expect(bytes.toString('ascii', 0, 4)).toBe('RIFF')
      expect(bytes.toString('ascii', 8, 12)).toBe('WEBP')
    },
  )
})
