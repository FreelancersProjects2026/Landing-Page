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
- [ ] T04 Verificación en navegador (sin commit de código salvo que aparezca un defecto, que se
  reporta a planner): `pnpm dev`, footer de `/es` y `/en` en escritorio (hover y Tab sobre los
  tres canales), a 375 px y con `prefers-reduced-motion: reduce` emulado; anotar evidencia aquí.
  (depende de T01 y T03)
