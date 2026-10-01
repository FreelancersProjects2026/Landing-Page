# Convenciones observadas

## Código y nombres
- TypeScript estricto, sin emisión; activa `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` y controles de símbolos no usados.
- Prettier: sin punto y coma, comillas simples y coma final.
- Componentes y clases en `PascalCase`; funciones, hooks y casos de uso en `camelCase`; módulos en `kebab-case`.
- Interfaces y propiedades del dominio son `readonly`; los perfiles creados se congelan.
- Alias entre espacios: `@app`, `@modules`, `@shared`; importaciones internas relativas.
- Cada módulo expone su superficie pública mediante `index.ts`.

## Patrones usados
- Módulos por capacidad con capas `domain`, `application`, `infrastructure` y `ui`.
- Factory para invariantes (`createCompanyProfile`).
- Puerto de repositorio en aplicación y adaptador concreto en infraestructura.
- Inyección de dependencias desde `app`.
- Unión discriminada para estados asíncronos.
- Validación externa en infraestructura y validación de negocio en dominio.

## Prohibiciones automatizadas
- Ciclos de dependencias.
- Dominio hacia aplicación, infraestructura, UI, `app` o React.
- Aplicación hacia infraestructura, UI, `app` o React.
- UI hacia infraestructura.
- `app` hacia capas internas de un módulo.

## Pruebas
- Archivos `*.test.ts(x)` junto al código probado; descripciones en español.
- Vitest para dominio/aplicación; React Testing Library para comportamiento visible.
- Dobles con `vi.fn()` y limpieza después de cada prueba.
- La constitución exige TDD: rojo, mínimo verde y refactor.

## Commits
- Solo existen `first commit` y `second commit`; no expresan intención técnica.
- [PENDIENTE: definir formato de commits, estrategia de ramas y reglas de pull request.]
