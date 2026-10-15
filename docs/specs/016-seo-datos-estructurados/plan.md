# Plan técnico: SEO con datos estructurados completos, Instagram e imagen OpenGraph

## Referencias
- Especificación: `docs/specs/016-seo-datos-estructurados/spec.md`.
- Precedentes: `docs/specs/004-indexarSearchConsole/` (siteUrl, canonical, JSON-LD),
  `docs/specs/008-faq/` (FAQPage), `docs/specs/011-variante-marca/` (`alternateName`).
- Dominio: `src/modules/company-profile/domain/landingContent.ts` (`Contact`,
  `validateLandingContent`, `ExternalLink`).
- Datos: `src/modules/company-profile/infrastructure/landingContentSource.ts` (`company`, `siteUrl`).
- JSON-LD: `src/app/[lang]/structured-data.ts` y su prueba.
- Footer: `src/components/landing/footer-section.tsx` (ya recibe `company`), `external-link.ts`.
- Metadata: `src/app/[lang]/layout.tsx` (OpenGraph de texto; no cambia).

## Enfoque
- **Bounded context**: `company-profile`. Logo, perfiles sociales y horario son datos públicos de
  la empresa, así que se agregan a `Contact`. `src/app` solo los traduce a schema.org y a la
  imagen OG.
- **Reutilizar**: `ExternalLink` (etiqueta y URL) para el perfil social; la regla «URL https» que
  ya valida los enlaces de proyectos se extiende a los perfiles sociales; `externalLinkProps` para
  el enlace del footer; `collectTexts` ya rechaza textos vacíos en los campos nuevos.
- **Sin cambios en `page.tsx` ni en `layout.tsx`**: el footer ya recibe `company`, y Next agrega
  `og:image` por convención de archivo (`opengraph-image.tsx` en `src/app/[lang]/`), prerenderizado
  por idioma con el `generateStaticParams` del layout.
- **Sin dependencias nuevas**: `next/og` viene con `next`.
- Descartado: una entidad `SocialProfile` propia (no aporta sobre `ExternalLink`); el ícono de
  Instagram de `lucide-react` (sus íconos de marca están obsoletos; el footer usa texto y la
  flecha `ArrowUpRight`, como WhatsApp); `alt` distinto por idioma (un `alt` fijo con el nombre de
  la empresa basta).

## Diseño (DDD)
### Domain (`domain/landingContent.ts`)
- Value object `OpeningHours`: lista de días (`DayOfWeek`, con los nombres en inglés de
  schema.org para mapear sin traducción), hora de apertura y hora de cierre en formato HH:MM.
- `Contact` suma tres datos: `logo` (ruta pública del logo, empieza con barra; la URL absoluta se
  arma con `siteUrl` donde se publique), `socialProfiles` (lista de `ExternalLink`) y
  `openingHours`.
- Invariante nueva en `validateLandingContent`: la URL de cada perfil social es https válida, con
  el mismo criterio que los enlaces de proyectos (si conviene, se extrae un ayudante local para no
  duplicar el chequeo).

### Infrastructure (`infrastructure/landingContentSource.ts`)
`company` recibe los datos confirmados en la spec: logo `LOGOsolutionsPJM.jpeg` de
`public/logo/icono/`, un perfil «Instagram» con la URL canónica del perfil y horario de lunes a
domingo de 00:00 a 23:59 (atención 24/7).

### API pública (`index.ts`)
Exporta los tipos `DayOfWeek` y `OpeningHours`.

### App: JSON-LD (`structured-data.ts`)
`buildStructuredData` agrega, a partir de `company` y `siteUrl`: el correo; `logo` e `image` con
la misma URL absoluta del logo; `sameAs` con las URL de los perfiles sociales; y
`openingHoursSpecification` con un único bloque de tipo `OpeningHoursSpecification` que copia
días, apertura y cierre. No se agrega `geo`.

### UI: footer (`footer-section.tsx`)
En la lista de contacto, después del correo, un elemento por perfil social: enlace con la
etiqueta visible, abierto en otra pestaña con `externalLinkProps`, mismas clases que el enlace de
WhatsApp y la flecha decorativa oculta a lectores de pantalla. El nombre accesible es el texto
visible («Instagram»); no se agrega `aria-label` porque duplicaría el texto (WCAG 2.5.3, label in
name).

