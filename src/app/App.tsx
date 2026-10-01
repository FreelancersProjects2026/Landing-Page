import {
  CompanyProfileSection,
  createGetCompanyProfile,
  StaticCompanyProfileRepository,
} from '@modules/company-profile'

const getCompanyProfile = createGetCompanyProfile(
  new StaticCompanyProfileRepository(),
)

export function App() {
  return <CompanyProfileSection getCompanyProfile={getCompanyProfile} />
}
