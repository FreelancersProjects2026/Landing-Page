# Plan técnico: Retraso de render del LCP en el hero

## Referencias
- Especificación: `docs/specs/020-lcp-render-hero/spec.md`.
- Spec anterior: `docs/specs/019-lcp-movil/` (precargas; resultado PSI en producción).
- Código: `src/components/landing/hero-section.tsx`, `src/components/landing/rotating-slogan.tsx`,
  `@utility animate-hero-letter` y `@keyframes hero-letter-in` en `src/app/globals.css`.
- tw-animate-css: `@keyframes enter` parte de `opacity: var(--tw-enter-opacity, 1)`; solo
  `fade-in` pone `--tw-enter-opacity: 0`. Sin `fade-in`, `animate-in` anima solo `transform`.

## Enfoque
Primero medir, después tocar. T01 midió: el elemento LCP es el texto de marca del menú, no el
hero. Eso ocurre porque los candidatos grandes del hero quedan fuera del LCP: el texto arranca en
`opacity: 0` por `fade-in` (causa a, confirmada en código), y la imagen hero, que cubre todo el
viewport, probablemente se descarta como fondo (causa b, hipótesis que T04 verifica).

El arreglo sigue siendo borrar `fade-in` de la constante de entrada del hero, pero ahora con otra
justificación: el texto queda opaco desde el primer pintado, conserva el deslizamiento, y el
eslogan y el subtítulo, mucho más grandes que el logo, pasan a ser el LCP con un tiempo cercano al
FCP. Cambio mínimo, sin CSS nuevo. No se toca la imagen hero: aunque la hipótesis (b) se
confirme, el texto basta como LCP temprano.

La primera palabra rotativa sin `animate-hero-letter` (T03) pasa a condicional: solo se hace si
la medición posterior a T02 muestra que el LCP es el eslogan y que llega tarde por esa animación.
Hacerlo antes sería cambiar el efecto aprobado sin evidencia.

T04 vuelve a medir con el mismo método que T01 y, además, lista todas las entradas
`largest-contentful-paint` del navegador (un `PerformanceObserver` con `buffered: true` en la
consola de DevTools) para ver qué candidatos se reportan y confirmar o descartar la hipótesis (b).

Alternativas (no son tareas; solo si la medición descarta el texto o el LCP sigue ≥ 2,5 s):
- `experimental.inlineCss: true` en `next.config.mjs`: elimina los 2 CSS que bloquean el render.
- Variante `hero-720.webp` en el `srcset` para móvil, si el LCP es la imagen y pesa su carga.
- Fuentes Instrument: revisar `display`/precarga si el retraso viene del intercambio de fuente.

Descartadas: animar el texto con JS tras la hidratación (llega aún más tarde); quitar toda
animación del hero (cambia el diseño aprobado sin necesidad).

## Diseño
No hay modelo de dominio nuevo: es presentación pura en `src/components/landing/`; no toca
`company-profile`.

- **Entrada del hero** (`hero-section.tsx`): la constante compartida de entrada queda solo con
  `motion-safe:animate-in fill-mode-both`. Eyebrow, eslogan y subtítulo mantienen su duración,
  retraso y `slide-in-from-bottom-*`. El comentario se actualiza: el texto es visible desde el
  primer pintado y solo se desplaza.
- **Palabra rotativa** (`rotating-slogan.tsx`, condicional: solo si la medición tras T02 señala
  el eslogan y su animación letra por letra lo retrasa): la primera palabra
  del primer render se pinta sin `animate-hero-letter`; al rotar, las palabras entran como hoy.
  SSR y cliente producen el mismo primer render, así que no hay riesgo de hidratación.
  `motion-reduce` sigue igual.
- `globals.css` no cambia.

## Estructura objetivo
| Ruta | Capa | Responsabilidad |
|------|------|-----------------|
| `docs/specs/020-lcp-render-hero/spec.md` | Docs | Sección `## Medición` (T01 y T04). |
| `src/components/landing/hero-section.tsx` | UI (landing) | Entrada sin fundido. |
| `src/components/landing/landing-sections.test.tsx` | Prueba | Texto del hero sin `fade-in`. |
| `src/components/landing/rotating-slogan.tsx` | UI (landing) | Primera palabra sin animación de entrada. |
| `src/components/landing/rotating-slogan.test.tsx` | Prueba (nueva) | Primera palabra estática; las siguientes animadas. |

## Pruebas
- `landing-sections.test.tsx` (RTL): la prueba existente «anima la entrada del texto con CSS…» se
  ajusta para eyebrow, eslogan y subtítulo: tienen `motion-safe:animate-in` y
  `slide-in-from-bottom-*`, y **no** tienen `fade-in` ni `opacity-0`.
- `rotating-slogan.test.tsx` (RTL, temporizadores falsos): en el primer render las letras de
  `[data-rotating-word]` no tienen `motion-safe:animate-hero-letter`; tras 3 500 ms las de la nueva
  palabra sí. Las pruebas existentes de rotación y escalonado (`--letter-delay`) en
  `landing-sections.test.tsx` deben seguir en verde.
- `src/app/[lang]/page.test.tsx` sin cambios y en verde.
- Manual: Lighthouse móvil local antes (T01) y después (T04); PSI de producción tras el deploy.
