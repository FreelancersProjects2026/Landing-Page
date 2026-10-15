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
        [
          ...source.matchAll(/[a-z-]+:(animate-(?:hero|obsidian)-[a-z-]+)/g),
        ].map((match) => match[1]),
      ),
    )

    expect(variantAnimations.size).toBeGreaterThan(0)
    for (const name of variantAnimations) {
      expect(css).toContain(`@utility ${name} {`)
    }
  })

  it('declara --glow-angle como ángulo para que el borde del botón pueda girar', () => {
    expect(css).toMatch(
      /@property --glow-angle \{\s*syntax: '<angle>';\s*inherits: false;\s*initial-value: 0deg;\s*\}/,
    )
    expect(css).toContain('@utility btn-obsidian {')
  })

  it('declara contact-orb con el 3D solo sin movimiento reducido y hover junto a foco', () => {
    const start = css.indexOf('@utility contact-orb {')
    expect(start).toBeGreaterThanOrEqual(0)
    const block = css.slice(start, css.indexOf('\n}', start))
    const [still, motion = ''] = block.split(
      '@media (prefers-reduced-motion: no-preference) {',
    )

    expect(motion).toContain('rotateX(')
    expect(motion).toContain('translate3d(')
    expect(still).not.toMatch(/transform:|transition|rotateX|translate3d/)
    expect(block).toMatch(/:hover,\s*a:focus-visible/)
  })
})
