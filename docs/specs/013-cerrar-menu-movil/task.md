# Tareas: cerrar el menú móvil

## Base acordada
- Spec: `docs/specs/013-cerrar-menu-movil/spec.md`. Plan: `plan.md`.
- Método: TDD, un commit por tarea, `pnpm validate` en verde.

## Tareas
- [x] T01 Prueba: el `<nav>` tiene `relative z-50` (falla) → agregar las clases en `navigation.tsx`.
- [x] T02 Prueba: el botón abre y cierra (`aria-expanded`) el menú.
- [ ] T03 Prueba: Escape cierra el menú abierto (falla) → `useEffect` con listener `keydown`.
- [ ] T04 Verificación: `pnpm validate` y prueba manual en viewport de 375 px.
