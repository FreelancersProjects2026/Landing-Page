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

### Replanificación tras T04
T04 confirmó (a) y observó (b) (la imagen hero no es candidata; el mecanismo es deducido), pero el LCP simulado sigue en 3,5–3,7 s porque Lantern suma las
peticiones que empiezan antes del LCP observado (~110 ms). Se atacan por impacto y esfuerzo:

1. **Imagen de la 404 precargada en la landing (bug, 102 KB)**: `NotFoundView` usa `<Image
   preload>`. El árbol de la 404 global viaja en el payload RSC, así que React emite la precarga
   al hidratar cualquier página. Se cambia `preload` por `fetchPriority="high"` con carga
   inmediata (`loading="eager"`): en la 404 la imagen sigue llegando con prioridad alta, pero ya
   no se emite `<link rel=preload>` en ninguna página. Descartado: dejar la 404 con carga
   diferida (está arriba del pliegue allí).
2. **`como-trabajamos.webp` (186 KB) pedida antes del LCP**: se genera una variante de 640 px de
   ancho (`como-trabajamos-640.webp`) con el sharp que ya trae Next, mediante un script de un solo
   uso fuera del repo (como el logo WebP de la spec 019), y se sirve con `srcset` (640w y la
   original 1212w) y `sizes` según el ancho **pintado**: debajo de `lg` el contenedor mide 320 px
   de alto y `object-contain` con proporción 1212/1298 limita la imagen a ~299 px de ancho
   (`300px`), no al ancho del contenedor; en `lg` es una de dos columnas, con el `object-contain`
   a 640 px de alto limitándola a ~600 px. Así, en móviles con DPR hasta 2 el navegador elige la
   de 640. (Corregido en T08: T06 usó `calc(100vw - 48px)`, el ancho del contenedor.) Descartado: bajar la calidad de la original (empeora escritorio).
3. **Medir de nuevo** (como T04) y anotar la lista de peticiones previas al LCP (tipo y tamaño).
   Con eso planner decide si sigue alguna de las alternativas de abajo o un recorte del JS de las
   secciones bajo el pliegue (`'use client'` en cta, services, how-it-works, projects, team y
   whatsapp-button). Ese recorte no se planifica aún: `next/dynamic` con SSR no evita descargar
   el chunk para hidratar, y quitar `'use client'` implica rehacer las animaciones de entrada
   (`useInView`); solo vale la pena si la medición muestra que los scripts dominan.

### Corrección tras T07: cabecera `Link` de la 404 (T09)
**Qué la emite.** Es el mismo mecanismo que en la spec 019. React 19, al renderizar en el
servidor, registra una precarga para todo `<img>` que no sea `loading="lazy"`: `next/image` con
`images.unoptimized` acaba en un `<img>` normal. Next pasa a React un callback de cabeceras y
convierte esas precargas en la cabecera HTTP `Link: <…>; rel=preload; as="image"`. La 404 global
(`global-not-found.tsx` → `LocalizedNotFound` → `NotFoundView`) se renderiza en cada respuesta
404, incluso en las de subrecursos como `/_vercel/insights/script.js`, así que toda 404 lleva la
cabecera.
- Antes de T05, la cabecera ya existía sin `fetchpriority`: la imagen era eager por `preload`, y
  Chrome la pedía con prioridad Low.
- T05 la dejó eager con `fetchPriority="high"`: la cabecera añade `fetchpriority="high"` y la
  petición sube a High.

**Cambio mínimo elegido.** Cargar la imagen de la 404 en diferido: `loading="lazy"`, sin
`fetchPriority`. React no registra precargas para imágenes diferidas, así que desaparece la
cabecera en cualquier respuesta 404. En la página 404 la imagen está arriba del pliegue: Chrome
la pide igualmente en cuanto calcula el layout, con un retraso pequeño que se acepta porque la 404
no es una página de conversión y no se mide su LCP. El criterio de la spec cambia de «prioridad
alta y carga inmediata» a «sin precarga en ninguna respuesta 404».

Descartadas:
- Reemplazar `next/image` por un `<img>` simple: React precarga igual cualquier `<img>` eager, así
  que no cambia nada.
- Solo quitar `fetchPriority`: vuelve a la cabecera de prioridad Low que existía antes de T05.
- `fetchPriority="low"`: dependería de un detalle interno de React menos claro que `lazy`.
- Tocar `next.config.mjs` o un middleware para quitar cabeceras: es más código y global.

