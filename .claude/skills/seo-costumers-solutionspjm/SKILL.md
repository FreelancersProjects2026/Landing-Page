---
name: seo-costumers-solutionspjm
description: Auditoría SEO y de captación de clientes de https://solutionspjm.com (/es y /en). Entra al sitio en vivo, lo analiza paso a paso, detecta errores, bugs y causas de poco tráfico, propone cómo atraer clientes y entrega una lista priorizada de problemas con su solución. Usar cuando el usuario diga "SEO", "nadie entra a la web", "conseguir clientes", "auditar la web" o invoque /seo-costumers-solutionspjm.
---

# SEO-Costumers-SolutionsPJM

Objetivo: que más negocios encuentren solutionsPJM y escriban por WhatsApp. El SEO técnico es solo una
parte; casi siempre el cuello de botella es **autoridad** (nadie enlaza ni menciona la marca) y
**contenido** (una sola página no posiciona para casi ninguna búsqueda).

Reglas: responde en español. Razona paso a paso y separa **hechos medidos** de **suposiciones**.
No cambies contenido visible sin aprobarlo antes en `docs/specs/003-generarContenido/contenido.md`;
cualquier cambio de código sigue el flujo de `CLAUDE.md` (spec → plan → task, TDD, `pnpm validate`).

## Paso 1 — Entrar al sitio en vivo

Guarda todo en el scratchpad. Usa User-Agent de Googlebot para ver lo que ve Google.

```bash
for p in es en es/privacidad en/privacy; do curl -sL -A "Mozilla/5.0 (compatible; Googlebot/2.1)" "https://solutionspjm.com/$p" -o "$D/${p//\//_}.html"; done
curl -sI https://solutionspjm.com/ ; curl -sI https://www.solutionspjm.com/ ; curl -sI http://solutionspjm.com/
curl -s https://solutionspjm.com/robots.txt ; curl -s https://solutionspjm.com/sitemap.xml
curl -s -o /dev/null -w '%{http_code}\n' https://solutionspjm.com/es/no-existe   # debe ser 404
```

Rendimiento real (si la cuota de la API se agota, pide al usuario que abra pagespeed.web.dev):
`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://solutionspjm.com/es&strategy=mobile&category=performance&category=seo`

## Paso 2 — Analizar (cadena de pensamiento)

Para cada idioma extrae y evalúa con un script de Python (`python -I`):

| Área | Qué revisar | Correcto si… |
| --- | --- | --- |
| Indexación | `robots`, `meta robots`, canonical, hreflang, sitemap | Todo 200, canonical propio, hreflang recíproco, `lastmod` presente |
| Redirecciones | `/`, `www`, `http` | Un solo salto hacia `https://solutionspjm.com/es` |
| Título/descr. | `<title>`, `meta description` | 50–60 / 140–160 caracteres, palabra clave + ciudad + CTA |
| Encabezados | `h1`, `h2`, `h3` | Un `h1` con la búsqueda objetivo; `h2` con servicios buscables |
| Contenido | Nº de palabras, páginas indexables | > 800 palabras por página clave y **una página por servicio/sector** |
| Datos estructurados | JSON-LD | `LocalBusiness`/`ProfessionalService` con `geo`, `sameAs` completos, horario real |
| Imágenes | `alt` | Las de proyectos y equipo con `alt` descriptivo; solo las decorativas con `alt=""` |
| Confianza | Portafolio, testimonios, correo de dominio, reseñas | Casos con resultado medible y reseñas de Google |
| Conversión | CTA, mensaje prellenado de WhatsApp, objeciones del FAQ | Ninguna respuesta del FAQ ahuyenta al cliente |
| Medición | Vercel Analytics, Search Console, eventos de clic en WhatsApp | Se sabe cuántas visitas y cuántos clics a WhatsApp hay |

Después verifica la **presencia fuera del sitio** (esto suele explicar el "nadie entra"):

- Busca `solutionspjm`, `"solutionsPJM"` y `site:solutionspjm.com`. Si la marca no aparece, el sitio no está
  indexado o no tiene autoridad.
- Busca 3–5 consultas comerciales reales (p. ej. "desarrollo de software a medida Cartago",
  "sistema de inventario Costa Rica", "facturación electrónica Hacienda sistema a medida") y anota quién
  sale: esos son los competidores y los directorios donde hay que estar (Clutch, LinkedIn empresa, GoodFirms,
  CAMTIC, Google Maps).
- Revisa si existe Perfil de Empresa de Google (Google Maps) y página de empresa en LinkedIn/Facebook.

Si el usuario puede, pide datos reales: Search Console (impresiones, consultas, páginas indexadas) y
Vercel Analytics (visitas, referentes, países). Sin datos, márcalo como suposición.

## Paso 3 — Clasificar los hallazgos

Agrupa cada hallazgo en una de estas causas y asígnale prioridad (P0 bloquea, P1 alto impacto, P2 mejora):

1. **No indexado / no medido** — Google no conoce el sitio o no hay forma de saberlo.
2. **Sin autoridad** — dominio nuevo, cero enlaces y menciones, sin Perfil de Google.
3. **Poco contenido** — una sola landing compitiendo por "software a medida Costa Rica" contra agencias grandes.
4. **Baja confianza / conversión** — falta prueba social, correo genérico, FAQ que genera objeciones.
5. **Técnico** — errores de metadatos, redirecciones, rendimiento, `alt`, sitemap.

## Paso 4 — Cómo atraer clientes

Propón acciones concretas, ordenadas por impacto/esfuerzo:

- **Google primero**: Search Console (verificar dominio, enviar sitemap, pedir indexación de `/es` y `/en`)
  y Perfil de Empresa de Google en Paraíso de Cartago con fotos, servicios y **reseñas de cada cliente**.
- **Directorios y citas NAP idénticas**: LinkedIn empresa, Facebook, Clutch, GoodFirms, CAMTIC, Páginas
  Amarillas CR. Mismo nombre, teléfono y dominio en todos; añadirlos a `sameAs` del JSON-LD.
- **Páginas de servicio y sector** (long tail): inventario, punto de venta, facturación electrónica
  Hacienda, reservas/citas, sistemas para ferreterías, sodas/restaurantes, clínicas, fincas. Una URL por
  tema con problema → solución → caso → FAQ → CTA.
- **Casos de estudio** con números ("redujimos X horas de inventario por semana").
- **Contenido local útil**: guías sobre facturación electrónica v4.x, SINPE, digitalizar un negocio en CR.
- **Canales directos**: Instagram/TikTok con demos cortas, grupos de comercio local, visitas a negocios de
  Cartago, alianzas con contadores (recomiendan sistemas a sus clientes) y referidos con descuento.
- **Medir conversiones**: evento al hacer clic en WhatsApp/correo (Vercel Analytics `track`).

## Paso 5 — Entregar el informe

Formato de salida:

1. Resumen de 3 líneas: por qué no llega gente.
2. Tabla `# | Prioridad | Problema (hecho medido) | Causa | Solución | Esfuerzo`.
3. Plan de 30 días por semana.
4. Dudas de negocio que solo el equipo puede responder (no supongas reglas del negocio).
5. Fuentes: URLs consultadas.

Si el usuario aprueba cambios de código, crea `docs/specs/NNN-seo-.../` y delega con `planner`.
