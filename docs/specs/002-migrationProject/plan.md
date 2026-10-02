# Plan técnico: Migración del proyecto a la nueva plantilla

## Referencias
- Especificación: `docs/specs/002-migrationProject/spec.md`.
- Arquitectura vigente: `docs/specs/001-definir-arquitectura/`, `docs/adr/001-arquitectura-modular-por-dominio.md`.
- Constitución: `docs/constitution.md`.
- Plantilla: `compute-the-platform-to-build-and-ship-ai-agents/` (Next.js 16, React 19, Tailwind 4, shadcn/ui).

## Enfoque
Se trasladará la plantilla a la raíz del repositorio sin modificar su contenido visual, se retirará el
proyecto Vite y se reintegrará el módulo `company-profile` con su arquitectura por capas. Las
herramientas de calidad actuales (Vitest, ESLint, Prettier, dependency-cruiser) se conservarán y se
adaptarán a Next.js. La migración se hará en una rama dedicada (`migration/design`) y en pasos
pequeños, cada uno verificable de forma independiente.

## Estructura objetivo
| Ruta | Origen | Responsabilidad |
|------|--------|-----------------|
| `src/app/` | Plantilla | Composición de páginas, layout y estilos globales (App Router). |
| `src/components/landing/` | Plantilla | Secciones visuales de la landing, sin cambios. |
| `src/components/ui/`, `src/hooks/`, `src/lib/` | Plantilla | Componentes shadcn/ui y utilidades técnicas. |
| `public/` | Plantilla | Recursos estáticos (Next.js exige que esté en la raíz). |
| `src/modules/company-profile/` | Proyecto actual | Módulo de dominio con sus capas y pruebas. |
| `src/shared/` | Proyecto actual | Recursos técnicos transversales. |
| `src/test/setup.ts` | Proyecto actual | Configuración de pruebas. |

Se retiran: `index.html`, `vite.config.ts`, `src/main.tsx`, `src/app/`, `src/styles.css`, `dist/`,
`tsconfig.app.json`, `tsconfig.node.json` y el directorio de la plantilla una vez trasladado.

## Decisiones técnicas
- **Gestor de paquetes:** pnpm 10; se regenera un único `pnpm-lock.yaml` en la raíz.
- **`package.json`:** nombre `pjm-solutions`, dependencias de la plantilla, devDependencies de
  calidad actuales (sin `vite` ni `@vitejs/plugin-react`) y scripts `dev`, `build` y `start` de Next.js.
  Se mantienen `test`, `lint`, `format`, `typecheck`, `architecture`, `check` y `validate`.
- **TypeScript:** un solo `tsconfig.json` basado en el de la plantilla, conservando los alias
  `@/*`, `@modules/*` y `@shared/*`.
- **Pruebas:** Vitest con entorno jsdom y alias equivalentes (`@`, `@modules`, `@shared`); basta la
  configuración de TypeScript para JSX, sin plugin de React. `src/test/setup.ts` simula
  `IntersectionObserver` y `canvas.getContext`, que jsdom no implementa. No hizo falta aislar WebGL:
  `AsciiScene` no se renderiza en la página.
