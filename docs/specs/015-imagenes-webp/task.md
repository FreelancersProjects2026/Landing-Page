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
- [x] T03 Prueba: cada uno de los 4 `<img>` tiene `width`/`height` con las dimensiones de su WebP
  (Cómo trabajamos 1212×1298, Proyectos 1600×903, Servicios 1600×903, footer 1600×533; o las
  reales de T01) (falla) → agregar los atributos. (depende de T02; paralela a T04)
  Archivos: `how-it-works-section.tsx`, `projects-section.tsx`, `service-cards.tsx`,
  `footer-section.tsx`, `section-reveal.test.tsx`, `services-section.test.tsx`,
  `landing-sections.test.tsx`.
  - Evidencia (4709bf7, aprobada): rojo 4/4 «Expected width=... Received: null».
    Verde: `pnpm validate` exit 0, 214 pruebas. La prueba también comprueba que se mantienen
    `w-full h-full`.
  - Archivos: la prueba quedó solo en `landing-sections.test.tsx` (estaba en la lista de la
    tarea; ya renderiza las 4 secciones), así que no hizo falta tocar `section-reveal.test.tsx`
    ni `services-section.test.tsx`. No es un desvío.
- [x] T04 Prueba en `landing-images.test.ts`: los 4 PNG no existen (falla) → `git rm` de los 4 PNG.
  (depende de T02; paralela a T03)
  Archivos: `landing-images.test.ts`, `public/ComoTrabajamos/ComoTrabajamos.png`,
  `public/Proyectos/Proyectos.png`, `public/Servicios/Servicios.png`, `public/footer/Footer.png`.
  - Evidencia (d616e16, aprobada): rojo 4 fallos «expected true to be false» (los PNG existían).
    Verde: 214 pruebas, lint, typecheck, architecture y build OK; Prettier solo falló en
    `landing-sections.test.tsx` por T03 a medio hacer en paralelo (en verde tras 4709bf7). Grep:
    ningún archivo fuera de los docs de la 015 referencia los PNG.
- [x] T06 Corrección (mejora, hallazgo de reviwer en T01): ninguna prueba cubre el criterio «ancho
  ≤ 1600 px» de `spec.md` → prueba en `landing-images.test.ts` que lee el ancho de cada WebP con
  `sharp` resuelto desde `next` (`createRequire` + `require.resolve('sharp', { paths:
  [require.resolve('next')] })`, sin agregarlo a `package.json`) y comprueba `width ≤ 1600`. Hoy
  se cumple (1212, 1600, 1600, 1600): para ver el rojo, bajar el límite de forma temporal a 1599
  y anotarlo en la evidencia. Solo prueba, sin cambio de assets.
  Archivos: `src/components/landing/landing-images.test.ts`.
  - Evidencia: `sharp` 0.34.5 se resuelve desde `next` y carga en vitest sin problemas. Rojo con
    el límite temporal en 1599: 3 fallos «expected 1600 to be less than or equal to 1599»
    (`proyectos`, `servicios`, `footer`); `como-trabajamos` (1212) pasa. Verde con 1600:
    `pnpm validate` exit 0, 218 pruebas (5 avisos `no-img-element` previos).
- [x] T07 Corrección (mejora, hallazgo de reviwer en T03): el `it.each` de
  `landing-sections.test.tsx` (~línea 589) usa `%#` en el título y, si falla, no dice de qué
  sección es → poner el nombre de la sección en el título (p. ej. agregar el nombre como primer
  valor de cada fila o usar filas objeto con `$name`). Solo prueba; sigue en verde antes y
  después. (independiente de T06)
  Archivos: `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: antes, los casos salían como «0: declara width/height…» … «3: …»; ahora cada fila
    lleva el nombre como primer valor y el título usa `%s`: «Cómo trabajamos:», «Proyectos:»,
    «Servicios:», «Footer:» (4 casos en verde). `pnpm validate` OK (el build se repitió aparte por
    choque con otro `next build` en curso).
- [x] T08 Corrección (mejora, hallazgo de reviwer en T06): `landing-images.test.ts:14-19` carga
  `sharp` a nivel de módulo; si no resuelve o falla su binario, cae todo el archivo (peso y
  formato, «sin .png», «PNG borrados») y el error no apunta al criterio de ancho → cargar `sharp`
  de forma perezosa solo dentro de la prueba de ancho (o en su `beforeAll`). Refactor de prueba:
  verde antes y después. Comprobación: resolver de forma temporal un nombre inexistente (p. ej.
  `'sharp-x'`) y ver que solo falla la prueba de ancho; revertir y anotarlo en la evidencia.
  (independiente de T07)
  Archivos: `src/components/landing/landing-images.test.ts`.
  - Evidencia: antes, con `'sharp-x'` caía el archivo entero: «Error: Cannot find module
    'sharp-x'», «Tests no tests». Ahora `sharp` se carga con `loadSharp()` dentro de la prueba de
    ancho; con `'sharp-x'` solo fallan los 4 casos «mide como máximo 1600 px de ancho» y pasan los
    otros 9. Revertido a `'sharp'`: 13/13 en verde; `pnpm test` 218 pruebas; `pnpm validate` exit 0.
- [x] T05 Verificación: `pnpm validate` y revisión visual en 1280 y 375 px de Servicios, Cómo
  trabajamos, Proyectos y footer (comparar con la versión anterior). (depende de T03, T04, T06, T07, T08)
