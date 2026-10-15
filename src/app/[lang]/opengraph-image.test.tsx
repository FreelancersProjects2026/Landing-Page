import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getLandingContent } from '@modules/company-profile'

import OpengraphImage, {
  alt,
  contentType,
  dynamicParams,
  size,
} from './opengraph-image'

const { ImageResponse } = vi.hoisted(() => ({ ImageResponse: vi.fn() }))
vi.mock('next/og', () => ({ ImageResponse }))

describe('opengraph-image', () => {
  it('declara una imagen PNG de 1200×630', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
    expect(contentType).toBe('image/png')
  })

  it('describe la imagen con el nombre de la empresa y solo admite es y en', () => {
    expect(alt).toBe(getLandingContent('es').company.name)
    expect(dynamicParams).toBe(false)
  })

  it.each(['es', 'en'])(
    'compone logo, nombre y descripción SEO de %s',
    async (lang) => {
      await OpengraphImage({ params: Promise.resolve({ lang }) })

      const [card, options] = ImageResponse.mock.lastCall as [
        ReactElement,
        typeof size,
      ]
      expect(options).toMatchObject(size)
      render(card)
      expect(screen.getByText('solutionsPJM')).toBeInTheDocument()
      expect(
        screen.getByText(getLandingContent(lang).seo.description),
      ).toBeInTheDocument()
      expect(document.querySelector('img')?.getAttribute('src')).toMatch(
        /^data:image\/jpeg;base64,\/9j\//,
      )
    },
  )
})
