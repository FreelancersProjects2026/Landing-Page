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
- [ ] T06 Verificación: `pnpm validate`, `/es` y `/en` en dev, Rich Results Test de Google:
      marcado válido sin errores (Google no muestra rich results de FAQ fuera de sitios
      gubernamentales y de salud desde agosto de 2023).
      - Hecho (2026-10-07): `pnpm validate` en verde (167 pruebas). HTML prerenderizado de `/es` y
        `/en`: 7 `<details>` con respuestas en el HTML, 1 `FAQPage`, 2 anclas `#preguntas-frecuentes`.
      - Pendiente: revisión visual en `pnpm dev` y Rich Results Test tras el deploy.
- [x] T07 Correcciones de revisión: preguntas frecuentes únicas en el dominio, ícono con
      `motion-safe:`, `FaqItem` en orden alfabético y comparación con `contenido.md` acotada a la FAQ.
- [x] T08 Expectativa de rich results ajustada en `spec.md` y en el criterio de T06.
