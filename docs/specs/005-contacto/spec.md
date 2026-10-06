# Spec 005: Contacto, ícono del sitio y alcance internacional

## Problema
Hoy los 5 enlaces de contacto abren WhatsApp con un único mensaje genérico
(`whatsappMessage`). No hay botón de WhatsApp siempre visible, el cliente no puede elegir el motivo
de su mensaje y el correo `solutionspjm@gmail.com` no aparece en la web.
El ícono de la pestaña y de Google no es el logo de la marca, y los textos solo hablan de
clientes en Costa Rica: no dejan claro que también trabajamos para clientes de otros países.

## Solución
Agregar un botón flotante de WhatsApp con varias opciones de mensaje predefinido según el motivo
de contacto, y publicar el correo como canal alternativo. Usar el logo como ícono del sitio y
explicar que somos de Costa Rica y desarrollamos software para clientes de cualquier país.

## Objetivo
Que los clientes nos contacten de forma confiable, por el canal que prefieran y con un mensaje
claro desde el primer contacto.

## Alcance
1. **Botón flotante de WhatsApp** abajo a la derecha, visible en toda la landing (`/es` y `/en`).
2. **Menú de opciones:** al abrirlo, el cliente elige un motivo; cada opción abre WhatsApp con su
   mensaje predefinido en el idioma de la página.
3. **Correo** `solutionspjm@gmail.com` como enlace `mailto:` en la sección de contacto y en el
   footer.
4. **Contenido** (opciones, mensajes y correo) en el módulo `company-profile`, en `es` y `en`.
5. **Validación** en el límite de infraestructura: teléfono, correo y opciones bien formados.
6. **Ícono del sitio:** `public/logo/icono/LogoPJM.jpeg` como ícono de pestaña (favicon), ícono de
   Apple y el que muestra Google en los resultados, en `/es` y `/en`.
7. **Alcance internacional:** textos `es` y `en` (hero, SEO, footer y datos estructurados) que
   muestren que somos de Costa Rica y atendemos clientes de cualquier país.
8. **Resultado en Google:** al buscar «solutionsPJM» el resultado muestra el logo y una
   descripción que dice que somos de Costa Rica y hacemos software para cualquier país.

## Fuera de alcance
- Formulario de contacto, backend o envío de correos desde la web.
- WhatsApp Business API, chatbots o respuestas automáticas.
- Analítica de clics por opción.
- Correo con dominio propio (`@solutionspjm.com`).
- Rediseñar el logo o crear otras versiones de marca.
- Controlar cuándo Google actualiza el ícono en sus resultados (depende de su rastreo).

## Reglas del negocio
- Un solo número de WhatsApp (`+506 6440-0832`) y un solo correo para todo el sitio.
- Cada opción tiene etiqueta y mensaje; ambos existen en `es` y `en`.
- Toda URL de WhatsApp se genera con `buildWhatsAppUrl` (sin URLs escritas a mano).
- Los enlaces de WhatsApp actuales (hero, header, CTA, footer) siguen funcionando.
- El correo se publica en minúsculas (`solutionspjm@gmail.com`): el correo no distingue
  mayúsculas y así se evita duplicarlo con otra escritura. Confirmado por el negocio (2026-10-06).
- El `mailto:` no lleva asunto predefinido. Confirmado por el negocio (2026-10-06).
- Las opciones del botón flotante y sus mensajes son los de `contenido.md` (Spec 003, enmienda
  2026-10-06): «Cotizar un proyecto», «Soporte de un sistema existente» y «Otra consulta», con su
  traducción al inglés. Aprobados por el negocio (2026-10-06).
- El ícono es el logo oficial `LogoPJM.jpeg` (cuadrado, 1024×1024); no se modifica su diseño.
- Costa Rica se mantiene como origen y palabra clave principal (regla SEO de la Spec 003).
- Alcance internacional: el subtítulo del hero y el texto del footer dicen que desde Costa Rica
  atendemos negocios de cualquier país (textos en `contenido.md`, enmienda 2026-10-06); título y
  H1 no cambian. Aprobado por el negocio (2026-10-06).
- La descripción SEO (`es` y `en`) también pasa a alcance internacional, conserva «Costa Rica» y
  no supera 160 caracteres. Texto pendiente de aprobación (ver dudas).
- `areaServed` del JSON-LD es `Worldwide`; la dirección sigue en Costa Rica. Aprobado por el
  negocio (2026-10-06).

## Dudas abiertas
- [PENDIENTE] ¿Los botones actuales siguen con el mensaje genérico o también muestran opciones?
- [PENDIENTE] ¿Se reemplazan y borran los íconos actuales (`public/icon.svg`, `icon-*-32x32.png`,
  `apple-icon.png`)?
- [PENDIENTE] ¿Se aprueba una versión simplificada del logo (solo "PJM") para 16–48 px? A tamaño
  de pestaña el texto pequeño no se lee.
- [PENDIENTE] Aprobar la descripción SEO propuesta:
  - es: «Desarrollo de software a medida desde Costa Rica para negocios de cualquier país: sistemas
    de gestión, control y métricas. Cotiza tu proyecto por WhatsApp.» (155 caracteres)
  - en: «Custom software development from Costa Rica for businesses anywhere: management, tracking
    and metrics systems. Get a quote for your project on WhatsApp.» (152 caracteres)

## Criterios de aceptación
- [x] El botón flotante aparece en `/es` y `/en` y no tapa contenido en móvil.
- [x] El menú abre y cierra con mouse y teclado (`Esc`), con `aria-expanded`; la prueba con lector
      de pantalla real queda diferida (2026-10-06, T23).
- [x] Cada opción abre `https://wa.me/50664400832?text=…` con su mensaje del idioma activo.
- [x] El correo aparece en contacto y footer como `mailto:solutionspjm@gmail.com`.
- [x] Contenido inválido (opción sin mensaje, correo mal formado) falla con pruebas unitarias.
- [x] Los componentes de `src/components/landing/` reciben textos por props, sin reglas de negocio.
- [ ] La pestaña muestra `LogoPJM` en `/es` y `/en`; el HTML enlaza favicon y `apple-touch-icon`.
- [ ] El favicon tiene un tamaño múltiplo de 48 px y Google puede descargarlo en producción.
- [ ] La descripción SEO aprobada está en `/es` y `/en`; tras el nuevo rastreo, Google muestra el
      logo y la descripción nueva (depende de Google).
- [x] Los textos aprobados indican origen Costa Rica y atención a clientes de cualquier país,
      sin perder la palabra clave principal en título, descripción y H1.
- [x] `pnpm validate` pasa en verde.
