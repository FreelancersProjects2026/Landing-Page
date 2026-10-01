import { describe, expect, it } from 'vitest'

import { InvalidCompanyProfileError } from '../domain/companyProfile.ts'
import { StaticCompanyProfileRepository } from './StaticCompanyProfileRepository.ts'

describe('StaticCompanyProfileRepository', () => {
  it('valida los datos antes de entregarlos a la aplicación', async () => {
    const repository = new StaticCompanyProfileRepository({
      name: 'PJM Solutions',
      teamSize: 'tres',
      audiences: ['Empresas'],
      valueProposition: 'Software a medida',
    })

    await expect(repository.find()).rejects.toBeInstanceOf(
      InvalidCompanyProfileError,
    )
  })
})
