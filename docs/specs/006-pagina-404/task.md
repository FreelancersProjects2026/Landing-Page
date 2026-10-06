# Tareas: Página 404

## Base acordada
- Spec: `docs/specs/006-pagina-404/spec.md`. Plan: `plan.md`.
- Rama: `contact/feature` (actual).
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.
- Flujo: `coder` implementa; `reviwer` revisa cada commit y reporta.

## Tareas
- [x] T01 Línea base: `pnpm validate` en verde antes de tocar nada.
- [ ] T02 Imagen: convertir `public/404/404 entre raíces y obsidiana luminosa.png` a
      `public/404/404-raices-obsidiana.webp` (≤ 250 KB, 1672×941) con una herramienta puntual
      (`pnpm dlx sharp-cli`), sin agregar dependencias. Borrar el PNG original.
- [ ] T03 Dominio: `NotFoundContent` en `LandingContent.notFound`; la validación rechaza campos
      vacíos. Exportar el tipo en `index.ts`.
- [ ] T04 Infraestructura: textos `es` y `en` de la spec (marcadores) y prueba de que ambos
      idiomas los traen.
- [ ] T05 Fuentes en `app/fonts.ts`; `[lang]/layout.tsx` las importa (sin cambio visual).
- [ ] T06 Componente `not-found-view.tsx` con su prueba (título, imagen con `alt`, enlace).
- [ ] T07 Botón «obsidiana luminosa»: utilidades en `globals.css` (`@property`, keyframes,
      `motion-safe`) y uso en la vista; la prueba de `globals.css` sigue en verde.
- [ ] T08 `localized-not-found.tsx` con su prueba (`en`, `fr` y sin `lang`).
- [ ] T09 `[lang]/[...rest]/page.tsx` + `[lang]/not-found.tsx` con prueba de `notFound()`.
- [ ] T10 `global-not-found.tsx` + flag en `next.config.mjs` con su prueba.
- [ ] T11 Verificación en build (`pnpm build && pnpm start`): `/es/xyz`, `/en/xyz`, `/fr` y `/xyz`
      responden 404 con el idioma y enlace correctos; `/es` y `/en` siguen en 200.
- [ ] T12 Revisión manual: 390×844 y 1440×900, teclado, `prefers-reduced-motion`, sin scroll
      horizontal, título en ≤ 2 líneas.
- [ ] T13 Pendiente del negocio: aprobación de textos y de `canonical` heredado (ver spec).