### Ronda 3: JS de Radix y CSS en línea (T10–T12)
**T10, Radix fuera del arranque** (**revertido tras T17**, ver más abajo). Opción elegida: `next/dynamic` con `ssr: false` y un fallback
estático.
- Un envoltorio cliente nuevo (`whatsapp-button-lazy.tsx`) carga `WhatsAppButton` en diferido.
  `ssr: false` no se permite en Server Components, por eso hace falta el envoltorio: `page.tsx`
  es Server Component y pasa a importar el envoltorio.
- Mientras carga, `loading` pinta el mismo botón visual sin Radix: mismo `aria-label`, clases de
  posición y el ícono `MessageCircle`. Next renderiza ese `loading` en el servidor, así que el
  HTML conserva el botón y el layout no cambia.
- Para no duplicar el marcado, el botón (trigger) se extrae a un componente propio que reciben
  tanto el fallback como `DropdownMenuTrigger asChild`. Ese componente reenvía al `<button>` las
  props y la ref que inyecta Radix (`aria-expanded`, `data-state`, manejadores).
- El chunk de Radix se pide al montar el envoltorio en el cliente, después de la hidratación, así
  que queda fuera de la ventana previa al LCP que cuenta Lantern.

Descartadas:
- API nativa `popover`: no da semántica de menú (roles `menu`/`menuitem`, flechas) sin escribirla
  a mano, jsdom no implementa la API Popover (las pruebas de teclado y Esc quedarían sin cubrir), y
  posicionar respecto al botón requiere CSS anchor positioning, que no es universal.
- `next/dynamic` sin `ssr: false`: el chunk se sigue cargando para hidratar, sin ganancia.
- Cargar Radix solo al primer toque: más estado y manejo de foco para una ventana que ya es breve.

`page.test.tsx` comprueba el botón en el primer render (lo cubre el fallback) y abre el menú. Si
el clic llega antes de que cargue el componente diferido, la prueba puede esperar al botón real
(por ejemplo con `findBy…` hasta que tenga `aria-haspopup="menu"`), pero no se quita ninguna
aserción ni se toca la prueba de hidratación. Si la hidratación falla con el fallback, coder para
y lo reporta.

**T11, CSS en línea.** `experimental.inlineCss: true` en `next.config.mjs` (existe en Next
16.2.12, `config-shared`). Next inyecta el CSS como `<style>` en el HTML de producción en lugar de
`<link rel="stylesheet">`, y elimina la petición que bloquea el render (~450 ms de FCP en T07).
Coste previsto: ~23 KB de CSS sin caché entre páginas. **Corregido tras T11** (reviwer): el CSS
(136 825 B) va dos veces en cada HTML, en `<style>` y en el payload RSC, y también en cada `.rsc`
de navegación. Con gzip, el HTML de `/es` crece ~45 KB; con brotli alto la copia sale casi gratis.
Por eso T12 mide el peso con la compresión real de Vercel y FCP/LCP con y sin `inlineCss`; si no
hay una mejora clara, se revierte T11 en una tarea. Se verifica que la 404 global y la privacidad siguen con
estilos. No requiere ADR: es una opción de configuración reversible, no un cambio de arquitectura.

**T12, medición.** Igual que T07 (dos corridas locales, `--save-assets`). Se anotan LCP, FCP, SI y
la lista de scripts que empiezan antes del LCP observado, para confirmar que el chunk de Radix ya
no está ahí y que no se piden hojas de estilo. También se mira la tira de fotogramas para la
hipótesis del Speed Index (animaciones del hero). Después se pide al usuario que corra **PSI móvil
3 veces** en producción tras el deploy y anote la **mediana**: una sola corrida tiene ±0,5 s de
ruido.

### Tras T17: se revierte T10, se mantiene `inlineCss` (T18–T20)
Decisión del usuario (ver `spec.md`, «Decisión del usuario tras T17»). La reversión deja el botón
flotante exactamente como antes de T10 (`910caa8`), sin conservar piezas de T10:
- **Qué se quita.** El envoltorio diferido y su prueba (T10, T13–T16) y el componente
  `whatsapp-trigger.tsx`. Ese componente solo existía para compartir el marcado entre el fallback
  y el trigger de Radix; sin fallback le queda un único consumidor y el contexto de foco de T13
  queda muerto (YAGNI). `whatsapp-button.tsx` vuelve a tener el `<button>` dentro de
  `DropdownMenuTrigger asChild`, como en `910caa8`.
