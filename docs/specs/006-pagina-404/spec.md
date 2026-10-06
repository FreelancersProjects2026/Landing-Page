# Spec 006: Página 404

## Problema
Una URL que no existe (`/es/xyz`, `/en/abc`, `/fr`) muestra la 404 genérica de Next: en inglés,
sin la marca y sin una salida clara hacia la landing. El cliente que llega por un enlace roto
se va del sitio.

## Solución
Una página 404 propia con la imagen `public/404/404 entre raíces y obsidiana luminosa.png`
(«404» de piedra con raíces, flores y brillos ámbar y magenta), un título corto, un texto breve
y **un solo botón** «Volver al inicio» con los colores y brillos de la imagen.

## Objetivo
Que quien llegue a una URL inexistente entienda qué pasó y vuelva a la landing en un clic.

## Alcance
1. **404 por idioma:** `/es/<cualquier-ruta>` muestra la 404 en español y su botón lleva a `/es`;
   `/en/<cualquier-ruta>` en inglés y lleva a `/en`.
2. **404 global:** cualquier otra URL que no empiece con un idioma válido (`/fr`, `/xyz`) muestra
   la 404 en español y lleva a `/es`.
3. **Código HTTP 404** y `noindex` (Next lo agrega solo) en ambos casos.
4. **Imagen** de `public/404/` optimizada para web, como pieza central de la página.
5. **Botón «Volver al inicio»:** píldora oscura (obsidiana) con borde degradado ámbar → magenta →
   rosa flor, brillo exterior y destello al pasar el cursor; texto claro de alto contraste.
6. **Contenido** (título, texto, botón y `alt` de la imagen) en el módulo `company-profile`, en
   `es` y `en`, validado al cargarse.

## Fuera de alcance
- Páginas para otros errores (500, `error.tsx`, `global-error.tsx`).
- Buscador, sugerencias de páginas o enlaces a secciones.
- Botón de WhatsApp en la 404.
- Analítica o registro de URLs rotas.
- Dependencias nuevas (GSAP u otras): las animaciones son CSS.

## Reglas del negocio
- La 404 respeta el idioma de la URL cuando es `es` o `en`; si no hay idioma válido, español.
  Confirmado por el negocio (2026-10-06).
- Un solo botón, que lleva al inicio del idioma activo.

## Textos (pendientes de aprobación)
Marcadores hasta que el negocio los apruebe:

| Campo | `es` | `en` |
|-------|------|------|
| Título | Esta página se perdió entre las raíces | This page got lost among the roots |
| Texto | El enlace que seguiste no existe o cambió de lugar. Volvamos al camino. | The link you followed doesn't exist or has moved. Let's get you back on the path. |
| Botón | Volver al inicio | Back to home |
| `alt` imagen | Error 404: la página no existe | Error 404: page not found |

## Dudas abiertas
- Aprobación de los textos de la tabla.
- La 404 por idioma hereda `canonical` y `alternates` del layout `[lang]`; con `noindex` no
  afecta a Google. ¿Se acepta así?

## Criterios de aceptación
- `/es/xyz` y `/en/xyz` responden 404 con textos y enlace de su idioma.
- `/fr` y `/xyz` responden 404 en español con enlace a `/es`.
- El botón se usa con teclado (foco visible) y su texto cumple contraste AA sobre su fondo.
- Con `prefers-reduced-motion: reduce` no hay animaciones continuas.
- Móvil (390 px) y escritorio (1440 px): título en 2 líneas como máximo, sin scroll horizontal,
  imagen y botón visibles sin desplazarse en escritorio.
- `pnpm validate` en verde.
