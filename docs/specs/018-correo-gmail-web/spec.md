# Spec 018: botones de correo con Gmail web

## Problema
Los botones de correo de la sección de contacto y del footer usaban `mailto:solutionspjm@gmail.com`.
`mailto:` depende de la app de correo predeterminada del sistema operativo. Si no hay ninguna, o la
predeterminada no tiene cuenta configurada (p. ej. Outlook nuevo en Windows), el clic no hace nada y
la persona visitante no puede escribirnos.

## Decisión (confirmada por el usuario, 2026-10-15)
Los botones de correo abren en una pestaña nueva la ventana de redactar de Gmail web con el
destinatario ya puesto: `https://mail.google.com/mail/?view=cm&fs=1&to=solutionspjm%40gmail.com`.
Consecuencia aceptada: la persona debe usar o iniciar sesión en Gmail.

## Criterios
- C1. `buildEmailComposeUrl(email)` devuelve la URL de redactar de Gmail con el correo codificado.
- C2. El botón de correo de `#contacto` y el del footer usan esa URL, con `target="_blank"` y
  `rel="noopener noreferrer"`.
- C3. Los nombres accesibles y el correo visible en `#contacto` no cambian.
- C4. No queda ningún `mailto:` en la landing.

## Fuera de alcance
Formularios de contacto, copiar al portapapeles o elegir proveedor de correo.
