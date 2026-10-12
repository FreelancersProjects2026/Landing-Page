# Tareas: header con menos ruido

## Base acordada
- Spec: `docs/specs/014-header-menos-ruido/spec.md`. Plan: `plan.md`.
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Decisiones confirmadas por el usuario (ver `spec.md`): primarios = Servicios, Cómo trabajamos,
  Proyectos; en escritorio solo el otro idioma; Preguntas en el footer. Sin bloqueos.
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
- [ ] T04 Verificación: `pnpm validate` y revisión visual en 1280, 768 y 375 px. (depende de T03, T05)
