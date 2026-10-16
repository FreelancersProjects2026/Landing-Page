# Tareas: Retraso de render del LCP en el hero

## Base acordada
- Spec: `docs/specs/020-lcp-render-hero/spec.md`. Plan: `plan.md`.
- Rama: `perf/lcp-render-hero` (no crear otra, no hacer push).
- Método: TDD, un commit por tarea `fix(landing): 020-Tnn ...` (`docs(landing): 020-Tnn ...` para
  mediciones), `pnpm validate` en verde.
- Sin cambio de contenido ni de dominio. Sin dependencias nuevas. No debilitar
  `src/app/[lang]/page.test.tsx`.
- Orden (replanificado tras T01): T02 → T04. T03 descartada tras T04.
- Orden (replanificado tras T04): T05 ∥ T06 (no comparten archivos) → T08 (corrección de T06)
  → T07. Recorte de JS o
  alternativas del plan solo si T07 los señala (se planifican aparte).
- Tras T07: T09 (corrección de T05, cabecera `Link` de la 404).
- Variantes de imagen: sharp ya instalado por Next (`node_modules/.pnpm/sharp@0.34.5`), script de
  un solo uso fuera del repo, sin dependencias nuevas.

## Tareas
- [x] T01 Medición (sin código): `pnpm build && pnpm start`; Lighthouse móvil en DevTools sobre
  `http://localhost:3000/es` (o `PerformanceObserver` `largest-contentful-paint` con throttling
  móvil) → anotar en `spec.md` `## Medición` el elemento LCP (selector) y el desglose TTFB /
  retraso de carga / tiempo de carga / retraso de render. Si el LCP **no** es texto del hero,
  parar y reportar a planner (T02/T03 no aplican).
  Archivos: `docs/specs/020-lcp-render-hero/spec.md`.
  - Evidencia: Lighthouse 12.8.2 móvil local, LCP 3,7 s; elemento LCP = logo del nav
    (`span.font-display` «solutionsPJM»), retraso de render 88 %. No es texto del hero → parar,
    planner replanifica.
- [x] T02 Prueba en `landing-sections.test.tsx` (ajustar «anima la entrada del texto con CSS…»):
  eyebrow, eslogan y subtítulo tienen `motion-safe:animate-in` y `slide-in-from-bottom-*` y no
  tienen `fade-in` ni `opacity-0` (falla) → quitar `fade-in` de la constante de entrada en
  `hero-section.tsx` y actualizar su comentario: el texto es visible desde el primer pintado para
  que el eslogan y el subtítulo cuenten como candidatos LCP (con `opacity: 0` Chrome no los
  cuenta y gana el logo del menú). (depende de T01)
  Archivos: `src/components/landing/hero-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo «expect(element).not.toHaveClass("fade-in")» en el eyebrow; verde tras
    quitar `fade-in`; `pnpm test` 252/252 y `pnpm check` OK.
- [x] T03 **Descartada** (T04: el LCP es el subtítulo, no el eslogan; no se implementa).
  Texto original: solo si T04 muestra que el LCP es el eslogan y que llega
  tarde por la animación letra por letra de la palabra rotativa. Prueba nueva en `rotating-slogan.test.tsx`
  (temporizadores falsos): en el primer render las letras de `[data-rotating-word]` no tienen
  `motion-safe:animate-hero-letter`; tras 3 500 ms las de la nueva palabra sí (falla) → en
  `rotating-slogan.tsx`, la primera palabra del primer render se pinta sin la clase de entrada;
  las rotaciones siguientes se animan como hoy. Si se rompe la prueba de escalonado de
  `landing-sections.test.tsx`, reportarlo a planner en lugar de editar ese archivo.
  (depende de T04)
  Archivos: `src/components/landing/rotating-slogan.tsx`,
  `src/components/landing/rotating-slogan.test.tsx` (nuevo).
- [x] T04 Medición posterior (sin código): `pnpm validate` verde; `pnpm build && pnpm start` y
  Lighthouse móvil local con el mismo método que T01 → anotar en `## Medición` (subsección
  «Después») el elemento LCP, LCP/FCP simulados y el desglose, comparados con T01. Además, en
  DevTools con throttling móvil, listar todas las entradas `largest-contentful-paint`
  (`PerformanceObserver` con `buffered: true`) y anotar si la imagen hero aparece como candidata
  (confirma o descarta la hipótesis b). Marcar criterios de `spec.md` (menos PSI en producción).
  Reportar a planner: si el LCP es el eslogan y llega tarde por la palabra rotativa → activar T03;
  si el LCP sigue ≥ 2,5 s por otra causa → replanificar con las alternativas del plan.
  (depende de T02)
  Archivos: `docs/specs/020-lcp-render-hero/spec.md`.
  - Evidencia: Lighthouse 12.8.2 móvil local, 2 corridas: LCP 3,7 s / 3,5 s, FCP 1,4 s; elemento
    LCP = subtítulo del hero (`p.text-lg`); retraso de render 87–88 %. Candidatos LCP tomados de
    los eventos de la traza de Lighthouse (`largestContentfulPaint::Candidate`,
    `LargestTextPaint`/`LargestImagePaint`), equivalentes al `PerformanceObserver` en DevTools:
    único candidato LCP el subtítulo; la imagen hero no es candidata (observado; mecanismo de (b)
    deducido). LCP no es el eslogan → T03 no aplica; LCP ≥ 2,5 s → replanificar.
