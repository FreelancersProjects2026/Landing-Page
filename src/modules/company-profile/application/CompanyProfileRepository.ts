import type { CompanyProfile } from '../domain/companyProfile.ts'

export interface CompanyProfileRepository {
  find(): Promise<CompanyProfile | null>
}
