# Tareas: Indexar la landing en Google Search Console

## Base acordada
- Spec: `docs/specs/004-indexarSearchConsole/spec.md`. Plan: `plan.md`.
- Rama: `indexarPagina`.
- Método: TDD (prueba que falla → código mínimo → refactor) y `pnpm validate` en verde tras cada tarea.
- Un commit por tarea.

## Tareas
- [x] T00 Search Console: propiedad de tipo Dominio `solutionspjm.com` verificada con registro TXT
      en el DNS de Vercel (2026-10-05). El registro TXT no se borra.
- [x] T01 Preparación: crear la rama y ejecutar `pnpm validate` como línea base.
- [x] T02 Dominio: regla de la URL del sitio (absoluta, `https`, con `www`, sin ruta ni barra final)
      y `defaultLocale = 'es'` junto a `locales` en `domain/landingContent.ts`.
- [ ] T03 Aplicación: `buildLocaleUrl(siteUrl, locale)` y `buildLanguageAlternates(siteUrl)`
      (`es`, `en` y `x-default` → `/es`, todas absolutas).
- [ ] T04 Infraestructura: `siteUrl = 'https://www.solutionspjm.com'` validada al cargarse; exportar
      `siteUrl`, `defaultLocale` y las dos funciones desde `index.ts`.
- [ ] T05 Metadatos: `metadataBase`, `alternates.canonical`, `alternates.languages` y
      `openGraph.url` en `generateMetadata` de `src/app/[lang]/layout.tsx` (actualizar
      `layout.test.tsx`).
- [ ] T06 Sitemap y robots: `src/app/sitemap.ts` (una entrada por idioma con alternativas, sin `/`)
      y `src/app/robots.ts` (`allow: '/'` y sitemap absoluto), con sus pruebas.
- [ ] T07 JSON-LD: agregar `url` del idioma en `structured-data.ts` y quitar el comentario de
      pendiente (actualizar `structured-data.test.ts`).
- [ ] T08 Verificación local: `pnpm validate`; `pnpm build && pnpm start` y revisar `/sitemap.xml`,
      `/robots.txt` y el `<head>` de `/es` y `/en` (canonical, `hreflang`, `og:url`).
- [ ] T09 Despliegue (antes del merge, manual en Vercel → Settings → Domains): `www.solutionspjm.com`
      como dominio principal y `solutionspjm.com` → `308` a `www`. Después merge y deploy de
      producción; `curl` confirma `308` del apex y de `http` a `https://www.solutionspjm.com`, y `200`
      en `/robots.txt` y `/sitemap.xml`.
- [ ] T10 Search Console (manual): enviar `https://www.solutionspjm.com/sitemap.xml` hasta estado
      «Correcto»; solicitar indexación de `/es` y `/en` con la inspección de URL sin errores de
      canonical ni `hreflang`; dar acceso a los demás integrantes.
- [ ] T11 Cierre: marcar criterios de la spec 004, actualizar el pendiente de dominio de la spec 003
      (remite a la 004) y sincronizar `docs/contexto/` si cambió el despliegue.
