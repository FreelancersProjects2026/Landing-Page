# Tareas: Preguntas frecuentes

## Base acordada
- Spec: `docs/specs/008-faq/spec.md`. Textos: `contenido.md`.
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.

## Tareas
- [x] T01 Negocio aprueba respuestas en `contenido.md` (2026-10-07).
- [x] T02 Dominio: `LandingContent.faq` (`title`, `items: { question, answer }[]`, mínimo 1) y
      `menu.faq`, con pruebas.
- [x] T03 Infraestructura: textos `es` y `en` copiados de `contenido.md`.
- [x] T04 Vista `components/landing/faq-section.tsx` (`<details>` nativo: respuestas en el HTML del servidor, sin JS), id en `section-ids.ts`,
      montada entre Equipo y Contacto; prueba en `landing-sections.test.tsx`.
- [x] T05 `FAQPage` en `structured-data.ts` con su prueba.
- [ ] T06 Verificación: `pnpm validate`, `/es` y `/en` en dev, Rich Results Test de Google.
