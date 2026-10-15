# Spec 016: SEO con datos estructurados completos, Instagram e imagen OpenGraph

## Problema
Google ve a solutionsPJM con datos incompletos:
- El JSON-LD `ProfessionalService` (`src/app/[lang]/structured-data.ts`) no publica correo, logo,
  imagen, perfiles sociales (`sameAs`) ni horario.
- La empresa tiene Instagram, pero la web no lo enlaza en ningún lado.
- Al compartir la web (WhatsApp, LinkedIn, Facebook) no sale ninguna imagen: no hay `og:image`.

Ya existe y no cambia: `sitemap.ts`, `robots.ts`, canonical + hreflang, OpenGraph de texto y el
JSON-LD `FAQPage`. El correo ya se muestra en el footer y en la sección de contacto.

## Objetivo
Que Google y las redes sociales muestren la ficha de la empresa completa y con imagen, con datos
confirmados por el cliente.

## Lenguaje ubicuo
- **Empresa (`Contact`)**: datos públicos de solutionsPJM en `company-profile` (nombre, teléfono,
  correo, dirección…).
- **Perfil social**: página pública de la empresa en una red social (hoy solo Instagram). En
  schema.org es `sameAs`.
- **Logo**: imagen de marca `public/logo/icono/LOGOsolutionsPJM.jpeg` (1254×1254, fondo negro).
- **Horario de atención**: días y horas en que la empresa atiende. El cliente atiende 24/7.
- **Imagen OpenGraph**: imagen 1200×630 que muestran las redes al compartir la URL de un idioma.

## Datos confirmados por el cliente
| Dato | Valor |
|------|-------|
| Correo | `solutionspjm@gmail.com` (ya está en `company.email`) |
| Instagram | `https://www.instagram.com/solutionspjm` (el cliente envió la URL con `?vrfl=…&utm_source=qr`; se quitan los parámetros de seguimiento) |
| Logo e imagen | `https://solutionspjm.com/logo/icono/LOGOsolutionsPJM.jpeg` (construida desde `siteUrl`) |
| Horario | Todos los días, 00:00–23:59 |
| Coordenadas (`geo`) | No se publican |

## Alcance
1. **Dominio**: la empresa (`Contact`) incorpora logo, perfiles sociales y horario de atención.
   Los datos viven en `company-profile`, no en `src/app`.
2. **JSON-LD `ProfessionalService`** agrega `email`, `logo`, `image`, `sameAs` y
   `openingHoursSpecification`. Sin `geo`.
3. **Enlace visible a Instagram** en la columna de contacto del footer, junto a WhatsApp y correo.
   Se abre en otra pestaña (`target="_blank"`, `rel="noopener noreferrer"`).
4. **Imagen OpenGraph por idioma** (`src/app/[lang]/opengraph-image.tsx`, `ImageResponse` de
   `next/og`): 1200×630, fondo oscuro como el logo, logo + nombre + descripción del idioma.

## Fuera de alcance
- `geo`, `priceRange`, reseñas (`aggregateRating`) y otras redes sociales.
- Etiquetas `twitter:*` propias (X usa las OpenGraph como respaldo).
- Mostrar el horario 24/7 en la web (el cliente solo pidió el dato estructurado).
- Cambiar `src/app/icons.ts` o el favicon.

## Criterios de aceptación
- [ ] `company` (es y en) expone logo `/logo/icono/LOGOsolutionsPJM.jpeg` (el archivo existe en
  `public/`), perfil social Instagram `https://www.instagram.com/solutionspjm` y horario de lunes a
  domingo 00:00–23:59.
- [ ] `validateLandingContent` rechaza un perfil social cuya URL no sea `https`.
- [ ] El JSON-LD `ProfessionalService` de `/es` y `/en` incluye:
  `email: "solutionspjm@gmail.com"`,
  `logo` e `image`: `"https://solutionspjm.com/logo/icono/LOGOsolutionsPJM.jpeg"`,
  `sameAs: ["https://www.instagram.com/solutionspjm"]` y
  `openingHoursSpecification` con los 7 días, `opens: "00:00"`, `closes: "23:59"`. No incluye `geo`.
- [ ] El footer muestra un enlace «Instagram» a la URL del perfil, con `target="_blank"` y
  `rel="noopener noreferrer"`; su nombre accesible es «Instagram» y el ícono decorativo es
  `aria-hidden`.
- [ ] `/es/opengraph-image` y `/en/opengraph-image` devuelven PNG 1200×630 con logo, nombre y la
  descripción SEO del idioma; el HTML de cada idioma declara `og:image` hacia su imagen.
- [ ] La prueba de resultados enriquecidos de Google (o validator.schema.org) no reporta errores
  en el JSON-LD de la preview.
- [ ] `pnpm validate` en verde.

## Dudas
Datos de negocio: ninguna (confirmados por el cliente, tabla de arriba).

Diseño de la imagen OpenGraph (no bloquean: T04 usa la propuesta y se ajusta si el cliente pide
otra cosa; confirmar antes de mergear):
- D1. **Texto**: se propone nombre + `seo.description` del idioma (≤ 160 caracteres, ya aprobada).
  ¿Prefiere el cliente un eslogan corto (p. ej. `hero.slogan`)?
- D2. **Tipografía**: se propone la fuente por defecto de `next/og` (Geist) para no embeber
  archivos de fuente. ¿Debe usar la tipografía de marca de la landing?
- D3. **Composición**: se propone logo a la izquierda (≈ 320 px) y texto a la derecha, fondo
  `#080808` (color dominante del logo) y texto blanco. ¿Algún acento de color de marca?
