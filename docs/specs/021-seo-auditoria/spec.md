# Spec 021: correcciones de la auditoría SEO

## Problema
La auditoría con la skill `seo-costumers-solutionspjm` (2026-10-20) dejó 11 hallazgos. El equipo ya
resolvió fuera del código los #1 (Search Console) y #2 (Perfil de Empresa de Google). Esta spec cubre los
que dependen del código y quedan dentro del alcance acordado.

## Decisiones del negocio (confirmadas por el usuario, 2026-10-20)
- **#3 Horario:** lunes a sábado de 07:00 a 21:00; domingos cerrado. Reemplaza el 24/7 de la spec 016.
- **#4 Código fuente:** se mantiene el texto del FAQ. Descartado.
- **#5 `sameAs`:** hoy solo existe Instagram; no se agregan URLs inventadas. Pendiente hasta crear perfiles
  (la lista ya sale de `company.socialProfiles`, basta con agregarlos ahí).
- **#6 / #7 Páginas por servicio y casos de estudio:** fuera de esta spec (spec futura, con textos y métricas reales).
- **#8 Correo:** el nuevo correo es `info@solutionspjm.com` (MX en Zoho). Los botones siguen abriendo Gmail
  web (spec 018).
- **#10 `alt`:** descartado tras revisar el código: las 7 imágenes son decorativas (`aria-hidden`, fondos o
  logo junto al nombre); `alt=""` es lo correcto.

## Criterios
- C1. `company.email` es `info@solutionspjm.com`; JSON-LD, sección de contacto, footer y política de
  privacidad (ES/EN) lo muestran. No queda `solutionspjm@gmail.com` en el contenido del sitio.
- C2. La política de privacidad nombra a Zoho como proveedor de correo en lugar de Gmail y su fecha de
  actualización pasa a 20 de octubre de 2026.
- C3. `openingHoursSpecification` del JSON-LD: lunes a sábado, `07:00`–`21:00`, sin domingo.
- C4. Footer: «Lunes a sábado, 7:00 a. m. a 9:00 p. m. Domingos cerrado.» /
  «Monday to Saturday, 7:00 a.m. to 9:00 p.m. Closed on Sundays.»
- C5. FAQ «¿Trabajan con clientes fuera de Costa Rica?» sin «24/7»: «Sí. Atendemos clientes de todos los
  países.» / «Yes. We serve clients in every country.» (FAQ visible y FAQPage coinciden).
- C6. Un clic en cualquier enlace de WhatsApp (`https://wa.me/`) o de correo (Gmail compose) envía a Vercel
  Analytics el evento `Contacto` con `{ canal: 'whatsapp' | 'correo' }`. Sin datos personales.
- C7. Cada URL del sitemap lleva `lastModified`.

## Dudas
- Los eventos personalizados de Vercel Analytics requieren plan Pro. En Hobby `track` no falla, pero el
  evento no se ve en el panel. Confirmar el plan del proyecto.

## Fuera de alcance
#1, #2, #4, #5, #6, #7, #10 y #11 parte 307 (la redirección de `/` se mantiene).
