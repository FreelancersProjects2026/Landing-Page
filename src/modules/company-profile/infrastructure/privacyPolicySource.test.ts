import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { collectTexts } from '../domain/landingContent.ts'
import { validatePrivacyPolicy } from '../domain/privacyPolicy.ts'
import { privacyPolicySource } from './privacyPolicySource.ts'

const { es, en } = privacyPolicySource

// Vitest se ejecuta desde la raíz del repositorio. Borrador pendiente de aprobación (T11).
// Cada bloque es una línea de contenido.md con sus continuaciones unidas y sin marcas de
// Markdown (`#### `, `- `, `**Etiqueta:** `); cada texto debe coincidir con un bloque entero.
const draftBlocks = new Set(
  readFileSync('docs/specs/007-privacidad/contenido.md', 'utf8')
    .replace(/\r/g, '')
    .replace(/^#.*$/gm, '$&\n')
    .replace(/\n(?![\n#-]| *- )/g, ' ')
    .split('\n')
    .map((line) =>
      line
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^(#+ |- )?(\*\*[^*]+\*\* )?/, ''),
    ),
)

describe('privacyPolicySource', () => {
  it.each([es, en])('la política en $locale es válida', (policy) => {
    expect(() => validatePrivacyPolicy(policy)).not.toThrow()
  })

  it('tiene las mismas secciones, con la misma forma, en ambos idiomas', () => {
    const shape = (policy: typeof es) =>
      policy.sections.map(({ paragraphs, items = [] }) => [
        paragraphs.length,
        items.length,
      ])

    // [párrafos, elementos] por sección; la 2 tiene la lista y un párrafo de cierre.
    const expected = [[1, 0], [1, 3], ...Array(7).fill([1, 0])]

    expect(shape(es)).toEqual(expected)
    expect(shape(en)).toEqual(expected)
  })

  it.each([es, en])(
    'copia literalmente de contenido.md los textos en $locale',
    (policy) => {
      const missing = collectTexts(policy, '')
        .map(([, text]) => text)
        .filter((text) => text !== policy.locale && !draftBlocks.has(text))

      expect(missing).toEqual([])
    },
  )
})
