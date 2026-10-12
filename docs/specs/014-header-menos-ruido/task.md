# Tareas: header con menos ruido

## Base acordada
- Spec: `docs/specs/014-header-menos-ruido/spec.md`. Plan: `plan.md`.
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Decisiones confirmadas por el usuario (ver `spec.md`): primarios = Servicios, Cómo trabajamos,
  Proyectos, Contacto (Contacto agregado en T06); en escritorio solo el otro idioma; Preguntas en el footer. Sin bloqueos.
- Todas las tareas tocan `src/components/landing/landing-sections.test.tsx`: van en serie.

## Tareas
- [x] T01 Prueba: dentro del `<nav>` no están Equipo, Preguntas ni Contacto y sí Servicios, Cómo
  trabajamos y Proyectos (falla) → `primary` en `navLinks` y filtro en el bloque de escritorio;
  `gap-12` → `gap-8`.
  Archivos: `navigation.tsx`, `landing-sections.test.tsx`.
  - Evidencia: rojo, «en escritorio el nav solo muestra los enlaces primarios» falló en
    `expect(element).not.toBeInTheDocument()` (Equipo estaba en el `<nav>`). Verde: 196/196
    pruebas y `pnpm validate` exit 0.
- [x] T02 Prueba: con `locale="es"` el `<nav>` tiene «EN» y no «ES»; con `locale="en"`, al revés
  (falla) → `languageLinks` recibe los idiomas; escritorio pasa solo el otro. (depende de T01)
  Archivos: `navigation.tsx`, `landing-sections.test.tsx`.
  - Evidencia: rojo, «con locale=es/en el nav solo enlaza al otro idioma» fallaron en
    `expect(element).not.toBeInTheDocument()` (el idioma actual seguía en el `<nav>`). Verde:
    198/198 pruebas y `pnpm validate` exit 0.
- [x] T03 Prueba: el footer enlaza «Preguntas» a `#preguntas-frecuentes` (falla) → agregar
  `menu.faq` a `links`. (depende de T01 por el archivo de pruebas; código independiente)
  Archivos: `footer-section.tsx`, `landing-sections.test.tsx`.
  - Evidencia: rojo, «enlaza Preguntas a la sección de preguntas frecuentes» falló en
    `getByRole('link', { name: 'Preguntas' })` (el footer no tenía ese enlace). Verde: 199/199
    pruebas y `pnpm validate` exit 0.
- [x] T05 Corrección (mejora, hallazgo de reviwer en T01): `navigation.tsx` tiene 224 líneas
  (límite del equipo: < 150; ya tenía 222 antes de esta spec) → refactor sin cambio de
  comportamiento. Extraer:
  - `mobile-menu.tsx`: el overlay móvil y el `useEffect` de Escape; props `open`, `onClose`,
    `links`, `languageLinks` (o los datos para pintarlos), `cta`, `whatsappUrl`.
  - `language-links.tsx`: los enlaces de idioma que hoy arma `languageLinks`, compartidos por
    escritorio (solo el otro idioma) y móvil (ambos).
  Sin pruebas nuevas ni cambios en `landing-sections.test.tsx`: las existentes (nav, idioma,
  menú móvil, Escape, `relative z-50`) deben seguir en verde sin tocarlas. Cada archivo tocado o
  creado < 150 líneas. Va **antes de T04**. (depende de T02 por `navigation.tsx`; no comparte
  archivos con T03)
  Archivos: `navigation.tsx`, `mobile-menu.tsx` (nuevo), `language-links.tsx` (nuevo).
  - Evidencia: refactor sin prueba nueva; antes y después `landing-sections.test.tsx` 26/26 en
    verde sin tocarlo. Líneas: `navigation.tsx` 148, `mobile-menu.tsx` 106 (overlay, Escape y el
    botón `MobileMenuToggle`, movido para bajar de 150), `language-links.tsx` 21. `pnpm validate`
    exit 0 (199/199 pruebas).
- [x] T06 Prueba (pedido nuevo del usuario: Contacto pasa a ser primario): la prueba de primarios
  espera «Contacto» → `#contacto` dentro del `<nav>` y sigue sin Equipo ni Preguntas (falla) →
  `primary: true` en el enlace de `menu.contact` de `navLinks`. No suma líneas (148).
  Archivos: `navigation.tsx`, `landing-sections.test.tsx`.
  - Evidencia: rojo, «en escritorio el nav solo muestra los enlaces primarios» falló en
    `within(nav).getByRole('link', { name: 'Contacto' })` (Contacto no estaba en el `<nav>`).
    Verde: 199/199 pruebas y `pnpm validate` exit 0. `navigation.tsx` sigue en 148 líneas.
- [ ] T07 Corrección (bloqueante, resultado de T04): con 4 enlaces el header de escritorio no cabe
  entre 768 y ~950 px y se solapa → subir el breakpoint de escritorio de `md` a `lg`.
  Prueba (falla): los 2 bloques de escritorio del `<nav>` (enlaces primarios; idioma + CTA) tienen
  `lg:flex` y no `md:flex`; el botón «Menú» y el overlay móvil tienen `lg:hidden` y no
  `md:hidden` → cambiar las 4 clases. Sin cambios de textos ni de enlaces.
  Archivos: `navigation.tsx`, `mobile-menu.tsx`, `landing-sections.test.tsx`.
- [ ] T04 Verificación: `pnpm validate` y revisión visual en 1280, 1024, 768 y 375 px. En 1024 y
  1280 (es y en, arriba y con scroll), logo, 4 enlaces, idioma y CTA en una línea sin solaparse;
  en 768 y 375, hamburguesa con el menú completo. Si algo se solapa, reportar a planner.
  (depende de T03, T05, T06, T07)
  - Intento 1 (falló, revisión del usuario en 1280/768/375 px): «el logo solutionsPJM se monta
    sobre "Servicios" y "Contacto" se monta sobre "EN"». Causa: con 4 enlaces el contenido mide
    ~850–880 px y el header de escritorio aparece desde 768 px. Se crea T07.
