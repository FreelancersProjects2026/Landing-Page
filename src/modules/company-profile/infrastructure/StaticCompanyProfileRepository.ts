import type { CompanyProfileRepository } from '../application/CompanyProfileRepository.ts'
import {
  createCompanyProfile,
  InvalidCompanyProfileError,
  type CompanyProfile,
} from '../domain/companyProfile.ts'

const defaultProfile: unknown = {
  name: 'PJM Solutions',
  teamSize: 3,
  audiences: ['Emprendimientos', 'Negocios', 'Empresas'],
  valueProposition: 'Software que comienza por entender tu negocio.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseCompanyProfile(value: unknown): CompanyProfile {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    typeof value.teamSize !== 'number' ||
    !Array.isArray(value.audiences) ||
    !value.audiences.every((audience) => typeof audience === 'string') ||
    typeof value.valueProposition !== 'string'
  ) {
    throw new InvalidCompanyProfileError()
  }

  return createCompanyProfile({
    name: value.name,
    teamSize: value.teamSize,
    audiences: value.audiences,
    valueProposition: value.valueProposition,
  })
}

export class StaticCompanyProfileRepository implements CompanyProfileRepository {
  private readonly source: unknown

  constructor(source: unknown = defaultProfile) {
    this.source = source
  }

  find(): Promise<CompanyProfile> {
    return Promise.resolve(this.source).then(parseCompanyProfile)
  }
}