- **Qué se conserva.** `inlineCss` (T11) y su prueba. Las pruebas de `whatsapp-button.test.tsx` no
  cambian. `page.test.tsx` deja de esperar al botón real: sin la precarga en `beforeAll` y sin
  `findByRole`; el botón con `aria-expanded="false"` está en el primer render.
- **Orden.** Primero `page.tsx` y la eliminación del envoltorio (T18), porque el envoltorio importa
  el trigger. Después la vuelta del marcado a `whatsapp-button.tsx` (T19), un refactor sin cambio de
  comportamiento. No se repite Lighthouse local: B en T17 ya midió la página sin la carga diferida.
- **Cierre (T20, usuario).** PSI móvil de `/es` en producción, 3 corridas, mediana, y el brotli
  real del HTML con `inlineCss`.

Descartada: conservar `whatsapp-trigger.tsx` como componente aparte. Con un solo consumidor no
aporta y deja un archivo más que mantener.

Alternativas (no son tareas; solo si la medición final las señala):
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
| `docs/specs/020-lcp-render-hero/spec.md` | Docs | Sección `## Medición` (T01, T04 y T07). |
| `src/components/not-found/not-found-view.tsx` | UI | Imagen de la 404 en diferido, sin precarga (T05, corregido en T09). |
| `src/components/not-found/not-found-view.test.tsx` | Prueba | Sin `<link rel=preload>`; imagen `loading="lazy"`, sin `fetchpriority` (T09). |
| `public/ComoTrabajamos/como-trabajamos-640.webp` | Recurso estático | Variante de 640 px (nueva). |
| `src/components/landing/how-it-works-section.tsx` | UI (landing) | `srcset`/`sizes` de la imagen. |
| `src/components/landing/landing-images.test.ts` | Prueba | La variante existe, es WebP y mide 640 px. |
| ~~`src/components/landing/whatsapp-trigger.tsx`~~ | UI (landing) | Creado en T10; se elimina en T19. |
| `src/components/landing/whatsapp-button.tsx` | UI (landing) | Vuelve a su versión anterior a T10 (`910caa8`), T19. |
| ~~`src/components/landing/whatsapp-button-lazy.tsx`~~ | UI (landing) | Creado en T10; se elimina en T18. |
| ~~`src/components/landing/whatsapp-button-lazy.test.tsx`~~ | Prueba | Creada en T10; se elimina en T18. |
| `src/app/[lang]/page.tsx` | App | Vuelve a importar `WhatsAppButton` directo, T18. |
| `src/app/[lang]/page.test.tsx` | Prueba | El botón que abre el menú está en el primer render, sin esperas, T18. |
| `next.config.mjs`, `next.config.test.ts` | Config | `experimental.inlineCss: true` y su prueba, T11. |
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
- `not-found-view.test.tsx` (RTL): al renderizar `NotFoundView` no aparece ningún
  `link[rel="preload"]` de imagen en el documento, y la imagen tiene `fetchpriority="high"` y no
  tiene `loading="lazy"`. Las pruebas de `global-not-found.test.tsx` siguen en verde.
- `landing-images.test.ts`: `public/ComoTrabajamos/como-trabajamos-640.webp` existe, es WebP, mide
  640 px de ancho (sharp) y pesa menos que la original.
- `landing-sections.test.tsx` (RTL): la imagen de «Cómo trabajamos» ofrece en `srcset` la variante
  `-640.webp` y la original, tiene `sizes` y conserva `loading="lazy"`.
- ~~`whatsapp-button-lazy.test.tsx`~~: se elimina con T10 (T18). En su lugar, `page.test.tsx`
  encuentra en el primer render, sin esperar, el botón flotante con su nombre accesible y
  `aria-expanded="false"`, y un clic abre el menú (falla mientras `page.tsx` use el envoltorio).
  Las pruebas de `whatsapp-button.test.tsx` siguen en verde sin cambios de aserciones.
- `next.config.test.ts`: `experimental.inlineCss` es `true`; las pruebas existentes siguen.
- Manual: Lighthouse móvil local antes (T01), después (T04), final (T07) y ronda 3 (T12); PSI de
  producción tras el deploy (mediana de 3 corridas).
