# Spec 020: Retraso de render del LCP en el hero

## Problema
Tras la spec 019, PSI móvil de `https://solutionspjm.com/es` (2026-10-16) da Rendimiento 95,
FCP 1,2 s y **LCP 2,9 s**. La página pinta a 1,2 s pero el LCP llega 1,7 s después. La hero
(`hero-960.webp`, 58 KB) ya se precarga con `fetchPriority="high"` y no compite con otras
imágenes, así que el hueco es retraso de render, no de descarga.

La medición de T01 (ver `## Medición`) cambió el diagnóstico: el elemento LCP **no** es el texto
del hero sino el texto de marca «solutionsPJM» del menú (`navigation.tsx`, span de 138 × 32 px).
Que un elemento tan pequeño gane indica que los candidatos grandes del hero quedan fuera del LCP
en la carga:
- **(a) Texto del hero invisible al pintar** (confirmado en código): eyebrow, eslogan y subtítulo
  entran con `motion-safe:animate-in fade-in fill-mode-both` (`hero-section.tsx`), es decir,
  arrancan en `opacity: 0`, y Chrome no cuenta como candidato LCP un pintado con opacidad 0.
  Además, cada letra de la palabra rotativa del eslogan entra con `opacity: 0` y `blur(20px)`
  (`animate-hero-letter` en `globals.css`).
- **(b) Imagen hero tratada como fondo** (hipótesis, no verificada): la imagen ocupa todo el
  viewport (`absolute inset-0` dentro de `min-h-screen`), y Chrome descarta para el LCP las
  imágenes que cubren el viewport completo por considerarlas fondo. Se confirma o descarta en T04
  con la lista de candidatos LCP.

Sobre el tiempo: en la traza sin simular, el retraso de render del logo es de solo 155 ms (se
pinta casi a la par del FCP). Los 3,7 s son la estimación de Lantern (throttling simulado de
Lighthouse), que es lo que también reporta PSI.

## Objetivo
Que el eslogan y el subtítulo del hero, mucho más grandes que el logo, sean visibles desde el
primer pintado y pasen a ser el elemento LCP con un tiempo cercano al FCP, para que el LCP móvil
baje de 2,5 s. Sin cambiar contenido ni el diseño aprobado: solo cambia cómo aparece el texto.

## Lenguaje ubicuo
- **Elemento LCP**: el elemento más grande visible al cargar; Chrome toma su tiempo de pintado.
- **Retraso de render**: tiempo entre que el recurso del LCP está listo y su pintado efectivo.
- **Fundido de entrada**: animación que lleva la opacidad de 0 a 1 (`fade-in`).
- **Deslizamiento**: animación solo de `transform` (`slide-in-from-bottom-*`); no oculta el texto.

## Alcance
1. Confirmar localmente el elemento LCP y su desglose (hecho en T01).
2. Quitar el fundido de entrada del eyebrow, eslogan y subtítulo, que conservan el deslizamiento
   (`transform`) bajo `motion-safe`. Así son candidatos LCP desde el primer pintado.
3. **Condicional**: solo si, tras el punto 2, el LCP es el eslogan y su animación letra por letra
   lo retrasa (el LCP llega después del FCP por la palabra rotativa), la primera palabra se pinta
   visible desde el primer pintado (sin `opacity: 0` ni `blur` inicial). El efecto letra por
   letra se mantiene en cada cambio de palabra posterior.
4. Volver a medir con Lighthouse local y comparar el elemento y el tiempo con T01. Si el LCP sigue
   ≥ 2,5 s, planner replanifica con las alternativas de `plan.md`.

## Fuera de alcance
- Cambios de contenido, textos, dominio (`company-profile`) o diseño estático del hero.
- Cambiar la imagen hero, las fuentes o `next.config.mjs` (alternativas en el plan, solo si la
  medición las exige).
- Dependencias nuevas.

## Criterios de aceptación
- [x] Elemento LCP local identificado y desglose anotado en `## Medición` (antes del cambio).
- [ ] Ningún texto del hero (eyebrow, eslogan, subtítulo) usa `fade-in`; siguen con
  `motion-safe:animate-in` y su `slide-in-from-bottom-*`.
- [ ] Si aplica (alcance 3, decidido tras medir): en el primer render la palabra rotativa no lleva
  `animate-hero-letter`; tras el primer cambio de palabra, sí.
- [ ] Medición posterior anotada en `## Medición`: elemento LCP (debe ser texto del hero, no el
  logo del menú), tiempo y desglose comparados con T01, y lista de candidatos LCP que confirme o
  descarte la hipótesis (b).
- [ ] Con `prefers-reduced-motion` no hay animación (se mantienen `motion-safe:`/`motion-reduce:`).
- [ ] `src/app/[lang]/page.test.tsx` (hidratación) sigue en verde; `pnpm validate` en verde.
- [ ] Lighthouse móvil local tras el cambio: LCP simulado menor que los 3,7 s de T01.
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
- Conclusión: que un texto pequeño del nav gane a eslogan, subtítulo e imagen hero indica que
  estos no cuentan como candidatos LCP en la carga. Replanificado (2026-10-16): ver `## Problema`,
  causas (a) y (b); T02 se mantiene con esa justificación, T03 pasa a condicional y T04 vuelve a
  medir.

## Dudas
- **Por qué el span de 138 × 32 px del menú gana** a eslogan, subtítulo e imagen hero (la duda
  anterior, «elemento LCP no confirmado», quedó resuelta en T01). Hipótesis: (a) el texto del
  hero arranca en `opacity: 0` por `fade-in` y Chrome no cuenta esos pintados; (b) la imagen hero
  cubre todo el viewport y Chrome la descarta como fondo. Se verifica en T04, tras T02: si el LCP
  pasa a ser texto del hero se confirma (a); la lista de entradas `largest-contentful-paint`
  confirma o descarta (b).
- **Riesgo de que el LCP simulado baje poco**: en la traza real el logo ya se pinta unos 155 ms
  después del FCP. Si el texto del hero pasa a pintarse en el mismo momento, la estimación de
  Lantern podría cambiar poco. T04 lo mide; si no baja de 2,5 s, se pasa a las alternativas del
  plan (CSS en línea, fuentes) en una replanificación.
- **Primera palabra del eslogan sin efecto blur al cargar** (alcance 3): cambia levemente la
  primera impresión (la palabra aparece nítida con su degradado, sin entrar letra por letra). Se
  asume aceptable porque el efecto sigue en cada rotación; la alternativa es conservar solo el
  `blur` sin `opacity: 0`. A confirmar por el usuario.
