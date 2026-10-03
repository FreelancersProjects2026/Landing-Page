import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import { CtaSection } from './cta-section'
import { FooterSection } from './footer-section'
import { HeroSection } from './hero-section'
import { HowItWorksSection } from './how-it-works-section'
import { Navigation } from './navigation'
import { ProjectsSection } from './projects-section'
import { ServicesSection } from './services-section'
import { TeamSection } from './team-section'

const content = getLandingContent('es')
const whatsappUrl = 'https://wa.me/50664400832?text=Hola'

function expectWhatsAppLink(link: HTMLElement) {
  expect(link).toHaveAttribute('href', whatsappUrl)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
}

describe('Navigation', () => {
  it('muestra la marca, las anclas, el selector de idioma y WhatsApp', () => {
    render(
      <Navigation
        brand={content.company.name}
        menu={content.menu}
        cta={content.hero.cta}
        whatsappUrl={whatsappUrl}
        locale="es"
      />,
    )
    const nav = screen.getByRole('navigation')

    expect(within(nav).getByText('PJM Solutions')).toBeInTheDocument()
    expect(
      within(nav)
        .getAllByRole('link', { name: 'Servicios' })
        .map((link) => link.getAttribute('href')),
    ).toContain('#servicios')
    for (const [label, href] of [
      ['Cómo trabajamos', '#como-trabajamos'],
      ['Proyectos', '#proyectos'],
      ['Equipo', '#equipo'],
      ['Contacto', '#contacto'],
    ]) {
      expect(screen.getAllByRole('link', { name: label })[0]).toHaveAttribute(
        'href',
        href,
      )
    }
    expect(screen.getAllByRole('link', { name: 'EN' })[0]).toHaveAttribute(
      'href',
      '/en',
    )
    for (const link of screen.getAllByRole('link', {
      name: content.hero.cta,
    })) {
      expectWhatsAppLink(link)
    }
    expect(screen.getByRole('button', { name: 'Menú' })).toBeInTheDocument()
  })
})

describe('HeroSection', () => {
  it('usa la palabra clave como único <h1> y muestra eslogan, subtítulo y botón', () => {
    const { container } = render(
      <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
    )

    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: content.hero.heading }),
    ).toBeInTheDocument()
    expect(screen.getByText(content.hero.slogan)).toBeInTheDocument()
    expect(screen.getByText(content.hero.subtitle)).toBeInTheDocument()
    expect(container.querySelector('section')).toHaveAttribute('id', 'inicio')
    expectWhatsAppLink(screen.getByRole('link', { name: content.hero.cta }))
  })
})

describe('ServicesSection', () => {
  it('muestra título, introducción y los cuatro servicios', () => {
    render(
      <ServicesSection label={content.menu.services} {...content.services} />,
    )
    const section = screen.getByRole('region', {
      name: content.services.title,
    })

    expect(section).toHaveAttribute('id', 'servicios')
    expect(within(section).getByText(content.services.intro)).toBeVisible()
    for (const service of content.services.items) {
      expect(
        within(section).getByRole('heading', { name: service.title }),
      ).toBeInTheDocument()
      expect(within(section).getByText(service.description)).toBeVisible()
    }
  })
})

describe('HowItWorksSection', () => {
  it('muestra los cuatro pasos y los diferenciadores', () => {
    render(
      <HowItWorksSection label={content.menu.process} {...content.process} />,
    )
    const section = screen.getByRole('region', { name: content.process.title })

    expect(section).toHaveAttribute('id', 'como-trabajamos')
    for (const step of content.process.steps) {
      expect(
        within(section).getByRole('heading', { name: step.title }),
      ).toBeInTheDocument()
      expect(within(section).getByText(step.description)).toBeVisible()
    }
    expect(
      within(section).getByText(content.process.differentiatorsTitle),
    ).toBeVisible()
    for (const differentiator of content.process.differentiators) {
      expect(within(section).getByText(differentiator)).toBeVisible()
    }
  })
})

describe('CtaSection', () => {
  it('muestra el contacto con su botón de WhatsApp', () => {
    render(<CtaSection {...content.contact} whatsappUrl={whatsappUrl} />)
    const section = screen.getByRole('region', { name: content.contact.title })

    expect(section).toHaveAttribute('id', 'contacto')
    expect(within(section).getByText(content.contact.text)).toBeVisible()
    expectWhatsAppLink(
      within(section).getByRole('link', { name: content.contact.cta }),
    )
  })
})

describe('FooterSection', () => {
  it('muestra nombre, texto, ubicación, WhatsApp y derechos', () => {
    render(
      <FooterSection
        company={content.company}
        menu={content.menu}
        footer={content.footer}
        whatsappUrl={whatsappUrl}
      />,
    )
    const footer = screen.getByRole('contentinfo')

    expect(within(footer).getByText('PJM Solutions')).toBeVisible()
    expect(within(footer).getByText(content.footer.text)).toBeVisible()
    expect(
      within(footer).getByText('Paraíso de Cartago, Costa Rica'),
    ).toBeVisible()
    expectWhatsAppLink(
      within(footer).getByRole('link', { name: 'WhatsApp +506 6440-0832' }),
    )
    expect(within(footer).getByText('© 2026 PJM Solutions')).toBeVisible()
  })
})

describe('ProjectsSection', () => {
  it('muestra cada proyecto con su nombre y lo logrado, sin enlaces', () => {
    const { projects } = getLandingContent('en')
    render(<ProjectsSection label="Projects" {...projects} />)
    const section = screen.getByRole('region', { name: projects.title })

    expect(section).toHaveAttribute('id', 'proyectos')
    for (const project of projects.items) {
      expect(
        within(section).getByRole('heading', { name: project.name }),
      ).toBeInTheDocument()
      expect(within(section).getByText(project.description)).toBeVisible()
    }
    expect(
      within(section).getByText(
        'Centralized Tourism Control and Management System',
      ),
    ).toBeVisible()
    expect(within(section).queryAllByRole('link')).toHaveLength(0)
  })
})

describe('TeamSection', () => {
  it('muestra a cada integrante con su rol y sus enlaces externos', () => {
    render(<TeamSection label={content.menu.team} {...content.team} />)
    const section = screen.getByRole('region', { name: content.team.title })

    expect(section).toHaveAttribute('id', 'equipo')
    expect(within(section).getByText(content.team.intro)).toBeVisible()
    expect(within(section).queryAllByRole('img')).toHaveLength(0)
    for (const member of content.team.members) {
      const card = within(section)
        .getByRole('heading', { name: member.name })
        .closest('article') as HTMLElement

      expect(within(card).getByText(member.role)).toBeVisible()
      expect(
        within(card)
          .getAllByRole('link')
          .map((link) => [
            link.textContent,
            link.getAttribute('href'),
            link.getAttribute('target'),
            link.getAttribute('rel'),
          ]),
      ).toEqual(
        member.links.map(({ label, url }) => [
          label,
          url,
          '_blank',
          'noopener noreferrer',
        ]),
      )
    }
  })
})
