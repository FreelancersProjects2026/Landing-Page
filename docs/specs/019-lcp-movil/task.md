# Tareas: LCP móvil

## Base acordada
- Spec: `docs/specs/019-lcp-movil/spec.md`. Plan: `plan.md`.
- Rama: `perf/lcp-movil` (no crear otra, no hacer push).
- Método: TDD, un commit por tarea `fix(landing): 019-Tnn ...`, `pnpm validate` en verde.
- Sin cambio de contenido visible ni de dominio. Sin dependencias nuevas.
- Orden: T01 → T02 (comparten `landing-sections.test.tsx`); T03 en paralelo con ambas.

## Tareas
- [x] T01 Prueba en `landing-sections.test.tsx`: las imágenes de cómo trabajamos, proyectos,
  footer y servicios tienen `loading="lazy"` y `decoding="async"`; la hero no tiene
  `loading="lazy"` y conserva `fetchpriority="high"` (falla) → añadir `loading="lazy"` y
  `decoding="async"` a esos cuatro `<img>`. (paralela a T03)
  Archivos: `src/components/landing/how-it-works-section.tsx`,
  `src/components/landing/projects-section.tsx`, `src/components/landing/footer-section.tsx`,
  `src/components/landing/service-cards.tsx`, `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo 4 fallos (`loading="lazy"` ausente en cómo trabajamos, proyectos, servicios y
    footer); verde `pnpm test` 250/250 y `pnpm check` OK.
- [ ] T02 Prueba en `landing-sections.test.tsx` (bloque navegación, hoy asserta el JPEG): el logo
  contiene `/logo/icono/LOGOsolutionsPJM-192.webp` (falla) → generar
  `public/logo/icono/LOGOsolutionsPJM-192.webp` (192×192) desde `LOGOsolutionsPJM.jpeg` con sharp
  (ya en `node_modules/.pnpm/sharp@0.34.5`; script de un solo uso fuera del repo, sin añadir
  dependencias) y apuntar el `src` del `<Image>` de `navigation.tsx` a ese WebP; mantener
  `alt=""`, 40×40 y `preload`. No usar el PNG (regla de spec 015, `landing-images.test.ts`). No
  tocar `whatsapp-button`. (depende de T01)
  Archivos: `public/logo/icono/LOGOsolutionsPJM-192.webp` (nuevo),
  `src/components/landing/navigation.tsx`, `src/components/landing/landing-sections.test.tsx`.
- [x] T03 Prueba en `fonts.test.ts`: el mock registra las opciones de cada fuente y
  `JetBrains_Mono` se llama con `preload: false`, las Instrument sin él (falla) → añadir
  `preload: false` a `JetBrains_Mono` en `fonts.ts`. (paralela a T01/T02)
  Archivos: `src/app/fonts.ts`, `src/app/fonts.test.ts`.
  - Evidencia: rojo 1 fallo (`preload` de mono `undefined`, se esperaba `false`); verde
    `pnpm test` 251/251 y `pnpm check` OK (solo los avisos conocidos de `<img>`).
- [ ] T04 Verificación (sin commit de código): `pnpm validate` verde; `pnpm build && pnpm start` y
  el `<head>` de `/es` solo precarga hero, logo `LOGOsolutionsPJM-192.webp` y fuentes Instrument. Marcar criterios en
  `spec.md`. (depende de T01–T03)