- [x] T05 Prueba en `not-found-view.test.tsx`: al renderizar `NotFoundView` no hay ningún
  `link[rel="preload"]` de imagen en el documento, y la imagen tiene `fetchpriority="high"` y no
  tiene `loading="lazy"` (falla por el `preload`) → en `not-found-view.tsx` cambiar `preload` por
  `fetchPriority="high"` y `loading="eager"`; mantener tamaño, `alt` y clases. Bug: la precarga de
  `/404/404-raices-obsidiana.webp` (102 KB) llega a `/es` porque la 404 global viaja en el payload
  RSC. Comprobar además en `pnpm build && pnpm start` que `/es` ya no pide esa imagen (pestaña
  Red o reporte de Lighthouse) y anotarlo como evidencia. (paralela a T06)
  Commit: `fix(not-found): 020-T05 imagen de la 404 sin precarga`.
  Archivos: `src/components/not-found/not-found-view.tsx`,
  `src/components/not-found/not-found-view.test.tsx`.
  - Evidencia: rojo, la prueba nueva falla con `link[rel="preload"][as="image"]` de
    `404-raices-obsidiana.webp` en el documento. Verde con `fetchPriority="high"` y
    `loading="eager"`. En `pnpm build && pnpm start`, `/es` no menciona `404-raices-obsidiana`
    ni en el HTML ni en el payload RSC (`curl -H 'RSC: 1'`); solo precarga el logo y el hero. La
    404 (`/es/no-existe`, 404) sigue mostrando la imagen con `fetchpriority="high"`
    `loading="eager"`. `pnpm test` (253) y `pnpm check` en verde.
- [x] T06 Pruebas en `landing-images.test.ts`, que la variante
  `public/ComoTrabajamos/como-trabajamos-640.webp` existe, es WebP, mide 640 px de ancho y pesa
  menos que la original, y en `landing-sections.test.tsx`, que la imagen de «Cómo trabajamos»
  tiene `srcset` con `como-trabajamos-640.webp 640w` y `como-trabajamos.webp 1212w`, tiene `sizes`
  y conserva `loading="lazy"`, `decoding="async"` y `alt=""` (fallan) → generar la variante con
  sharp desde la original (script de un solo uso fuera del repo) y añadir `srcSet`/`sizes` en
  `how-it-works-section.tsx`. `sizes` según el ancho mostrado: ~600 px en `lg` (una de dos
  columnas, limitada por `object-contain` a 640 px de alto) y el ancho de la pantalla menos el
  padding `px-6` debajo de `lg`, para que el móvil de Lighthouse (412 px CSS, DPR 1,75) elija la
  de 640. `src` sigue siendo la original. (paralela a T05)
  **Nota (corregida en T08):** la fórmula de debajo de `lg` era errónea; el ancho pintado lo
  limita el alto de 320 px con `object-contain` (~299 px), no el ancho del contenedor.
  Commit: `fix(landing): 020-T06 variante móvil de la imagen de cómo trabajamos`.
  Archivos: `public/ComoTrabajamos/como-trabajamos-640.webp` (nuevo),
  `src/components/landing/how-it-works-section.tsx`,
  `src/components/landing/landing-images.test.ts`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo, ENOENT de `como-trabajamos-640.webp` y `srcset` ausente en la imagen.
    Variante con sharp (`resize` 640, WebP q80 effort 6): 640×685, 63 446 B frente a 190 576 B
    de la original (1212×1298); revisada a ojo. `sizes="(min-width: 1024px) 600px,
    calc(100vw - 48px)"`. `pnpm test` (255) y `pnpm check` en verde.
