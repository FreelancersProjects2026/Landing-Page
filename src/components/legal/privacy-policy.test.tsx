import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getPrivacyPolicy } from '@modules/company-profile'

import { PrivacyPolicyView } from './privacy-policy'

const policy = getPrivacyPolicy('es')

function renderView() {
  return render(
    <PrivacyPolicyView
      policy={policy}
      homeHref="/es"
      homeLabel="Volver al inicio"
    />,
  )
}

describe('PrivacyPolicyView', () => {
  it('muestra el título como h1, la fecha y la introducción', () => {
    renderView()

    expect(
      screen.getByRole('heading', { level: 1, name: policy.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(policy.updated)).toBeInTheDocument()
    expect(screen.getByText(policy.intro)).toBeInTheDocument()
  })

  it('muestra un h2 por sección, en orden', () => {
    renderView()

    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual(policy.sections.map(({ heading }) => heading))
  })

  it('muestra la lista de datos antes del párrafo de cierre de su sección', () => {
    renderView()
    const [, dataSection] = policy.sections
    const section = screen.getByRole('region', { name: dataSection.heading })

    const list = within(section).getByRole('list')
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(dataSection.items)
    const closing = within(section).getByText(dataSection.paragraphs[0])
    expect(
      list.compareDocumentPosition(closing) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('vuelve al inicio del idioma con un enlace nativo', () => {
    renderView()

    expect(
      screen.getByRole('link', { name: 'Volver al inicio' }),
    ).toHaveAttribute('href', '/es')
  })
})
