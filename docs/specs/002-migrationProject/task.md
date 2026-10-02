# Tareas: Migrar el proyecto a la nueva plantilla

## Base acordada
- Spec: `docs/specs/002-migrationProject/spec.md`. Plan: `plan.md`.
- Rama: `migration/design`.
- Plantilla: se usa tal como está (secciones, textos, identidad y escena 3D).
- Stack: Next.js 16 + React 19 + Tailwind 4 + shadcn/ui, con pnpm 10.
- Se conserva `company-profile` con sus capas y pruebas.
- Método: TDD y cambios pequeños, validando tras cada fase.

## 1. Preparación
- [x] T01 Ejecutar `pnpm validate` en el estado actual y registrar el resultado como línea base.
- [x] T02 Registrar el ADR 002 con la decisión de pasar de Vite a Next.js.
- [x] T03 Verificar la compatibilidad de TypeScript, ESLint y Vitest con Next.js 16.

## 2. Traslado de la plantilla
- [x] T04 Mover `app/`, `components/`, `hooks/`, `lib/`, `public/` y `styles/` a la raíz.
- [x] T05 Mover `components.json`, `next.config.mjs` y `postcss.config.mjs` a la raíz.
- [x] T06 Fusionar los `.gitignore` incluyendo `.next/` y `next-env.d.ts`.
- [x] T07 Eliminar el directorio `compute-the-platform-to-build-and-ship-ai-agents/`.

## 3. Retiro de Vite
- [x] T08 Eliminar `index.html`, `vite.config.ts` y `src/main.tsx`.
- [x] T09 Eliminar `src/app/` del proyecto Vite y `src/styles.css`.
- [x] T10 Eliminar `tsconfig.app.json`, `tsconfig.node.json` y `dist/`.
- [x] T11 Retirar `vite` y `@vitejs/plugin-react` de las dependencias.

## 4. Configuración
- [x] T12 Unificar `package.json` con el nombre `pjm-solutions`.
- [x] T13 Combinar dependencias de la plantilla con las herramientas de calidad actuales.
- [x] T14 Definir los scripts `dev`, `build` y `start` de Next.js.
- [x] T15 Conservar los scripts `test`, `lint`, `format`, `typecheck`, `architecture`, `check` y `validate`.
- [x] T16 Unificar `tsconfig.json` conservando los alias `@/*`, `@modules/*` y `@shared/*`.
- [x] T17 Adaptar Vitest a Next.js con jsdom y los alias equivalentes.
- [x] T18 Añadir las reglas de Next.js a ESLint.
- [x] T19 Hacer que Prettier ignore `.next/`.
- [x] T20 Adaptar dependency-cruiser al nuevo `tsconfig.json`.
- [x] T21 Añadir la regla: `app/` y `components/` solo usan la API pública de los módulos.
- [x] T22 Regenerar un único `pnpm-lock.yaml` e instalar dependencias.

## 5. Pruebas de la página (TDD)
- [x] T23 Escribir una prueba que verifique que la página principal renderiza todas las secciones.
- [x] T24 Confirmar que la prueba falla (rojo).
- [x] T25 Aislar la escena 3D en las pruebas si jsdom no soporta WebGL.
  No requirió mock de WebGL: `AsciiScene` no se usa en la página. Se simulan `IntersectionObserver` y
  `canvas.getContext` (2D) en `src/test/setup.ts`.
- [x] T26 Ajustar la configuración hasta que la prueba pase (verde).
- [x] T27 Refactorizar manteniendo las pruebas en verde.

## 6. Módulo company-profile
- [x] T28 Ejecutar las pruebas de `company-profile` sin cambiar su lógica.
- [x] T29 Confirmar que respeta las reglas de capas de dependency-cruiser.

## 7. Verificación
- [x] T30 Confirmar que `pnpm dev` levanta la página.
- [x] T31 Confirmar que `pnpm build` compila sin errores.
- [x] T32 Confirmar que `pnpm validate` pasa en verde.
- [ ] T33 Comparar visualmente la página con la plantilla original.
  Pendiente: la realiza el equipo manualmente en el navegador con `pnpm dev`.
- [x] T34 Confirmar que no quedan archivos ni dependencias de Vite.

## 8. Documentación
- [x] T35 Actualizar `README.md` con el nuevo stack y los comandos.
- [x] T36 Actualizar `AGENTS.md` con la nueva estructura.
- [x] T37 Actualizar `docs/architecture.md`.
- [x] T38 Actualizar `docs/constitution.md`.
- [x] T39 Actualizar los archivos de `docs/contexto/`.
- [x] T40 Sincronizar spec, plan y tareas con el resultado final.

## 9. Corrección del error de hidratación
- [x] T41 Escribir una prueba que hidrate la página y falle ante errores de hidratación (rojo).
- [x] T42 Marcar el patrón ASCII de `TestimonialsSection` con `suppressHydrationWarning` (verde).
- [ ] T43 Confirmar en `pnpm dev` que la consola no muestra errores de hidratación.
  Pendiente: el usuario recarga http://localhost:3000 y confirma que la consola no muestra 'Hydration failed'.
- [x] T44 Actualizar `docs/contexto/errores-conocidos.md` como resuelto.

## 10. Código fuente en src/
- [x] T45 Mover `app/`, `components/`, `hooks/` y `lib/` a `src/` con `git mv`.
- [x] T46 Eliminar `styles/globals.css` (no se usa).
- [x] T47 Cambiar el alias `@/*` a `./src/*` en `tsconfig.json` y en Vitest.
- [x] T48 Actualizar `components.json` (`css: src/app/globals.css`).
- [x] T49 Actualizar rutas en dependency-cruiser, ESLint y Prettier (`src/components/ui`, `src/app`).
- [x] T50 Confirmar que la regla de API pública de módulos sigue detectando importaciones ilegales.
- [x] T51 Confirmar que `pnpm validate` pasa en verde.
- [x] T52 Actualizar README, AGENTS, architecture, constitution, contexto y ADR 002 con la nueva estructura.
