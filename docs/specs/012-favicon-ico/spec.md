# Spec 012: favicon.ico en la raíz

## Problema
En los resultados de Google la web aparece con el globo gris genérico en lugar del logo.
`https://solutionspjm.com/favicon.ico` responde 404 (verificado el 2026-10-08), y el rastreador de
favicons de Google suele pedir esa ruta. La spec 009 lo dejó pendiente: «se agrega si Google no
muestra el ícono».

## Solución
Publicar `/favicon.ico` generado desde el logo actual (`LOGOsolutionsPJM.jpeg`).

## Alcance
1. `public/favicon.ico` con tamaños 16, 32 y 48 px (48 = múltiplo de 48 que pide Google).

## Fuera de alcance
- Cambiar los `<link>` de íconos actuales (`src/app/icons.ts`, spec 009).
- Cambiar la redirección temporal `/` → `/es` (regla de la spec 004).
- Forzar a Google: la caché del favicon se actualiza sola en días o semanas; solo se puede pedir
  reindexación en Search Console.

## Criterios de aceptación
- [ ] `/favicon.ico` responde 200 con un ICO válido que incluye 48×48.
- [ ] `pnpm validate` en verde.
