# Tareas: imágenes de la landing en WebP

## Base acordada
- Spec: `docs/specs/015-imagenes-webp/spec.md`. Plan: `plan.md` (comando exacto de conversión).
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Orden: T01 → T02 → (T03 ∥ T04) → T05. T03 y T04 no comparten archivos.

## Tareas
- [x] T01 Prueba en `landing-images.test.ts`: los 4 WebP existen, pesan ≤ 250 KB y su cabecera es
  `RIFF`…`WEBP` (falla) → generar los WebP con el comando de `plan.md`. Anotar dimensiones y pesos
  reales en la evidencia.
  Archivos: `src/components/landing/landing-images.test.ts` (nuevo),
  `public/ComoTrabajamos/como-trabajamos.webp`, `public/Proyectos/proyectos.webp`,
  `public/Servicios/servicios.webp`, `public/footer/footer.webp` (nuevos).
  - Evidencia: rojo, 4/4 fallan con `ENOENT` (no existen los WebP). Verde, 4/4 tras el comando de
    `plan.md`. Real (igual al plan): `como-trabajamos.webp` 1212×1298, 186 KB;
    `proyectos.webp` 1600×903, 193 KB; `servicios.webp` 1600×903, 96 KB; `footer.webp` 1600×533,
    104 KB. `pnpm validate` OK (205 pruebas).
- [x] T02 Prueba en `landing-images.test.ts`: ningún `.tsx` de `src/components/landing/` (sin
  contar pruebas) contiene `.png` (falla) → cambiar las 4 rutas a WebP; actualizar las rutas
  esperadas en `section-reveal.test.tsx` (líneas 76 y 92). (depende de T01)
  Archivos: `landing-images.test.ts`, `how-it-works-section.tsx`, `projects-section.tsx`,
  `service-cards.tsx`, `footer-section.tsx`, `section-reveal.test.tsx`.
  - Evidencia: rojo, la prueba nueva falla con `withPng` = `footer-section.tsx`,
    `how-it-works-section.tsx`, `projects-section.tsx`, `service-cards.tsx`. Verde tras cambiar
    las 4 rutas y las 2 esperadas en `section-reveal.test.tsx`. `pnpm validate` OK (206 pruebas;
    5 avisos `no-img-element` previos, fuera de alcance).
- [ ] T03 Prueba: cada uno de los 4 `<img>` tiene `width`/`height` con las dimensiones de su WebP
  (Cómo trabajamos 1212×1298, Proyectos 1600×903, Servicios 1600×903, footer 1600×533; o las
  reales de T01) (falla) → agregar los atributos. (depende de T02; paralela a T04)
  Archivos: `how-it-works-section.tsx`, `projects-section.tsx`, `service-cards.tsx`,
  `footer-section.tsx`, `section-reveal.test.tsx`, `services-section.test.tsx`,
  `landing-sections.test.tsx`.
- [ ] T04 Prueba en `landing-images.test.ts`: los 4 PNG no existen (falla) → `git rm` de los 4 PNG.
  (depende de T02; paralela a T03)
  Archivos: `landing-images.test.ts`, `public/ComoTrabajamos/ComoTrabajamos.png`,
  `public/Proyectos/Proyectos.png`, `public/Servicios/Servicios.png`, `public/footer/Footer.png`.
- [ ] T05 Verificación: `pnpm validate` y revisión visual en 1280 y 375 px de Servicios, Cómo
  trabajamos, Proyectos y footer (comparar con la versión anterior). (depende de T03, T04)
