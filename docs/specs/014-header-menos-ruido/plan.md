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
- Desktop: `gap-12` → `gap-8` entre enlaces (con 3 enlaces basta).
- Idioma: `languageLinks` recibe la lista de idiomas a mostrar. Escritorio pasa
  `locales.filter((l) => l !== locale)`; móvil, `locales`. El enlace conserva `hrefLang`/`lang`.
- CTA sin cambios: sigue siendo el único botón relleno.
- Footer: agregar `{ name: menu.faq, href: '#' + sectionIds.faq }` a `links`.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `src/components/landing/navigation.tsx` | Modificado | Escritorio: solo primarios y el otro idioma. Móvil igual. |
| `src/components/landing/mobile-menu.tsx` | Nuevo (T05) | Overlay móvil y cierre con Escape, extraído sin cambio de comportamiento. |
| `src/components/landing/language-links.tsx` | Nuevo (T05) | Enlaces de idioma compartidos por escritorio y móvil. |
| `src/components/landing/footer-section.tsx` | Modificado | Enlace a Preguntas. |
| `src/components/landing/landing-sections.test.tsx` | Modificado | Pruebas de nav y footer. |

## Pruebas
- `within(nav)`: hay Servicios, Cómo trabajamos y Proyectos; no hay Equipo, Preguntas ni Contacto.
  El overlay móvil está fuera del `<nav>` (hermano en el `<header>`), así que `screen` aún los
  encuentra: la prueba existente de las 6 anclas sigue en verde y garantiza el móvil.
- `locale="es"`: `within(nav)` tiene «EN» → `/en` y no «ES»; `locale="en"`: al revés. `screen`
  sigue encontrando ambos (móvil).
- Footer: enlace «Preguntas» → `#preguntas-frecuentes`.
- Manual: 1280 px y 768 px, header en una línea; 375 px, menú móvil intacto.

## Riesgos
- Primarios confirmados por el usuario (Servicios, Cómo trabajamos, Proyectos). Si cambian en el
  futuro, solo se tocan los `primary: true` y la prueba de T01.
