import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

const MAX_BYTES = 250 * 1024

const MAX_WIDTH_PX = 1600

type ReadImageMetadata = (path: string) => {
  metadata: () => Promise<{ width?: number }>
}

const requireFromHere = createRequire(import.meta.url)
const loadSharp = () =>
  requireFromHere(
    requireFromHere.resolve('sharp', {
      paths: [requireFromHere.resolve('next')],
    }),
  ) as ReadImageMetadata

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

  it.each(SECTION_WEBPS)(
    '%s mide como máximo 1600 px de ancho',
    async (path) => {
      const { width } = await loadSharp()(path).metadata()

      expect(width).toBeLessThanOrEqual(MAX_WIDTH_PX)
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

describe('variante móvil de «Cómo trabajamos»', () => {
  const ORIGINAL = 'public/ComoTrabajamos/como-trabajamos.webp'
  const MOBILE = 'public/ComoTrabajamos/como-trabajamos-640.webp'

  it('existe, es WebP, mide 640 px de ancho y pesa menos que la original', async () => {
    const bytes = readFileSync(MOBILE)
    const { width } = await loadSharp()(MOBILE).metadata()

    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF')
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP')
    expect(width).toBe(640)
    expect(bytes.length).toBeLessThan(readFileSync(ORIGINAL).length)
  })
})
