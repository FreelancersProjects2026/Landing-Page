import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { createCompanyProfile } from '../domain/companyProfile.ts'
import { CompanyProfileSection } from './CompanyProfileSection.tsx'

describe('CompanyProfileSection', () => {
  it('muestra el perfil cargado', async () => {
    const profile = createCompanyProfile({
      name: 'PJM Solutions',
      teamSize: 3,
      audiences: ['Emprendimientos', 'Negocios', 'Empresas'],
      valueProposition: 'Software que comienza por entender tu negocio.',
    })

    render(
      <CompanyProfileSection
        getCompanyProfile={vi.fn().mockResolvedValue(profile)}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: profile.valueProposition }),
    ).toBeInTheDocument()
  })

  it('representa el estado vacío', async () => {
    render(
      <CompanyProfileSection
        getCompanyProfile={vi.fn().mockResolvedValue(null)}
      />,
    )

    expect(
      await screen.findByText(/no hay información disponible/i),
    ).toBeVisible()
  })

  it('representa los errores sin exponer detalles internos', async () => {
    render(
      <CompanyProfileSection
        getCompanyProfile={vi.fn().mockRejectedValue(new Error('interno'))}
      />,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /no pudimos cargar la información/i,
    )
  })
})
