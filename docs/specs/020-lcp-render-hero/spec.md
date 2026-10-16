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
- **(a) Texto del hero invisible al pintar** (**confirmada en T04**): eyebrow, eslogan y subtítulo
  entran con `motion-safe:animate-in fade-in fill-mode-both` (`hero-section.tsx`), es decir,
  arrancan en `opacity: 0`, y Chrome no cuenta como candidato LCP un pintado con opacidad 0.
  Además, cada letra de la palabra rotativa del eslogan entra con `opacity: 0` y `blur(20px)`
  (`animate-hero-letter` en `globals.css`).
- **(b) Imagen hero fuera del LCP**: **observado en T04**, `hero-960.webp` no aparece como
  candidata aunque se descarga a ~20 ms con prioridad alta. **Deducido, no demostrado por la
  traza**: el mecanismo sería la exclusión de Chrome de las imágenes que cubren todo el viewport
  (`absolute inset-0` dentro de `min-h-screen`), tratadas como fondo; la traza no expone el
  motivo.

Tras T02 el elemento LCP es el subtítulo del hero, pero el **LCP simulado no baja** (3,5–3,7 s).
En la traza real FCP = LCP ≈ 110 ms: los ~2,2 s de diferencia los pone Lantern (throttling
simulado de Lighthouse, el mismo que usa PSI). Su LCP pesimista suma todas las peticiones que
empiezan antes del LCP observado. Antes de 110 ms arrancan (reporte de T04, corrida 2):
- **Imagen de la 404** `/404/404-raices-obsidiana.webp` (102 KB), precargada en la landing
  (`isLinkPreload`), inyectada en cliente (no está en el HTML SSR). Es un **bug**: el `<Image
  preload>` de `src/components/not-found/not-found-view.tsx` viaja en el payload RSC de la 404
  global y React emite la precarga al hidratar `/es`.
- **`como-trabajamos.webp`** (186 KB), pedida a ~45 ms pese a `loading="lazy"`: en móvil la
  sección cae dentro del margen de carga diferida de Chrome. Se muestra a ~364 px CSS de ancho en
  móvil (contenedor de 320 px de alto, `object-contain`), pero el archivo mide 1212 px.
- **Scripts**: 204 KB en chunks; varias secciones bajo el pliegue son `'use client'` (cta,
  services, how-it-works, projects, team, whatsapp-button con Radix).
- **Fuentes**: 84 KB, entre ellas una de 40 KB sin precarga (probablemente JetBrains Mono, usada
  por el eyebrow del hero).

## Objetivo
Que el LCP móvil (Lighthouse simulado y PSI) baje de 2,5 s sin cambiar contenido ni el diseño
aprobado. Primero, que el texto del hero sea candidato LCP desde el primer pintado (hecho en T02).
Después, quitar de la ventana previa al LCP las descargas que no hacen falta para la primera
pantalla, empezando por las de mayor impacto y menor esfuerzo.

## Lenguaje ubicuo
- **Elemento LCP**: el elemento más grande visible al cargar; Chrome toma su tiempo de pintado.
- **Retraso de render**: tiempo entre que el recurso del LCP está listo y su pintado efectivo.
- **Fundido de entrada**: animación que lleva la opacidad de 0 a 1 (`fade-in`).
- **Deslizamiento**: animación solo de `transform` (`slide-in-from-bottom-*`); no oculta el texto.

## Alcance
1. Confirmar localmente el elemento LCP y su desglose (hecho en T01).
2. Quitar el fundido de entrada del eyebrow, eslogan y subtítulo, que conservan el deslizamiento
   (`transform`) bajo `motion-safe`. Así son candidatos LCP desde el primer pintado.
3. ~~Primera palabra rotativa sin animación inicial~~: **descartado** en T04 (el LCP no es el
   eslogan).
4. Volver a medir con Lighthouse local (hecho en T04: LCP simulado sin cambio).
5. La imagen de la 404 deja de precargarse en cualquier página, tanto por `<link>` en el
   documento como por la cabecera HTTP `Link` de las respuestas 404. Desde T09 se carga en diferido
   (`loading="lazy"`): la prioridad alta de T05 era justo lo que hacía que la cabecera la pidiera
   en High.
