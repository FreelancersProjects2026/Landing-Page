# Spec 014: header con menos ruido

## Problema
En escritorio el header muestra 9 elementos además del logo: 6 enlaces (Servicios, Cómo trabajamos,
Proyectos, Equipo, Preguntas, Contacto), el selector ES/EN (2 enlaces) y el botón «Cotiza por
WhatsApp». Se ve lleno y el botón de cotizar compite con todo lo demás.

## Objetivo
Header de escritorio con pocos elementos y una jerarquía clara (el CTA de WhatsApp destaca), sin
perder acceso a ninguna sección.

## Lenguaje ubicuo
- **Enlace primario:** sección visible en el header de escritorio.
- **Enlace secundario:** sección que sale del header de escritorio pero sigue accesible por el menú
  móvil, el footer y el scroll.
- **CTA:** botón «Cotiza por WhatsApp» / «Get a quote on WhatsApp».

## Alcance
1. Escritorio (≥ 768 px) muestra solo los enlaces primarios: **Servicios, Cómo trabajamos,
   Proyectos** (ver Decisiones).
2. Escritorio muestra solo el enlace al **otro** idioma (en `/es` se ve «EN»; en `/en`, «ES»).
3. El CTA sigue siendo el único botón relleno del header.
4. El menú móvil no cambia: sigue con las 6 secciones, ES/EN y el CTA.
5. El footer agrega «Preguntas» (`#preguntas-frecuentes`) para que toda sección secundaria tenga un
   enlace fuera del header en escritorio (Equipo ya está; Contacto es la sección del CTA, cubierta
   por el botón de WhatsApp).

## Fuera de alcance
- Menú desplegable «Más» o hamburguesa en escritorio.
- Cambios de textos o del módulo `company-profile`.
- Rediseño del menú móvil.
- Quitar el CTA del header o el botón flotante de WhatsApp.

## Criterios de aceptación
- [ ] Dentro del `<nav>` solo están los enlaces primarios; los secundarios no aparecen en él.
- [ ] El menú móvil conserva las 6 secciones.
- [ ] En `/es` el `<nav>` tiene «EN» → `/en` y no tiene «ES»; en `/en`, al revés. El menú móvil
      mantiene ambos.
- [ ] El footer enlaza «Preguntas» a `#preguntas-frecuentes`.
- [ ] Verificación visual en 1280 px y 768 px: logo, 3 enlaces, idioma y CTA en una línea sin
      saltos.
- [ ] `pnpm validate` en verde.

## Decisiones (confirmadas por el usuario)
1. Enlaces primarios: **Servicios, Cómo trabajamos, Proyectos**. Contacto sale porque el CTA ya
   lleva a WhatsApp.
2. En escritorio, el selector muestra solo el enlace al otro idioma.
3. Se agrega «Preguntas» al footer.

## Dudas
Ninguna.
