# Spec 020: Retraso de render del LCP en el hero

## Problema
Tras la spec 019, PSI móvil de `https://solutionspjm.com/es` (2026-10-16) da Rendimiento 95,
FCP 1,2 s y **LCP 2,9 s**. La página pinta a 1,2 s pero el LCP llega 1,7 s después. La hero
(`hero-960.webp`, 58 KB) ya se precarga con `fetchPriority="high"` y no compite con otras
imágenes, así que el hueco es retraso de render, no de descarga.

Hipótesis principal: el texto del hero entra con `motion-safe:animate-in fade-in fill-mode-both`
(tw-animate-css, `duration-700`/`duration-1000`, `delay-200` en el subtítulo) y arranca en
`opacity: 0`. Si el elemento LCP es ese texto, Chrome lo cuenta al final del fundido (~1 s más
tarde). Además, en `rotating-slogan.tsx` cada letra de la palabra rotativa entra con `opacity: 0`
y `blur(20px)` (`animate-hero-letter` en `globals.css`).

## Objetivo
Que el texto del hero sea visible desde el primer pintado, para que el LCP móvil baje de 2,5 s,
sin cambiar contenido ni el diseño aprobado: solo cambia cómo aparece el texto.

## Lenguaje ubicuo
- **Elemento LCP**: el elemento más grande visible al cargar; Chrome toma su tiempo de pintado.
- **Retraso de render**: tiempo entre que el recurso del LCP está listo y su pintado efectivo.
- **Fundido de entrada**: animación que lleva la opacidad de 0 a 1 (`fade-in`).
- **Deslizamiento**: animación solo de `transform` (`slide-in-from-bottom-*`); no oculta el texto.

## Alcance
1. Confirmar localmente el elemento LCP y su desglose (TTFB, retraso de carga, tiempo de carga,
   retraso de render) y anotarlo en esta spec antes de tocar código.
2. Si el LCP es texto del hero: quitar el fundido de entrada del eyebrow, eslogan y subtítulo;
   conservan el deslizamiento (`transform`) bajo `motion-safe`.
3. Si el LCP es el eslogan: la primera palabra rotativa se pinta visible desde el primer pintado
   (sin `opacity: 0` ni `blur` inicial); el efecto letra por letra se mantiene en cada cambio de
   palabra posterior.
4. Si el LCP es la imagen hero u otro elemento: no se aplica 2–3; planner replanifica con las
   alternativas de `plan.md`.

## Fuera de alcance
- Cambios de contenido, textos, dominio (`company-profile`) o diseño estático del hero.
- Cambiar la imagen hero, las fuentes o `next.config.mjs` (alternativas en el plan, solo si la
  medición las exige).
- Dependencias nuevas.

## Criterios de aceptación
- [ ] Elemento LCP local identificado y desglose anotado en `## Medición` (antes del cambio).
- [ ] Ningún texto del hero (eyebrow, eslogan, subtítulo) usa `fade-in`; siguen con
  `motion-safe:animate-in` y su `slide-in-from-bottom-*`.
- [ ] Si aplica (alcance 3): en el primer render la palabra rotativa no lleva
  `animate-hero-letter`; tras el primer cambio de palabra, sí.
- [ ] Con `prefers-reduced-motion` no hay animación (se mantienen `motion-safe:`/`motion-reduce:`).
- [ ] `src/app/[lang]/page.test.tsx` (hidratación) sigue en verde; `pnpm validate` en verde.
- [ ] Lighthouse móvil local tras el cambio: retraso de render del LCP reducido; anotado en
  `## Medición`.
- [ ] Tras el deploy, PSI móvil de `/es` reporta LCP < 2,5 s y Rendimiento ≥ 95 (verificación
  manual del usuario).

## Medición
### Antes (T01, 2026-10-16)
- Herramienta: Lighthouse 12.8.2 CLI, móvil por defecto, throttling simulado, Chrome headless,
  contra `pnpm build && pnpm start -p 3123` → `http://localhost:3123/es`. Dos corridas, mismo
  resultado.
- Rendimiento 89; FCP 1,4 s; **LCP 3,7 s**; TBT 20 ms; CLS 0.
- **Elemento LCP: NO es texto del hero.** Es el logotipo de la barra de navegación:
  - Selector: `nav.relative > div.flex > a.flex > span.font-display` (texto «solutionsPJM»,
    138 × 32 px, `src/components/landing/navigation.tsx`).
  - Snippet: `<span class="font-display tracking-tight transition-all duration-500 text-2xl text-white">`.
- Desglose (`largest-contentful-paint-element`, simulado):

  | Fase              | Tiempo    | % LCP |
  | ----------------- | --------- | ----- |
  | TTFB              | 457 ms    | 12 %  |
  | Retraso de carga  | 0 ms      | 0 %   |
  | Tiempo de carga   | 0 ms      | 0 %   |
  | Retraso de render | 3 280 ms  | 88 %  |

  (`lcp-breakdown-insight`, traza sin simular: TTFB 10 ms, retraso de render 155 ms.)
- Conclusión: alcance 2–3 no aplica tal cual (alcance 4). Que un texto pequeño del nav gane a
  eslogan, subtítulo e imagen hero sugiere que estos no cuentan como candidatos LCP en la carga;
  lo replanifica planner.

## Dudas
- **Elemento LCP no confirmado**: la API de PSI respondió 429. Candidatos: `<p>` del eslogan,
  `<p>` del subtítulo o la imagen hero. Lo resuelve T01.
- **Primera palabra del eslogan sin efecto blur al cargar** (alcance 3): cambia levemente la
  primera impresión (la palabra aparece nítida con su degradado, sin entrar letra por letra). Se
  asume aceptable porque el efecto sigue en cada rotación; la alternativa es conservar solo el
  `blur` sin `opacity: 0`. A confirmar por el usuario.