6. `como-trabajamos.webp` tiene una variante ligera para móvil (640 px de ancho) servida con
   `srcset`/`sizes` según su tamaño mostrado; la original sigue para pantallas grandes.
7. Medir de nuevo y, con la lista de peticiones previas al LCP, decidir si hace falta reducir el
   JavaScript de las secciones bajo el pliegue o aplicar otra alternativa del plan. Eso se
   planifica aparte, según la medición.

### Ronda 3 (tras el deploy de 020, misma spec y rama por pedido del usuario)
PSI móvil en producción con 020 desplegada (una corrida, ruido ±0,5 s): Rendimiento 90, FCP 1,8 s,
LCP 3,1 s, TBT 0, CLS 0, **Speed Index 4,6 s**. Con 019: 95, FCP 1,2 s, LCP 2,9 s, SI 1,3 s. T07
mostró que dominan los scripts (sin JS, el LCP simulado baja a 2,6 s) y que el CSS principal
bloquea ~450 ms de FCP. Datos del build local:
- `29_1ix9xaos4m.js` (155 KB sin comprimir, ~700 ms de arranque en T07) contiene Radix
  DropdownMenu (popper/floating, focus-scope, dismissable-layer), importado solo por el botón
  flotante de WhatsApp (`whatsapp-button.tsx`), que no hace falta para el primer pintado.
- `0-ssspa2fpt11.js` (221 KB) es react-dom: no se puede recortar.

Alcance de la ronda:
8. El código de Radix del botón flotante de WhatsApp se descarga después de la hidratación, no en
   el arranque. El botón sigue en el HTML del servidor con el mismo aspecto, nombre accesible y
   posición. El menú conserva su comportamiento: clic, Enter, Esc, regreso del foco, roles
   `menu`/`menuitem` y sin bloquear el scroll.
9. El CSS se sirve en línea en el HTML (`experimental.inlineCss`, disponible en Next 16.2.12), sin
   la petición de hoja de estilos que bloquea el render.
10. Medir de nuevo en local y pedir al usuario 3 corridas de PSI en producción (se usa la mediana).

## Fuera de alcance
- Cambios de contenido, textos, dominio (`company-profile`) o diseño estático del hero.
- Cambiar la imagen hero.
- Variantes de `servicios.webp` (oculta en móvil con `hidden lg:block`, no se descarga),
  `footer.webp` (con `object-cover` a 340 px de alto se muestra ~1 020 px CSS de ancho en móvil;
  está al final de la página) y `proyectos.webp` (no aparece entre las peticiones previas al LCP).
- Fuentes: T07 mostró que la mono no influye en el LCP.
- Recortar `'use client'` de las secciones bajo el pliegue o reescribir sus animaciones: solo si la
  medición de la ronda 3 lo señala. (`inlineCss` y el JS diferido de Radix entraron en la ronda 3.)
- Reemplazar Radix por la API nativa `popover`: descartado en el plan.
- Dependencias nuevas (las variantes se generan con el sharp que ya trae Next, como en la spec 019).

## Criterios de aceptación
- [x] Elemento LCP local identificado y desglose anotado en `## Medición` (antes del cambio).
- [x] Ningún texto del hero (eyebrow, eslogan, subtítulo) usa `fade-in`; siguen con
  `motion-safe:animate-in` y su `slide-in-from-bottom-*`.
- [x] ~~Si aplica (alcance 3): primera palabra rotativa sin `animate-hero-letter`~~: no aplica
  (T04: el LCP es el subtítulo, no el eslogan).
- [x] La vista de la 404 no emite `<link rel="preload">` de su imagen, y ninguna respuesta 404
  lleva la cabecera `Link: rel=preload` de esa imagen (comprobado con `curl -I` en `pnpm start`).
  La imagen se carga en diferido en la 404. En `/es` compilada, la imagen de la 404 no aparece
  entre las peticiones de red. (Redactado de nuevo tras T07: con el criterio anterior, «prioridad
  alta y carga inmediata», la primera mitad fallaba en cualquier entorno. Lo corrige T09.)
