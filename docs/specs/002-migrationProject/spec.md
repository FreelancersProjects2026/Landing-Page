# Spec 002: Migrar el proyecto a la nueva plantilla

## Problema
La página actual no nos gusta: no representa la imagen que queremos transmitir como equipo y no
resulta atractiva para emprendimientos, negocios y empresas. Necesitamos migrar el proyecto a una
nueva base visual.

## Objetivo
Reemplazar el proyecto actual por la plantilla `compute-the-platform-to-build-and-ship-ai-agents/`,
de modo que esta se convierta en el único proyecto del repositorio, sin perder la arquitectura por
capas, el enfoque DDD ni las prácticas de calidad definidas en la Spec 001.

## Solución
Migrar el repositorio a la plantilla (Next.js 16 + React 19 + Tailwind 4 + shadcn/ui) ubicándola en
la raíz, retirar el proyecto Vite actual y reubicar en la nueva estructura los módulos de dominio
existentes (`company-profile`), conservando sus pruebas.

## Alcance
- Mover el contenido de la plantilla a la raíz del repositorio y eliminar el directorio original.
- Retirar el proyecto Vite actual (`index.html`, `vite.config.ts`, `src/main.tsx`, `src/app/`,
  `dist/`) y sus dependencias exclusivas.
- Unificar `package.json`: dependencias de la plantilla + herramientas de calidad vigentes
  (Vitest, Testing Library, ESLint, Prettier, dependency-cruiser) y el script `validate`.
- Renombrar el paquete de `my-v0-project` a `pjm-solutions`.
- Conservar `src/modules/company-profile` (domain, application, infrastructure, ui) y sus pruebas.
- Usar la plantilla tal como está: todas sus secciones, textos, identidad visual y escena 3D.
- Adaptar `.dependency-cruiser.cjs`, `tsconfig` y `eslint.config.js` a la nueva estructura.
- Actualizar los archivos `.md` (`README.md`, `AGENTS.md`, `docs/architecture.md`,
  `docs/constitution.md` y `docs/contexto/`) para reflejar el nuevo stack y estructura.
- Registrar la decisión del cambio de Vite a Next.js en un ADR (`docs/adr/002-...`).

## Fuera de alcance
- Modificar textos, secciones o identidad de la plantilla (se hará en una spec posterior).
- Conectar la landing con el módulo `company-profile`.
- Crear nuevos módulos de dominio o funcionalidades nuevas.
- Configurar despliegue, dominio, analítica (`@vercel/analytics`) o integración continua.
- Implementar backend, APIs, formularios funcionales o autenticación.
- Rediseñar la plantilla más allá de lo necesario para integrarla.

## Reglas del negocio
- La plantilla es la base visual oficial del sitio de PJM Solutions y se adopta sin cambios.
- La personalización del contenido para PJM Solutions queda pendiente de una spec posterior.
- El código nuevo sigue TDD y respeta la separación de capas de la Spec 001.
- La documentación `.md` debe estar sincronizada con el proyecto migrado.

## Decisiones (dudas resueltas)
1. Secciones: se conservan todas las de la plantilla.
2. Textos e identidad: se mantienen los de la plantilla, sin cambios.
3. Escena 3D (`ascii-scene`, `three`): se mantiene.
4. Contenido provisional: no aplica; se usa la plantilla tal como está.
5. Gestor de paquetes: pnpm 10, con un único `pnpm-lock.yaml` regenerado en la raíz.

## Criterios de aceptación
- [ ] El repositorio contiene un único proyecto en la raíz basado en la plantilla; el directorio
      `compute-the-platform-to-build-and-ship-ai-agents/` ya no existe.
- [ ] No quedan archivos ni dependencias directas del proyecto Vite (`vite`, `@vitejs/plugin-react`,
      `index.html`, `vite.config.ts`). `vite` puede seguir como dependencia transitiva de Vitest.
- [ ] `pnpm dev` levanta la página y `pnpm build` genera la compilación de Next.js sin errores.
- [ ] `pnpm validate` (formato, lint, tipos, pruebas, arquitectura y build) pasa en verde.
- [ ] Las pruebas existentes de `company-profile` se conservan y pasan.
- [ ] La página principal se ve igual que la plantilla original, con todas sus secciones.
- [ ] Una prueba verifica que la página principal renderiza todas las secciones de la plantilla.
- [ ] dependency-cruiser sigue validando las reglas de capas de `src/modules`.
- [ ] Los archivos `.md` (README, AGENTS, arquitectura, constitución, contexto y ADR) reflejan
      el nuevo stack.
- [ ] La spec, el plan y las tareas de la migración están sincronizados con el código final.