### App: imagen OpenGraph
- `og-image-card.tsx`: componente puro `OgImageCard` que recibe nombre, texto y fuente del logo.
  Usa estilos en línea compatibles con Satori (todo contenedor con varios hijos en flexbox). Fondo
  `#080808` (color dominante del logo), logo de unos 320 px a la izquierda, nombre grande y texto
  blanco al 70 % a la derecha. Es la propuesta de D1–D3 de la spec.
- `opengraph-image.tsx`: declara tamaño 1200×630, tipo PNG y `alt` con el nombre de la empresa.
  Su función por defecto obtiene el contenido del idioma, lee el logo desde `public/` con la ruta
  de `company.logo`, lo convierte en data URL JPEG en base64 y devuelve un `ImageResponse` con
  `OgImageCard`, usando la `seo.description` del idioma como texto.

## Estructura objetivo
| Archivo | Capa | Responsabilidad |
|---------|------|-----------------|
| `src/modules/company-profile/domain/landingContent.ts` | domain | `DayOfWeek`, `OpeningHours`, campos nuevos de `Contact`, regla https de perfiles sociales. |
| `src/modules/company-profile/domain/landingContent.test.ts` | domain | Fixture con campos nuevos; rechaza perfil social no https, logo sin barra inicial, horas fuera de HH:MM y horario sin días. |
| `src/modules/company-profile/infrastructure/landingContentSource.ts` | infrastructure | Logo, Instagram y horario 24/7 confirmados. |
| `src/modules/company-profile/infrastructure/landingContentSource.test.ts` | infrastructure | Datos exactos; el logo existe en `public/`. |
| `src/modules/company-profile/index.ts` | API pública | Exporta `DayOfWeek` y `OpeningHours`. |
| `src/app/[lang]/structured-data.ts` | app | Correo, logo, imagen, `sameAs` y horario en el JSON-LD. |
| `src/app/[lang]/structured-data.test.ts` | app | Objeto esperado completo en es/en, sin `geo`. |
| `src/components/landing/footer-section.tsx` | ui | Enlace a cada perfil social. |
| `src/components/landing/footer-contact-link.tsx` | ui | Enlace de contacto del footer con flecha decorativa (T07, evita repetir el marcado). |
| `eslint.config.js` | configuración | Permite exportar `alt` y `dynamicParams` en rutas de Next (T08). |
| `src/components/landing/landing-sections.test.tsx` | ui | Enlace de Instagram en el footer. |
| `src/app/[lang]/og-image-card.tsx` | app | Composición visual de la imagen OG. |
| `src/app/[lang]/opengraph-image.tsx` | app | Ruta de la imagen OG por idioma; solo `es` y `en` (sin parámetros dinámicos). |
| `src/app/[lang]/opengraph-image.test.tsx` | app | Tamaño, tipo, `alt` y contenido de la tarjeta. |

## Pruebas
- Domain: `validateLandingContent` rechaza un perfil social con URL http o inválida, un logo sin
  barra inicial, horas fuera de HH:MM y un horario sin días, y acepta el
  contenido real.
- Infrastructure: `company` tiene exactamente el logo, Instagram y horario de la spec, y el
  archivo del logo existe en `public/`.
- JSON-LD: comparación exacta del objeto completo por idioma (la prueba actual ya compara por
  igualdad, así que también garantiza que no hay `geo`).
- Footer: existe un enlace con nombre «Instagram» hacia el perfil, que abre en otra pestaña con
  `noopener noreferrer`.
- Imagen OG: el tamaño es 1200×630 y el tipo PNG; la tarjeta renderizada contiene el nombre, la
  descripción del idioma y una imagen cuya fuente es una data URL JPEG. El render real con Satori
  no se prueba en Vitest (jsdom; un render en seco en Node fuera de Next se colgó): lo cubre
  `pnpm build`, que prerenderiza la imagen de cada idioma y falla si Satori rechaza el marcado.
- Manual (T05): abrir ambas imágenes con `pnpm start`, ver `og:image` en el HTML y validar el
  JSON-LD de la preview con la prueba de resultados enriquecidos.

## Riesgos
- Si importar `opengraph-image.tsx` (que importa `next/og`) falla en jsdom, la prueba cubre solo
  `og-image-card.tsx`, y el tamaño y el tipo se verifican en el build (T05).
- Satori solo admite flexbox y estilos en línea: un contenedor con varios hijos sin flexbox hace
  fallar el build.
