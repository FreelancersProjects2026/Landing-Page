# Tareas: Contactos del footer con botones 3D

## Base acordada
- Spec: `docs/specs/017-footer-contactos-3d/spec.md`. Plan: `plan.md` (diseño en prosa).
- Rama: `feat/seo-datos-estructurados` (no crear otra). No tocar ni commitear
  `.claude/agents/planner.md`.
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Orden: (T01 ∥ T02) → T03 → T04. T01 y T02 no comparten archivos.
- Valores por defecto D1–D3 de la spec; si el usuario pide otra cosa, se ajusta en una corrección.

## Tareas
- [x] T01 Prueba en `globals-css.test.ts`: `globals.css` declara `@utility contact-orb {`, con
  `rotateX` y `translate3d` solo dentro de `@media (prefers-reduced-motion: no-preference)`, y el
  estado de hover comparte regla con `:focus-visible` (falla) → agregar la utilidad según
  «Diseño» del plan (orbe 48 px, acento por `--orb-accent`, ícono que se adelanta). (paralela a T02)
  Archivos: `src/app/globals.css`, `src/app/globals-css.test.ts`.
  - Evidencia: rojo `expected -1 to be greater than or equal to 0` (no existía `@utility contact-orb`);
    verde `globals-css.test.ts` 3/3 y `pnpm validate` OK (239 pruebas). Estado activo con
    `:where(a:hover, a:focus-visible) > &`; `transform`/`transition` solo bajo `no-preference`.
- [x] T02 Prueba nueva `footer-contact-link.test.tsx`: `FooterContactLink` con `icon` y `accent`
  muestra un orbe `aria-hidden` con clase `contact-orb`, el svg recibido y `--orb-accent` igual al
  acento; el nombre accesible es solo `children`; `external` añade `target`/`rel` y sin él no hay
  `target`; ya no hay `lucide-arrow-up-right` (falla) → ampliar el componente con `icon` y
  `accent`, enlace `group inline-flex items-center gap-3 min-h-12` con foco visible, sin
  transformar el `<a>`. (paralela a T01)
  Archivos: `src/components/landing/footer-contact-link.tsx`,
  `src/components/landing/footer-contact-link.test.tsx`.
  - Evidencia: rojo 2/4 fallan (sin orbe `aria-hidden`; clases `gap-3 min-h-12` ausentes); verde
    4/4. `icon?: LucideIcon` (respaldo `ArrowUpRight`) y `accent?` (respaldo `#ffffff`) para que
    `FooterSection` siga compilando hasta T03. lint, typecheck, 239 pruebas, architecture y build
    OK; `format:check` solo marca `globals-css.test.ts` (T01 en curso, no tocado).
- [x] T03 Prueba en `landing-sections.test.tsx` (bloque `FooterSection`): los enlaces «WhatsApp
  +506 6440-0832», «solutionspjm@gmail.com» e «Instagram» conservan `href`/`target` y contienen
  `lucide-message-circle`, `lucide-mail` y `lucide-instagram` respectivamente, todos
  `aria-hidden`; renombrar/ajustar la prueba «oculta a lectores todas las flechas» a íconos
  (falla) → en `footer-section.tsx` pasar ícono y acento (D2) a cada canal; perfiles sociales por
  `label` con respaldo `ArrowUpRight` y acento blanco. (depende de T02)
  Archivos: `src/components/landing/footer-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo 3/38 fallan (`expected null not to be null`: sin `lucide-message-circle`,
    `lucide-mail` ni `lucide-instagram`); verde 38/38. Acentos D2 `#25D366`, `#EA4335`,
    `#E1306C`; tabla `socialChannels` por `label` y, si falta, quedan los defaults de
    `FooterContactLink`. «oculta a lectores todas las flechas» pasa a «todos los íconos».
    `pnpm validate` OK (242 pruebas, build OK).
