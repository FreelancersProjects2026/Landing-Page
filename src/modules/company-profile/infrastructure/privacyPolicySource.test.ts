import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { collectTexts } from '../domain/landingContent.ts'
import { validatePrivacyPolicy } from '../domain/privacyPolicy.ts'
import { privacyPolicySource } from './privacyPolicySource.ts'

const { es, en } = privacyPolicySource

// Vitest se ejecuta desde la raíz del repositorio. Borrador pendiente de aprobación (T11).
const draft = readFileSync(
  'docs/specs/007-privacidad/contenido.md',
  'utf8',
).replace(/\s+/g, ' ')

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

    expect(es.sections).toHaveLength(9)
    expect(shape(en)).toEqual(shape(es))
  })

  it.each([es, en])(
    'copia literalmente de contenido.md los textos en $locale',
    (policy) => {
      const missing = collectTexts(policy, '')
        .map(([, text]) => text)
        .filter((text) => text !== policy.locale && !draft.includes(text))

      expect(missing).toEqual([])
    },
  )
})
