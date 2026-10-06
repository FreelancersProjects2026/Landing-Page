import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import NotFound from './not-found'

vi.mock('next/navigation', () => ({ useParams: vi.fn() }))

describe('[lang]/not-found', () => {
  it.each(['es', 'en'])(
    'muestra la 404 en %s con su imagen y enlace al inicio',
    (lang) => {
      vi.mocked(useParams).mockReturnValue({ lang })
      const { notFound } = getLandingContent(lang)

      render(<NotFound />)

      expect(
        screen.getByRole('heading', { level: 1, name: notFound.title }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('img', { name: notFound.imageAlt }),
      ).toHaveAttribute(
        'src',
        expect.stringContaining('404-raices-obsidiana.webp'),
      )
      expect(screen.getByRole('link', { name: notFound.cta })).toHaveAttribute(
        'href',
        `/${lang}`,
      )
    },
  )
})
