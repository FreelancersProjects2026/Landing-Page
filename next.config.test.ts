import { describe, expect, it } from 'vitest'

import nextConfig from './next.config.mjs'

describe('next.config', () => {
  it('redirige / a /es de forma no permanente', async () => {
    expect(await nextConfig.redirects?.()).toEqual([
      { source: '/', destination: '/es', permanent: false },
    ])
  })
})
