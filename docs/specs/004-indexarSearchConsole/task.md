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
- [x] T02 Dominio: regla de la URL del sitio (absoluta, `https`, sin `www`, sin ruta ni barra final)
      y `defaultLocale = 'es'` junto a `locales` en `domain/landingContent.ts`.
- [x] T03 Aplicación: `buildLocaleUrl(siteUrl, locale)` y `buildLanguageAlternates(siteUrl)`
      (`es`, `en` y `x-default` → `/es`, todas absolutas).
- [x] T04 Infraestructura: `siteUrl = 'https://solutionspjm.com'` validada al cargarse; exportar
      `siteUrl`, `defaultLocale` y las dos funciones desde `index.ts`.
- [x] T05 Metadatos: `metadataBase`, `alternates.canonical`, `alternates.languages` y
      `openGraph.url` en `generateMetadata` de `src/app/[lang]/layout.tsx` (actualizar
      `layout.test.tsx`).
- [x] T06 Sitemap y robots: `src/app/sitemap.ts` (una entrada por idioma con alternativas, sin `/`)
      y `src/app/robots.ts` (`allow: '/'` y sitemap absoluto), con sus pruebas.
- [x] T07 JSON-LD: agregar `url` del idioma en `structured-data.ts` y quitar el comentario de
      pendiente (actualizar `structured-data.test.ts`).
- [x] T08 Verificación local: `pnpm validate`; `pnpm build && pnpm start` y revisar `/sitemap.xml`,
      `/robots.txt` y el `<head>` de `/es` y `/en` (canonical, `hreflang`, `og:url`).
      Hecho: `/robots.txt` y `/sitemap.xml` `200`; `/es` y `/en` con `lang`, canonical propio,
      `hreflang` `es`/`en`/`x-default`, `og:url` y `url` en JSON-LD; sin `noindex`.
- [x] T09 Despliegue: en Vercel (Settings → Domains) `www.solutionspjm.com` redirige con `308`
      (2026-10-05). Merge `--no-ff` de `indexarPagina` en `main` (`gh` no disponible, sin PR) y
      deploy automático de Vercel. `curl` en producción: `/robots.txt` y `/sitemap.xml` `200`;
      `www` y `http` → `308` a `https://solutionspjm.com`; `/es` y `/en` con canonical,
      `hreflang`, `og:url` y `url` en JSON-LD.
- [x] T10 Search Console (manual): enviar `https://solutionspjm.com/sitemap.xml` hasta estado
      «Correcto»; solicitar indexación de `/es` y `/en` con la inspección de URL sin errores de
      canonical ni `hreflang`; dar acceso a los demás integrantes.
- [x] T11 Cierre: marcar criterios de la spec 004, actualizar el pendiente de dominio de la spec 003
      (remite a la 004) y sincronizar `docs/contexto/` si cambió el despliegue.
