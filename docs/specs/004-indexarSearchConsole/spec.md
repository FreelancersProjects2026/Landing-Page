# Spec 004: Indexar la landing en Google Search Console

## Problema
La landing ya está publicada en `https://solutionspjm.com` (`/es` y `/en`), pero Google no tiene
cómo descubrirla ni entenderla bien: no hay `robots.txt` ni `sitemap.xml` (ambos responden 404), no
hay URL canónica ni `hreflang` entre idiomas (pendientes de la spec 003 por falta de dominio) y el
equipo no tiene acceso a Search Console para saber si el sitio aparece en Google ni con qué
búsquedas.

## Solución
Ahora que existe el dominio, completar el SEO técnico que quedó bloqueado en la spec 003
(`metadataBase`, canonical, `hreflang`, sitemap y robots) con las convenciones nativas de Next.js,
verificar la propiedad del dominio en Google Search Console, enviar el sitemap y solicitar la
indexación de `/es` y `/en`.

## Objetivo
Que Google indexe `https://solutionspjm.com/es` y `https://solutionspjm.com/en` como versiones
alternativas del mismo sitio, y que el equipo pueda monitorear en Search Console la cobertura,
las búsquedas y los errores.

## Estado actual (verificado el 2026-10-05)
| URL | Respuesta |
|---|---|
| `https://solutionspjm.com/` | `307` → `/es` |
| `https://www.solutionspjm.com/` | `307` → `https://solutionspjm.com/` |
| `https://solutionspjm.com/es` y `/en` | `200` |
| `https://solutionspjm.com/robots.txt` | `404` |
| `https://solutionspjm.com/sitemap.xml` | `404` |

## Alcance
1. **URL base del sitio:** `https://solutionspjm.com` (sin `www`) como única fuente de verdad,
   declarada una sola vez y validada (URL absoluta `https`, sin barra final).
2. **`metadataBase`** en los metadatos para que las URL relativas (Open Graph, canonical) sean
   absolutas.
3. **Canonical y `hreflang`** por idioma mediante `alternates`:
   - `/es` → canonical `https://solutionspjm.com/es`.
   - `/en` → canonical `https://solutionspjm.com/en`.
   - Ambas declaran `es`, `en` y `x-default` (→ `/es`).
   - Open Graph publica `url` con la URL canónica del idioma.
4. **`sitemap.xml`** (`src/app/sitemap.ts`) con `/es` y `/en`, cada una con sus alternativas de
   idioma.
5. **`robots.txt`** (`src/app/robots.ts`) que permite todo el sitio y apunta al sitemap.
6. **Verificación en Search Console** con propiedad de tipo dominio (`solutionspjm.com`) mediante
   registro DNS TXT: cubre `http`/`https` y `www`/apex sin código.
7. **Alta manual en Search Console:** enviar `https://solutionspjm.com/sitemap.xml` y solicitar la
   indexación de `/es` y `/en` con la herramienta de inspección de URL.
8. **JSON-LD:** agregar la `url` canónica del idioma a la organización publicada (spec 003).

## Fuera de alcance
- Google Business Profile, redes sociales y correo corporativo.
- Imagen Open Graph propia (`opengraph-image`).
- Google Analytics / Tag Manager (ya existe Vercel Analytics).
- Nuevas páginas, contenido o palabras clave (se mantienen los de la spec 003).
- Campañas pagadas (Google Ads).

## Reglas del negocio
- El dominio canónico es `https://solutionspjm.com`, sin `www`; toda URL publicada (canonical,
  `hreflang`, sitemap, Open Graph y JSON-LD) usa ese mismo origen.
- Español es el idioma por defecto (`x-default` → `/es`), igual que la redirección de `/`.
- Solo se indexan las páginas reales por idioma: `/` no aparece en el sitemap porque redirige.
- El sitemap y el `hreflang` se generan desde la lista de idiomas del módulo `company-profile`;
  agregar un idioma no requiere tocarlos a mano.
- La verificación de Search Console no expone secretos en el repositorio.

## Decisiones técnicas
- Se usan `metadata.alternates`, `app/sitemap.ts` y `app/robots.ts` de Next.js: sin dependencias
  nuevas.
- Verificación por DNS en lugar de meta tag → no hay código ni variable de entorno que mantener. Si
  el DNS no está accesible, el respaldo es `metadata.verification.google` con el token en una
  variable de entorno.

## Dudas abiertas
- [x] DNS: el dominio se compró en Vercel y la app está desplegada ahí; el registro TXT se agrega
  en Vercel (Domains → `solutionspjm.com` → DNS Records).
- [x] Cuenta propietaria de la propiedad en Search Console: `jason.moyabre.es@gmail.com`.
- [PENDIENTE] ¿A qué integrantes se da acceso y con qué permiso (propietario / completo)?
- [x] Dominio preferido: sin `www` (decisión del equipo, 2026-10-05). Con o sin `www` no cambia la
  confianza (la da `https`) ni el SEO (solo importa la consistencia). `www.solutionspjm.com` →
  `solutionspjm.com` pasa de `307` a `308` (manual en Vercel → Settings → Domains).
- [PENDIENTE] `/` → `/es` responde `307` (`permanent: false` en `next.config.mjs`). Recomendado:
  mantenerlo temporal por si a futuro se detecta el idioma del navegador.

## Criterios de aceptación
- [ ] La URL base `https://solutionspjm.com` está definida una sola vez, validada y con pruebas.
- [x] `https://www.solutionspjm.com/es` redirige con `308` a `https://solutionspjm.com/es`
      (2026-10-05: `www` agregado al proyecto `landing-page` con redirect `308`).
- [ ] `/es` y `/en` publican `<link rel="canonical">` a su propia URL absoluta.
- [ ] `/es` y `/en` publican `hreflang` `es`, `en` y `x-default` (→ `/es`) con URL absolutas.
- [ ] Open Graph incluye la `url` canónica de cada idioma.
- [ ] `https://solutionspjm.com/sitemap.xml` responde `200` con `/es` y `/en` y sus alternativas.
- [ ] `https://solutionspjm.com/robots.txt` responde `200`, permite el sitio y apunta al sitemap.
- [ ] El JSON-LD de la organización incluye la `url` canónica de cada idioma.
- [x] La propiedad de dominio `solutionspjm.com` aparece verificada en Search Console
      (2026-10-05, registro TXT en el DNS de Vercel).
- [ ] El sitemap figura como «Correcto» en Search Console.
- [ ] Se solicitó la indexación de `/es` y `/en` y la inspección no reporta errores de canonical
      ni de `hreflang`.
- [ ] La spec 003 actualiza su pendiente de dominio y remite a esta spec.
- [ ] `pnpm validate` pasa en verde.
