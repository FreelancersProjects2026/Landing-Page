import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { buildWhatsAppUrl, getLandingContent } from '@modules/company-profile'

import Home from './page'
import { buildStructuredData } from './structured-data'

function renderPage(lang: string) {
  return Home({ params: Promise.resolve({ lang }) })
}

describe.each(['es', 'en'])('Home (%s)', (lang) => {
  const content = getLandingContent(lang)

  it('renderiza el menú, las 7 secciones, el footer y el botón flotante en orden', async () => {
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

    await userEvent.click(
      screen.getByRole('button', { name: content.whatsapp.label }),
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

  it('publica el JSON-LD del idioma', async () => {
    const { container } = render(await renderPage(lang))
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(JSON.parse(script?.textContent ?? '')).toEqual(
      buildStructuredData(content),
    )
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
