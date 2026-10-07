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
- [x] T09 Verificación en build (`pnpm build && pnpm start`, curl sin JS): `/es/privacidad` y
      `/en/privacy` → 200 prerenderizadas con `h1` y secciones; `/en/privacidad` y `/es/privacy`
      → 404 global con contenido; `sitemap.xml` con 4 URLs; el enlace del footer lleva a la
      página correcta en cada idioma.
      - Verificado (2026-10-07, curl sin JS sobre el SSR): build con `● /[lang]/privacidad` (solo
        `/es/privacidad`) y `● /[lang]/privacy` (solo `/en/privacy`). Ambas → 200 `HIT`, con `h1`,
        9 `h2`, fecha, `<title>` y description propios, `canonical` y alternates cruzados
        (x-default → `/es/privacidad`). `/en/privacidad` y `/es/privacy` → 404 global con `h1` y
        texto en el SSR (igual que `/en/xyz`: contenido según la ruta, `<html lang="es">`).
        `sitemap.xml`: 4 `<url>` con sus hreflang. Footer: `/es` → `/es/privacidad` «Privacidad»,
        `/en` → `/en/privacy` «Privacy».
- [x] T10 Revisión manual: 390×844 y 1440×900, sin scroll horizontal, encabezados en orden,
      foco visible en los enlaces.
      - Verificado (2026-10-07, Chrome sobre `pnpm start`, iframes de 390×844 y 1440×900):
        `/es/privacidad` y `/en/privacy` sin scroll horizontal (scrollWidth ≤ ancho visible) y
        ningún elemento sale del viewport; encabezados `h1` → 9 `h2` en orden. Foco con Tab:
        «Volver al inicio» muestra el anillo blanco; «Privacidad» del footer, el contorno de
        `globals.css`, visible sobre el fondo negro; a 390 px queda centrado bajo los derechos.
        Consola sin errores ni avisos de hidratación en ambas páginas.
- [x] T11 Pendiente del negocio: aprobación final de `contenido.md`.
- [x] T12 Quitar nombre de persona y cédula de §1 (`contenido.md` ya actualizado): fuente y prueba
      de copia literal.
- [x] T13 Imagen de cabecera, a prueba: convertir
      `public/privacidad/Escudo de privacidad sobre raíces luminosas.png` a
      `public/privacidad/escudo-privacidad.webp` (≤ 250 KB, 1672×941, `pnpm dlx sharp-cli`), sin
      borrar el PNG hasta que el negocio la apruebe. Cabecera con la imagen decorativa (`alt=""`)
      detrás del `h1`: escudo a la derecha, título sobre la zona negra de la izquierda en
      escritorio; en móvil, imagen arriba y título debajo. Degradado al fondo para fundirla.
      - Hecho (2026-10-07): WebP de 92 KB a 1673×942 (tamaño original). Medido en Chrome sobre
        `pnpm start`: 390×844 y 1440×900 sin scroll horizontal; «Volver al inicio» no queda tapado
        (`elementFromPoint`). Contraste mínimo calculado píxel a píxel con el degradado: a 1440,
        `h1` 16,8:1 y fecha 6,6:1; a 390 el título va bajo la imagen, sobre el fondo. La cabecera
        mide `clamp(34rem,40vw,44rem)` en escritorio para que el escudo no se corte en pantallas
        anchas. El PNG sigue sin versionar hasta que el negocio apruebe la imagen.