- [x] T04 Verificación en navegador (sin commit de código salvo que aparezca un defecto, que se
  reporta a planner): `pnpm dev`, footer de `/es` y `/en` en escritorio (hover y Tab sobre los
  tres canales), a 375 px y con `prefers-reduced-motion: reduce` emulado; anotar evidencia aquí.
  (depende de T01, T03, T05 y T07)
  - Evidencia (2026-10-15, Chrome, `next dev` en :3000 del mismo repo con HMR; un segundo
    `next dev` no arranca en el mismo directorio; el DOM ya trae T07 y T08): **no pasa por (3)**.
    (1) Escritorio `/es` y `/en`: con el ratón, cada orbe se inclina (`matrix3d`), tiene sombra y
    borde, y el ícono toma el acento `rgb(37,211,102)`/`rgb(234,67,53)`/`rgb(225,48,108)` y se
    adelanta (`translate3d`); solo cambia el orbe bajo el cursor. Sin parpadeo: con el cursor en
    el borde superior, `:hover` sigue activo a 1 s (el `<a>` no se transforma). (2) Tab
    WhatsApp → correo → Instagram: `:focus-visible`, mismo estado y anillo blanco de 2+2 px
    sobre un `<a>` de 48×48 `rounded-full`. (4) CSSOM servido: las 4 declaraciones `transform` y
    `transition` de `contact-orb` están dentro de `(prefers-reduced-motion: no-preference)`;
    ninguna fuera (la extensión no puede emular reduce). (3) **Defecto**, 375 px (`/en` en un
    iframe de 375 px): sin scroll horizontal, objetivos de 48×48 con 12 px de separación, pero
    **Instagram baja a una segunda línea** (fila 2 + 1). La columna de contacto mide ~132–140 px
    (`grid grid-cols-2 gap-12` en `footer-section.tsx`) y la fila necesita 168 px
    (3×48 + 2×12); el `<li>` tiene `flex flex-wrap`. Contradice «fila horizontal» (spec y plan);
    se reporta a planner, sin corregir.
  - Re-verificación tras T09 (2026-10-15, Chrome, mismo `next dev` :3000 con HMR, commit
    1820001): **pasa**. 375 px (`/es` y `/en`, iframe de 375 px): la columna de contacto es
    `col-span-2 md:col-span-2` y mide 312 px; los tres orbes (48×48) en la misma fila
    (mismo `top`, `left` 24/84/144, 12 px de separación); sin scroll horizontal
    (`scrollWidth` ≤ 375). Escritorio 1920 px `/es`: grid sin cambios en una sola fila
    (marca 636 px, secciones 191 px, contacto 413 px), los tres orbes en fila; captura
    visual igual a la anterior. (1), (2) y (4) no dependen del cambio de clase.

### Correcciones (revisión de T01 y T02)
- [x] T05 Corrección (mejora, reviwer T01): la prueba de `contact-orb` solo revisa lo anterior al
  `@media`, no exige `var(--orb-accent)` y la transición omite borde, fondo y color →
  en `globals-css.test.ts`, que todo el bloque de `@utility contact-orb` fuera de su
  `@media (prefers-reduced-motion: no-preference)` (antes y después) no tenga `transform:` ni
  `transition`, y que la utilidad use `var(--orb-accent)` (falla al menos la transición) → en
  `globals.css` sumar `border-color`, `background-color` y `color` a la transición del bloque
  `no-preference` (mismo tiempo y easing). (depende de T01; paralela a T03)
  Archivos: `src/app/globals.css`, `src/app/globals-css.test.ts`.
  - Evidencia: la prueba aísla el `@media` contando llaves (`bracedBlock`) y exige
    `var(--orb-accent)`. Rojo: `expected '@media (prefers-reduced-motion: no-pr…' to match
    /[\s:,]border-color 500ms cubic-bezier…/`. Verde: orbe con `border-color` y
    `background-color`, y `svg` con `color`, todos a 500ms cubic-bezier(0.22, 1, 0.36, 1);
    globals-css 4/4 y `pnpm validate` en verde.
- [x] T06 Corrección (mejora, reviwer T03): el `it.each` de canales del footer no comprueba el
  acento D2 → añadir a cada caso el `--orb-accent` esperado (`#25D366`, `#EA4335`, `#E1306C`) en
  el orbe; verificar el rojo cambiando un hex a mano y revertir. Sin cambio de producción.
  (depende de T03) Archivos: `src/components/landing/landing-sections.test.tsx`.
  - Rojo: con `#EA4336` en el correo → `Expected: "#EA4335" Received: "#EA4336"` (1 falla, 2 pasan); revertido. Verde: 3/3 casos comprueban `--orb-accent` en `span.contact-orb`; `pnpm validate` en verde.
