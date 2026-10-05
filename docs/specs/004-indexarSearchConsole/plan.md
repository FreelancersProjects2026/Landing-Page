# Plan técnico: Indexar la landing en Google Search Console

## Referencias
- Especificación: `docs/specs/004-indexarSearchConsole/spec.md`.
- Contenido y SEO vigentes: `docs/specs/003-generarContenido/` (spec y plan).
- Arquitectura: `docs/adr/`, `docs/contexto/arquitectura.md`.
- Constitución: `docs/constitution.md`.

## Contexto de despliegue
- La app está en Vercel y el dominio `solutionspjm.com` se compró en Vercel → los nameservers y el
  DNS se administran desde Vercel; no hay registrador externo.
- Producción responde en `https://solutionspjm.com`; `www` redirige al apex.

## Enfoque
La URL del sitio es un dato de la empresa, igual que su nombre o teléfono: vive en el módulo
`company-profile`, se valida al cargarse y se expone por `index.ts`. A partir de ella, funciones
puras de aplicación construyen la URL de cada idioma y sus alternativas (`hreflang`). El layout, el
sitemap, el robots y el JSON-LD solo componen esas funciones: ninguna URL se escribe a mano fuera
del módulo. Todo es estático y se genera en el build con las convenciones nativas de Next.js; sin
dependencias nuevas. La verificación y el alta en Search Console son pasos manuales, fuera del
código.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `src/modules/company-profile/domain/` | Ampliar | Regla de la URL del sitio: absoluta, `https`, sin `www`, sin ruta ni barra final. |
| `src/modules/company-profile/application/` | Ampliar | `buildLocaleUrl(siteUrl, locale)` → `https://solutionspjm.com/es`; `buildLanguageAlternates(siteUrl)` → `{ es, en, 'x-default' }` (x-default = idioma por defecto `es`). |
| `src/modules/company-profile/infrastructure/` | Ampliar | `siteUrl: 'https://solutionspjm.com'` junto a los datos de la empresa, validado al cargarse. |
| `src/modules/company-profile/index.ts` | Actualizar | Exporta `siteUrl`, `defaultLocale` (nuevo en `domain/landingContent.ts`, junto a `locales`) y las dos funciones. |
| `src/app/[lang]/layout.tsx` | Ampliar | `metadataBase`, `alternates.canonical`, `alternates.languages` y `openGraph.url`. |
| `src/app/sitemap.ts` | Nuevo | Una entrada por idioma con `alternates.languages`; generado desde `locales`. |
| `src/app/robots.ts` | Nuevo | `allow: '/'` para todos los agentes y `sitemap` absoluto. |
| `src/app/[lang]/structured-data.ts` | Ampliar | Agrega `url` (URL del idioma) al `ProfessionalService`; se borra el comentario de pendiente. |
| `docs/specs/003-generarContenido/spec.md` | Actualizar | Pendiente de dominio resuelto → remite a la spec 004. |

## Decisiones técnicas
- **Fuente única de la URL:** `siteUrl` en infraestructura del módulo, no en una variable de
  entorno: es un dato de negocio estable y así los previews de Vercel también publican la URL de
  producción como canonical (evita que Google indexe `*.vercel.app`). Variable de entorno solo si
  a futuro hay más de un dominio.
- **Idioma por defecto:** `x-default` y la redirección de `/` usan el mismo valor (`es`); se expone
  desde el dominio para no duplicarlo.
- **Canonical por idioma:** cada página es canónica de sí misma; `/es` y `/en` son alternativas,
  no duplicados.
- **Sitemap:** solo `/es` y `/en` (`/` redirige, no se lista). Sin `lastModified`,
  `changeFrequency` ni `priority`: Google los ignora o el valor no sería verídico.
- **Robots:** permite todo; no hay rutas privadas que bloquear.
- **Verificación:** propiedad de tipo dominio en Search Console con registro TXT en el DNS de
  Vercel. Cubre `https`/`http` y `www`/apex. Sin código ni secretos en el repo. Respaldo (solo si
  falla el DNS): `metadata.verification.google` con token en variable de entorno de Vercel.
- **Redirección `www`:** se configura en Vercel (Settings → Domains → `www.solutionspjm.com` →
  redirect a `solutionspjm.com`). Se cambia de `307` a `308` (decisión del equipo: sin `www`).
  `/` → `/es` sigue temporal en `next.config.mjs` salvo que el equipo decida otra cosa.
