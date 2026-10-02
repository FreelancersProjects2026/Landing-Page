/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'domain-has-no-outer-dependencies',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/domain' },
      to: {
        path: '(^(app|components)/|/application/|/infrastructure/|/ui/|node_modules/react)',
      },
    },
    {
      name: 'application-does-not-depend-on-outer-layers',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/application' },
      to: {
        path: '(^(app|components)/|/infrastructure/|/ui/|node_modules/react)',
      },
    },
    {
      name: 'ui-does-not-depend-on-infrastructure',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/ui' },
      to: { path: '/infrastructure/' },
    },
    {
      name: 'app-uses-module-public-api',
      severity: 'error',
      from: { path: '^(app|components)/' },
      to: {
        path: '^src/modules/[^/]+/(application|domain|infrastructure|ui)/',
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    includeOnly: '^(src|app|components)/',
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
}
