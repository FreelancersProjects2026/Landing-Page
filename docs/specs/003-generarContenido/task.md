# Tareas: Implementar el contenido de la landing de PJM Solutions

## Base acordada
- Spec: `docs/specs/003-generarContenido/spec.md`. Plan: `plan.md`. Textos: `contenido.md`.
- Rama: `startingLanding`.
- Método: TDD (prueba que falla → código mínimo → refactor) y `pnpm validate` en verde tras cada tarea.
- Un commit por tarea.

## Tareas
- [ ] T01 Confirmar la aprobación de `contenido.md` por el equipo y ejecutar `pnpm validate` como
      línea base.
- [ ] T02 Dominio: tipos del contenido (`Locale`, `Seo`, `Service`, `Project`, `TeamMember`,
      `Contact`, `LandingContent`) y validaciones (título ≤ 60, descripción ≤ 160, palabra clave,
      textos no vacíos, sin `[PENDIENTE]`).
- [ ] T03 Aplicación: `buildWhatsAppUrl(phone, message)` y `getLandingContent(locale)`, que rechaza
      idiomas desconocidos.
- [ ] T04 Infraestructura: cargar los textos ES/EN de `contenido.md` con datos comunes compartidos
      (nombre, ubicación, WhatsApp, enlaces del equipo); retirar `CompanyProfileSection`,
      `useCompanyProfile` y actualizar `index.ts`.
- [ ] T05 Rutas: `src/app/[lang]/` con `generateStaticParams`, `dynamicParams = false`, `lang` del
      documento, y redirección de `/` a `/es` en `next.config.mjs`.
- [ ] T06 SEO: `generateMetadata` por idioma (título, descripción, `openGraph`), quitar los metadatos
      de COMPUTE y añadir el JSON-LD `ProfessionalService`.
- [ ] T07 Secciones existentes: adaptar menú (anclas, WhatsApp, selector ES/EN), hero (único `<h1>`),
      servicios, cómo trabajamos, contacto y footer para recibir el contenido por props.
- [ ] T08 Secciones nuevas: crear proyectos y equipo; eliminar las secciones de la plantilla fuera de
      alcance y todo recurso sin uso (`placeholder-*`, `public/images/*`, `ascii-scene.tsx`,
      `three`/`@react-three/fiber` si quedan sin uso).
- [ ] T09 Página: reescribir `page.test.tsx` por idioma (7 secciones en orden, un `<h1>`, botones a
      WhatsApp, hidratación) y componer `src/app/[lang]/page.tsx`.
- [ ] T10 Cierre: `pnpm validate` en verde, revisión manual en `/es` y `/en` (móvil, escritorio,
      Lighthouse), marcar criterios de la spec y sincronizar plan, `README.md` y `docs/contexto/`.
