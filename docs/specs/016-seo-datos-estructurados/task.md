# Tareas: SEO con datos estructurados completos, Instagram e imagen OpenGraph

## Base acordada
- Spec: `docs/specs/016-seo-datos-estructurados/spec.md`. Plan: `plan.md` (diseño y snippets).
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Orden: T01 → (T02 ∥ T03 ∥ T04) → T05. T02, T03 y T04 no comparten archivos.
- Imagen OG: T04 usa la propuesta de D1–D3 de la spec; si el cliente pide otra cosa, se ajusta
  en una tarea de corrección.

## Tareas
- [x] T01 Prueba: `company` (es y en) expone el logo `/logo/icono/LOGOsolutionsPJM.jpeg` (y el
  archivo existe en `public/`), un perfil social «Instagram» con URL
  `https://www.instagram.com/solutionspjm` y horario lunes–domingo 00:00–23:59; y
  `validateLandingContent` rechaza un perfil social no https (fallan) → agregar `DayOfWeek`,
  `OpeningHours` y los 3 campos a `Contact`, la regla https, los datos en la fuente y exportar los
  tipos en `index.ts`. Actualizar el fixture de `landingContent.test.ts`.
  Archivos: `src/modules/company-profile/domain/landingContent.ts`,
  `src/modules/company-profile/domain/landingContent.test.ts`,
  `src/modules/company-profile/infrastructure/landingContentSource.ts`,
  `src/modules/company-profile/infrastructure/landingContentSource.test.ts`,
  `src/modules/company-profile/index.ts`.
  - Evidencia: rojo, 4 pruebas fallan (perfil social http y sin esquema aceptado; `company` sin
    los campos nuevos; logo inexistente en `public/`); verde, 87/87 en `company-profile` y
    `pnpm validate` OK (221 pruebas, build y arquitectura en verde).
- [ ] T02 Prueba en `structured-data.test.ts`: el `ProfessionalService` de es/en incluye
  `email`, `logo` e `image` (`https://solutionspjm.com/logo/icono/LOGOsolutionsPJM.jpeg`),
  `sameAs` y `openingHoursSpecification` (falla) → agregarlos en `buildStructuredData`. Sin `geo`.
  (depende de T01; paralela a T03 y T04)
  Archivos: `src/app/[lang]/structured-data.ts`, `src/app/[lang]/structured-data.test.ts`.
- [ ] T03 Prueba en `landing-sections.test.tsx` (bloque del footer): hay un enlace
  «Instagram» a `https://www.instagram.com/solutionspjm` con `target="_blank"` y
  `rel="noopener noreferrer"` (falla) → renderizar `company.socialProfiles` en la lista de
  contacto del footer con `externalLinkProps` y la flecha decorativa oculta a lectores de pantalla.
  (depende de T01; paralela a T02 y T04)
  Archivos: `src/components/landing/footer-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
- [ ] T04 Prueba en `opengraph-image.test.tsx`: el tamaño declarado es 1200×630, el tipo es
  PNG, y `OgImageCard` renderiza nombre, `seo.description` del idioma y una imagen con
  data URL JPEG (falla: no existen) → crear `og-image-card.tsx` y `opengraph-image.tsx` según
  `plan.md`. `pnpm build` debe listar `/es/opengraph-image` y `/en/opengraph-image`.
  (depende de T01; paralela a T02 y T03)
  Archivos: `src/app/[lang]/og-image-card.tsx`, `src/app/[lang]/opengraph-image.tsx`,
  `src/app/[lang]/opengraph-image.test.tsx` (nuevos).
- [ ] T05 Verificación: `pnpm validate`; con `pnpm start`, `/es/opengraph-image` y
  `/en/opengraph-image` devuelven PNG 1200×630 y el HTML de `/es` y `/en` trae `og:image`; footer
  en 1280 y 375 px; en la preview de Vercel, prueba de resultados enriquecidos sin errores.
  Anotar evidencia aquí. (depende de T02, T03, T04)
