import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const srcDir = join(import.meta.dirname, '..')
const css = readFileSync(join(srcDir, 'app', 'globals.css'), 'utf8')

function componentSources(): string[] {
  return readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => readFileSync(join(srcDir, file), 'utf8'))
}

// NOTE: Tailwind 4 solo genera variantes (motion-safe:, hover:…) para clases
// declaradas con @utility; una clase en @layer utilities pierde la variante sin aviso.
describe('globals.css', () => {
  it('declara con @utility cada animación propia usada con una variante', () => {
    const variantAnimations = new Set(
      componentSources().flatMap((source) =>
        [...source.matchAll(/[a-z-]+:(animate-hero-[a-z-]+)/g)].map(
          (match) => match[1],
        ),
      ),
    )

    expect(variantAnimations.size).toBeGreaterThan(0)
    for (const name of variantAnimations) {
      expect(css).toContain(`@utility ${name} {`)
    }
  })
})
