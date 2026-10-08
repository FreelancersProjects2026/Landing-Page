# Tareas: favicon.ico en la raíz

## Base acordada
- Spec: `docs/specs/012-favicon-ico/spec.md`. Plan: `plan.md`.
- Método: TDD y `pnpm validate` en verde.

## Tareas
- [x] T01 Prueba `src/app/favicon.test.ts`: `public/favicon.ico` es ICO con 16, 32 y 48 px (falla).
- [x] T02 Generar `public/favicon.ico` desde `LOGOsolutionsPJM.jpeg` con `pnpm dlx sharp-cli` + script de Node (3 KB).
- [x] T03 Verificación: `pnpm validate`; tras el deploy, `/favicon.ico` responde 200.
      - 2026-10-08: `pnpm validate` en verde. En `next start`, `/favicon.ico` responde 200
        (`image/x-icon`, 3217 bytes, idéntico a `public/favicon.ico`). Producción (merge `ee85d18`):
        `https://solutionspjm.com/favicon.ico` responde 200 (3217 bytes, idéntico) y `/es` publica
        `alternateName`.
