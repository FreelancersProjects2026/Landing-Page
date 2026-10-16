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
- [ ] Ronda 3: el menú de WhatsApp conserva su comportamiento (pruebas de `whatsapp-button.test.tsx`
  y del botón flotante en `page.test.tsx` en verde, sin quitar ninguna aserción).
- [ ] Ronda 3: `next.config.mjs` activa `experimental.inlineCss`. `/es`, `/en`, la privacidad y la
  404 compiladas no piden hojas de estilo (`<link rel="stylesheet">`) y se ven igual.
- [ ] Ronda 3: medición local anotada en `## Medición` («Ronda 3»), con la lista de scripts que
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
  sección de contacto y el footer. A confirmar por el usuario.
