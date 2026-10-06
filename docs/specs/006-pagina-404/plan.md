# Plan técnico: Página 404

## Referencias
- Especificación: `docs/specs/006-pagina-404/spec.md`.
- Next 16: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`.

## Enfoque
El layout raíz es `app/[lang]/layout.tsx` (segmento dinámico con `dynamicParams = false`). Una sola
página atiende **toda** URL que no coincide con una ruta (`/fr`, `/xyz`, `/es/xyz`, `/en/a/b`):
`app/global-not-found.tsx` (flag `experimental.globalNotFound`). Devuelve su propio
`<html>`/`<body>`, importa `globals.css`, las fuentes y los íconos.

`global-not-found` no recibe `params` y `headers()` no trae la ruta. Por eso el servidor pasa los
textos de **ambos** idiomas y un componente cliente mínimo elige por el primer segmento de
`usePathname()` (si no es `es`/`en`, usa `defaultLocale`). `usePathname()` devuelve la ruta real
también en el SSR, así que el HTML sale ya en el idioma de la URL, sin parpadeo. Para eso la
página llama a `await connection()`: si se prerenderiza, el SSR no ve la ruta real. El cliente
no importa el módulo `company-profile` (solo sus tipos).

**Limitación conocida:** `<html lang>` y el `<title>` quedan en el idioma por defecto (`es`)
también en `/en/xyz`; el contenido visible sí sale en inglés y el `<main>` declara su `lang`
(WCAG 3.1.2), así que los lectores de pantalla lo leen en inglés. Con `noindex` no afecta a
Google.

Las fuentes se declaran una sola vez en `app/fonts.ts` y las usan `[lang]/layout.tsx` y
`global-not-found.tsx`.

Sin dependencias nuevas: la entrada usa `tw-animate-css` (ya instalado) y el botón, CSS propio en
`globals.css` (`@property --glow-angle` + `@keyframes`), todo bajo `motion-safe`.

## Diseño
- **Composición «cinematic center»:** fondo negro puro (la imagen es negra y se funde), imagen
  centrada `max-w-6xl` arriba, título + texto + botón centrados debajo; viñeta radial oscura en
  los bordes y un halo ámbar/magenta muy tenue detrás del botón.
- **Título:** `font-display`, `max-w-4xl`, `text-[clamp(2rem,4vw,3.5rem)]`, 2 líneas como máximo.
  Texto en `text-white/70`, `max-w-xl`.
- **Entrada:** imagen `fade-in zoom-in-95` (700 ms); texto y botón `fade-in slide-in-from-bottom-4`
  con retraso escalonado.
- **Botón «obsidiana luminosa»** (`<Link>` con apariencia de píldora, `h-14 px-8 rounded-full`):
  - Borde 1 px con `conic-gradient(from var(--glow-angle), #f5a524, #e0329a, #f9a8c9, #f5a524)`
    que gira lento (8 s) con `motion-safe`; estático con movimiento reducido.
  - Interior obsidiana `#0b0708` con leve degradado; texto crema `#fde7c4` (contraste AA).
  - Brillo: `box-shadow` ámbar + magenta; en hover/focus se intensifica, sube 2 px y cruza un
    destello diagonal; el ícono `ArrowLeft` (lucide) se desplaza.
  - Foco visible: anillo ámbar con offset sobre negro.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `public/404/404-raices-obsidiana.webp` | Nuevo | Imagen convertida (≤ 250 KB) con nombre ASCII. |
| `modules/company-profile/domain/landingContent.ts` | Ampliar | `NotFoundContent { title, text, cta, imageAlt }` en `LandingContent.notFound`; validación: campos no vacíos. |
| `modules/company-profile/infrastructure/landingContentSource.ts` | Ampliar | Textos `es` y `en` de la spec. |
| `modules/company-profile/index.ts` | Actualizar | Exporta el tipo `NotFoundContent`. |
| `components/not-found/not-found-view.tsx` | Nuevo | Vista visual: recibe textos, `homeHref` e imagen por props. Sin reglas. |
| `components/not-found/localized-not-found.tsx` | Nuevo | Cliente: elige textos por el primer segmento de `usePathname()` y monta la vista. |
| `components/not-found/not-found-image.ts` | Nuevo | Ruta de la imagen. |
| `app/fonts.ts` | Nuevo | Fuentes compartidas. |
| `app/icons.ts` | Nuevo | Íconos compartidos (layout y 404 global). |
| `app/global-not-found.tsx` | Nuevo | Documento completo, `connection()`, metadata e íconos; arma textos de `locales` y monta `LocalizedNotFound`. |
| `app/globals.css` | Ampliar | `@property --glow-angle`, keyframes y utilidades del botón. |
| `next.config.mjs` | Ampliar | `experimental: { globalNotFound: true }`. |

## Pruebas
- Dominio: `validateLandingContent` rechaza un `notFound` con algún campo vacío.
- Infraestructura: `es` y `en` traen `notFound` completo.
- `not-found-view`: `h1` con el título, `img` con `alt`, enlace con `href` recibido y nombre
  accesible del botón.
- `localized-not-found`: `/en/xyz` muestra inglés y `/en`; `/es/xyz`, `/fr`, `/xyz`, `/fr/abc`,
  `/` o sin ruta, español y `/es` (mock de `usePathname`).
- `global-not-found`: llama a `connection()`; por ruta, h1, `alt` y enlace del idioma.
- `next.config`: incluye `experimental.globalNotFound`.
- `globals.css`: la prueba existente sigue en verde con las utilidades nuevas.

## Riesgos
- `globalNotFound` es experimental en Next 16.2: verificado en build (T11).
- **Descartado: 404 dentro del layout `[lang]`** (`[lang]/[...rest]/page.tsx` + `[lang]/not-found.tsx`).
  Con `dynamicParams = false`, cada `/es/xyz` registraba `NoFallbackError` y el SSR salía como
  `<html id="__next_error__">` vacío: el contenido solo aparecía con JS. Quitar `dynamicParams` y
  validar con `isLocale` + `notFound()` (opción A) no lo arregló: incluso un `not-found.tsx`
  trivial sale vacío bajo el layout raíz dinámico, y además `/fr` dejaba de usar la global.
- Con `dynamicParams = false`, Next sigue registrando `NoFallbackError` en el log para
  `/es/xyz` antes de servir la global; la respuesta (404 y HTML) es correcta.
- Sin `connection()` la global se prerenderiza y el SSR de `/en/xyz` sale en español (y no
  coincide con el cliente al hidratar).
