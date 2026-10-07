# Spec 007: Política de privacidad

## Problema
La landing invita a escribir por WhatsApp y por correo, y mide visitas con Vercel Analytics, pero
no dice qué datos se tratan, para qué ni cómo pedir su borrado. En Costa Rica aplica la Ley 8968
(protección de datos personales); a clientes de otros países (UE) les puede aplicar el RGPD. Sin
política, el sitio transmite menos confianza a clientes internacionales.

## Solución
Una página de política de privacidad en `es` y `en`, enlazada desde el footer, con un texto corto
y claro sobre los datos que el sitio y los canales de contacto realmente manejan.

## Objetivo
Que cualquier visitante sepa qué datos suyos se tratan, con qué fin y cómo ejercer sus derechos,
y que el sitio cumpla lo básico de la Ley 8968.

## Alcance
1. **Página** de privacidad por idioma, dentro del layout `[lang]` (mismas fuentes, colores e ícono).
2. **Enlace** «Privacidad» / «Privacy» en el footer, en ambos idiomas.
3. **Contenido** en el módulo `company-profile` (`es` y `en`), validado al cargarse, igual que el
   resto de textos.
4. **SEO:** `title` y `description` propios, `canonical` y `alternates` por idioma, e inclusión en
   `sitemap.ts`. Se indexa (no es `noindex`).
5. **Fecha de última actualización** visible en la página.
6. **Alternates cruzados:** `/es/privacidad` ↔ `/en/privacy` (hreflang y selector de idioma, si
   existe en la página).
7. **Imagen de cabecera** `public/privacidad/` (escudo con candado sobre raíces), decorativa, a
   prueba: el negocio decide si queda tras verla (2026-10-07).

## Fuera de alcance
- Términos y condiciones (no hay ventas, cuentas ni pagos en la web; las condiciones van en cada
  contrato).
- Banner o gestor de cookies: hoy el sitio no usa cookies propias ni de terceros para medir.
- Formularios, registro de solicitudes o automatización de derechos ARCO.
- Inscripción de bases de datos ante la PRODHAB.
- Redactar el texto legal definitivo: lo aprueba el negocio y, recomendado, un abogado.

## Hechos del sitio (verificados en el código, 2026-10-07)
- **Sin formularios ni cuentas:** el sitio no recibe datos por sí mismo.
- **WhatsApp:** los botones abren `wa.me` con un mensaje predefinido; lo que el visitante envíe
  lo procesa WhatsApp (Meta) y llega al número `+506 6440-0832`.
- **Correo:** enlace `mailto:` a `solutionspjm@gmail.com` (Gmail, Google).
- **Vercel Analytics** (`@vercel/analytics` en `[lang]/layout.tsx`): métricas de visitas
  agregadas, sin cookies.
- **Alojamiento:** Vercel; sus servidores registran datos técnicos de la petición (IP, navegador)
  y pueden estar fuera de Costa Rica.
- **Responsable publicado:** solutionsPJM, Paraíso de Cartago, Costa Rica.

## Contenido mínimo de la política
Secciones, en este orden (el texto final está pendiente):
1. Responsable y contacto.
2. Qué datos tratamos: los mensajes y datos de contacto que el visitante nos envía por WhatsApp o
   correo; métricas anónimas de visitas; datos técnicos del alojamiento.
3. Para qué: responder consultas, preparar cotizaciones y dar seguimiento a proyectos; mejorar el
   sitio con métricas agregadas.
4. Base: consentimiento del visitante al escribirnos.
5. Terceros que intervienen: Meta (WhatsApp), Google (Gmail) y Vercel (alojamiento y analítica),
   con transferencia internacional de datos.
6. Cuánto tiempo los conservamos.
7. Derechos (acceso, rectificación, cancelación/supresión y oposición) y cómo ejercerlos por
   correo; posibilidad de reclamar ante la PRODHAB.
8. Cookies: el sitio no usa cookies de seguimiento.
9. Cambios a la política y fecha de última actualización.

## Reglas del negocio
Confirmadas por el negocio (2026-10-07):
- **Responsable:** se publica solo el nombre comercial solutionsPJM, Paraíso de Cartago, Costa
  Rica. Sin nombre de persona ni cédula (cambio del negocio, 2026-10-07).
- **Conservación:** 12 meses desde el último contacto para quien no contrata; luego se borran.
- **Solicitudes de derechos:** al correo `solutionspjm@gmail.com`; respuesta en un máximo de
  5 días hábiles (compromiso propio).
- **RGPD:** se menciona expresamente para visitantes de la UE.
- **URL con slug por idioma:** `/es/privacidad` y `/en/privacy`. `/en/privacidad` y
  `/es/privacy` responden 404.
- **Sin revisión de abogado:** se publica con texto propio, claro y sin promesas que el equipo no
  pueda cumplir. Riesgo aceptado por el negocio.
- **Textos:** borrador en `contenido.md` de esta spec; se copian literalmente al módulo.

## Dudas abiertas
- Aprobación final de los textos de `contenido.md`.

## Criterios de aceptación
- La página de privacidad responde 200 en `es` y `en`, con el contenido aprobado y la fecha de
  última actualización.
- El footer enlaza a la página del idioma activo en ambos idiomas.
- `sitemap.xml` incluye ambas URLs con `alternates`; cada una tiene `canonical`, `title` y
  `description` propios.
- El contenido vive en `company-profile` y la validación rechaza secciones vacías.
- Encabezados en orden (`h1` → `h2`), legible en 390 px y 1440 px, sin scroll horizontal.
- `pnpm validate` en verde.
