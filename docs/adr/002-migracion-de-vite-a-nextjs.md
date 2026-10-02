# ADR-002: Migración de Vite a Next.js

## Estado
Aceptada.

## Contexto
La página construida con Vite no transmite la imagen que el equipo quiere ofrecer a emprendimientos,
negocios y empresas. Se eligió como nueva base visual una plantilla basada en Next.js 16, React 19,
Tailwind 4 y shadcn/ui (Spec 002). Conservarla exige cambiar el framework de la aplicación, sin
perder la arquitectura modular por dominio (ADR-001) ni las herramientas de calidad vigentes
(TypeScript 6, ESLint 10, Vitest 5, Prettier y dependency-cruiser).

Al verificar compatibilidades aparecieron dos conflictos de dependencias entre pares (peers):
- **Vitest 5** declara `vite` como dependencia entre pares obligatoria.
- **`eslint-config-next`** incluye `eslint-plugin-react`, `eslint-plugin-import` y
  `eslint-plugin-jsx-a11y`, que solo admiten ESLint 9 o anterior.

## Decisión
- Adoptar Next.js (App Router) como framework y ubicar la plantilla en la raíz del repositorio.
- Mantener los módulos de dominio en `src/modules/` con sus capas y reglas de dependencia.
- Retirar `vite` y `@vitejs/plugin-react` de las dependencias directas. `vite` queda solo como
  dependencia transitiva de Vitest (pnpm instala los peers automáticamente). Vitest compila el JSX
  con la configuración de TypeScript, sin plugin de React.
- Usar `@next/eslint-plugin-next` con sus configuraciones `recommended` y `core-web-vitals` en el
  config plano de ESLint 10, en lugar de `eslint-config-next`. No se añaden reglas de React,
  import ni accesibilidad para compensar.

## Alternativas evaluadas
- **Mantener Vite y adaptar la plantilla:** implicaría reescribir el enrutado, las fuentes y los
  componentes de servidor de la plantilla, alejándola del original.
- **Mantener `vite` como dependencia directa:** innecesario, pnpm ya lo resuelve como peer de Vitest.
- **Bajar a ESLint 9 para usar `eslint-config-next`:** retrocede una herramienta de calidad vigente.

## Consecuencias
- `pnpm dev`, `pnpm build` y `pnpm start` usan Next.js.
- `vite` permanece en el lockfile como dependencia transitiva de Vitest.
- El lint cubre las reglas de Next.js, pero no las de `eslint-plugin-react`, `import` ni `jsx-a11y`.
- dependency-cruiser sigue validando las capas y añade que `app/` y `components/` solo usan la API
  pública de cada módulo.
