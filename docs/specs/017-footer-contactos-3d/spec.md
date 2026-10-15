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
1. Cada uno de los tres enlaces de contacto del footer muestra, a la izquierda de su texto
   actual, un orbe con el ícono del canal: Instagram (`Instagram` de lucide), WhatsApp
   (`MessageCircle`, el mismo del botón flotante) y correo (`Mail`). Reemplaza la flecha actual.
2. Efecto en hover del enlace **y** en `:focus-visible` (equivalente para teclado): el orbe se
   inclina (`perspective` + `rotateX`), se ilumina con el acento y proyecta una sombra de ese
   color; el ícono se adelanta (`translate3d` en Z) y toma el acento.
3. Con `prefers-reduced-motion: reduce` no hay transformaciones ni transiciones de movimiento:
   solo cambian color, borde y sombra.
4. Sin hover (táctil) el orbe se ve completo en reposo: borde sutil e ícono blanco legible.
5. Sin cambios de datos: mismos `href`, `target`/`rel`, textos visibles y nombres accesibles.

## Fuera de alcance
- Otros canales (Twitter/X, GitHub, Facebook del ejemplo) y otras secciones (CTA, botón flotante).
- Nuevas dependencias (styled-components, GSAP, iconos de marca externos).
- Cambios en `company-profile` (datos, dominio o textos i18n).

## Criterios de aceptación
- [ ] El footer conserva los enlaces con nombre accesible «WhatsApp +506 6440-0832» (URL de
  WhatsApp, nueva pestaña), «solutionspjm@gmail.com» (`mailto:`, misma pestaña) e «Instagram»
  (`https://www.instagram.com/solutionspjm`, `target="_blank"`, `rel="noopener noreferrer"`).
- [ ] Cada uno contiene un orbe con su ícono (Instagram, MessageCircle, Mail) marcado
  `aria-hidden="true"` y su acento de color.
- [ ] El área clicable de cada enlace mide al menos 44×44 px (orbe de 48 px) y la inclinación no
  reduce el área que recibe el hover (se transforma un hijo, no el enlace).
- [ ] `globals.css` declara la utilidad del orbe con el efecto 3D solo bajo
  `prefers-reduced-motion: no-preference`, y aplica el mismo estado en `:hover` y `:focus-visible`.
- [ ] El foco de teclado es visible (anillo) sobre el fondo negro.
- [ ] Verificado en navegador: escritorio (hover y Tab), 375 px de ancho y movimiento reducido.
- [ ] `pnpm validate` en verde.

## Dudas
Ninguna bloquea; se aplican valores por defecto a confirmar con el usuario:
- D1. **Texto junto al orbe**: el ejemplo es una fila de íconos sin texto. Se conserva el texto
  visible (teléfono, correo, «Instagram») al lado de cada orbe para no perder datos de contacto
  visibles (el teléfono solo se muestra aquí). ¿Prefiere una fila de solo íconos con el texto como
  `aria-label`?
- D2. **Colores**: se usan los colores de marca de cada red como acento: Instagram `#E1306C`,
  WhatsApp `#25D366`, correo (Gmail) `#EA4335`. ¿Prefiere la paleta del sitio (`#eca8d6`,
  `#67e8f9`, `#fbbf24`)?
- D3. **Fondo del orbe en hover**: el ejemplo lo pinta de blanco; el verde de WhatsApp sobre
  blanco no llega al contraste 3:1 de gráficos (WCAG 1.4.11). Se usa un relleno oscuro
  translúcido con borde y sombra del acento, que contrasta sobre el footer negro.
