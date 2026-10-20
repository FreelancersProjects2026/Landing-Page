# Plan 021

- **Correo (C1–C2):** `landingContentSource.ts` cambia `company.email`. `privacyPolicySource.ts` reemplaza
  el correo escrito a mano por el de la fuente común (NAP una sola vez), cambia Gmail por Zoho y actualiza
  la fecha. Pruebas que usan el contenido real (`page.test.tsx`, `structured-data.test.ts`,
  `landingContentSource.test.ts`, `landing-sections.test.tsx`) cambian primero. Las pruebas de
  `validateEmail`/`buildEmailComposeUrl` usan el correo como dato de ejemplo y no cambian.
- **Horario y FAQ (C3–C5):** `openingHours` y `footer.hours`/FAQ en ES/EN de `landingContentSource.ts`.
  El dominio ya admite un solo bloque de días: no cambia. Enmiendas en `003-generarContenido/contenido.md`
  y `008-faq/contenido.md`.
- **Evento de contacto (C6):** componente cliente `src/app/[lang]/contact-click-tracker.tsx` montado en el
  layout junto a `<Analytics />`. Un solo listener de `click` en `document` reconoce los enlaces por
  `href` y llama a `track` de `@vercel/analytics` (ya instalado). Ningún componente de la landing cambia.
- **Sitemap (C7):** `sitemap.ts` añade `lastModified` con la fecha del build (ruta estática).
- **Docs:** `docs/contexto/decisiones.md` si registra horario o correo.
