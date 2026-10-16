# Spec 019: LCP móvil

## Problema
PageSpeed Insights móvil de `https://solutionspjm.com/es` da Rendimiento 71: FCP 2,3 s,
**LCP 5,8 s**, TBT 0 ms, CLS 0. Solo el LCP hunde la nota.

El `<head>` del HTML en vivo precarga (~660 KB) imágenes que están bajo el pliegue y que compiten
por ancho de banda con la imagen hero (58 KB, el elemento LCP) en el slow 4G simulado:

| Recurso | Peso | Origen |
|---------|------|--------|
| `/ComoTrabajamos/como-trabajamos.webp` | 190 KB | `how-it-works-section.tsx`, `<img>` sin `loading` |
| `/Proyectos/proyectos.webp` | 198 KB | `projects-section.tsx` |
| `/footer/footer.webp` | 106 KB | `footer-section.tsx` |
| `/Servicios/servicios.webp` | 99 KB | `service-cards.tsx` |
| `/logo/icono/LOGOsolutionsPJM.jpeg` | 68 KB | `navigation.tsx`, `<Image preload>` mostrado a 40 px |

Causa: React 19 en SSR emite `<link rel=preload>` para todo `<img>` eager. La hero ya está bien
(`fetchPriority="high"`, `srcset` hasta 960w) y debe seguir eager.

## Objetivo
Que en la primera carga móvil la red se dedique a la hero y a las fuentes, para bajar el LCP por
debajo de 2,5 s sin cambiar nada visible.

## Lenguaje ubicuo
- **Pliegue**: borde inferior de la primera pantalla; lo que está debajo no se ve al cargar.
- **Hero**: imagen principal de la primera sección; es el elemento LCP.
- **Precarga**: `<link rel=preload>` en el `<head>`; el navegador la descarga con prioridad alta.

## Alcance
1. Las cuatro imágenes bajo el pliegue (cómo trabajamos, proyectos, footer, servicios) se cargan
   en diferido (`loading="lazy"`, `decoding="async"`), así React deja de precargarlas.
2. El logo de la navegación usa el PNG de 192 px ya existente
   (`/logo/icono/LOGOsolutionsPJM-192.png`, 20 KB) en lugar del JPEG de 68 KB; sigue precargado
   porque está arriba del pliegue.
3. La fuente JetBrains Mono deja de precargarse (`preload: false`): arriba del pliegue solo la usa
   el eyebrow pequeño del h1 y tiene respaldo monoespaciado.

## Fuera de alcance
- Cambios de contenido visible, de dominio (`company-profile`) o de textos.
- Recomprimir o redimensionar imágenes, cambiar la hero o migrar `<img>` a `next/image`.
- Dependencias nuevas.
- El logo del botón de WhatsApp (su popover no se renderiza en SSR, no genera precarga).

## Criterios de aceptación
- [ ] Las imágenes de cómo trabajamos, proyectos, footer y servicios tienen `loading="lazy"` y
  `decoding="async"`.
- [ ] La hero no tiene `loading="lazy"` y conserva `fetchPriority="high"`.
- [ ] El logo de la navegación apunta a `/logo/icono/LOGOsolutionsPJM-192.png`, sigue sin
  `loading="lazy"` y con `alt=""`.
- [ ] `JetBrains_Mono` se configura con `preload: false`; Instrument Sans y Serif siguen
  precargadas.
- [ ] `pnpm validate` en verde.
- [ ] Con `pnpm build && pnpm start`, el `<head>` de `/es` solo precarga la hero, el logo de 192 px
  y las fuentes Instrument (ninguna de las cuatro imágenes bajo el pliegue ni el JPEG del logo).
- [ ] Tras el deploy, PSI móvil de `/es` reporta LCP < 2,5 s (verificación manual del usuario).

## Dudas
Ninguna: plan aprobado por el usuario.
