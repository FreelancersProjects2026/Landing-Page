# Spec 005: Contacto por WhatsApp y correo

## Problema
Hoy los 5 enlaces de contacto abren WhatsApp con un único mensaje genérico
(`whatsappMessage`). No hay botón de WhatsApp siempre visible, el cliente no puede elegir el motivo
de su mensaje y el correo `Solutionspjm@gmail.com` no aparece en la web.

## Solución
Agregar un botón flotante de WhatsApp con varias opciones de mensaje predefinido según el motivo
de contacto, y publicar el correo como canal alternativo.

## Objetivo
Que los clientes nos contacten de forma confiable, por el canal que prefieran y con un mensaje
claro desde el primer contacto.

## Alcance
1. **Botón flotante de WhatsApp** abajo a la izquierda, visible en toda la landing (`/es` y `/en`).
2. **Menú de opciones:** al abrirlo, el cliente elige un motivo; cada opción abre WhatsApp con su
   mensaje predefinido en el idioma de la página.
3. **Correo** `Solutionspjm@gmail.com` como enlace `mailto:` en la sección de contacto y en el
   footer.
4. **Contenido** (opciones, mensajes y correo) en el módulo `company-profile`, en `es` y `en`.
5. **Validación** en el límite de infraestructura: teléfono, correo y opciones bien formados.

## Fuera de alcance
- Formulario de contacto, backend o envío de correos desde la web.
- WhatsApp Business API, chatbots o respuestas automáticas.
- Analítica de clics por opción.
- Correo con dominio propio (`@solutionspjm.com`).

## Reglas del negocio
- Un solo número de WhatsApp (`+506 6440-0832`) y un solo correo para todo el sitio.
- Cada opción tiene etiqueta y mensaje; ambos existen en `es` y `en`.
- Toda URL de WhatsApp se genera con `buildWhatsAppUrl` (sin URLs escritas a mano).
- Los enlaces de WhatsApp actuales (hero, header, CTA, footer) siguen funcionando.
- El correo se publica en minúsculas (`solutionspjm@gmail.com`): el correo no distingue
  mayúsculas y así se evita duplicarlo con otra escritura.

## Dudas abiertas
- [PENDIENTE] ¿Qué opciones de mensaje? Propuesta: «Cotizar un proyecto», «Soporte de un
  sistema existente», «Otra consulta».
- [PENDIENTE] ¿Texto exacto de cada mensaje?
- [PENDIENTE] ¿Los botones actuales siguen con el mensaje genérico o también muestran opciones?
- [PENDIENTE] ¿El correo lleva asunto predefinido en el `mailto:`?
- [PENDIENTE] ¿Se confirma publicar el correo en minúsculas?

## Criterios de aceptación
- [ ] El botón flotante aparece en `/es` y `/en` y no tapa contenido en móvil.
- [ ] El menú abre y cierra con mouse, teclado (`Esc`) y lector de pantalla (`aria-expanded`).
- [ ] Cada opción abre `https://wa.me/50664400832?text=…` con su mensaje del idioma activo.
- [ ] El correo aparece en contacto y footer como `mailto:solutionspjm@gmail.com`.
- [ ] Contenido inválido (opción sin mensaje, correo mal formado) falla con pruebas unitarias.
- [ ] Los componentes de `src/components/landing/` reciben textos por props, sin reglas de negocio.
- [ ] `pnpm validate` pasa en verde.
