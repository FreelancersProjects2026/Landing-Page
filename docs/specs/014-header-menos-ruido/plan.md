# Plan técnico: header con menos ruido

## Referencias
- Especificación: `docs/specs/014-header-menos-ruido/spec.md`.
- Spec previa del menú móvil: `docs/specs/013-cerrar-menu-movil/`.
- Componentes: `src/components/landing/navigation.tsx`, `src/components/landing/footer-section.tsx`.
- Pruebas existentes: `src/components/landing/landing-sections.test.tsx` (`describe('Navigation')`
  y footer).

## Enfoque
Recortar lo que se pinta en escritorio, no agregar componentes. El menú móvil y el footer ya
cubren todas las secciones; el header de escritorio deja de repetirlas. Cambio solo de UI: no toca
el módulo `company-profile` ni agrega textos (los nombres siguen saliendo de `menu`).

Alternativas descartadas:
- Desplegable «Más»: nuevo estado, teclado y clic afuera para esconder 3 enlaces; más código que
  valor.
- Hamburguesa también en escritorio: esconde todo y empeora el descubrimiento.
- Solo achicar espacios/tipografía: no reduce opciones, el ruido sigue.

## Diseño (DDD)
- Bounded context: ninguno nuevo; `company-profile` ya provee `menu`. La elección de primarios es
  presentación, vive en `navigation.tsx`.
- `navLinks` gana `primary: boolean`. Escritorio filtra `primary`; el overlay móvil usa la lista
  completa.
- Desktop: `gap-12` → `gap-8` entre enlaces.
- Tamaños (T08): el usuario vio la letra muy pequeña a 1024 y 1280 px. Enlaces `text-sm` →
  `text-base`; idioma y CTA suben un escalón (arriba `text-base`, CTA `h-10`; con scroll
  `text-sm`). El logo (`text-2xl`/`text-xl`) no cambia y el CTA sigue siendo el único botón
  relleno, así se mantiene la jerarquía. Cálculo a 1024 px (`text-base` es 16/14 ≈ +14 %):
  enlaces +35–41 px, idioma +3 px, CTA +20–25 px → ~+60–70 px. Sin scroll el contenido pasa de
  ~845 a ~910 px (en) frente a ~943 px útiles: sobran ~30 px. Con scroll el logo se achica y el
  CTA queda en `text-sm`, así que hay más margen (~150 px). Cabe sin subir el breakpoint.
  Descartadas: subir el breakpoint a `xl` (1024 px pasaría a hamburguesa, cambiaría lo que el
  usuario aprobó, y no hace falta); agrandar también el `gap` o el logo (gasta el margen
  restante sin que lo hayan pedido).
- Breakpoint (T07): el header de escritorio pasa de `md` (768 px) a `lg` (1024 px). Cálculo con
  4 enlaces: logo ≈ 190 px + enlaces ≈ 290 px + 3 gaps de 32 px + EN ≈ 20 px + gap de 16 px + CTA
  ≈ 190–250 px (es/en) + padding de 48 px ≈ 850–880 px. Entre 768 y ~950 px no cabe y los
  elementos se solapan (lo vio el usuario en T04). Con `lg`, 1024 − 64 de padding = 960 px útiles.
  Se cambian juntos los 4 puntos: `hidden md:flex` → `hidden lg:flex` (2 en `navigation.tsx`) y
  `md:hidden` → `lg:hidden` (overlay y botón en `mobile-menu.tsx`).
  Descartadas: bajar `gap` o tamaños de texto (a 768 px faltan ~130 px y no alcanza); ocultar
  Contacto o el CTA en anchos medios (contradice las decisiones del usuario); acortar el texto del
  CTA (cambia textos, fuera de alcance, y tampoco alcanza).
- Idioma: `languageLinks` recibe la lista de idiomas a mostrar. Escritorio pasa
  `locales.filter((l) => l !== locale)`; móvil, `locales`. El enlace conserva `hrefLang`/`lang`.
- CTA sin cambios: sigue siendo el único botón relleno.
- Footer: agregar `{ name: menu.faq, href: '#' + sectionIds.faq }` a `links`.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `src/components/landing/navigation.tsx` | Modificado | Escritorio: solo primarios y el otro idioma. Móvil igual. |
| `src/components/landing/mobile-menu.tsx` | Nuevo (T05), modificado (T07) | Overlay móvil y cierre con Escape; visible por debajo de `lg`. |
| `src/components/landing/language-links.tsx` | Nuevo (T05) | Enlaces de idioma compartidos por escritorio y móvil. |
| `src/components/landing/footer-section.tsx` | Modificado | Enlace a Preguntas. |
| `src/components/landing/landing-sections.test.tsx` | Modificado | Pruebas de nav y footer. |

## Pruebas
- `within(nav)`: hay Servicios, Cómo trabajamos, Proyectos y Contacto; no hay Equipo ni Preguntas.
  El overlay móvil está fuera del `<nav>` (hermano en el `<header>`), así que `screen` aún los
  encuentra: la prueba existente de las 6 anclas sigue en verde y garantiza el móvil.
- `locale="es"`: `within(nav)` tiene «EN» → `/en` y no «ES»; `locale="en"`: al revés. `screen`
  sigue encontrando ambos (móvil).
- Footer: enlace «Preguntas» → `#preguntas-frecuentes`.
- Breakpoint: los 2 bloques de escritorio tienen `lg:flex` y no `md:flex`; el botón del menú y el
  overlay tienen `lg:hidden` (jsdom no aplica media queries: las clases protegen contra la
  regresión, igual que `relative z-50`).
- Tamaños (T08): sin scroll, enlaces primarios con `text-base` (no `text-sm`) y CTA con
  `text-base`.
- Manual: 1024 y 1280 px, header en una línea sin solaparse; 768 y 375 px, hamburguesa.

## Riesgos
- Primarios confirmados por el usuario (Servicios, Cómo trabajamos, Proyectos, Contacto). Si
  cambian, solo se tocan los `primary: true` y la prueba de primarios.
- Con 4 enlaces el header de escritorio no cabe a 768 px (confirmado en T04); se resuelve con T07.
  Tras T08, a 1024 px sin scroll el margen queda en ~30 px: si se solapa en algún idioma, la
  salida es subir a `xl`, pero eso es decisión del usuario (pasaría 1024 px a hamburguesa).