- [x] Existe `public/ComoTrabajamos/como-trabajamos-640.webp` (640 px de ancho, WebP); la imagen
  de «Cómo trabajamos» la ofrece en `srcset` junto a la original, con `sizes` acorde a su ancho
  mostrado, y conserva `loading="lazy"`, `decoding="async"`, `alt=""` y `aria-hidden`.
- [x] Medición final anotada en `## Medición` con la lista de peticiones que empiezan antes del
  LCP (tipo, tamaño) comparada con T04.
- [x] Medición posterior anotada en `## Medición`: elemento LCP (debe ser texto del hero, no el
  logo del menú), tiempo y desglose comparados con T01, y lista de candidatos LCP que confirme o
  descarte la hipótesis (b).
- [x] Con `prefers-reduced-motion` no hay animación (se mantienen `motion-safe:`/`motion-reduce:`).
- [x] `src/app/[lang]/page.test.tsx` (hidratación) sigue en verde; `pnpm validate` en verde.
- [ ] Lighthouse móvil local tras el cambio: LCP simulado menor que los 3,7 s de T01.
  **No concluyente (dentro del ruido)**: T07 da 3,5–3,6 s, pero T04 ya dio 3 681 ms en la
  corrida 1 y la propia medición «Final» concluye que el LCP no cambió.
- [ ] Tras el deploy, PSI móvil de `/es` reporta LCP < 2,5 s y Rendimiento ≥ 95 (verificación
  manual del usuario: **mediana de 3 corridas**).
- [ ] Ronda 3: el HTML de `/es` sigue incluyendo el botón flotante de WhatsApp (mismo nombre
  accesible y clases de posición), y el chunk con Radix DropdownMenu no está entre los scripts
  iniciales: se pide después del LCP observado.
  **T12: parcial.** El botón está en el HTML y Radix no está entre los scripts iniciales, pero se
  pide al hidratar, a la vez que el LCP observado: en 2 de 4 corridas empieza 3–9 ms antes.
- [x] Ronda 3: el menú de WhatsApp conserva su comportamiento (pruebas de `whatsapp-button.test.tsx`
  y del botón flotante en `page.test.tsx` en verde, sin quitar ninguna aserción).
- [x] Ronda 3: si el botón provisional tenía el foco, al cargar el menú el foco pasa al botón real
  (no cae a `<body>`); si no lo tenía, el real no lo roba (T13).
- [x] Ronda 3: `next.config.mjs` activa `experimental.inlineCss`. `/es`, `/en`, la privacidad y la
  404 compiladas no piden hojas de estilo (`<link rel="stylesheet">`) y se ven igual.
- [ ] Ronda 3: `inlineCss` se mantiene solo si mejora FCP/LCP de forma clara (más allá del ruido)
  frente a su coste. Hallazgo de reviwer sobre T11: el CSS va dos veces en cada HTML (`<style>` y
  payload RSC); `es.html` pasa a 375 852 B (gzip 63 105 B, brotli 34–42 KB), cada `.rsc` también lo
  lleva y se pierde la caché de la hoja. T12 mide el peso con la compresión real de Vercel y
  FCP/LCP con y sin la opción; si no compensa, se revierte T11 en una tarea.
  **T12: no concluyente, decisión escalada a planner** (FCP −150 ms estable; LCP −233 ms dentro
  del ruido, con solo 2 corridas; coste en navegaciones siguientes no medido). Se decide tras T17,
  junto con T10. Falta medir el brotli real de Vercel tras el deploy.
- [x] Ronda 3: medición local anotada en `## Medición` («Ronda 3»), con la lista de scripts que
  empiezan antes del LCP y el Speed Index, comparada con T07.

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

### Después (T04, 2026-10-16, tras T02 `4013da8`)
- Mismo método que T01 (Lighthouse 12.8.2 CLI, móvil, throttling simulado, Chrome headless,
  `pnpm start -p 3123` → `http://localhost:3123/es`), dos corridas con `--save-assets`.
