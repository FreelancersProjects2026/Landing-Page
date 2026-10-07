# Plan técnico: Política de privacidad

## Referencias
- Especificación: `docs/specs/007-privacidad/spec.md`. Textos: `contenido.md` (fuente literal).
- Lección de la Spec 006: `notFound()` bajo el layout `[lang]` da un SSR vacío; las rutas que no
  deben existir se resuelven por `generateStaticParams` + `dynamicParams = false` (cae en la 404
  global), nunca con `notFound()`.

## Enfoque
La política es contenido de la empresa: vive en `company-profile`, pero en archivos propios porque
`landingContentSource.ts` ya supera las 360 líneas. El módulo expone `getPrivacyPolicy(locale)` y
las URLs (`privacyPaths`, `buildPrivacyUrl`, `buildPrivacyAlternates`); `app/` solo compone y el
componente visual recibe todo por props.

**Slug por idioma:** dos rutas, cada una con `generateStaticParams` de un solo idioma y
`dynamicParams = false`:
- `app/[lang]/privacidad/page.tsx` → solo `{ lang: 'es' }`.
- `app/[lang]/privacy/page.tsx` → solo `{ lang: 'en' }`.

Ambas delegan en el mismo componente y el mismo armado de metadata; así `/en/privacidad` y
`/es/privacy` no coinciden con ninguna ruta y responden con la 404 global.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `modules/company-profile/domain/privacyPolicy.ts` | Nuevo | `PrivacyPolicy { seo, footerLink, title, updated, intro, sections: { heading, paragraphs, items? }[] }` y `validatePrivacyPolicy`: textos no vacíos, `seo` dentro de 60/160 caracteres, al menos una sección. |
| `modules/company-profile/application/privacyPolicy.ts` | Nuevo | `privacyPaths: Record<Locale, string>` (`privacidad`, `privacy`), `buildPrivacyPath`, `buildPrivacyUrl(siteUrl, locale)`, `buildPrivacyAlternates(siteUrl)` (con `x-default` → `es`), `createGetPrivacyPolicy`. |
| `modules/company-profile/infrastructure/privacyPolicySource.ts` | Nuevo | Textos `es` y `en` copiados literalmente de `contenido.md`, validados al cargarse. |
| `modules/company-profile/index.ts` | Actualizar | Exporta `getPrivacyPolicy`, los helpers de URL y los tipos. |
| `components/legal/privacy-policy.tsx` | Nuevo | Vista: `h1`, fecha, intro, `h2` por sección, párrafos y listas; enlace «volver al inicio» con `<a>`; estilo de la landing (fondo oscuro, `font-display`, ancho de lectura `max-w-3xl`). |
| `app/[lang]/privacy-route.ts` | Nuevo | Armado compartido de la página y de `generateMetadata` por idioma (canonical, alternates cruzados, title y description). |
| `app/[lang]/privacidad/page.tsx`, `app/[lang]/privacy/page.tsx` | Nuevos | Una línea de idioma cada una + `generateStaticParams` + `dynamicParams = false`. |
| `components/landing/footer-section.tsx` | Ampliar | Recibe `privacy: { label, href }` y lo muestra en la barra inferior junto a los derechos. |
| `app/[lang]/page.tsx` | Ampliar | Pasa el enlace de privacidad al footer. |
| `app/sitemap.ts` | Ampliar | Agrega `/es/privacidad` y `/en/privacy` con sus alternates. |

## Pruebas
- Dominio: la validación rechaza secciones vacías, títulos SEO de más de 60 y descripciones de
  más de 160 caracteres.
- Infraestructura: `es` y `en` copian `contenido.md` literalmente (mismo criterio que la Spec 003)
  y tienen la misma cantidad de secciones.
- Aplicación: `buildPrivacyUrl` y `buildPrivacyAlternates` dan `/es/privacidad` y `/en/privacy`.
- Vista: `h1`, un `h2` por sección, la lista de datos y la fecha.
- Rutas: cada `generateStaticParams` devuelve solo su idioma; `generateMetadata` da canonical y
  alternates cruzados.
- Footer: enlace con el `href` y el texto del idioma.
- Sitemap: cuatro entradas (landing y privacidad por idioma).

## Riesgos
- `dynamicParams = false` por página con un layout dinámico: verificar en build que
  `/en/privacidad` y `/es/privacy` responden 404 con la 404 global (con contenido en el SSR) y que
  las dos páginas válidas se prerenderizan (`●`).
