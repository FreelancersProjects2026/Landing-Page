# Spec 013: cerrar el menú móvil

## Problema
En el teléfono, al abrir el menú de hamburguesa no se ve ninguna «X» y el usuario no puede salir del
menú sin elegir una sección. Esto genera insatisfacción del cliente.

Causa: en `navigation.tsx` el overlay móvil es `fixed z-40` y el `<nav>` que contiene el botón no
está posicionado; dentro del contexto de apilamiento del `<header>`, el overlay se pinta encima del
`<nav>` y tapa el botón (que ya cambia a ícono `X`).

## Solución
Con el menú abierto, el botón X queda visible y usable por encima del overlay, y la tecla Escape
también cierra el menú.

## Alcance
1. El `<nav>` (con el botón) se pinta por encima del overlay móvil.
2. Tocar la X cierra el menú.
3. Escape cierra el menú abierto.

## Fuera de alcance
- Etiqueta accesible distinta al abrir («Cerrar menú»): requiere textos nuevos en `es`/`en`;
  se pide aclaración si el cliente la quiere.
- Bloquear el scroll del fondo y atrapar el foco dentro del menú.
- Rediseño visual del menú.

## Criterios de aceptación
- [ ] En móvil (<768 px), con el menú abierto, la X se ve arriba a la derecha y al tocarla se cierra.
- [ ] Escape cierra el menú.
- [ ] Desktop sin cambios.
- [ ] `pnpm validate` en verde.