- Corrida 1: Rendimiento 89; FCP 1,4 s; **LCP 3,7 s**; TBT 10 ms; CLS 0.
  Corrida 2: Rendimiento 90; FCP 1,4 s; **LCP 3,5 s**; TBT 10 ms; CLS 0.
- **Elemento LCP: el subtítulo del hero** (ya no el logo del menú ni el eslogan):
  - Selector: `section#inicio > div.relative > div.lg:max-w-[55%] > p.text-lg` («Desde Costa Rica
    desarrollamos software a medida…», 364 × 117 px).
- Desglose (`largest-contentful-paint-element`, simulado):

  | Fase              | Corrida 1 | Corrida 2 | T01      |
  | ----------------- | --------- | --------- | -------- |
  | TTFB              | 453 ms    | 452 ms    | 457 ms   |
  | Retraso de carga  | 0 ms      | 0 ms      | 0 ms     |
  | Tiempo de carga   | 0 ms      | 0 ms      | 0 ms     |
  | Retraso de render | 3 228 ms  | 3 091 ms  | 3 280 ms |

  (`lcp-breakdown-insight`, traza sin simular: TTFB 4–6 ms, retraso de render ~104 ms; FCP y LCP
  observados iguales, 107–110 ms.)
- Candidatos `largest-contentful-paint` de la traza (iguales en ambas corridas, un solo candidato
  por tipo, todos a ~110 ms):
  - `largestContentfulPaint::Candidate` → texto, `P.text-lg` (subtítulo), tamaño 39 050.
  - `LargestTextPaint::Candidate` → el mismo subtítulo.
  - `LargestImagePaint::Candidate` → solo el icono del logo del menú (40 × 40, 1 600).
  - **Observado**: la imagen hero no aparece como candidata, aunque `hero-960.webp` se descarga a
    ~20 ms con prioridad alta y no tiene opacidad. **Deducido** (la traza no da el motivo): Chrome
    la excluye por cubrir todo el viewport. Hipótesis (b) consistente con lo observado.
  - El eslogan tampoco aparece como candidato. No se puede atribuir a la opacidad 0 de sus letras
    animadas: `LargestTextPaint` solo emite un candidato cuando supera al anterior, así que el
    eslogan pudo quedar fuera simplemente por ser más pequeño que el subtítulo.
- Comparación con T01: la causa (a) queda confirmada (el texto del hero ya cuenta como LCP), pero
  el **LCP simulado no baja** (3,5–3,7 s frente a 3,7 s) y sigue ≥ 2,5 s. El retraso de render
  simulado es casi el mismo: en la traza real el LCP ocurre a la vez que el FCP, así que el hueco
  de ~2,2 s entre FCP y LCP simulados lo genera la estimación de Lantern, no la animación.
- Conclusión para planner: el LCP **no** es el eslogan → T03 no se activa. Como el LCP sigue
  ≥ 2,5 s por otra causa, se replanifica con las alternativas de `plan.md`.

### Final (T07, 2026-10-16, tras T05 `4ffd6e6`, T06 `6deccf6` y T08 `3d037d8`)
- Mismo método que T04 (Lighthouse 12.8.2 CLI, móvil, throttling simulado, Chrome headless,
  `pnpm build && pnpm start -p 3123` → `http://localhost:3123/es`), dos corridas con
  `--save-assets`.
- Corrida 1: Rendimiento 90; FCP 1,4 s; **LCP 3,6 s** (3 552 ms); TBT 10 ms; CLS 0.
  Corrida 2: Rendimiento 90; FCP 1,4 s; **LCP 3,5 s** (3 544 ms); TBT 10 ms; CLS 0.
- Elemento LCP: el mismo subtítulo del hero
  (`section#inicio > div.relative > div.lg:max-w-[55%] > p.text-lg`, 364 × 117 px).
- Desglose (`largest-contentful-paint-element`, simulado):

  | Fase              | Corrida 1 | Corrida 2 | T04 (c2) |
  | ----------------- | --------- | --------- | -------- |
  | TTFB              | 454 ms    | 452 ms    | 452 ms   |
  | Retraso de carga  | 0 ms      | 0 ms      | 0 ms     |
  | Tiempo de carga   | 0 ms      | 0 ms      | 0 ms     |
  | Retraso de render | 3 098 ms  | 3 091 ms  | 3 091 ms |

  FCP y LCP observados iguales (112 / 108 ms).
