# Plan técnico: Cambio de logo

## Referencias
- Especificación: `docs/specs/009-cambio-logo/spec.md`.
- Antecedente: `docs/specs/005-contacto/plan.md` (íconos del sitio y favicon de 192 px).
- Next 16: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`.

## Enfoque
El logo es un asset estático en `public/logo/icono/`. Hay tres puntos de uso y ninguno toca el
dominio:
- **Íconos del sitio:** `src/app/icons.ts` es la única fuente de las rutas. La usan
  `[lang]/layout.tsx` y `global-not-found.tsx`, y Next genera los `<link>`.
- **Avatar de WhatsApp:** ruta literal en `whatsapp-button.tsx`.
- **Navbar:** `next/image` decorativo junto a `{brand}` en `navigation.tsx`.

Con nombres de archivo nuevos (`LOGOsolutionsPJM*`), navegadores y Google piden el ícono otra vez
en lugar de usar el de la caché. Los archivos viejos se borran.

Sin dependencias nuevas: `next/image` ya se usaba en el botón de WhatsApp, y el PNG se genera una
sola vez con `pnpm dlx sharp-cli`, como en 008-T09.

## Diseño
- **Favicon:** PNG RGB de 192×192 (múltiplo de 48, como pide Google), generado desde el JPEG de
  1254×1254.
- **Apple touch icon:** el JPEG original, que el sistema operativo recorta y escala.
- **Navbar:** imagen con `width`/`height` de 40 px (sin CLS) y bordes `rounded-lg`. Mide `size-10`
  arriba de la página y `size-8` con scroll, con la misma transición de 500 ms que el texto.
  Lleva `alt=""` porque el nombre accesible del enlace ya es `{brand}`.
- **Contraste:** el logo trae su propio fondo oscuro. Se verifica a ojo sobre el hero oscuro y
  sobre la barra clara con scroll (T06).

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `public/logo/icono/LOGOsolutionsPJM.jpeg` | Nuevo | Logo fuente; también es el apple touch icon. |
| `public/logo/icono/LOGOsolutionsPJM-192.png` | Nuevo | Favicon de 192 px. |
| `public/logo/icono/LogoPJM.jpeg`, `LogoPJM-192.png` | Borrar | Logo anterior. |
| `app/icons.ts` | Actualizar | `icon` y `apple` con las rutas nuevas. |
| `components/landing/whatsapp-button.tsx` | Actualizar | Avatar con el nuevo logo. |
| `components/landing/navigation.tsx` | Ampliar | `Image` decorativo dentro del enlace de inicio. |

## Pruebas
- `[lang]/layout.test.tsx` y `global-not-found.test.tsx`: `metadata.icons` con las rutas nuevas.
- `whatsapp-button.test.tsx`: el `src` del avatar, decodificado, contiene
  `/logo/icono/LOGOsolutionsPJM.jpeg`. En vitest, `next/image` lo reescribe a
  `/_next/image?url=…`.
- `landing-sections.test.tsx`: el enlace de inicio contiene una imagen con `alt=""` del nuevo logo,
  y su nombre accesible sigue siendo la marca.
- Limpieza: `grep LogoPJM src` no devuelve resultados.

## Riesgos y seguimiento
- La caché de Google tarda días o semanas en mostrar el ícono nuevo; no se puede forzar.
- Revisión de 2026-10-08: el logo de la navbar se carga en diferido aunque está siempre arriba
  del pliegue. Se puede agregar `preload`, que en Next 16 reemplaza a `priority` (mejora menor,
  aplicado en T07).
- Fuera de alcance: `icon.svg`, `icon-*-32x32.png` y `apple-icon.png` en `public/` no se usan.
  Es una duda que sigue pendiente en 005.
