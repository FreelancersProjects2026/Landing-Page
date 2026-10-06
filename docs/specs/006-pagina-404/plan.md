# Plan técnico: Página 404

## Referencias
- Especificación: `docs/specs/006-pagina-404/spec.md`.
- Next 16: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`.

## Enfoque
El layout raíz es `app/[lang]/layout.tsx` (segmento dinámico con `dynamicParams = false`), así que
se combinan dos convenciones de Next:

- **Por idioma:** `app/[lang]/[...rest]/page.tsx` captura `/es/<algo>` y `/en/<algo>` y llama a
  `notFound()`; lo renderiza `app/[lang]/not-found.tsx` dentro del layout del idioma.
- **Global:** `app/global-not-found.tsx` (flag `experimental.globalNotFound`) atiende lo que no
  coincide con ninguna ruta (`/fr`). Devuelve su propio `<html>`/`<body>`, importa
  `globals.css` y las fuentes.

`not-found.tsx` no recibe `params`. Por eso el servidor pasa los textos de **ambos** idiomas y un
componente cliente mínimo elige con `useParams().lang` (si no es `es`/`en`, usa `defaultLocale`).
Así el cliente no importa el módulo `company-profile`.

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
| `components/not-found/localized-not-found.tsx` | Nuevo | Cliente: elige textos por `useParams().lang` y monta la vista. |
| `app/fonts.ts` | Nuevo | Fuentes compartidas. |
| `app/[lang]/[...rest]/page.tsx` | Nuevo | `notFound()`. |
| `app/[lang]/not-found.tsx` | Nuevo | Arma textos de `locales` y monta `LocalizedNotFound`. |
| `app/global-not-found.tsx` | Nuevo | Documento completo en `es`, metadata, monta `NotFoundView`. |
| `app/globals.css` | Ampliar | `@property --glow-angle`, keyframes y utilidades del botón. |
| `next.config.mjs` | Ampliar | `experimental: { globalNotFound: true }`. |

## Pruebas
- Dominio: `validateLandingContent` rechaza un `notFound` con algún campo vacío.
- Infraestructura: `es` y `en` traen `notFound` completo.
- `not-found-view`: `h1` con el título, `img` con `alt`, enlace con `href` recibido y nombre
  accesible del botón.
- `localized-not-found`: con `lang = 'en'` muestra inglés y `/en`; con `lang = 'fr'` o sin
  `lang`, español y `/es` (mock de `useParams`).
- `[...rest]/page`: llama a `notFound()`.
- `next.config`: incluye `experimental.globalNotFound`.
- `globals.css`: la prueba existente sigue en verde con las utilidades nuevas.

## Riesgos
- `globalNotFound` es experimental en Next 16.2: verificar con `pnpm build && pnpm start` que
  `/fr` usa la global y `/es/xyz` la localizada, ambas con 404.
- `dynamicParams = false` del layout podría afectar al catch-all: validar en build el código y la
  vista de `/es/xyz`.
