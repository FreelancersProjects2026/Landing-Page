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
- [ ] T03 Prueba: el footer enlaza «Preguntas» a `#preguntas-frecuentes` (falla) → agregar
  `menu.faq` a `links`. (depende de T01 por el archivo de pruebas; código independiente)
  Archivos: `footer-section.tsx`, `landing-sections.test.tsx`.
- [ ] T04 Verificación: `pnpm validate` y revisión visual en 1280, 768 y 375 px. (depende de T02, T03)
