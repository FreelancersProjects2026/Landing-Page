# Plan técnico: Contacto por WhatsApp y correo

## Referencias
- Especificación: `docs/specs/005-contacto/spec.md`.
- Contenido vigente: `docs/specs/003-generarContenido/contenido.md`.

## Bloqueo
Las dudas abiertas de la spec (opciones, textos, asunto del `mailto:`) deben resolverse antes de
la fase 3. Las fases 1 y 2 no dependen de ellas.

## Enfoque
El correo y las opciones de WhatsApp son datos de la empresa: viven en `company-profile`, se
validan al cargarse (mismo criterio que la spec 003: contenido inválido rompe el build) y se
exponen por `index.ts`. La página arma las URLs (`buildWhatsAppUrl`, `buildMailtoUrl`) y los
componentes de `landing/` solo reciben `{ label, url }` por props. Sin dependencias nuevas: el menú
usa `dropdown-menu` de shadcn/ui (Radix), que ya resuelve teclado, `Esc`, foco y `aria-expanded`.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `modules/company-profile/domain/email.ts` | Nuevo | `validateEmail`: formato válido y en minúsculas. |
| `modules/company-profile/domain/landingContent.ts` | Ampliar | `Contact.email`; `LandingContent.whatsapp` con `label` del botón y `options: { label, message }[]`; la validación exige al menos una opción. |
| `modules/company-profile/application/landingContent.ts` | Ampliar | `buildMailtoUrl(email)` → `mailto:solutionspjm@gmail.com`. |
| `modules/company-profile/infrastructure/landingContentSource.ts` | Ampliar | `email` validado en `company`; opciones y textos en `es` y `en`. |
| `modules/company-profile/index.ts` | Actualizar | Exporta `buildMailtoUrl`. |
| `components/landing/whatsapp-button.tsx` | Nuevo | Botón flotante + menú; recibe `label` y `options: ExternalLink[]`. |
| `components/landing/cta-section.tsx` | Ampliar | Enlace `mailto:` debajo del botón de WhatsApp. |
| `components/landing/footer-section.tsx` | Ampliar | Enlace `mailto:` junto al teléfono. |
| `app/[lang]/page.tsx` | Ampliar | Arma URLs de opciones y `mailto:`; monta el botón flotante. |

## Decisiones técnicas
- **Reuso de tipos:** las opciones ya resueltas se pasan como `ExternalLink` (`label`, `url`); no
  se crea un tipo nuevo para la UI.
- **Textos vacíos:** la validación genérica actual (`collectTexts`) ya rechaza etiquetas y
  mensajes vacíos o `[PENDIENTE]`; solo se agrega la regla de mínimo una opción.
- **Correo en minúsculas:** se valida en dominio, así una escritura con mayúsculas no compila.
- **Enlaces actuales:** hero, navegación, CTA y footer conservan `whatsappMessage` hasta que se
  resuelva la duda correspondiente.
- **Posición:** esquina inferior derecha, `fixed`, con margen seguro en móvil
  (`env(safe-area-inset-bottom)`) para no tapar el contenido ni la barra del navegador.
- **Textos de las opciones:** aprobados el 2026-10-06 (T12) y copiados a `contenido.md`; la
  prueba de copia literal los verifica como al resto del contenido.
- **Colores:** el botón usa `bg-foreground`/`text-background` como los CTA; el verde de WhatsApp
  con icono blanco no alcanza el contraste 3:1 de WCAG.
- **Accesibilidad:** el botón lleva `aria-label` traducido; las opciones son enlaces reales
  (`<a>`) con `externalLinkProps`, navegables sin JavaScript extra.

## Pruebas (TDD)
1. **Dominio:** `validateEmail` acepta `solutionspjm@gmail.com`; rechaza mayúsculas, sin `@`,
   sin dominio y vacío. `validateLandingContent` rechaza `options` vacío.
2. **Aplicación:** `buildMailtoUrl` produce `mailto:` correcto.
3. **Infraestructura:** `es` y `en` cargan con el mismo correo y la misma cantidad de opciones.
4. **Componentes:** `whatsapp-button` muestra cada opción con su `href` al abrirse; CTA y footer
   muestran el `mailto:` (`landing-sections.test.tsx`).
5. **Página:** cada opción abre `https://wa.me/50664400832?text=…` con el mensaje del idioma; se
   actualiza el conteo de enlaces de WhatsApp en `page.test.tsx`.

## Fases
1. **Correo:** dominio, aplicación, infraestructura, CTA y footer (TDD).
2. **Botón flotante:** componente con opciones de prueba en los tests (TDD).
3. **Contenido real:** opciones y mensajes aprobados en `es` y `en`; montar el botón en la página.
4. **Verificación:** `pnpm validate`; `pnpm dev` y probar en móvil y escritorio, teclado y lector
   de pantalla; marcar criterios en la spec. Un commit por fase.

## Riesgos
- **Spam al correo publicado:** riesgo conocido al publicar un correo; si crece, un formulario (fuera de
  alcance) lo mitiga.
- **Superposición en móvil:** el botón flotante puede tapar CTA o footer; se revisa en la fase 4.
