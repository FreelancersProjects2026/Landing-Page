import { describe, expect, it } from 'vitest'

import robots from './robots'

describe('robots', () => {
  it('permite todo el sitio y apunta al sitemap absoluto', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://solutionspjm.com/sitemap.xml',
    })
  })
})
