import { describe, expect, it } from 'vitest'

import {
  InvalidPrivacyPolicyError,
  validatePrivacyPolicy,
  type PrivacyPolicy,
} from './privacyPolicy.ts'

function validPolicy(): PrivacyPolicy {
  return {
    locale: 'es',
    seo: {
      title: 'Política de privacidad | solutionsPJM',
      description: 'Qué datos personales tratamos.',
    },
    footerLink: 'Privacidad',
    title: 'Política de privacidad',
    updated: 'Última actualización: 7 de octubre de 2026',
    intro: 'Esta política explica qué datos tratamos.',
    sections: [
      { heading: '1. Responsable', paragraphs: ['solutionsPJM.'] },
      {
        heading: '2. Qué datos tratamos',
        items: ['Los que nos envías.'],
        paragraphs: ['Este sitio no tiene formularios.'],
      },
    ],
  }
}

function problemsOf(policy: PrivacyPolicy): readonly string[] {
  try {
    validatePrivacyPolicy(policy)
  } catch (error) {
    if (error instanceof InvalidPrivacyPolicyError) return error.problems
    throw error
  }
  return []
}

describe('validatePrivacyPolicy', () => {
  it('acepta una política completa y la devuelve', () => {
    const policy = validPolicy()

    expect(validatePrivacyPolicy(policy)).toBe(policy)
  })

  it('rechaza un título SEO de más de 60 caracteres', () => {
    const policy = validPolicy()

    expect(
      problemsOf({ ...policy, seo: { ...policy.seo, title: 'a'.repeat(61) } }),
    ).toEqual(['el título supera 60 caracteres'])
  })

  it('rechaza una descripción SEO de más de 160 caracteres', () => {
    const policy = validPolicy()

    expect(
      problemsOf({
        ...policy,
        seo: { ...policy.seo, description: 'a'.repeat(161) },
      }),
    ).toEqual(['la descripción supera 160 caracteres'])
  })

  it('exige al menos una sección', () => {
    expect(problemsOf({ ...validPolicy(), sections: [] })).toEqual([
      'falta al menos una sección',
    ])
  })

  it('rechaza una sección sin párrafos ni elementos', () => {
    expect(
      problemsOf({
        ...validPolicy(),
        sections: [{ heading: '1. Responsable', paragraphs: [] }],
      }),
    ).toEqual(['la sección «1. Responsable» está vacía'])
  })

  it('rechaza textos vacíos e indica dónde están', () => {
    const policy = validPolicy()

    expect(
      problemsOf({
        ...policy,
        intro: ' ',
        sections: [{ heading: '', paragraphs: ['Texto.'], items: [''] }],
      }),
    ).toEqual([
      'intro está vacío',
      'sections.0.heading está vacío',
      'sections.0.items.0 está vacío',
    ])
  })
})
