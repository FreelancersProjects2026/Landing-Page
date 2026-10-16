import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  buildWhatsAppUrl,
  getLandingContent,
  getPrivacyPolicy,
} from '@modules/company-profile'

import Home from './page'
import { buildFaqStructuredData, buildStructuredData } from './structured-data'

const gmailUrl =
  'https://mail.google.com/mail/?view=cm&fs=1&to=solutionspjm%40gmail.com'

function renderPage(lang: string) {
  return Home({ params: Promise.resolve({ lang }) })
}

describe.each(['es', 'en'])('Home (%s)', (lang) => {
  const content = getLandingContent(lang)

  it('renderiza el menú, las 8 secciones, el footer y el botón flotante en orden', async () => {
    const { container } = render(await renderPage(lang))
    const children = Array.from(container.querySelector('main')?.children ?? [])
    const floatingButton = children.pop()

    expect(floatingButton).toHaveAccessibleName(content.whatsapp.label)
    const sections = children.map((element) => ({
      id: element.id || element.tagName.toLowerCase(),
      title: element.querySelector('h1, h2')?.textContent,
    }))

    expect(sections).toEqual([
      { id: 'header', title: undefined },
      { id: 'inicio', title: content.hero.heading },
      { id: 'servicios', title: content.services.title },
      { id: 'como-trabajamos', title: content.process.title },
      { id: 'proyectos', title: content.projects.title },
      { id: 'equipo', title: content.team.title },
      { id: 'preguntas-frecuentes', title: content.faq.title },
      { id: 'contacto', title: content.contact.title },
      { id: 'footer', title: undefined },
    ])
  })

  it('cada ancla del menú y del footer apunta a una sección existente', async () => {
    const { container } = render(await renderPage(lang))
    const anchors = Array.from(
      container.querySelectorAll('header a[href^="#"], footer a[href^="#"]'),
    ).map((link) => link.getAttribute('href') ?? '')

    expect(anchors.length).toBeGreaterThan(0)
    for (const href of anchors) {
      expect(container.querySelector(`section${href}`), href).not.toBeNull()
    }
  })

  it('tiene un único <h1> con la palabra clave principal', async () => {
    const { container } = render(await renderPage(lang))
    const headings = container.querySelectorAll('h1')

    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(content.hero.heading)
  })

  it('todos los botones de contacto abren WhatsApp con el mensaje del idioma', async () => {
    const { container } = render(await renderPage(lang))
    const whatsappUrl = buildWhatsAppUrl(
      content.company.phone,
      content.whatsappMessage,
    )
    const whatsappLinks = Array.from(
      container.querySelectorAll('a[href*="wa.me"]'),
    )

    // Menú (escritorio y móvil), hero, contacto y footer.
    expect(whatsappLinks).toHaveLength(5)
    for (const link of whatsappLinks) {
      expect(link).toHaveAttribute('href', whatsappUrl)
    }
  })

  it('el botón flotante abre WhatsApp con el mensaje de cada opción del idioma', async () => {
    render(await renderPage(lang))

    // El menú se carga en diferido: se espera al botón real (con aria-expanded).
    await userEvent.click(
      await screen.findByRole(
        'button',
        { name: content.whatsapp.label, expanded: false },
        { timeout: 5000 },
      ),
    )

    expect(
      screen.getAllByRole('menuitem').map((item) => ({
        label: item.textContent,
        href: item.getAttribute('href'),
      })),
    ).toEqual(
      content.whatsapp.options.map(({ label, message }) => ({
        label,
        href: buildWhatsAppUrl(content.company.phone, message),
      })),
    )
    for (const item of screen.getAllByRole('menuitem')) {
      expect(item.getAttribute('href')).toMatch(
        /^https:\/\/wa\.me\/50664400832\?text=/,
      )
    }
  })

  it('la sección de contacto abre el correo en Gmail web', async () => {
    const { container } = render(await renderPage(lang))
    const email = container.querySelectorAll(`#contacto a[href="${gmailUrl}"]`)

    expect(email).toHaveLength(1)
    expect(email[0]).toHaveAttribute('target', '_blank')
    expect(email[0]).toHaveTextContent('solutionspjm@gmail.com')
  })

  it('el footer abre el correo en Gmail web', async () => {
    const { container } = render(await renderPage(lang))
    const email = container.querySelectorAll(`footer a[href="${gmailUrl}"]`)

    expect(email).toHaveLength(1)
    expect(email[0]).toHaveAttribute('target', '_blank')
  })

  it('no publica enlaces mailto:', async () => {
    const { container } = render(await renderPage(lang))

    expect(container.querySelectorAll('a[href^="mailto:"]')).toHaveLength(0)
  })

  it('el footer enlaza a la política de privacidad del idioma', async () => {
    render(await renderPage(lang))

    expect(
      screen.getByRole('link', { name: getPrivacyPolicy(lang).footerLink }),
    ).toHaveAttribute('href', lang === 'es' ? '/es/privacidad' : '/en/privacy')
  })

  it('publica el JSON-LD del idioma', async () => {
    const { container } = render(await renderPage(lang))
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    )

    expect(
      Array.from(scripts, (script) => JSON.parse(script.textContent ?? '')),
    ).toEqual([buildStructuredData(content), buildFaqStructuredData(content)])
  })

  it('se hidrata sin errores a partir del HTML del servidor', async () => {
    const page = await renderPage(lang)
    const container = document.createElement('div')
    container.innerHTML = renderToString(page)
    document.body.appendChild(container)
    const onRecoverableError = vi.fn()

    const root = await act(async () =>
      hydrateRoot(container, page, { onRecoverableError }),
    )

    expect(onRecoverableError).not.toHaveBeenCalled()
    act(() => root.unmount())
    container.remove()
  })
})
