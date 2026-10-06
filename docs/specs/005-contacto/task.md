# Tareas: Botón flotante de WhatsApp

## Base acordada
- Spec: `docs/specs/005-contacto/spec.md`. Plan: `plan.md`.
- Rama: `contact/feature`.
- Alcance de esta lista: solo el botón flotante (el correo va aparte).
- Posición: esquina **inferior derecha**.
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.

## Tareas
- [x] T01 Línea base: `pnpm validate` en verde antes de tocar nada.
- [x] T02 Dominio: `LandingContent.whatsapp` con `label` del botón y
      `options: { label, message }[]`. La validación rechaza `options` vacío.
- [x] T03 Infraestructura: opciones y textos en `es` y `en`. Usar la propuesta de la spec solo
      como marcador hasta que se aprueben los textos.
- [x] T04 Prueba de infraestructura: `es` y `en` tienen la misma cantidad de opciones.
- [x] T05 Componente `whatsapp-button.tsx`: recibe `label` y `options: ExternalLink[]`. Sin reglas
      de negocio.
- [x] T06 Prueba del componente: al abrir, cada opción es un `<a>` con su `href` y
      `externalLinkProps`. El botón tiene `aria-label` y `aria-expanded`.
- [x] T07 Menú con `dropdown-menu` de shadcn: abre con clic y `Enter`, cierra con `Esc`, el foco
      vuelve al botón.
- [x] T08 Estilo: `fixed` abajo a la derecha, con margen `env(safe-area-inset-bottom)` y por
      encima del contenido (`z-index`).
- [x] T09 Página: `page.tsx` arma la URL de cada opción con `buildWhatsAppUrl` y monta el botón.
- [x] T10 Prueba de página: cada opción abre `https://wa.me/50664400832?text=…` con el mensaje
      del idioma activo. Ajustar el conteo de enlaces en `page.test.tsx`.
- [ ] T11 Revisión manual con `pnpm dev`: móvil y escritorio, teclado, lector de pantalla. El
      botón no tapa CTA, footer ni la barra del navegador.
      - Verificado en Chrome con el botón a la derecha (`/es` y `/en`, escritorio 1440×900 y
        móvil 390×844): con el menú cerrado el botón se ve y recibe clics; con el menú móvil
        abierto lo tapa el CTA del menú (no se ve ni recibe toques); el dropdown queda dentro de
        la pantalla con 3 opciones; al final de la página no hay nada debajo del botón y la
        columna derecha del footer termina por encima de él.
      - Al desplazarse en móvil, el botón pasa por encima del contenido; entre los controles, solo
        los botones de los pasos de «Cómo trabajamos» quedan debajo en 1 o 2 posiciones de
        desplazamiento, y se pueden tocar al seguir desplazando.
      - Teclado (`Enter` abre, `Esc` cierra, el foco vuelve) verificado con teclas reales con el
        botón a la izquierda; no depende de la posición y lo cubren las pruebas del componente.
      - Sin verificar: lector de pantalla real (NVDA/VoiceOver) y la barra de un navegador móvil
        real con `safe-area-inset-bottom`.
- [ ] T12 Contenido aprobado: reemplazar los textos marcadores por los definitivos (`es` y `en`).
- [x] T13 Cierre: marcar criterios de la spec, sincronizar el plan y correr `pnpm validate`.