- **Rigor de TypeScript:** respecto al `tsconfig.app.json` anterior se pierden
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly` y `noFallthroughCasesInSwitch`
  (activar los cuatro primeros y el último provocaba 56 errores en la plantilla). Recuperarlos, por
  ejemplo solo para `src/`, queda para una spec posterior; no se crea un tsconfig adicional. Se conserva
  `allowImportingTsExtensions`, que ya existía en `tsconfig.app.json`, para no cambiar `company-profile`.
- **Lint:** ESLint plano actual ampliado con las reglas de Next.js; Prettier ignora `.next/`.
  Se usa `@next/eslint-plugin-next` (`recommended` + `core-web-vitals`) en lugar de
  `eslint-config-next`, cuyos plugins (react, import, jsx-a11y) no admiten ESLint 10 (ADR-002).
- **Vite:** se retiran `vite` y `@vitejs/plugin-react` de las dependencias directas; `vite` queda
  como peer transitivo de Vitest 5 y Vitest compila JSX sin plugin de React (ADR-002).
- **Arquitectura:** dependency-cruiser conserva las reglas de capas de `src/modules` y añade que
  `src/app/` y `src/components/` solo usan la API pública (`index.ts`) de cada módulo.
- **`.gitignore`:** fusión de ambos, incluyendo `.next/`, `next-env.d.ts` y `dist/`.
- **Código de terceros:** `src/components/ui/` (shadcn) queda fuera de ESLint y Prettier. El resto de
  la plantilla se formatea con Prettier y se corrige lo mínimo para pasar lint, sin cambios visuales.
- **Build:** se elimina `typescript.ignoreBuildErrors` de `next.config.mjs`; los errores de tipos
  de la plantilla se corrigen sin cambiar lo visual.
- **Commits:** uno por fase en `migration/design`, más uno inicial con spec, plan y tareas.
- **Verificación visual (T33):** la realiza el equipo manualmente en el navegador.
- **`@vercel/analytics`:** el componente se conserva tal cual en el layout; no se configura.

## Fases
1. **Preparación:** registrar el ADR 002 (Vite → Next.js) y verificar que `pnpm validate` pasa en
   el estado actual como línea base.
2. **Traslado de la plantilla:** mover sus archivos a la raíz y resolver conflictos de nombres
   (`package.json`, `tsconfig.json`, `.gitignore`, `pnpm-lock.yaml`).
3. **Retiro de Vite:** eliminar los archivos y dependencias exclusivos del proyecto anterior.
4. **Configuración:** unificar `package.json`, `tsconfig.json`, Vitest, ESLint, Prettier y
   dependency-cruiser; instalar dependencias.
5. **Pruebas (TDD):** escribir primero la prueba que verifica que la página principal renderiza
   todas las secciones de la plantilla; hacerla pasar con la configuración correcta.
6. **Módulo `company-profile`:** comprobar que sus pruebas siguen en verde sin cambios de lógica.
7. **Verificación:** `pnpm validate` en verde y revisión visual con `pnpm dev` frente a la plantilla.
8. **Documentación:** actualizar `README.md`, `AGENTS.md`, `docs/architecture.md`,
   `docs/constitution.md` y `docs/contexto/`; sincronizar spec, plan y tareas.
9. **Corrección de hidratación:** corregir el error de hidratación del patrón ASCII de
   `TestimonialsSection` con `suppressHydrationWarning`, sin cambio visual (excepción de alcance
   aprobada por el usuario).
10. **Código en `src/`:** mover `app/`, `components/`, `hooks/` y `lib/` a `src/` con `git mv`,
    cambiar el alias `@/*` a `./src/*`, actualizar `components.json`, dependency-cruiser, ESLint,
    Prettier, Vitest y la documentación, y eliminar `styles/globals.css` (sin uso). Sin cambios
    de contenido ni visuales.

## Estrategia de pruebas
- Las pruebas de `company-profile` actúan como red de seguridad: no deben cambiar su lógica.
- Una prueba de la página principal confirma que se muestran todas las secciones de la plantilla.
- Una prueba de hidratación (`renderToString` + `hydrateRoot`) falla ante errores de hidratación.
- La escena 3D (`three`, `@react-three/fiber`) se aísla en las pruebas si jsdom no soporta WebGL.
- La comparación visual con la plantilla original se hace de forma manual en el navegador.

## Criterios de aceptación
Los definidos en la spec 002; la migración se considera completa cuando `pnpm validate` pasa y la
página es visualmente idéntica a la plantilla.

## Riesgos y mitigaciones
- **Incompatibilidad de versiones (TypeScript 6, ESLint 10, Vitest 5) con Next.js 16:** fijar
  versiones compatibles y documentarlo en el ADR.
- **WebGL en jsdom:** sustituir la escena 3D en pruebas mediante un mock controlado.
- **Pérdida de las reglas de capas:** ejecutar dependency-cruiser antes y después de la migración.
- **Componentes de servidor y cliente:** respetar las directivas `"use client"` de la plantilla.
- **Conflictos en archivos de configuración:** resolverlos uno a uno y validar tras cada fase.
- **Historial de git:** usar movimientos de archivos para conservar la trazabilidad.
