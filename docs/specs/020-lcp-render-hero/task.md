# Tareas: Retraso de render del LCP en el hero

## Base acordada
- Spec: `docs/specs/020-lcp-render-hero/spec.md`. Plan: `plan.md`.
- Rama: `perf/lcp-render-hero` (no crear otra, no hacer push).
- Método: TDD, un commit por tarea `fix(landing): 020-Tnn ...` (`docs(landing): 020-Tnn ...` para
  mediciones), `pnpm validate` en verde.
- Sin cambio de contenido ni de dominio. Sin dependencias nuevas. No debilitar
  `src/app/[lang]/page.test.tsx`.
- Orden (replanificado tras T01): T02 → T04. T03 descartada tras T04.
- Orden (replanificado tras T04): T05 ∥ T06 (no comparten archivos) → T07. Recorte de JS o
  alternativas del plan solo si T07 los señala (se planifican aparte).
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
- [ ] T05 Prueba en `not-found-view.test.tsx`: al renderizar `NotFoundView` no hay ningún
  `link[rel="preload"]` de imagen en el documento, y la imagen tiene `fetchpriority="high"` y no
  tiene `loading="lazy"` (falla por el `preload`) → en `not-found-view.tsx` cambiar `preload` por
  `fetchPriority="high"` y `loading="eager"`; mantener tamaño, `alt` y clases. Bug: la precarga de
  `/404/404-raices-obsidiana.webp` (102 KB) llega a `/es` porque la 404 global viaja en el payload
  RSC. Comprobar además en `pnpm build && pnpm start` que `/es` ya no pide esa imagen (pestaña
  Red o reporte de Lighthouse) y anotarlo como evidencia. (paralela a T06)
  Commit: `fix(not-found): 020-T05 imagen de la 404 sin precarga`.
  Archivos: `src/components/not-found/not-found-view.tsx`,
  `src/components/not-found/not-found-view.test.tsx`.
- [ ] T06 Pruebas en `landing-images.test.ts`, que la variante
  `public/ComoTrabajamos/como-trabajamos-640.webp` existe, es WebP, mide 640 px de ancho y pesa
  menos que la original, y en `landing-sections.test.tsx`, que la imagen de «Cómo trabajamos»
  tiene `srcset` con `como-trabajamos-640.webp 640w` y `como-trabajamos.webp 1212w`, tiene `sizes`
  y conserva `loading="lazy"`, `decoding="async"` y `alt=""` (fallan) → generar la variante con
  sharp desde la original (script de un solo uso fuera del repo) y añadir `srcSet`/`sizes` en
  `how-it-works-section.tsx`. `sizes` según el ancho mostrado: ~600 px en `lg` (una de dos
  columnas, limitada por `object-contain` a 640 px de alto) y el ancho de la pantalla menos el
  padding `px-6` debajo de `lg`, para que el móvil de Lighthouse (412 px CSS, DPR 1,75) elija la
  de 640. `src` sigue siendo la original. (paralela a T05)
  Commit: `fix(landing): 020-T06 variante móvil de la imagen de cómo trabajamos`.
  Archivos: `public/ComoTrabajamos/como-trabajamos-640.webp` (nuevo),
  `src/components/landing/how-it-works-section.tsx`,
  `src/components/landing/landing-images.test.ts`,
  `src/components/landing/landing-sections.test.tsx`.
- [ ] T07 Medición final (sin código): `pnpm validate` verde; `pnpm build && pnpm start` y
  Lighthouse móvil local con el mismo método que T04 (dos corridas, `--save-assets`) → anotar en
  `## Medición` (subsección «Final») LCP/FCP simulados, elemento LCP y la **lista de peticiones
  que empiezan antes del LCP observado** (URL, tipo y tamaño), comparada con T04. Confirmar que
  ya no aparecen la imagen de la 404 ni `como-trabajamos.webp` de 186 KB. Marcar criterios de
  `spec.md` (menos PSI en producción). Reportar a planner qué domina lo que queda (scripts,
  fuentes, CSS) para decidir si hace falta otra ronda. (depende de T05 y T06)
  Commit: `docs(landing): 020-T07 medición final`.
  Archivos: `docs/specs/020-lcp-render-hero/spec.md`.
