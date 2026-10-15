# Plan técnico: Contactos del footer con botones 3D

## Referencias
- Especificación: `docs/specs/017-footer-contactos-3d/spec.md`.
- Spec 016 (Instagram y horario en el footer): `docs/specs/016-seo-datos-estructurados/`.
- Patrón de utilidad propia con movimiento reducido: `btn-obsidian` en `src/app/globals.css`.
- Skill `gpt-taste`: de ella aplica solo física de hover (reacción en todo lo clicable,
  transiciones suaves con easing), contraste legible y cero etiquetas meta. GSAP, AIDA, bento y
  layout de página no aplican a un micro-componente.

## Enfoque
Cambio solo visual en `src/components/landing/`; no toca `company-profile`.

`FooterContactLink` ya es el enlace de los tres canales: se amplía en lugar de crear otro
componente. Recibe además el ícono del canal y su acento (color) por props, y reemplaza la flecha
`ArrowUpRight` por el orbe. El texto visible sigue siendo `children`, así que los nombres
accesibles no cambian (D1).

`FooterSection` decide ícono y acento de cada canal (presentación, no negocio): WhatsApp y correo
directos; los perfiles sociales por su `label` con una tabla pequeña que hoy solo tiene
«Instagram». Un perfil sin entrada usa el ícono `ArrowUpRight` y acento blanco, para no romper si
mañana se agrega otro perfil; ese respaldo vive solo en los valores por defecto de
`FooterContactLink` (un único lugar), `FooterSection` no lo repite.

El efecto va en CSS, como `btn-obsidian`: una `@utility contact-orb` en `globals.css` (Tailwind 4
genera variantes solo para `@utility`). El acento llega por una variable CSS (`--orb-accent`) que
el componente fija en `style`; así una sola utilidad sirve para los tres canales sin clases
arbitrarias por color.

Sin dependencias nuevas: lucide-react 0.454 ya trae `Instagram`, `MessageCircle` y `Mail`.

## Diseño
Estructura del enlace (de fuera hacia dentro):
- **Enlace `<a>`** (`group`, `inline-flex`, `items-center`, `gap-3`, `min-h-12`): no se
  transforma nunca, así su caja de hover/clic queda fija y el efecto no parpadea al inclinarse el
  orbe. Lleva el foco visible (anillo blanco con offset sobre negro) y el cambio de color del
  texto a blanco, como hoy.
- **Orbe** (`span`, 48 px, `rounded-full`, `aria-hidden`): en reposo borde `white/15`, fondo
  transparente, `transform-style: preserve-3d`. En hover/foco del enlace: borde y sombra
  `0 10px 10px` del acento, relleno oscuro translúcido (D3) y `perspective(180px) rotateX(60deg)
  translateY(2px)` como el ejemplo.
- **Ícono** (svg de lucide, `size-5`, blanco al 70 %): en hover/foco toma el acento y se adelanta
  con `translate3d(0, 0, 15px) perspective(180px) rotateX(-35deg) translateY(2px)`, de modo que
  "salta" hacia el usuario mientras el orbe se acuesta.
- **Transición**: ~500 ms con easing suave (`cubic-bezier(0.22, 1, 0.36, 1)`), solo dentro de
  `@media (prefers-reduced-motion: no-preference)`; fuera de ese bloque solo cambian color, borde
  y sombra, sin `transform` ni transición de movimiento.
- Los selectores de hover/foco salen del enlace: el estado del orbe se activa con el enlace en
  `:hover` o `:focus-visible` (selector padre en la utilidad o variantes `group-hover` /
  `group-focus-visible`; lo elige coder, uno solo).
- **Táctil**: el estado en reposo ya es legible (borde e ícono visibles); no hace falta
  `@media (hover: hover)`.

Acentos confirmados por el usuario (D2): colores de marca oficiales, Instagram `#E1306C`,
WhatsApp `#25D366`, correo `#EA4335`. El footer es negro fijo (no hay tema claro), así que todos
superan 3:1; no se usa el gradiente completo de Instagram para mantener una sola variable de acento.

## Estructura objetivo
| Ruta | Capa | Responsabilidad |
|------|------|-----------------|
| `src/app/globals.css` | Estilos | `@utility contact-orb` (orbe + ícono, hover/foco, movimiento reducido). |
| `src/app/globals-css.test.ts` | Prueba | La utilidad existe, el 3D vive bajo `no-preference` y hover y foco comparten estado. |
| `src/components/landing/footer-contact-link.tsx` | UI (landing) | Enlace con orbe: recibe `icon` y `accent`; sin flecha. |
| `src/components/landing/footer-contact-link.test.tsx` | Prueba | Nuevo: nombre accesible, orbe `aria-hidden` con ícono, acento en la variable, props externas. |
| `src/components/landing/footer-section.tsx` | UI (landing) | Pasa ícono y acento a WhatsApp, correo y perfiles sociales. |
| `src/components/landing/landing-sections.test.tsx` | Prueba | Bloque del footer: cada canal con su ícono; actualiza la prueba de flechas. |

## Pruebas
- `globals.css`: contiene `@utility contact-orb {`; la regla con `rotateX` y `translate3d` está
  dentro de `prefers-reduced-motion: no-preference`; `:focus-visible` aparece junto a `:hover`.
- `FooterContactLink`: con `children` «Instagram», el enlace se llama «Instagram»; el orbe tiene
  `aria-hidden="true"`, la clase `contact-orb` y `--orb-accent` con el color recibido; con
  `external`, `target="_blank"` y `rel="noopener noreferrer"`; sin `external`, sin `target`.
- `FooterSection`: los tres enlaces conservan nombre y `href`; el de WhatsApp contiene el ícono
  `lucide-message-circle`, el de correo `lucide-mail` y el de Instagram `lucide-instagram`; los
  tres svg siguen `aria-hidden`.
- Manual (navegador): hover y Tab en escritorio, 375 px y movimiento reducido emulado.

## Riesgos
- Transformar el enlace en vez de un hijo achica su caja al inclinarse y produce parpadeo del
  hover: por eso solo se transforman orbe e ícono.
- `rotateX(60deg)` aplasta visualmente el orbe; el texto al lado mantiene el enlace reconocible.
- Descartado: componente nuevo `ContactOrb` aparte (duplicaría el enlace que ya existe) y fila de
  solo íconos (pierde el teléfono visible; queda como D1).
