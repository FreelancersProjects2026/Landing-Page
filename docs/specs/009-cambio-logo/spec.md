# Spec 009: Cambio de logo

## Problema
El logo actual (`LogoPJM.jpeg`, texto «PJM Soluciones Tecnológicas» sobre fondo claro) no se lee
a tamaño de ícono y el negocio lo considera poco profesional. La navbar solo muestra texto.

## Solución
Usar el nuevo logo `public/logo/icono/LOGOsolutionsPJM.jpeg` (símbolo «S» azul y gris sobre fondo
oscuro, 1254×1254) en todos los lugares donde hoy aparece el logo, y mostrarlo además en la navbar
junto al nombre de la marca.

## Alcance
1. **Ícono del sitio:** favicon PNG 192×192 generado desde el nuevo logo
   (`LOGOsolutionsPJM-192.png`) y `apple-touch-icon` = `LOGOsolutionsPJM.jpeg`, en `/es`, `/en`
   y la 404 global (`src/app/icons.ts`).
2. **Botón de WhatsApp:** el avatar del menú usa el nuevo logo.
3. **Navbar:** el nuevo logo a la izquierda del nombre de la marca, decorativo (`alt=""`, el texto
   de la marca ya nombra el enlace), con alto acorde al estado de scroll.
4. **Limpieza:** se eliminan `LogoPJM.jpeg` y `LogoPJM-192.png`; ningún archivo de `src/` los
   referencia.

## Fuera de alcance
- Rediseñar el logo, versión SVG o variantes claro/oscuro.
- `/favicon.ico` (ver 005: se agrega si Google no muestra el ícono).
- Cambiar textos de la marca.

## Decisiones del negocio (2026-10-08)
- Alcance: reemplazar en todos los usos y agregar el logo en la navbar.
- Los archivos viejos se borran; los nombres nuevos obligan a navegadores y Google a refrescar.

## Criterios de aceptación
- [ ] `/es`, `/en` y la 404 enlazan `/logo/icono/LOGOsolutionsPJM-192.png` (icon) y
      `/logo/icono/LOGOsolutionsPJM.jpeg` (apple).
- [ ] El avatar de WhatsApp y la navbar muestran el nuevo logo.
- [ ] No quedan referencias a `LogoPJM` en `src/` ni archivos viejos en `public/logo/icono/`.
- [ ] `pnpm validate` en verde.
