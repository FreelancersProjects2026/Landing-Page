import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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

    expect(within(nav).getByText('solutionsPJM')).toBeInTheDocument()
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

  it('usa la foto del hero como fondo decorativo en WebP, sin video', () => {
    const { container } = render(
      <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
    )
    const background = container.querySelector('img')

    expect(container.querySelector('video')).toBeNull()
    expect(background).toHaveAttribute('src', '/hero/hero.webp')
    expect(background).toHaveAttribute(
      'srcset',
      '/hero/hero-960.webp 960w, /hero/hero.webp 1920w',
    )
    expect(background).toHaveAttribute('alt', '')
    expect(background).toHaveAttribute('aria-hidden', 'true')
  })

  it('mantiene cada palabra rotativa del eslogan 3,5 segundos', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(
        <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
      )
      const [first, second] = content.hero.sloganWords
      const visibleWord = () =>
        container.querySelector('[data-rotating-word]')?.textContent

      act(() => vi.advanceTimersByTime(3_499))
      expect(visibleWord()).toBe(first)

      act(() => vi.advanceTimersByTime(1))
      expect(visibleWord()).toBe(second)
    } finally {
      vi.useRealTimers()
    }
  })

  it('hace entrar la palabra rotativa letra por letra, de forma escalonada', () => {
    const { container } = render(
      <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
    )
    const [first] = content.hero.sloganWords
    const letters = container.querySelectorAll<HTMLElement>(
      '[data-rotating-word] > span',
    )

    expect(letters).toHaveLength(first.length)
    expect(letters[0].style.getPropertyValue('--letter-delay')).toBe('0ms')
    expect(letters[2].style.getPropertyValue('--letter-delay')).toBe('90ms')
  })

  it('hace caer solo unos pocos pétalos sobre la foto', () => {
    const { container } = render(
      <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
    )

    expect(container.querySelectorAll('.animate-hero-petal')).toHaveLength(6)
  })

  it('no parte la palabra rotativa entre letras al saltar de línea', () => {
    const { container } = render(
      <HeroSection hero={content.hero} whatsappUrl={whatsappUrl} />,
    )

    expect(container.querySelector('[data-rotating-word]')).toHaveClass(
      'whitespace-nowrap',
    )
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

describe('HowItWorksSection: accesibilidad', () => {
  function renderProcess() {
    return render(
      <HowItWorksSection label={content.menu.process} {...content.process} />,
    )
  }

  it('no anida encabezados dentro de botones', () => {
    const { container } = renderProcess()

    expect(
      container.querySelectorAll(
        'button h1, button h2, button h3, button h4, button h5, button h6',
      ),
    ).toHaveLength(0)
  })

  it('no anima el indicador del paso activo como si fuera a avanzar solo', () => {
    const { container } = renderProcess()

    expect(container.querySelector('.animate-progress')).toBeNull()
  })

  it('no cambia de paso sola: el paso activo cambia solo con un clic', () => {
    vi.useFakeTimers()
    try {
      renderProcess()
      const [first, second] = content.process.steps.map((step) =>
        screen.getByRole('button', { name: step.title }),
      )

      act(() => vi.advanceTimersByTime(20_000))
      expect(first).toHaveAttribute('aria-pressed', 'true')

      fireEvent.click(second as HTMLElement)
      expect(second).toHaveAttribute('aria-pressed', 'true')
      expect(first).toHaveAttribute('aria-pressed', 'false')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('CtaSection', () => {
  const email = 'solutionspjm@gmail.com'
  const emailUrl = 'mailto:solutionspjm@gmail.com'

  function renderCta() {
    render(
      <CtaSection
        {...content.contact}
        whatsappUrl={whatsappUrl}
        email={email}
        emailUrl={emailUrl}
      />,
    )
    return screen.getByRole('region', { name: content.contact.title })
  }

  it('muestra el contacto con su botón de WhatsApp', () => {
    const section = renderCta()

    expect(section).toHaveAttribute('id', 'contacto')
    expect(within(section).getByText(content.contact.text)).toBeVisible()
    expectWhatsAppLink(
      within(section).getByRole('link', { name: content.contact.cta }),
    )
  })

  it('muestra el correo como una tarjeta-botón mailto: con su etiqueta', () => {
    const section = renderCta()
    const link = within(section).getByRole('link', {
      name: `${content.contact.emailLabel} ${email}`,
    })

    expect(link).toHaveAttribute('href', emailUrl)
    expect(link).not.toHaveAttribute('target')
    // Los íconos (correo y flecha) son decorativos: no agregan nada al nombre accesible.
    const icons = link.querySelectorAll('svg')
    expect(icons).toHaveLength(2)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })
})

describe('FooterSection', () => {
  it('muestra nombre, texto, ubicación, WhatsApp, correo y derechos', () => {
    render(
      <FooterSection
        company={content.company}
        menu={content.menu}
        footer={content.footer}
        whatsappUrl={whatsappUrl}
        emailUrl="mailto:solutionspjm@gmail.com"
        privacy={{ label: 'Privacidad', href: '/es/privacidad' }}
      />,
    )
    const footer = screen.getByRole('contentinfo')

    expect(
      within(footer).getByRole('link', { name: 'Privacidad' }),
    ).toHaveAttribute('href', '/es/privacidad')
    expect(within(footer).getByText('solutionsPJM')).toBeVisible()
    expect(within(footer).getByText(content.footer.text)).toBeVisible()
    expect(
      within(footer).getByText('Paraíso de Cartago, Costa Rica'),
    ).toBeVisible()
    expectWhatsAppLink(
      within(footer).getByRole('link', { name: 'WhatsApp +506 6440-0832' }),
    )
    const email = within(footer).getByRole('link', {
      name: 'solutionspjm@gmail.com',
    })
    expect(email).toHaveAttribute('href', 'mailto:solutionspjm@gmail.com')
    expect(email).not.toHaveAttribute('target')
    expect(within(footer).getByText('© 2026 solutionsPJM')).toBeVisible()
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
