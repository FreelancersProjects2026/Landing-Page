# Tareas: Política de privacidad

## Base acordada
- Spec: `docs/specs/007-privacidad/spec.md`. Plan: `plan.md`. Textos: `contenido.md`.
- Rama: `contact/feature` (actual).
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.
- Flujo: `coder` implementa; `reviwer` revisa cada commit y reporta.

## Tareas
- [x] T01 Línea base: `pnpm validate` en verde antes de tocar nada.
- [x] T02 Dominio: `PrivacyPolicy` y `validatePrivacyPolicy` con sus pruebas.
- [x] T03 Infraestructura: textos `es` y `en` de `contenido.md`, con la prueba de copia literal y
      de igual cantidad de secciones.
- [x] T04 Aplicación: `privacyPaths`, `buildPrivacyUrl`, `buildPrivacyAlternates` y
      `getPrivacyPolicy`; exportarlos en `index.ts`.
- [x] T05 Vista `components/legal/privacy-policy.tsx` con su prueba.
- [x] T06 Rutas `/es/privacidad` y `/en/privacy` con metadata (canonical, alternates cruzados,
      title y description) y sus pruebas.
- [x] T07 Footer: enlace «Privacidad» / «Privacy» del idioma activo, con su prueba; la landing lo
      pasa por props.
- [x] T08 Sitemap con las dos URLs nuevas y sus alternates.
- [ ] T09 Verificación en build (`pnpm build && pnpm start`, curl sin JS): `/es/privacidad` y
      `/en/privacy` → 200 prerenderizadas con `h1` y secciones; `/en/privacidad` y `/es/privacy`
      → 404 global con contenido; `sitemap.xml` con 4 URLs; el enlace del footer lleva a la
      página correcta en cada idioma.
- [ ] T10 Revisión manual: 390×844 y 1440×900, sin scroll horizontal, encabezados en orden,
      foco visible en los enlaces.
- [x] T11 Pendiente del negocio: aprobación final de `contenido.md`.
