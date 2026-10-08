# Tareas: Cambio de logo

## Base acordada
- Spec: `docs/specs/009-cambio-logo/spec.md`.
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.

## Tareas
- [x] T01 Favicon: generar `public/logo/icono/LOGOsolutionsPJM-192.png` (192×192 PNG) desde
      `LOGOsolutionsPJM.jpeg` (sin agregar dependencias; `pnpm dlx sharp-cli` como en 008-T09).
- [x] T02 Íconos del sitio: primero actualizar las pruebas `src/app/[lang]/layout.test.tsx` y
      `src/app/global-not-found.test.tsx` a las rutas nuevas (fallan), luego `src/app/icons.ts`.
- [x] T03 WhatsApp: prueba en `whatsapp-button.test.tsx` que el avatar usa
      `/logo/icono/LOGOsolutionsPJM.jpeg`; luego cambiar `whatsapp-button.tsx`.
- [x] T04 Navbar: prueba en `landing-sections.test.tsx` (imagen decorativa del logo dentro del
      enlace de inicio); luego `next/image` en `navigation.tsx` junto a `{brand}`, tamaño acorde a
      `isScrolled` (sin lógica de negocio nueva).
- [x] T05 Limpieza: borrar `LogoPJM.jpeg` y `LogoPJM-192.png`; `grep LogoPJM src` sin resultados.
- [ ] T06 Verificación: `pnpm validate`; revisar `/es` en `pnpm dev` (pestaña, navbar con y sin
      scroll, avatar de WhatsApp).
      - 2026-10-08: `pnpm validate` en verde (177 pruebas). En `pnpm start`, `/es` enlaza el icon
        192 y el apple JPEG nuevos, la navbar sirve el logo (`alt=""`) y `LogoPJM.jpeg` da 404.
        Pendiente: revisión visual en navegador (pestaña, scroll, avatar de WhatsApp).
