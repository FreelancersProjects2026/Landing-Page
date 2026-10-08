# Tareas: Proyecto Orgánico CR

## Base acordada
- Spec: `docs/specs/010-proyecto-organico-cr/spec.md`. Plan: `plan.md`.
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.

## Tareas
- [x] T01 Dominio: `Project.link?: ExternalLink` y validación `https:` en `validateLandingContent`.
      Primero la prueba que falla en `landingContent.test.ts`.
- [ ] T02 Infraestructura: Orgánico CR en `es` y `en`, con los textos de la spec y `link`
      compartido. Primero la prueba en `landingContentSource.test.ts`, que pasa a 4 proyectos.
- [ ] T03 Vista: enlace externo opcional en `projects-section.tsx` (`externalLinkProps` y
      `ArrowUpRight`). Primero la prueba en `landing-sections.test.tsx`.
- [ ] T04 Verificación: `pnpm validate`; revisar `/es` y `/en` en `pnpm dev` (tarjeta y enlace).