- **Validación en el límite:** una `siteUrl` inválida rompe el build (mismo criterio que el
  contenido en la spec 003): nunca llega a producción una canonical rota.

## Pruebas (TDD)
Cada comportamiento se escribe primero como prueba que falla:
1. **Dominio:** la regla de URL rechaza `http://`, `www.`, ruta, barra final y texto no URL; acepta
   `https://solutionspjm.com`.
2. **Aplicación:** `buildLocaleUrl` produce `https://solutionspjm.com/es` y `/en`;
   `buildLanguageAlternates` devuelve `es`, `en` y `x-default` → `/es`, todas absolutas.
3. **Infraestructura:** la `siteUrl` cargada pasa la validación.
4. **Metadatos:** `generateMetadata` de cada idioma incluye `metadataBase`, `alternates.canonical`
   propio, `alternates.languages` completo y `openGraph.url` (se actualiza `layout.test.tsx`).
5. **Sitemap:** devuelve exactamente una entrada por idioma de `locales`, con URL absoluta y
   alternativas; no incluye `/`.
6. **Robots:** permite `/` y apunta a `https://solutionspjm.com/sitemap.xml`.
7. **JSON-LD:** incluye `url` del idioma (`structured-data.test.ts`).

## Fases
1. **Preparación:** `pnpm validate` en verde como línea base; rama dedicada.
2. **Dominio y aplicación:** regla de URL, `buildLocaleUrl`, `buildLanguageAlternates`, exportes
   del módulo (TDD).
3. **Infraestructura:** `siteUrl` validada en la fuente de datos.
4. **Metadatos:** `metadataBase`, canonical, `hreflang` y `openGraph.url` en el layout.
5. **Sitemap, robots y JSON-LD:** `src/app/sitemap.ts`, `src/app/robots.ts`, `url` en JSON-LD.
6. **Verificación local:** `pnpm validate`; `pnpm build && pnpm start` y revisar
   `/sitemap.xml`, `/robots.txt` y el `<head>` de `/es` y `/en`.
7. **Despliegue:** merge → deploy de producción en Vercel; comprobar con `curl` que
   `/robots.txt` y `/sitemap.xml` responden `200` en `https://solutionspjm.com`.
8. **Search Console (manual, ver «Pasos manuales»).** Pasos 1–4 hechos el 2026-10-05: propiedad
   de dominio verificada. Quedan el envío del sitemap, la indexación y los accesos.
9. **Documentación:** marcar criterios de la spec 004, actualizar pendiente de la spec 003 y
   `docs/contexto/` si cambia algo de despliegue; commit por fase.

## Pasos manuales en Search Console
Los hace Jason con la cuenta propietaria `jason.moyabre.es@gmail.com`:
1. Entrar a `https://search.google.com/search-console` → «Agregar propiedad» → tipo **Dominio** →
   `solutionspjm.com`.
2. Copiar el valor `google-site-verification=…` que muestra Google.
3. En Vercel: Domains → `solutionspjm.com` → DNS Records → agregar registro `TXT`, nombre `@`,
   valor copiado. (Alternativa CLI: `vercel dns add solutionspjm.com @ TXT "google-site-verification=…"`.)
4. Volver a Search Console → «Verificar». Si falla, esperar la propagación del DNS y reintentar.
5. Sitemaps → enviar `https://solutionspjm.com/sitemap.xml`; esperar estado «Correcto».
6. Inspección de URL → `https://solutionspjm.com/es` → «Solicitar indexación»; repetir con `/en`.
7. Configuración → Usuarios y permisos → agregar a los demás integrantes.
8. Registrar en la spec la fecha de verificación y del envío del sitemap.

## Riesgos
- **Indexación lenta:** Google puede tardar días o semanas; solicitar indexación no la garantiza.
  El criterio de aceptación es haberla solicitado sin errores, no aparecer en resultados.
- **Previews indexables:** las URL `*.vercel.app` podrían indexarse; mitigado porque su canonical
  apunta a producción (Vercel además envía `X-Robots-Tag: noindex` en previews).
- **Propagación DNS:** la verificación puede fallar las primeras horas; reintentar.
- **Cambio futuro de dominio:** obliga a nueva propiedad y redirecciones `308`; la URL vive en un
  solo lugar, así que el cambio en código es de una línea.
