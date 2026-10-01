import type { CompanyProfile } from '../domain/companyProfile.ts'
import type { CompanyProfileRepository } from './CompanyProfileRepository.ts'

export type GetCompanyProfile = () => Promise<CompanyProfile | null>

export function createGetCompanyProfile(
  repository: CompanyProfileRepository,
): GetCompanyProfile {
  return () => repository.find()
}
