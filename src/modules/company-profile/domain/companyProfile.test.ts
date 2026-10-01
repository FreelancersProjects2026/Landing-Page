import { describe, expect, it } from 'vitest'

import {
  createCompanyProfile,
  InvalidCompanyProfileError,
} from './companyProfile.ts'

describe('createCompanyProfile', () => {
  it('normaliza y conserva un perfil válido', () => {
    const profile = createCompanyProfile({
      name: '  PJM Solutions ',
      teamSize: 3,
      audiences: [' Emprendimientos ', 'Negocios'],
      valueProposition: ' Software a medida ',
    })

    expect(profile).toEqual({
      name: 'PJM Solutions',
      teamSize: 3,
      audiences: ['Emprendimientos', 'Negocios'],
      valueProposition: 'Software a medida',
    })
  })

  it('rechaza perfiles que rompen las invariantes', () => {
    expect(() =>
      createCompanyProfile({
        name: '',
        teamSize: 0,
        audiences: [],
        valueProposition: '',
      }),
    ).toThrow(InvalidCompanyProfileError)
  })
})
