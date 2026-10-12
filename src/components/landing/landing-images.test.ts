import { existsSync, readdirSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const MAX_BYTES = 250 * 1024

const LANDING_DIR = 'src/components/landing'

const SECTION_WEBPS = [
  'public/ComoTrabajamos/como-trabajamos.webp',
  'public/Proyectos/proyectos.webp',
  'public/Servicios/servicios.webp',
  'public/footer/footer.webp',
]

const SECTION_PNGS = [
  'public/ComoTrabajamos/ComoTrabajamos.png',
  'public/Proyectos/Proyectos.png',
  'public/Servicios/Servicios.png',
  'public/footer/Footer.png',
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

  it('ningún componente de la landing referencia .png', () => {
    const components = readdirSync(LANDING_DIR).filter(
      (file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'),
    )
    const withPng = components.filter((file) =>
      readFileSync(`${LANDING_DIR}/${file}`, 'utf8').includes('.png'),
    )

    expect(withPng).toEqual([])
  })

  it.each(SECTION_PNGS)('%s ya no existe', (path) => {
    expect(existsSync(path)).toBe(false)
  })
})
