import { useEffect, useState } from 'react'

import type { GetCompanyProfile } from '../application/getCompanyProfile.ts'
import type { CompanyProfile } from '../domain/companyProfile.ts'

type CompanyProfileState =
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'success'; readonly profile: CompanyProfile }
  | { readonly status: 'error' }

export function useCompanyProfile(
  getCompanyProfile: GetCompanyProfile,
): CompanyProfileState {
  const [state, setState] = useState<CompanyProfileState>({
    status: 'loading',
  })

  useEffect(() => {
    let isActive = true

    void getCompanyProfile().then(
      (profile) => {
        if (isActive) {
          setState(
            profile ? { status: 'success', profile } : { status: 'empty' },
          )
        }
      },
      () => {
        if (isActive) {
          setState({ status: 'error' })
        }
      },
    )

    return () => {
      isActive = false
    }
  }, [getCompanyProfile])

  return state
}
