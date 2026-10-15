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
    const block = bracedBlock(css, '@utility contact-orb {')
    const motion = bracedBlock(
      block,
      '@media (prefers-reduced-motion: no-preference) {',
    )
    const still = block.replace(motion, '')

    expect(motion).toContain('rotateX(')
    expect(motion).toContain('translate3d(')
    expect(still).not.toMatch(/transform:|transition|rotateX|translate3d/)
    expect(block).toContain('var(--orb-accent)')
    expect(block).toMatch(/:hover,\s*a:focus-visible/)
  })

  it('anima en contact-orb los mismos estados que cambian al hover', () => {
    const block = bracedBlock(css, '@utility contact-orb {')
    const motion = bracedBlock(
      block,
      '@media (prefers-reduced-motion: no-preference) {',
    )
    const easing = '500ms cubic-bezier(0.22, 1, 0.36, 1)'

    for (const property of [
      'transform',
      'box-shadow',
      'border-color',
      'background-color',
      'color',
    ]) {
      expect(motion).toMatch(new RegExp(`[\\s:,]${property} ${escape(easing)}`))
    }
  })
})

function bracedBlock(source: string, opening: string): string {
  const start = source.indexOf(opening)
  expect(start).toBeGreaterThanOrEqual(0)
  let depth = 0
  for (let i = start + opening.length - 1; i < source.length; i++) {
    if (source[i] === '{') depth++
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1)
  }
  throw new Error(`Bloque sin cerrar: ${opening}`)
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
