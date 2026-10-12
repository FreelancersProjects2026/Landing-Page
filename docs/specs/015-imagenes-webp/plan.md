# Plan técnico: imágenes de la landing en WebP

## Referencias
- Especificación: `docs/specs/015-imagenes-webp/spec.md`.
- Precedentes: `docs/specs/006-pagina-404/` y `docs/specs/007-privacidad/` (PNG → WebP ≤ 250 KB;
  prueba de peso con `statSync` en `src/app/[lang]/privacy-route.test.tsx`).
- Componentes: `src/components/landing/{how-it-works-section,projects-section,service-cards,footer-section}.tsx`.
- Pruebas que hoy esperan PNG: `src/components/landing/section-reveal.test.tsx:76` y `:92`.

## Enfoque
Solo assets y atributos de `<img>`; no hay dominio ni módulo involucrado (imágenes decorativas de
UI). Sin dependencias nuevas.

**Herramienta:** `sharp` 0.34.5, que ya está instalado como dependencia transitiva de `next`
(binario `@img/sharp-win32-x64`). Se resuelve desde `next`, sin agregarlo a `package.json` ni
descargar nada. `cwebp` y `magick` no están instalados. Se descarta `pnpm dlx sharp-cli`
(precedente de 006/007): descarga un paquete y no aporta nada sobre el `sharp` ya presente.

Comando exacto, desde la raíz del repo:

```sh
node -e "
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next')] }))
const jobs = [
  ['ComoTrabajamos/ComoTrabajamos.png', 'ComoTrabajamos/como-trabajamos.webp'],
  ['Proyectos/Proyectos.png', 'Proyectos/proyectos.webp'],
  ['Servicios/Servicios.png', 'Servicios/servicios.webp'],
  ['footer/Footer.png', 'footer/footer.webp'],
]
for (const [src, out] of jobs)
  sharp('public/' + src)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile('public/' + out)
    .then((i) => console.log(out, i.width + 'x' + i.height, Math.round(i.size / 1024) + ' KB'))
"
```

Prueba en seco (planner, en el scratchpad) con ese mismo comando:

| WebP | Dimensiones | Peso |
|------|-------------|------|
| `como-trabajamos.webp` | 1212×1298 (sin cambio, < 1600) | 186 KB |
| `proyectos.webp` | 1600×903 | 193 KB |
| `servicios.webp` | 1600×903 | 96 KB |
| `footer.webp` | 1600×533 | 104 KB |

Total ≈ 580 KB frente a ≈ 7,2 MB. Si al generarlos las cifras difieren, coder usa las reales en
`width`/`height` y lo anota en la evidencia.

## Diseño
- Rutas: `src="/…/xxx.png"` → `src="/…/xxx.webp"` en los 4 componentes.
- `width`/`height` con las dimensiones del WebP. Las clases (`w-full h-full`, `object-cover`,
  `object-contain`) siguen controlando el tamaño en pantalla: los atributos solo dan la proporción
  al navegador antes de descargar la imagen, sin cambio visual.
- Se borran los PNG con `git rm` después de cambiar las rutas, para no romper el build en medio.
- Fuera del alcance verificado: no hay OG, `manifest` ni prerender que usen estos PNG (grep en
  `src/` y `public/`: el único otro `.png` es el logo/favicon, fuera de alcance).

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `public/ComoTrabajamos/como-trabajamos.webp` | Nuevo | Imagen de «Cómo trabajamos». |
| `public/Proyectos/proyectos.webp` | Nuevo | Imagen de «Proyectos». |
| `public/Servicios/servicios.webp` | Nuevo | Imagen de la tarjeta destacada de servicios. |
| `public/footer/footer.webp` | Nuevo | Banner del footer. |
| `public/{ComoTrabajamos,Proyectos,Servicios,footer}/*.png` | Borrado | — |
| `src/components/landing/landing-images.test.ts` | Nuevo | WebP existen, ≤ 250 KB y son WebP; sin `.png` en la landing; PNG borrados. |
| `src/components/landing/how-it-works-section.tsx` | Modificado | Ruta WebP + `width`/`height`. |
| `src/components/landing/projects-section.tsx` | Modificado | Ruta WebP + `width`/`height`. |
| `src/components/landing/service-cards.tsx` | Modificado | Ruta WebP + `width`/`height`. |
| `src/components/landing/footer-section.tsx` | Modificado | Ruta WebP + `width`/`height`. |
| `src/components/landing/section-reveal.test.tsx` | Modificado | Espera las rutas WebP; `width`/`height`. |
| `src/components/landing/services-section.test.tsx` | Modificado | `width`/`height` de la imagen destacada. |
| `src/components/landing/landing-sections.test.tsx` | Modificado | `width`/`height` del banner del footer. |

## Pruebas
- `landing-images.test.ts` (sistema de archivos, como `privacy-route.test.tsx`; Vitest corre desde
  la raíz):
  - Cada WebP existe, pesa ≤ 250 KB y empieza con `RIFF`…`WEBP` (bytes 0–3 y 8–11).
  - Ningún `.tsx` de `src/components/landing/` que no sea prueba contiene `.png`.
  - Los 4 PNG no existen.
- Render (pruebas existentes de cada sección): el `<img>` tiene `src` WebP y `width`/`height`
  esperados.
- Manual: 1280 y 375 px, cada sección comparada con la versión anterior.

## Riesgos
- La calidad 80 podría verse peor en degradados oscuros; se revisa en T05. Si se nota, subir a 85
  respetando ≤ 250 KB.
