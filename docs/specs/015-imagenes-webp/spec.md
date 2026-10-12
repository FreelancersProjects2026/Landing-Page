# Spec 015: imágenes de la landing en WebP

## Problema
Cuatro imágenes decorativas de la landing se sirven como PNG sin optimizar (`next.config.mjs` usa
`images: { unoptimized: true }` y las secciones usan `<img>`): unos 7,2 MB en total. La página
carga lenta, sobre todo en móvil. Además, esos `<img>` no declaran `width`/`height`.

| Imagen actual | Peso | Dimensiones | Usada en |
|---------------|------|-------------|----------|
| `/ComoTrabajamos/ComoTrabajamos.png` | 1,98 MB | 1212×1298 | `how-it-works-section.tsx` |
| `/Proyectos/Proyectos.png` | 1,96 MB | 1669×942 | `projects-section.tsx` |
| `/Servicios/Servicios.png` | 1,65 MB | 1669×942 | `service-cards.tsx` |
| `/footer/Footer.png` | 1,58 MB | 2172×724 | `footer-section.tsx` |

## Objetivo
Servir esas 4 imágenes en WebP, con el mismo aspecto, mucho menos peso y dimensiones declaradas.

## Lenguaje ubicuo
- **Imagen de sección:** imagen decorativa (`alt=""`, `aria-hidden`) de una sección de la landing.

## Alcance
1. Generar 4 WebP desde los PNG: calidad 80, ancho máximo 1600 px, sin agrandar y sin deformar la
   proporción. Nombres en minúsculas y ASCII, en la misma carpeta:
   `/ComoTrabajamos/como-trabajamos.webp`, `/Proyectos/proyectos.webp`,
   `/Servicios/servicios.webp`, `/footer/footer.webp`.
2. Cambiar las 4 rutas en las secciones.
3. Agregar `width`/`height` (dimensiones del WebP) a esos 4 `<img>`.
4. Borrar los 4 PNG (quedan en el historial de git).

## Fuera de alcance
- AVIF, quitar `unoptimized` o migrar a `next/image`.
- El logo y el favicon (`/logo/icono/LOGOsolutionsPJM-192.png`, metadata en `src/app/icons.ts`).
- Imágenes que ya son WebP (`/hero/`, `/404/`, `/privacidad/`).

## Criterios de aceptación
- [ ] Existen los 4 WebP; cada uno pesa ≤ 250 KB y mide ≤ 1600 px de ancho.
- [ ] Ningún componente de `src/components/landing/` referencia `.png`.
- [ ] Los 4 `<img>` tienen `width` y `height` iguales a las dimensiones de su WebP.
- [ ] Los 4 PNG ya no están en `public/`.
- [ ] Revisión visual en 1280 y 375 px: las secciones se ven igual que antes.
- [ ] `pnpm validate` en verde.

## Dudas
Ninguna (alcance acordado con el usuario).
