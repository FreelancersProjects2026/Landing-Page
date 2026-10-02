# Convenciones observadas

## Código y nombres
- TypeScript `strict`, sin emisión, con el `tsconfig.json` de la plantilla Next.js. Respecto al anterior `tsconfig.app.json`, desde la Spec 002 se perdieron `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly` y `noFallthroughCasesInSwitch`; los cuatro primeros junto con el último generaban 56 errores en la plantilla. Recuperarlos (por ejemplo, solo para `src/`) queda para una spec posterior.
- Se conserva `allowImportingTsExtensions`, que ya existía en `tsconfig.app.json`; los módulos importan con extensión `.ts`/`.tsx`.
- Prettier: sin punto y coma, comillas simples y coma final.
- Componentes y clases en `PascalCase`; funciones, hooks y casos de uso en `camelCase`; módulos en `kebab-case`.
- Interfaces y propiedades del dominio son `readonly`; los perfiles creados se congelan.
- Alias entre espacios: `@/*` (`./src/*`), `@modules`, `@shared`; importaciones internas relativas.
- `src/components/ui` (shadcn/ui) es código de terceros: fuera de ESLint y Prettier.
- Cada módulo expone su superficie pública mediante `index.ts`.

## Patrones usados
- Módulos por capacidad con capas `domain`, `application`, `infrastructure` y `ui`.
- Factory para invariantes (`createCompanyProfile`).
- Puerto de repositorio en aplicación y adaptador concreto en infraestructura.
- Inyección de dependencias desde la capa de composición.
- Unión discriminada para estados asíncronos.
- Validación externa en infraestructura y validación de negocio en dominio.

## Prohibiciones automatizadas
- Ciclos de dependencias.
- Dominio hacia aplicación, infraestructura, UI, `src/app/`, `src/components/` o React.
- Aplicación hacia infraestructura, UI, `src/app/`, `src/components/` o React.
- UI hacia infraestructura.
- `src/app/` y `src/components/` hacia capas internas de un módulo.

## Pruebas
- Archivos `*.test.ts(x)` junto al código probado; descripciones en español.
- Vitest para dominio/aplicación; React Testing Library para comportamiento visible.
- Dobles con `vi.fn()` y limpieza después de cada prueba.
- La constitución exige TDD: rojo, mínimo verde y refactor.

## Commits
- Desde la Spec 002 se usan prefijos de intención (`docs:`, `chore:`, `build:`, `test:`) y un commit por fase.
- [PENDIENTE: definir formato de commits, estrategia de ramas y reglas de pull request.]
