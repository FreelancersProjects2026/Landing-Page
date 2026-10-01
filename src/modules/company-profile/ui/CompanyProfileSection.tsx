import type { GetCompanyProfile } from '../application/getCompanyProfile.ts'
import { useCompanyProfile } from './useCompanyProfile.ts'

interface CompanyProfileSectionProps {
  readonly getCompanyProfile: GetCompanyProfile
}

export function CompanyProfileSection({
  getCompanyProfile,
}: CompanyProfileSectionProps) {
  const state = useCompanyProfile(getCompanyProfile)

  if (state.status === 'loading') {
    return <p aria-live="polite">Cargando información...</p>
  }

  if (state.status === 'empty') {
    return <p>No hay información disponible.</p>
  }

  if (state.status === 'error') {
    return <p role="alert">No pudimos cargar la información.</p>
  }

  return (
    <main className="shell">
      <p className="eyebrow">{state.profile.name}</p>
      <h1>{state.profile.valueProposition}</h1>
      <p className="summary">
        Somos {state.profile.teamSize} profesionales que creamos soluciones para{' '}
        {state.profile.audiences.join(', ')}.
      </p>
    </main>
  )
}