- Peticiones que empiezan antes del LCP observado (`network-requests`, corrida 2, 108 ms;
  tamaño transferido):

  | Tipo        | T07                                                    | T04 (c2, 107 ms)      |
  | ----------- | ------------------------------------------------------ | --------------------- |
  | Documento   | `/es` 16,5 KB                                          | 16,4 KB               |
  | CSS         | 2 hojas, 23,3 KB (bloquean el render)                  | 23,3 KB               |
  | Fuentes     | 3, 84,3 KB (15,0 + 29,5 precargadas; 39,8 la mono)     | 84,3 KB               |
  | Imágenes    | `hero-960.webp` 57,4; logo 1,4; **`como-trabajamos-640.webp` 62,2** → 121,0 KB | 245,1 KB (con `como-trabajamos.webp` 186,4) |
  | Scripts     | 10 chunks, 204,2 KB + `/_vercel/insights/script.js` 0,5 | 204,2 KB              |
  | **Total**   | **449,3 KB**                                           | **573,3 KB**          |

  En la corrida 1 entra además `LOGOsolutionsPJM-192.png` (19,6 KB, tipo «Other», a 111 ms
  con LCP a 112 ms).
- **`como-trabajamos.webp` (186 KB) ya no aparece**: baja la variante de 640 (62 KB, a ~46 ms,
  aún por el margen de carga diferida de Chrome). −124 KB antes del LCP.
- **Imagen de la 404**: no está en el HTML ni en el payload RSC de `/es` (T05), y en ninguna
  corrida (ni en T04) arranca antes del LCP observado. Pero **sigue pidiéndose** en `/es` local a
  ~116–159 ms, con prioridad alta e iniciador «other». Causa observada: `@vercel/analytics` pide
  `/_vercel/insights/script.js`, que en `next start` local no existe; la 404 de Next responde con
  la cabecera `link: </404/404-raices-obsidiana.webp>; rel=preload; as="image";
  fetchpriority="high"` y Chrome la sigue. En Vercel ese script existe, así que en producción no
  debería ocurrir en `/es` (deducido, no medido).
- **La cabecera ya existía antes de T05** (observado en `t04-run2-0.devtoolslog.json`): en T04 la
  respuesta 404 de `/_vercel/insights/script.js` ya traía `link: </404/404-raices-obsidiana.webp>;
  rel=preload; as="image"` y la imagen se pedía con prioridad **Low**. Tras T05 la cabecera añade
  `fetchpriority="high"` y la petición pasa a **High**: T05 quitó la precarga del payload RSC,
  pero subió la prioridad de la precarga por cabecera. Por eso la primera mitad del criterio de la
  404 falla en cualquier entorno, y queda sin marcar hasta T09.
- **Deducido** (generalizado desde una sola respuesta 404 observada): cualquier respuesta 404, no
  solo la página, emitiría esa precarga por cabecera, porque todas las sirve la 404 global.
- **LCP simulado sin cambio** (3,5–3,6 s frente a 3,5–3,7 s en T04): quitar 124 KB de imagen no
  movió el LCP, así que las imágenes no estaban en el camino crítico de Lantern.
- **Qué domina lo que queda** (diagnóstico con `--blocked-url-patterns`, una corrida cada una,
  sin tocar código):

  | Bloqueado                       | FCP   | LCP   | Rendimiento |
  | ------------------------------- | ----- | ----- | ----------- |
  | Nada (referencia)               | 1,4 s | 3,5 s | 90          |
  | Todos los `*.js`                | 1,4 s | 2,6 s | 97          |
  | Fuente mono (39,8 KB)           | 1,2 s | 3,5 s | 91          |
  | CSS principal (21,8 KB)         | 1,1 s | 3,4 s | 92 (LCP pasa a la imagen hero) |

  **Dominan los scripts**: sin JS el LCP baja ~0,9 s. El chunk `29_1ix9xaos4m.js` (50 KB) cuesta
  ~700 ms de arranque y `0-ssspa2fpt11.js` (70 KB) ~250 ms (`bootup-time`, CPU ×4); trabajo del
  hilo principal 1,4 s. La fuente mono no influye en el LCP y el CSS influye en el FCP (~450 ms
  de bloqueo de render) pero apenas en el LCP. Aun sin JS, el LCP simulado (2,6 s) sigue por
  encima de 2,5 s.

