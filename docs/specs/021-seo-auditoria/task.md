# Tareas 021

- [x] T01 Correo `info@solutionspjm.com` y política de privacidad (C1–C2). Pruebas primero. Un commit.
  - Evidencia: rojo 16 pruebas; verde 258/258.
- [x] T02 Horario lunes a sábado 07:00–21:00 y FAQ sin 24/7 (C3–C5), con enmiendas de contenido. Un commit.
  - Evidencia: rojo 8 pruebas; verde 258/258.
- [x] T03 Evento `Contacto` en clics de WhatsApp y correo (C6). Un commit.
  - Evidencia: rojo (módulo inexistente); verde 262/262. La política de privacidad lista los clics de contacto.
- [x] T04 `lastModified` en el sitemap (C7). Un commit.
  - Evidencia: rojo 1 prueba; verde 262/262.
- [x] T05 `pnpm validate` en verde y sincronizar docs. Un commit.
  - Evidencia: Prettier en 3 archivos; `pnpm validate` OK (262/262, sin violaciones de capas, build estático). `docs/contexto/` no menciona correo ni horario: sin cambios.

## Correcciones de la revisión (reviwer, 2026-10-20)

- [x] T06 La prueba del tracker usa las URLs de `buildWhatsAppUrl` y `buildEmailComposeUrl`: si un builder
  cambia de dominio, la prueba falla. Un commit.
- [x] T07 Sincronizar `docs/specs/007-privacidad/spec.md` (correo, Zoho, clics de contacto) y añadir C8 a
  la spec 021. Un commit.
- Descartado: `privacyPolicySource.ts` con 151 líneas (ya estaba en 150; partirlo excede esta spec).