### Cambio pedido por el usuario (D1 resuelta: solo logo, en horizontal)
- [x] T07 Prueba en `footer-contact-link.test.tsx`: el texto recibido en `children` va dentro de un
  elemento `sr-only` (sigue siendo el nombre accesible exacto) y el enlace no muestra texto visible
  fuera de él (falla) → envolver `children` en `<span className="sr-only">` y quitar `gap-3`
  (sin texto al lado no hace falta). En `footer-section.tsx` el correo pasa como texto plano
  (`company.email`, sin `splitAfterAt`, que ya no se ve) y se quita su import. Los tres canales van
  en fila horizontal en un solo `<li>` con `flex items-center gap-3` (corrección del usuario:
  horizontal, no vertical); prueba roja en `landing-sections.test.tsx` de que los tres enlaces
  comparten `<li>`. Las demás pruebas por nombre accesible siguen en verde sin cambios.
  (depende de T06)
  Archivos: `src/components/landing/footer-contact-link.tsx`,
  `src/components/landing/footer-contact-link.test.tsx`,
  `src/components/landing/footer-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: Rojo: `expected element not to have class "gap-3"` y `.sr-only` nulo
    (`received value must be a Node`) en `footer-contact-link.test.tsx`; `expected 3 to be 1`
    (cada canal en su `<li>`) en «agrupa los canales en una sola fila». Verde: `pnpm validate` OK,
    245 pruebas; las de nombre accesible de `FooterSection` sin cambios.
- [x] T08 Corrección (mejora, reviwer T07): sin texto visible, `hover:text-white transition-colors`
  del enlace ya no hacen nada, y la prueba `not.toHaveClass('gap-3')` comprueba una clase, no
  comportamiento → quitar ambas clases y esa aserción (el rojo real ya lo da la prueba `sr-only`).
  Refactor sin cambio de comportamiento: pruebas en verde antes y después. (depende de T07)
  Archivos: `src/components/landing/footer-contact-link.tsx`,
  `src/components/landing/footer-contact-link.test.tsx`.
  Descartado: `text-sm text-white/40` del `<ul>` sigue aplicando a ubicación y horario.
  - Hecho: quitadas `hover:text-white transition-colors` del `<a>` y la aserción `not.toHaveClass('gap-3')`. Antes y después: 5/5 pruebas del enlace en verde; `pnpm validate` OK, 245 pruebas.
- T04 se repite tras T07 (cancelada a mitad por el cambio de diseño; sin evidencia previa).

- Descartados: pruebas de T02 por nombres de clase (jsdom no puede medir foco ni transform; lo
  cubre T04). Respaldo de ícono/acento: queda solo en los valores por defecto de
  `FooterContactLink` (plan actualizado); `FooterSection` no lo repite. Revisión de T05: exigir el
  mismo tiempo y easing en las 5 propiedades es intencional (el hallazgo de T01 era justo el
  desfase entre ellas); si cambia la duración, cambia en todas.

### Corrección tras T04 (defecto a 375 px)
- [x] T09 Corrección (bloqueante, T04): a 375 px la columna de contacto mide ~140 px (es 1 de las 2
  columnas del grid móvil `grid-cols-2 gap-12`) y la fila de orbes necesita 168 px (3×48 + 2×12):
  Instagram salta a otra línea → en `footer-section.tsx` la columna de contacto ocupa el ancho
  completo en móvil (`col-span-2`, manteniendo `md:col-span-2`); la columna de enlaces de
  secciones queda sola en su fila, aceptable. No se reduce el orbe (48 px, objetivo táctil) ni la
  separación. Prueba en `landing-sections.test.tsx`: la columna de contacto abarca las dos columnas
  del grid móvil (falla), como guarda de regresión; verificar en navegador a 375 px que los tres
  orbes quedan en una sola fila y anotar evidencia en T04 (marcarla [x] si todo pasa).
  (depende de T08)
  Archivos: `src/components/landing/footer-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: Rojo: «la columna de contacto abarca las dos columnas del grid móvil» →
    `expected the element to have class "col-span-2 md:col-span-2"`, recibido `md:col-span-2`.
    Verde: `col-span-2 md:col-span-2` en el div de contacto; `pnpm validate` OK, 246 pruebas.
