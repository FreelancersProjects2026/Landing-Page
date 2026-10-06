# Plan técnico: Contacto por WhatsApp y correo

## Referencias
- Especificación: `docs/specs/005-contacto/spec.md`.
- Contenido vigente: `docs/specs/003-generarContenido/contenido.md`.

## Bloqueo
Resueltas el 2026-10-06: opciones y textos de WhatsApp, correo en minúsculas, `mailto:` sin
asunto, textos de alcance internacional y `areaServed` mundial. La verificación con lector de
pantalla se difiere (T23). Quedan abiertas: si los botones actuales (hero, header, CTA, footer)
también muestran opciones, si se borran los íconos viejos y si se aprueba un logo simplificado
para tamaños chicos.

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

## Ícono del sitio y alcance internacional (alcance 6 y 7)

### Ícono
- Hoy el sitio no enlaza ningún ícono: `public/icon.svg`, `icon-*-32x32.png` y `apple-icon.png`
  no se usan en el código (se ve el ícono por defecto).
- `generateMetadata` de `src/app/[lang]/layout.tsx` agrega `icons.icon` e `icons.apple` →
  `/logo/icono/LogoPJM.jpeg` (una sola fuente, sin copiar el archivo). Next genera los `<link>`.
- Google pide un favicon cuadrado de al menos 48×48 px (recomienda múltiplos de 48): el JPEG de
  1024×1024 no es múltiplo de 48, pero es cuadrado y mayor de 48 px, así que se acepta.
  `robots.ts` ya permite rastrearlo; Google lo actualiza en su próximo rastreo.
- Mejora opcional (no se hace ahora): PNG de 48, 96 y 192 px, `apple-icon` de 180 px y
  `/favicon.ico`.
- Los íconos viejos se borran solo si el negocio lo confirma (duda abierta).
- Prueba: `layout.test.tsx` comprueba `icons` en `/es` y `/en`.

### Alcance internacional
- Aprobado el 2026-10-06 (T21): subtítulo del hero y texto del footer en `es` y `en`.
  - es: «Desde Costa Rica desarrollamos software a medida para negocios de cualquier país: …»;
    footer: «… en Cartago para negocios de Costa Rica y del mundo.»
  - en: «From Costa Rica, we build custom software for businesses anywhere: …»; footer:
    «… in Cartago for businesses in Costa Rica and around the world.»
- Título, descripción y H1 conservan «Costa Rica» (regla SEO de la Spec 003).
- Textos aprobados → `contenido.md` (enmienda aprobada) y `landingContentSource.ts`; la prueba de
  copia literal los verifica.
- `areaServed` del JSON-LD pasa a texto `Worldwide` (aprobado el 2026-10-06, T22); la dirección
  sigue en Costa Rica. Figura en `contenido.md` (datos comunes) y la prueba de copia literal lo
  verifica.
