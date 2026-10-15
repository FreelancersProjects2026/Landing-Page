# Spec 017: Contactos del footer con botones 3D

## Problema
En la columna de contacto del footer (`src/components/landing/footer-section.tsx`) los enlaces de
WhatsApp, correo e Instagram son texto plano con una flecha que aparece al pasar el cursor. El
usuario los quiere "dinámicos": un botón circular por canal que, al pasar o enfocar, se inclina
en 3D, proyecta una sombra de color y deja saltar el ícono hacia el usuario (referencia que envió,
hecha con styled-components; aquí se hace con Tailwind/CSS).

## Objetivo
Que los tres canales de contacto del footer se reconozcan de un vistazo por su ícono y color, y
respondan al cursor y al teclado con el efecto 3D, sin perder datos, accesibilidad ni el
comportamiento actual de los enlaces.

## Lenguaje ubicuo
- **Canal de contacto**: medio por el que el cliente escribe a solutionsPJM: WhatsApp, correo e
  Instagram (perfil social).
- **Orbe**: círculo con el ícono del canal que se inclina en 3D al pasar o enfocar el enlace.
- **Acento**: color de marca del canal, usado en el ícono y la sombra del orbe en hover/foco.

## Alcance
1. Cada uno de los tres enlaces de contacto del footer es solo un orbe con el ícono del canal
   (sin texto visible, D1), en una fila horizontal dentro de la columna de contacto: Instagram (`Instagram` de lucide), WhatsApp
   (`MessageCircle`, el mismo del botón flotante) y correo (`Mail`). Reemplaza la flecha actual.
2. Efecto en hover del enlace **y** en `:focus-visible` (equivalente para teclado): el orbe se
   inclina (`perspective` + `rotateX`), se ilumina con el acento y proyecta una sombra de ese
   color; el ícono se adelanta (`translate3d` en Z) y toma el acento.
3. Con `prefers-reduced-motion: reduce` no hay transformaciones ni transiciones de movimiento:
   solo cambian color, borde y sombra.
4. Sin hover (táctil) el orbe se ve completo en reposo: borde sutil e ícono blanco legible.
5. Sin cambios de datos: mismos `href`, `target`/`rel` y nombres accesibles (el texto actual
   pasa a ser solo para lectores de pantalla).

## Fuera de alcance
- Otros canales (Twitter/X, GitHub, Facebook del ejemplo) y otras secciones (CTA, botón flotante).
- Nuevas dependencias (styled-components, GSAP, iconos de marca externos).
- Cambios en `company-profile` (datos, dominio o textos i18n).

## Criterios de aceptación
- [x] El footer conserva los enlaces con nombre accesible «WhatsApp +506 6440-0832» (URL de
  WhatsApp, nueva pestaña), «solutionspjm@gmail.com» (`mailto:`, misma pestaña) e «Instagram»
  (`https://www.instagram.com/solutionspjm`, `target="_blank"`, `rel="noopener noreferrer"`).
- [x] Cada uno contiene un orbe con su ícono (Instagram, MessageCircle, Mail) marcado
  `aria-hidden="true"` y su acento de color.
- [x] Cada enlace muestra solo el orbe; su texto actual está oculto visualmente (`sr-only`) y
  sigue siendo su nombre accesible. Los tres orbes quedan en una fila horizontal.
- [x] El área clicable de cada enlace mide al menos 44×44 px (orbe de 48 px) y la inclinación no
  reduce el área que recibe el hover (se transforma un hijo, no el enlace).
- [x] `globals.css` declara la utilidad del orbe con el efecto 3D solo bajo
  `prefers-reduced-motion: no-preference`, y aplica el mismo estado en `:hover` y `:focus-visible`.
- [x] El foco de teclado es visible (anillo) sobre el fondo negro.
- [x] Acentos de marca confirmados (D2): Instagram `#E1306C`, WhatsApp `#25D366`, correo
  `#EA4335`, cada uno con contraste ≥ 3:1 contra el fondo del footer.
- [x] Verificado en navegador: escritorio (hover y Tab), 375 px de ancho y movimiento reducido (este último
  comprobado en el CSS servido: todo `transform`/`transition` del orbe está bajo `no-preference`;
  la extensión del navegador no puede emular la preferencia).
- [x] `pnpm validate` en verde.

## Dudas
Ninguna bloquea; se aplican valores por defecto a confirmar con el usuario:
- D1. **Texto junto al orbe**: **resuelta** (pedido del usuario el 2026-10-15): solo el logo de
  cada canal, sin texto visible (p. ej. Instagram sin la palabra «Instagram»), con los orbes en
  horizontal (primero pidió vertical y lo corrigió a horizontal el mismo día). El texto actual queda como nombre accesible solo para lectores de pantalla
  (`sr-only`). Consecuencia aceptada: el teléfono y el correo dejan de verse en el footer (el
  correo sigue visible en la sección de contacto).
- D2. **Colores**: **resuelta** (confirmada por el usuario el 2026-10-15): colores de marca
  oficiales de cada red, no la paleta del sitio. Instagram `#E1306C` (magenta de su gradiente de
  marca; un solo color porque el acento pinta el trazo del ícono y la sombra), WhatsApp `#25D366`,
  correo (Gmail) `#EA4335`. Contraste sobre el fondo del footer (`bg-black` fijo en ambos temas;
  el sitio no tiene tema claro): Instagram ≈ 4,8:1, WhatsApp ≈ 11:1, Gmail ≈ 5,3:1, todos sobre el
  3:1 de WCAG 1.4.11 para íconos; el anillo de foco es blanco (21:1).
- D3. **Fondo del orbe en hover**: el ejemplo lo pinta de blanco; el verde de WhatsApp sobre
  blanco no llega al contraste 3:1 de gráficos (WCAG 1.4.11). Se usa un relleno oscuro
  translúcido con borde y sombra del acento, que contrasta sobre el footer negro.

## Cierre (2026-10-15)
Spec cerrada: T01–T09 hechas y revisadas sin hallazgos bloqueantes pendientes. Mejoras
descartadas en la revisión final: `md:col-span-2` redundante junto a `col-span-2` en la columna de
contacto (inofensivo; se puede limpiar en cualquier cambio futuro del footer).
