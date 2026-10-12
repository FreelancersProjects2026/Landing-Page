import { act, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import { CtaSection } from './cta-section'
import { HowItWorksSection } from './how-it-works-section'
import { ProjectsSection } from './projects-section'
import { TeamSection } from './team-section'

const content = getLandingContent('es')
const emailUrl = 'mailto:solutionspjm@gmail.com'

let notify: (entries: Partial<IntersectionObserverEntry>[]) => void
let options: IntersectionObserverInit | undefined

vi.stubGlobal(
  'IntersectionObserver',
  class {
    constructor(callback: typeof notify, init?: IntersectionObserverInit) {
      notify = callback
      options = init
    }
    observe() {}
    disconnect() {}
  },
)

type Reveal = { element: () => Element; hidden: string[]; shown: string[] }

const title = (name: string) => () =>
  screen.getByRole('heading', { level: 2, name })
const image = (src: string) => () =>
  document.querySelector(`img[src="${src}"]`)!.parentElement!
const upIn = (offset: string) => ({
  hidden: ['opacity-0', offset],
  shown: ['opacity-100', 'translate-y-0'],
})
const fadeIn = { hidden: ['opacity-0'], shown: ['opacity-100'] }

const cases: [string, ReactElement, number, Reveal[]][] = [
  [
    'CtaSection',
    <CtaSection
      key="cta"
      {...content.contact}
      whatsappUrl="https://wa.me/1"
      email="solutionspjm@gmail.com"
      emailUrl={emailUrl}
    />,
    0.2,
    [
      {
        element: () => title(content.contact.title)().closest('.border')!,
        ...upIn('translate-y-8'),
      },
      {
        element: () =>
          document.querySelector(`a[href="${emailUrl}"]`)!.parentElement!,
        ...upIn('translate-y-4'),
      },
    ],
  ],
  [
    'HowItWorksSection',
    <HowItWorksSection key="how" label="Proceso" {...content.process} />,
    0.1,
    [
      {
        element: () => screen.getByText('Proceso').parentElement!,
        hidden: ['-translate-x-12', 'opacity-0'],
        shown: ['translate-x-0', 'opacity-100'],
      },
      { element: title(content.process.title), ...upIn('translate-y-16') },
      { element: image('/ComoTrabajamos/ComoTrabajamos.png'), ...fadeIn },
    ],
  ],
  [
    'ProjectsSection',
    <ProjectsSection key="projects" label="Proyectos" {...content.projects} />,
    0.1,
    [
      {
        element: () => title(content.projects.title)().parentElement!,
        ...upIn('translate-y-8'),
      },
      {
        element: () => screen.getAllByRole('article')[0],
        ...upIn('translate-y-4'),
      },
      { element: image('/Proyectos/Proyectos.png'), ...fadeIn },
    ],
  ],
  [
    'TeamSection',
    <TeamSection key="team" label="Equipo" {...content.team} />,
    0.1,
    [
      { element: title(content.team.title), ...upIn('translate-y-8') },
      {
        element: () => screen.getAllByRole('article')[0],
        ...upIn('translate-y-12'),
      },
    ],
  ],
]

describe.each(cases)('%s: aparición', (_, section, threshold, reveals) => {
  it('se oculta hasta entrar en pantalla con su umbral y luego aparece', () => {
    render(section)
    expect(options).toEqual({ threshold })
    for (const { element, hidden } of reveals) {
      expect(element()).toHaveClass(...hidden)
    }

    act(() => notify([{ isIntersecting: true }]))

    for (const { element, shown } of reveals) {
      expect(element()).toHaveClass(...shown)
    }
  })
})