### Ronda 3 (T12, 2026-10-16, en `fc98e3d`: T10, T11, T13–T16)
- Mismo método que T07 (Lighthouse 12.8.2 CLI, móvil, throttling simulado, Chrome headless,
  `pnpm build && pnpm start -p 3123` → `http://localhost:3123/es`), dos corridas con
  `--save-assets` por variante. `pnpm validate` verde en la revisión de `fc98e3d` (HEAD).
- Resultados (simulados; «sin `inlineCss`» = build local con `inlineCss: false`, sin commitear y
  restaurado después):

  | Variante                 | Rend. | FCP              | LCP              | SI    | TBT   | CLS |
  | ------------------------ | ----- | ---------------- | ---------------- | ----- | ----- | --- |
  | Con `inlineCss`, c1      | 90    | 1,2 s (1 212 ms) | 3,6 s (3 613 ms) | 1,2 s | 10 ms | 0   |
  | Con `inlineCss`, c2      | 91    | 1,2 s (1 206 ms) | 3,5 s (3 451 ms) | 1,2 s | 10 ms | 0   |
  | Sin `inlineCss`, c1      | 88    | 1,4 s (1 365 ms) | 3,8 s (3 847 ms) | 1,4 s | 10 ms | 0   |
  | Sin `inlineCss`, c2      | 89    | 1,4 s (1 362 ms) | 3,7 s (3 683 ms) | 1,4 s | 10 ms | 0   |
  | T07 (c1 / c2)            | 90    | 1,4 s            | 3,6 / 3,5 s      | 1,4 s | 10 ms | 0   |

- Elemento LCP: el mismo subtítulo del hero (`section#inicio > div.relative >
  div.lg:max-w-[55%] > p.text-lg`, 364 × 117 px) en las cuatro corridas. Desglose con
  `inlineCss`: TTFB 456 / 453 ms, retraso y tiempo de carga 0, **retraso de render 3 157 /
  2 999 ms**. FCP y LCP observados iguales (115 ms). **El LCP sigue ≥ 2,5 s.**
- Scripts y hojas de estilo que empiezan antes del LCP observado (corrida 2 con `inlineCss`,
  115 ms; tamaño transferido):

  | Tipo        | Ronda 3                                                      | T07 (c2)                       |
  | ----------- | ------------------------------------------------------------ | ------------------------------ |
  | Documento   | `/es` **62,9 KB** (CSS en línea, gzip)                       | 16,5 KB                        |
  | CSS         | **ninguna hoja**                                             | 2 hojas, 23,3 KB               |
  | Scripts     | 11 chunks, **182,1 KB**                                      | 10 chunks, 204,2 KB + insights 0,5 |
  | Fuentes     | 84,3 KB (sin cambio)                                         | 84,3 KB                        |
  | Imágenes    | 121,0 KB (sin cambio) + `LOGOsolutionsPJM-192.png` 19,6 KB   | 121,0 KB                       |
  | **Total**   | **469,9 KB** (494,6 en c1)                                   | 449,3 KB                       |

  Scripts: desaparece `29_1ix9xaos4m.js` (50,1 KB); entran `30ovs0h4fmpog.js` (18,2 KB) y
  `3n3zts851b2p1.js` (10,1 KB). Además, varios chunks cambiaron de hash respecto a T07 (no es «el
  resto, igual»): en T07 estaban `2s4zbrua0g06o` 7,8, `0mw67wy1375zi` 11,0, `2semfcofb2wsj` 6,4 y
  `turbopack-37ukxn4-07nwu`; en ronda 3, `0-ssspa2fpt11.js` 69,7, `07b01dw1b3skm.js` 38,3,
  `1dg2f_cnrzia-.js` 13,9, `2wd_t3ikai8ik.js` 10,9, `0zaqvpcaih_nz.js` 7,9, `15g5crpuo06-n.js` 6,5,
  `turbopack-*.js` 4,4, `3qy0shirk377_.js` 1,6 y `01kgg-fbm7ezm.js` 0,6. Total: −22 KB de JS antes
  del LCP. `/_vercel/insights/script.js`: con `inlineCss` arranca a 116,7 / 119,6 ms (después del
  LCP). Sin `inlineCss`, en c1 arranca a 108,3 ms, **antes** del LCP (112,6 ms).