- [x] T08 Corrección [mejora] (hallazgo de reviwer sobre T06, `6deccf6`): en
  `landing-sections.test.tsx`, la prueba de la imagen de «Cómo trabajamos» exige
  `sizes="(min-width: 1024px) 600px, 300px"` (falla: hoy es `calc(100vw - 48px)` debajo de `lg`)
  → en `how-it-works-section.tsx` cambiar el valor de debajo de `lg` a `300px`, el ancho pintado:
  el contenedor mide `h-[320px]` y con `object-contain` y proporción 1212/1298 la imagen mide
  ~299 px CSS de ancho. Con DPR 2 en teléfonos de 370–412 px se descargaba la de 1212 cuando
  basta la de 640 (contradice «`sizes` según su tamaño mostrado» de `spec.md`). Escritorio
  (`600px`) no cambia. (depende de T06; antes de T07)
  Commit: `fix(landing): 020-T08 sizes según el ancho pintado de cómo trabajamos`.
  Archivos: `src/components/landing/how-it-works-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo, `sizes` recibido `(min-width: 1024px) 600px, calc(100vw - 48px)`. Verde
    con `300px` debajo de `lg`. `pnpm test` y `pnpm check` en verde.
- [x] T07 Medición final (sin código): `pnpm validate` verde; `pnpm build && pnpm start` y
  Lighthouse móvil local con el mismo método que T04 (dos corridas, `--save-assets`) → anotar en
  `## Medición` (subsección «Final») LCP/FCP simulados, elemento LCP y la **lista de peticiones
  que empiezan antes del LCP observado** (URL, tipo y tamaño), comparada con T04. Confirmar que
  ya no aparecen la imagen de la 404 ni `como-trabajamos.webp` de 186 KB. Marcar criterios de
  `spec.md` (menos PSI en producción). Reportar a planner qué domina lo que queda (scripts,
  fuentes, CSS) para decidir si hace falta otra ronda. (depende de T05, T06 y T08)
  Commit: `docs(landing): 020-T07 medición final`.
  Archivos: `docs/specs/020-lcp-render-hero/spec.md`.
  - Evidencia: Lighthouse 12.8.2 móvil local, 2 corridas: Rendimiento 90/90, FCP 1,4 s, LCP
    3,6/3,5 s, TBT 10 ms, CLS 0; LCP = subtítulo del hero, retraso de render ~3,1 s. Antes del LCP
    449 KB (T04: 573): `como-trabajamos.webp` 186 KB sustituida por la de 640 (62 KB). La imagen
    de la 404 no está en el HTML ni en el RSC de `/es` y arranca después del LCP, pero se sigue
    pidiendo en local por la cabecera `link: rel=preload` de la 404 que responde a
    `/_vercel/insights/script.js` → criterio de la 404 sin marcar. Bloqueando `*.js` el LCP baja a
    2,6 s: dominan los scripts. Puerto 3123 liberado.
- [x] T09 Corrección [mejora] (hallazgo de reviwer sobre T07, `db42090`): toda respuesta 404 lleva
  `Link: </404/404-raices-obsidiana.webp>; rel=preload; as="image"; fetchpriority="high"`. La
  emite React al renderizar en el servidor el `<img>` eager de `NotFoundView`, y Next la convierte
  en cabecera; T05 subió su prioridad de Low a High (ver «Corrección tras T07» en `plan.md`).
  - Prueba en `not-found-view.test.tsx`: la imagen tiene `loading="lazy"` y no tiene
    `fetchpriority`; sigue sin haber ningún `link[rel="preload"]` de imagen en el documento (falla:
    hoy es `eager` con `fetchpriority="high"`).
  - Cambio: en `not-found-view.tsx` quitar `fetchPriority="high"` y pasar a `loading="lazy"`;
    mantener `src`, `alt`, tamaño y clases. Ajustar `global-not-found.test.tsx` solo si asserta la
    prioridad; no debilitar el resto.
  - Verificación manual: `pnpm build && pnpm start` y `curl -sI http://localhost:3000/xyz` y
    `curl -sI http://localhost:3000/_vercel/insights/script.js`. Ambas responden 404 sin ninguna
    cabecera `link` que mencione `404-raices-obsidiana`; anotar la salida como evidencia. La 404
    sigue mostrando la imagen en el navegador. Si la cabecera persiste, parar y reportar a planner
    sin probar otras variantes.
  - Al terminar, marcar en `spec.md` el criterio de la 404.
  (depende de T07)
  Commit: `fix(not-found): 020-T09 imagen de la 404 sin cabecera de precarga`.
  - Evidencia: rojo = la prueba «carga la imagen en diferido, sin prioridad ni precarga» fallaba
    (la imagen era `eager` con `fetchpriority="high"`). Tras el cambio, `pnpm build && pnpm start -p
    3123`: `curl -sI /xyz` y `curl -sI /_vercel/insights/script.js` → `HTTP/1.1 404 Not Found`, con
    cabeceras `Vary`, `Cache-Control`, `X-Powered-By`, `Content-Type`, `Date`, `Connection` y
    `Keep-Alive`, sin ninguna `link`. El HTML de `/xyz` sigue con el `<img>` de
    `404-raices-obsidiana.webp` (`loading="lazy"`). `pnpm test` (255) y `pnpm check` en verde.
  Archivos: `src/components/not-found/not-found-view.tsx`,
  `src/components/not-found/not-found-view.test.tsx`, `docs/specs/020-lcp-render-hero/spec.md`
  (solo el criterio).
