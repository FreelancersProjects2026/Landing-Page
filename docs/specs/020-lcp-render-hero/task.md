# Tareas: Retraso de render del LCP en el hero

## Base acordada
- Spec: `docs/specs/020-lcp-render-hero/spec.md`. Plan: `plan.md`.
- Rama: `perf/lcp-render-hero` (no crear otra, no hacer push).
- Método: TDD, un commit por tarea `fix(landing): 020-Tnn ...` (`docs(landing): 020-Tnn ...` para
  mediciones), `pnpm validate` en verde.
- Sin cambio de contenido ni de dominio. Sin dependencias nuevas. No debilitar
  `src/app/[lang]/page.test.tsx`.
- Orden (replanificado tras T01): T02 → T04. T03 queda en espera: solo se activa si la medición
  de T04 muestra que el LCP es el eslogan y que la animación letra por letra lo retrasa; en ese
  caso T03 → se repite la medición de T04.

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
- [ ] T02 Prueba en `landing-sections.test.tsx` (ajustar «anima la entrada del texto con CSS…»):
  eyebrow, eslogan y subtítulo tienen `motion-safe:animate-in` y `slide-in-from-bottom-*` y no
  tienen `fade-in` ni `opacity-0` (falla) → quitar `fade-in` de la constante de entrada en
  `hero-section.tsx` y actualizar su comentario: el texto es visible desde el primer pintado para
  que el eslogan y el subtítulo cuenten como candidatos LCP (con `opacity: 0` Chrome no los
  cuenta y gana el logo del menú). (depende de T01)
  Archivos: `src/components/landing/hero-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
- [ ] T03 **Condicional, en espera**: solo si T04 muestra que el LCP es el eslogan y que llega
  tarde por la animación letra por letra de la palabra rotativa. Prueba nueva en `rotating-slogan.test.tsx`
  (temporizadores falsos): en el primer render las letras de `[data-rotating-word]` no tienen
  `motion-safe:animate-hero-letter`; tras 3 500 ms las de la nueva palabra sí (falla) → en
  `rotating-slogan.tsx`, la primera palabra del primer render se pinta sin la clase de entrada;
  las rotaciones siguientes se animan como hoy. Si se rompe la prueba de escalonado de
  `landing-sections.test.tsx`, reportarlo a planner en lugar de editar ese archivo.
  (depende de T04)
  Archivos: `src/components/landing/rotating-slogan.tsx`,
  `src/components/landing/rotating-slogan.test.tsx` (nuevo).
- [ ] T04 Medición posterior (sin código): `pnpm validate` verde; `pnpm build && pnpm start` y
  Lighthouse móvil local con el mismo método que T01 → anotar en `## Medición` (subsección
  «Después») el elemento LCP, LCP/FCP simulados y el desglose, comparados con T01. Además, en
  DevTools con throttling móvil, listar todas las entradas `largest-contentful-paint`
  (`PerformanceObserver` con `buffered: true`) y anotar si la imagen hero aparece como candidata
  (confirma o descarta la hipótesis b). Marcar criterios de `spec.md` (menos PSI en producción).
  Reportar a planner: si el LCP es el eslogan y llega tarde por la palabra rotativa → activar T03;
  si el LCP sigue ≥ 2,5 s por otra causa → replanificar con las alternativas del plan.
  (depende de T02)
  Archivos: `docs/specs/020-lcp-render-hero/spec.md`.
