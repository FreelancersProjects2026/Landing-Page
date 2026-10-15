# Plan 018

- `company-profile/application/landingContent.ts`: `buildMailtoUrl` pasa a `buildEmailComposeUrl`, que
  arma la URL de Gmail con `encodeURIComponent(email)`. Se reexporta desde `index.ts`.
- `src/app/[lang]/page.tsx` calcula `emailUrl` con la función nueva; las secciones siguen recibiéndolo por props.
- `cta-section.tsx`: el `<a>` del correo recibe `externalLinkProps`.
- `footer-section.tsx`: el `FooterContactLink` del correo recibe `external`.
- Pruebas: aplicación (C1), sección CTA y página por idioma (C2–C4).
