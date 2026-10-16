# Plan técnico: LCP móvil

## Referencias
- Especificación: `docs/specs/019-lcp-movil/spec.md`.
- Spec 015 (imágenes WebP y hero con `srcset`): `docs/specs/015-imagenes-webp/`.
- Informe PSI móvil de `https://solutionspjm.com/es` (Rendimiento 71, LCP 5,8 s).

## Enfoque
Cambio solo de carga en `src/components/landing/` y `src/app/fonts.ts`; no toca `company-profile`
ni contenido. Se usan atributos nativos del navegador (`loading`, `decoding`) y la opción
`preload` de `next/font`, sin dependencias nuevas.

React 19 precarga en SSR todo `<img>` sin `loading="lazy"`; marcar las cuatro imágenes bajo el
pliegue como diferidas elimina sus precargas de raíz. El logo sí está arriba del pliegue: se
mantiene precargado, pero con un archivo más liviano que ya existe en `public/`.

Alternativas descartadas: migrar a `next/image` (más cambio para el mismo efecto); quitar la
precarga del logo (está arriba del pliegue y causaría parpadeo); recomprimir imágenes (no es la
causa; queda para otra spec si PSI lo sigue pidiendo).

## Diseño
No hay modelo de dominio nuevo: es presentación pura.

- **Imágenes bajo el pliegue**: cada `<img>` de cómo trabajamos, proyectos, footer y servicios
  recibe `loading="lazy"` y `decoding="async"`. Nada más cambia (clases, `alt`, tamaños).
- **Hero**: intacta; eager con `fetchPriority="high"`. Se fija en prueba para que nadie la difiera.
- **Logo de navegación**: se genera una vez `public/logo/icono/LOGOsolutionsPJM-192.webp`
  (192×192) desde `LOGOsolutionsPJM.jpeg` con sharp, que ya está instalado como dependencia de
  Next (`node_modules/.pnpm/sharp@0.34.5`); el script es de un solo uso, vive fuera del repo y no
  se añade ninguna dependencia. El `src` del `<Image>` pasa a ese WebP. Mismos `width`/`height`
  (40), `alt=""` y `preload`. Se descarta el PNG de 192 px existente: la spec 015
  (`landing-images.test.ts`) prohíbe `.png` en componentes de la landing.
- **Fuentes**: `JetBrains_Mono` recibe `preload: false`. Instrument Sans y Serif no cambian. El
  texto mono usa el respaldo `monospace` de `--font-mono` hasta que llega la fuente.

## Estructura objetivo
| Ruta | Capa | Responsabilidad |
|------|------|-----------------|
| `src/components/landing/how-it-works-section.tsx` | UI (landing) | `<img>` diferido. |
| `src/components/landing/projects-section.tsx` | UI (landing) | `<img>` diferido. |
| `src/components/landing/footer-section.tsx` | UI (landing) | `<img>` diferido. |
| `src/components/landing/service-cards.tsx` | UI (landing) | `<img>` diferido. |
| `public/logo/icono/LOGOsolutionsPJM-192.webp` | Recurso estático | Logo 192×192 en WebP (nuevo). |
| `src/components/landing/navigation.tsx` | UI (landing) | Logo WebP 192 px. |
| `src/components/landing/landing-sections.test.tsx` | Prueba | Lazy en las cuatro, hero eager, ruta del logo. |
| `src/app/fonts.ts` | App | JetBrains Mono sin precarga. |
| `src/app/fonts.test.ts` | Prueba | Opciones con que se llama a cada fuente. |

## Pruebas
- `landing-sections.test.tsx` (RTL): renderiza cada sección y comprueba que su imagen tiene
  `loading="lazy"` y `decoding="async"`; la imagen de la hero no tiene `loading="lazy"` y tiene
  `fetchpriority="high"`. El logo de la navegación contiene `/logo/icono/LOGOsolutionsPJM-192.webp`; `landing-images.test.ts` (spec 015) sigue
  en verde.
- `fonts.test.ts`: el mock de `next/font/google` registra las opciones de cada llamada;
  `JetBrains_Mono` recibe `preload: false` y las Instrument no lo reciben.
- Manual: `pnpm build && pnpm start` y revisar los `<link rel=preload>` del `<head>` de `/es`.