- **Chunk de Radix** (`0p3d03n8blbsx.js`, 24,6 KB): no está entre los scripts iniciales del HTML,
  pero se pide justo al hidratar, que en la traza sin throttling coincide con el primer pintado:
  a 116 ms (LCP 115) en c2 con `inlineCss` y a 114 ms (LCP 114) sin ella, pero a **112 ms (LCP
  115)** en c1 con `inlineCss` y a **104 ms (LCP 113)** en c1 sin ella. **No se confirma** que
  arranque siempre después del LCP observado. Respecto al LCP: −2,3 y −8,1 ms antes en dos
  corridas, +0,5 y +0,7 ms después en las otras dos. En la práctica coincide con la hidratación.
- **Trabajo de arranque**: Radix fuera no bajó el hilo principal; subió. `bootup-time` atribuye
  880–912 ms a `30ovs0h4fmpog.js`, frente a 724 ms de `29_1ix9xaos4m.js` en T07. Hilo principal:
  1 675–1 692 ms con `inlineCss` y 1 626–1 640 ms sin ella, frente a ~1 386 ms en T07.
  **Observado**: sin `inlineCss`, el LCP de ronda 3 (3 682–3 847 ms) es 140–300 ms **peor** que el
  de T07 (3 543–3 552 ms) con el mismo FCP. Entre T07 y esta variante solo cambió T10 (menú
  diferido; T13–T16 son el traspaso de foco y pruebas). **Deducido, no demostrado**: T10 es causa
  candidata del aumento de arranque y del LCP (por ejemplo, el chunk del envoltorio y la carga
  diferida coinciden con la hidratación). `inlineCss` solo devuelve el LCP al nivel de T07. Se
  aísla en T17.
- **Speed Index (hipótesis del SI de 4,6 s en PSI)**: en local el SI es 1,2 s con `inlineCss` y
  1,4 s sin ella (T07: 1,4 s); **no se reproduce**. Tira de `screenshot-thumbnails` (tiempos
  observados 375–3 000 ms, cada 375 ms): el primer fotograma ya muestra el hero con estilos,
  imagen y texto. Hasta ~2,46 s solo cambian detalles: las letras de la palabra rotativa
  («tu» → «tu negocio») y el deslizamiento del eyebrow. Los fotogramas de 2 625 y 3 000 ms son
  idénticos (mismo hash) y `final-screenshot` y `observedLastVisualChange` caen en 2 456–2 462 ms
  (T07: 2 448–2 470 ms). Las animaciones continuas (pétalos, partículas, brillo) no hacen que la
  tira siga cambiando después de ~2,5 s. El SI de 4,6 s de producción no se explica con esta
  medición. Queda pendiente la mediana de 3 corridas de PSI.
