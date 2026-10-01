import { describe, expect, it, vi } from 'vitest'

import { createCompanyProfile } from '../domain/companyProfile.ts'
import { createGetCompanyProfile } from './getCompanyProfile.ts'

describe('createGetCompanyProfile', () => {
  it('obtiene el perfil mediante el contrato del repositorio', async () => {
    const profile = createCompanyProfile({
      name: 'PJM Solutions',
      teamSize: 3,
      audiences: ['Empresas'],
      valueProposition: 'Software a medida',
    })
    const find = vi.fn().mockResolvedValue(profile)
    const getCompanyProfile = createGetCompanyProfile({ find })

    await expect(getCompanyProfile()).resolves.toBe(profile)
    expect(find).toHaveBeenCalledOnce()
  })
})
