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
  la empresa → se agregan a `Contact`. `src/app` solo los traduce a schema.org y a la imagen OG.
- **Reutilizar**: `ExternalLink` (`label` + `url`) para el perfil social; la regla «URL https»
  que ya valida `projects.items[].link` se extiende a `company.socialProfiles`; `externalLinkProps`
  para el enlace del footer; `collectTexts` ya rechaza textos vacíos de los campos nuevos.
- **Sin cambios en `page.tsx` ni en `layout.tsx`**: el footer ya recibe `company`; Next agrega
  `og:image` solo por convención de archivo (`opengraph-image.tsx` en `src/app/[lang]/`), y se
  prerenderiza por idioma con el `generateStaticParams` del layout.
- **Sin dependencias nuevas**: `next/og` viene con `next`.
- Descartado: una entidad `SocialProfile` propia (no aporta sobre `ExternalLink`); ícono de
  Instagram de `lucide-react` (los íconos de marca están obsoletos en lucide; el footer usa texto
  + `ArrowUpRight`, como WhatsApp); `generateImageMetadata` para `alt` por idioma (un `alt` fijo
  con el nombre de la empresa basta).

## Diseño (DDD)
### Domain (`domain/landingContent.ts`)
```ts
export type DayOfWeek =
  | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface OpeningHours {
  readonly dayOfWeek: readonly DayOfWeek[]
  readonly opens: string // HH:MM
  readonly closes: string // HH:MM
}

export interface Contact {
  // …campos actuales
  /** Ruta pública del logo (empieza con /); la URL absoluta se arma con siteUrl. */
  readonly logo: string
  readonly socialProfiles: readonly ExternalLink[]
  readonly openingHours: OpeningHours
}
```
Invariante nueva en `validateLandingContent`: cada `company.socialProfiles[i].url` es `https`
válida (mismo chequeo que los enlaces de proyectos; extraer un `isHttpsUrl` local si evita
duplicar). Los nombres de días siguen schema.org para mapear sin traducción.

### Infrastructure (`infrastructure/landingContentSource.ts`)
```ts
logo: '/logo/icono/LOGOsolutionsPJM.jpeg',
socialProfiles: [{ label: 'Instagram', url: 'https://www.instagram.com/solutionspjm' }],
openingHours: { dayOfWeek: [los 7 días], opens: '00:00', closes: '23:59' }, // 24/7
```

### API pública (`index.ts`)
Exportar los tipos `DayOfWeek` y `OpeningHours`.

### App: JSON-LD (`structured-data.ts`)
`buildStructuredData` agrega, a partir de `company` y `siteUrl`:
```ts
email: company.email,
logo: logoUrl,            // new URL(company.logo, siteUrl).href
image: logoUrl,
sameAs: company.socialProfiles.map(({ url }) => url),
openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', ...company.openingHours }],
```

### UI: footer (`footer-section.tsx`)
En la lista de contacto, tras el correo, un `<li>` por `company.socialProfiles`:
`<a href={url} {...externalLinkProps}>{label}<ArrowUpRight aria-hidden="true" /></a>`, con las
mismas clases que WhatsApp. Nombre accesible = texto visible («Instagram»); no se agrega
`aria-label` porque duplicaría el texto (WCAG 2.5.3, label in name).

### App: imagen OpenGraph
- `og-image-card.tsx`: componente puro `OgImageCard({ name, text, logoSrc })` con estilos en línea
  compatibles con Satori (`display: 'flex'` en cada contenedor). Fondo `#080808`, logo ≈ 320 px a
  la izquierda, nombre ≈ 72 px y texto ≈ 32 px en blanco (texto al 70 %). Propuesta de D1–D3.
- `opengraph-image.tsx`: `size = { width: 1200, height: 630 }`, `contentType = 'image/png'`,
  `alt = 'solutionsPJM'` (nombre de la empresa). `default async function Image({ params })`:
  `getLandingContent(lang)`, lee `public${company.logo}` con `readFile(join(process.cwd(),
  'public', company.logo))`, lo pasa como data URL `image/jpeg` base64 y devuelve
  `new ImageResponse(<OgImageCard name text={seo.description} logoSrc />, size)`.

## Estructura objetivo
| Archivo | Capa | Responsabilidad |
|---------|------|-----------------|
| `src/modules/company-profile/domain/landingContent.ts` | domain | `DayOfWeek`, `OpeningHours`, campos nuevos de `Contact`, regla https de perfiles sociales. |
| `src/modules/company-profile/domain/landingContent.test.ts` | domain | Fixture con campos nuevos; rechaza perfil social no https. |
| `src/modules/company-profile/infrastructure/landingContentSource.ts` | infrastructure | Logo, Instagram y horario 24/7 confirmados. |
| `src/modules/company-profile/infrastructure/landingContentSource.test.ts` | infrastructure | Datos exactos; el logo existe en `public/`. |
| `src/modules/company-profile/index.ts` | API pública | Exporta `DayOfWeek`, `OpeningHours`. |
| `src/app/[lang]/structured-data.ts` | app | `email`, `logo`, `image`, `sameAs`, `openingHoursSpecification`. |
| `src/app/[lang]/structured-data.test.ts` | app | Objeto esperado completo en es/en, sin `geo`. |
| `src/components/landing/footer-section.tsx` | ui | Enlace a cada perfil social. |
| `src/components/landing/landing-sections.test.tsx` | ui | Enlace Instagram en el footer. |
| `src/app/[lang]/og-image-card.tsx` | app | Composición visual de la imagen OG. |
| `src/app/[lang]/opengraph-image.tsx` | app | Ruta de la imagen OG por idioma (`ImageResponse`). |
| `src/app/[lang]/opengraph-image.test.tsx` | app | `size`, `contentType`, `alt` y contenido de la tarjeta. |

## Pruebas
- Domain: `validateLandingContent` lanza `InvalidLandingContentError` con un perfil social
  `http://…` o URL inválida; acepta el contenido real.
- Infrastructure: `company` tiene exactamente logo, Instagram y horario de la spec;
  `existsSync('public' + company.logo)`.
- JSON-LD: `toEqual` del objeto completo por idioma (la prueba actual ya usa `toEqual`, así que
  también garantiza que no hay `geo`).
- Footer: `getByRole('link', { name: 'Instagram' })` con `href`, `target="_blank"` y
  `rel="noopener noreferrer"`.
- Imagen OG: `size` 1200×630, `contentType` `image/png`; `renderToString(<OgImageCard …/>)`
  contiene nombre, descripción del idioma y un `<img>` con `src` `data:image/jpeg;base64,`.
  El render real con Satori no se prueba en Vitest (jsdom; en Node el render en seco se colgó al
  probarlo fuera de Next): lo cubre `pnpm build`, que prerenderiza `/es/opengraph-image` y
  `/en/opengraph-image` y falla si Satori rechaza el JSX.
- Manual (T05): abrir ambas imágenes en `pnpm start`, ver `og:image` en el HTML, validar el JSON-LD
  en la preview con la prueba de resultados enriquecidos.

## Riesgos
- Si importar `opengraph-image.tsx` (que importa `next/og`) falla en jsdom, la prueba importa solo
  `og-image-card.tsx` y los valores de `size`/`contentType` se verifican en el build (T05).
- Satori solo admite flexbox y estilos en línea: cualquier `div` con más de un hijo necesita
  `display: 'flex'`, o el build falla.