- **Decisión sobre `inlineCss` (T11)**:
  - Peso del HTML de `/es`: con `inlineCss`, 375 852 B sin comprimir, gzip de `next start`
    63 943 B. Brotli 46 828 (q4), 42 098 (q5) y 34 080 B (q11), **calculado fuera de la
    medición** (`next start` no sirvió brotli; no verificable hasta el deploy). Sin `inlineCss`: 98 566 B, gzip
    16 375 B, más 23,3 KB de hojas cacheables. Producción hoy (sin T11): `curl -H
    'Accept-Encoding: br' https://solutionspjm.com/es` → `content-encoding: br`, 15 254 B
    transferidos (98 069 B descomprimido), 2 hojas `rel="stylesheet"`. Con brotli, el HTML
    crece de 19 a 32 KB (q11 a q4), y se ahorran las dos hojas (23,3 KB con gzip, algo menos con
    brotli). El coste neto en la primera visita queda entre −4 y +9 KB, según la calidad de
    brotli de Vercel, que solo se mide tras el deploy. En cada
    navegación siguiente cuesta más, porque el CSS va en cada HTML y en cada `.rsc` sin caché.
  - FCP: −150 ms con `inlineCss` (1 206–1 212 frente a 1 362–1 365 ms), estable entre corridas
    (±6 ms). LCP: −230 ms de media (3 451–3 613 frente a 3 683–3 847 ms). Los rangos no se solapan,
    pero la variación entre corridas de una misma variante (~160 ms) es del mismo orden.
    Rendimiento 90–91 frente a 88–89.
  - Aplicando la regla (se mantiene solo si FCP/LCP mejoran de forma clara, más allá del ruido,
    frente a su coste): **no concluyente, decisión escalada a planner** (hallazgo bloqueante de
    reviwer sobre `b1df782`). La mejora del FCP es clara y repetible. La del LCP (−233 ms de media)
    está en el ruido: dispersión de ~162 ms por variante, solo 2 corridas y ~70 ms entre rangos. El
    coste en navegaciones siguientes (CSS en cada `.rsc`, sin caché) no se midió. Planner decide
    tras T17.
- Comprobación visual con `inlineCss` (Chrome headless, captura de `/es` y de `/es/no-existe`,
  404): ambas se ven con estilos (hero con imagen, tipografías y botón; 404 con imagen, título y
  botón). Las capturas se tomaron con ventana de escritorio estrecha, así que el texto se corta
  por el ancho mínimo de la ventana headless, no por el CSS. La tira de Lighthouse, con
  emulación móvil, muestra `/es` completa y con estilos. `/es/no-existe`: 0 `<link
  rel="stylesheet">` y 1 `<style>`.
- Puerto 3123 liberado; `next.config.mjs` restaurado (`git status` limpio salvo estos docs).

## Dudas
- **Por qué el span del menú ganaba el LCP**: resuelta en T04. (a) confirmada: sin `fade-in`, el
  subtítulo pasa a ser el LCP. (b) observada (la imagen hero no es candidata) con mecanismo
  deducido (ver `## Problema`).
- **Riesgo de que el LCP simulado baje poco**: se materializó en T04. Esta replanificación ataca
  las peticiones previas al LCP que cuenta Lantern.
- **Primera palabra del eslogan sin blur**: ya no aplica (T03 descartada).
- **JetBrains Mono en el eyebrow del hero**: la fuente de 40 KB se pide antes del LCP porque el
  eyebrow, que está arriba del pliegue, usa `font-mono`. Cambiar su tipografía altera el diseño
  aprobado: no se toca salvo que la medición final la señale como causa principal, y en ese caso
  se consulta al usuario.
- **Speed Index de 4,6 s en producción** (antes 1,3 s). Hipótesis, sin verificar: el fotograma
  final que toma Lighthouse cae en medio de animaciones continuas del hero (palabra rotativa del
  eslogan, pétalos, brillo, partículas), así que la progresión visual tarda en «completarse».
  Contra la hipótesis: esas animaciones ya existían con 019. Es una sola corrida, así que puede ser
  ruido. La ronda 3 lo mide en local (SI y tira de fotogramas) y con la mediana de 3 corridas de
  PSI. Si se confirma, se planifica aparte: tocar las animaciones cambia el diseño aprobado y se
  consulta al usuario.
- **Botón de WhatsApp antes de cargar el menú** (ronda 3): entre el primer pintado y la carga del
  chunk diferido (justo después de la hidratación), el botón se ve pero un toque no abre el menú.
  Se asume aceptable porque la ventana es breve y WhatsApp también está en el hero, el CTA, la
  sección de contacto y el footer. A confirmar por el usuario. **Foco**: al llegar el chunk, React
  cambia el botón provisional por el real; si el usuario ya lo había enfocado con Tab, el foco caía
  a `<body>` (hallazgo de reviwer sobre T10). Se corrige en T13: el foco pasa al botón real, y si el
  provisional no tenía el foco, el real no lo toma.
