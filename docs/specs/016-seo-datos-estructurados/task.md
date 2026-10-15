# Tareas: SEO con datos estructurados completos, Instagram e imagen OpenGraph

## Base acordada
- Spec: `docs/specs/016-seo-datos-estructurados/spec.md`. Plan: `plan.md` (diseño en prosa).
- Método: TDD, un commit por tarea, `pnpm validate` en verde.
- Orden: T01 → (T02 ∥ T03 ∥ T04) → (T06 ∥ T07 ∥ T08 ∥ T09) → (T10 ∥ T11) → T12 → T05. Las tareas
  de cada grupo paralelo no comparten archivos.
- Imagen OG: T04 usa la propuesta de D1–D3 de la spec; si el cliente pide otra cosa, se ajusta
  en una tarea de corrección.

## Tareas
- [x] T01 Prueba: `company` (es y en) expone el logo `/logo/icono/LOGOsolutionsPJM.jpeg` (y el
  archivo existe en `public/`), un perfil social «Instagram» con URL
  `https://www.instagram.com/solutionspjm` y horario lunes–domingo 00:00–23:59; y
  `validateLandingContent` rechaza un perfil social no https (fallan) → agregar `DayOfWeek`,
  `OpeningHours` y los 3 campos a `Contact`, la regla https, los datos en la fuente y exportar los
  tipos en `index.ts`. Actualizar el fixture de `landingContent.test.ts`.
  Archivos: `src/modules/company-profile/domain/landingContent.ts`,
  `src/modules/company-profile/domain/landingContent.test.ts`,
  `src/modules/company-profile/infrastructure/landingContentSource.ts`,
  `src/modules/company-profile/infrastructure/landingContentSource.test.ts`,
  `src/modules/company-profile/index.ts`.
  - Evidencia: rojo, 4 pruebas fallan (perfil social http y sin esquema aceptado; `company` sin
    los campos nuevos; logo inexistente en `public/`); verde, 87/87 en `company-profile` y
    `pnpm validate` OK (221 pruebas, build y arquitectura en verde).
- [x] T02 Prueba en `structured-data.test.ts`: el `ProfessionalService` de es/en incluye
  `email`, `logo` e `image` (`https://solutionspjm.com/logo/icono/LOGOsolutionsPJM.jpeg`),
  `sameAs` y `openingHoursSpecification` (falla) → agregarlos en `buildStructuredData`. Sin `geo`.
  (depende de T01; paralela a T03 y T04)
  Archivos: `src/app/[lang]/structured-data.ts`, `src/app/[lang]/structured-data.test.ts`.
  - Evidencia: rojo, 2 pruebas fallan (es/en sin `email`, `logo`, `image`, `sameAs` ni
    `openingHoursSpecification`); verde, 5/5 en `structured-data` y `pnpm validate` OK (221 pruebas,
    build y arquitectura en verde).
- [x] T03 Prueba en `landing-sections.test.tsx` (bloque del footer): hay un enlace
  «Instagram» a `https://www.instagram.com/solutionspjm` con `target="_blank"` y
  `rel="noopener noreferrer"` (falla) → renderizar `company.socialProfiles` en la lista de
  contacto del footer con `externalLinkProps` y la flecha decorativa oculta a lectores de pantalla.
  (depende de T01; paralela a T02 y T04)
  Archivos: `src/components/landing/footer-section.tsx`,
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo, la prueba del footer falla (no hay enlace con nombre «Instagram»); verde,
    222/222 y `pnpm validate` OK (build y arquitectura en verde; `footer-section.tsx` 148 líneas).
- [x] T04 Prueba en `opengraph-image.test.tsx`: el tamaño declarado es 1200×630, el tipo es
  PNG, y `OgImageCard` renderiza nombre, `seo.description` del idioma y una imagen con
  data URL JPEG (falla: no existen) → crear `og-image-card.tsx` y `opengraph-image.tsx` según
  `plan.md`. `pnpm build` debe listar `/es/opengraph-image` y `/en/opengraph-image`.
  (depende de T01; paralela a T02 y T03)
  Archivos: `src/app/[lang]/og-image-card.tsx`, `src/app/[lang]/opengraph-image.tsx`,
  `src/app/[lang]/opengraph-image.test.tsx` (nuevos).
  - Evidencia: rojo, la suite falla al no poder resolver `./opengraph-image`; verde, 3/3 (tamaño y
    tipo; tarjeta es/en con nombre, `seo.description` y logo `data:image/jpeg;base64`, con
    `ImageResponse` simulado) y `pnpm validate` OK (225 pruebas). El build prerenderiza
    `/es/opengraph-image` y `/en/opengraph-image` (PNG 1200×630, revisados a ojo).
    Desvíos: sin `export const alt` (el lint `react-refresh/only-export-components` no lo admite
    en la lista de Next y no se silencia); `generateStaticParams` propio en `opengraph-image.tsx`
    (sin él la ruta era dinámica y leía `public/` en tiempo de ejecución).

### Correcciones de la revisión de T01–T04 (aprobadas, sin bloqueantes)
- [x] T06 Corrección (mejora, hallazgo 1): `validateLandingContent` no valida el logo ni el
  horario; un logo sin barra inicial rompe la URL del JSON-LD → pruebas en
  `landingContent.test.ts` que esperan error cuando el logo no empieza con «/», cuando apertura o
  cierre no tienen formato HH:MM (00–23 y 00–59) y cuando la lista de días está vacía (fallan) →
  agregar esas tres reglas en el límite del dominio. El contenido real sigue siendo válido.
  (paralela a T07, T08 y T09)
  Archivos: `src/modules/company-profile/domain/landingContent.ts`,
  `src/modules/company-profile/domain/landingContent.test.ts`.
  - Evidencia: rojo, 6 pruebas fallan (logo sin «/»; `opens` 24:00 y 9:00; `closes` 23:60 y
    23:59:00; horario sin días); verde, reglas en `companyProblems` (junto a la de perfiles
    sociales), 93/93 en `company-profile` y `pnpm validate` OK (231 pruebas, build y arquitectura
    en verde).
- [x] T07 Corrección (mejora, hallazgo 2): el footer repite tres veces el enlace de contacto con
  flecha (WhatsApp, correo, perfiles sociales) y la flecha de WhatsApp no está oculta a lectores
  de pantalla → prueba en `landing-sections.test.tsx` (bloque del footer): todas las flechas de
  la lista de contacto están ocultas a lectores de pantalla (falla por WhatsApp) → extraer un
  componente de enlace de contacto en un archivo propio dentro de `src/components/landing/`
  (recibe destino, contenido y si es externo) y usarlo en los tres casos. Las pruebas existentes
  del footer siguen en verde (nombres, `href`, `target` y `rel` sin cambio) y
  `footer-section.tsx` baja de 148 líneas. (paralela a T06, T08 y T09)
  Archivos: `src/components/landing/footer-section.tsx`,
  `src/components/landing/footer-contact-link.tsx` (nuevo),
  `src/components/landing/landing-sections.test.tsx`.
  - Evidencia: rojo, la prueba nueva del footer falla (la flecha de WhatsApp no tiene
    `aria-hidden`); verde, `FooterContactLink` (destino, contenido y `external`) en los tres
    enlaces, 232/232 con las pruebas previas del footer intactas y `pnpm validate` OK;
    `footer-section.tsx` baja de 148 a 127 líneas.
- [x] T08 Corrección (mejora, hallazgos 3 y 7): la imagen OG no publica `og:image:alt` y la ruta
  no declara que solo existen `es` y `en` (un idioma desconocido llega a `getLandingContent` y da
  error 500 en vez de 404) → prueba en `opengraph-image.test.tsx`: la ruta exporta `alt` igual al
  nombre de la empresa y desactiva los parámetros dinámicos (falla) → permitir `alt` y
  `dynamicParams` en la opción de nombres exportados de la regla
  `react-refresh/only-export-components` de `eslint.config.js` (ambos son exportaciones oficiales
  de Next) y exportarlos en `opengraph-image.tsx`. Se juntan porque tocan los mismos archivos.
  (paralela a T06, T07 y T09)
  Archivos: `eslint.config.js`, `src/app/[lang]/opengraph-image.tsx`,
  `src/app/[lang]/opengraph-image.test.tsx`.
  - Evidencia: rojo, la prueba nueva falla (`alt` es `undefined`); verde, `alt` con el nombre de
    la empresa y `dynamicParams = false`, 233/233 y `pnpm validate` OK (el build prerenderiza
    `/es/opengraph-image` y `/en/opengraph-image`). En `eslint.config.js` solo se agrega `alt`:
    `dynamicParams` ya estaba en la lista del preset `next` de `eslint-plugin-react-refresh`.
- [x] T09 Corrección (nit, hallazgo 4): el comentario de la prueba de textos literales dice que
  logo, perfiles sociales y horario «no se muestran», pero «Instagram» se muestra en el footer
  desde T03 → corregir el comentario: se excluyen porque son datos confirmados por el cliente en
  la spec 016, no textos de `contenido.md`. Solo comentario; la prueba sigue en verde antes y
  después. (paralela a T06, T07 y T08)
  Archivos: `src/modules/company-profile/infrastructure/landingContentSource.test.ts`.
  - Evidencia: solo comentario (sin rojo, como indica la tarea); la prueba de textos literales
    sigue en verde, 233/233 y `pnpm validate` OK.

Descartados:
- Hallazgo 4, segunda parte (la exclusión compara valores): los valores excluidos son una URL,
  una ruta, horas y nombres de días en inglés, y ninguno coincide con textos de la landing; el
  falso positivo es teórico.
- Hallazgo 5 (ayudante de horario de un solo uso): nombra la traducción a schema.org y mide
  cinco líneas; inlinearlo no aporta valor al cliente.
- Hallazgo 6 (`image/jpeg` escrito a mano): el formato del logo está fijado por la spec y la
  prueba de T01; si cambia de formato, se cambia junto con la ruta. Deducir el tipo a partir de la
  extensión agregaría código sin un caso real que lo necesite.

### Correcciones de la revisión de T05
- [x] T10 Verificación (mejora, hallazgo 2 de T05): validar el JSON-LD de `/es` y `/en` en
  validator.schema.org sin URL pública. Con `pnpm build` y `pnpm start`, obtener con curl los dos
  bloques JSON-LD de cada idioma (`ProfessionalService` y `FAQPage`) y validarlos en
  https://validator.schema.org/ con la opción de pegar fragmento de código. Si se puede
  automatizar (navegador controlado o una petición directa al validador), hacerlo; si no, queda
  como paso manual con estas instrucciones. Criterio: 0 errores en los cuatro bloques; las
  advertencias se anotan sin corregir. Anotar en la evidencia la fecha, el commit validado y
  errores y advertencias por bloque. Sin cambios de código. (paralela a T11)
  Archivos: ninguno de código; evidencia en este `task.md`.
  - Evidencia (2026-10-15, sobre `f0d3947`): `pnpm build` + `pnpm start`; curl de `/es` y `/en`
    y extracción de los `<script type="application/ld+json">`: dos bloques por idioma. Validación
    automatizada con `POST https://validator.schema.org/validate` (campo `html` con el bloque
    dentro de su `<script>`, la misma petición que hace la opción de pegar fragmento):
    `/es` `ProfessionalService` 0 errores y 0 advertencias; `/es` `FAQPage` 0 y 0; `/en`
    `ProfessionalService` 0 y 0; `/en` `FAQPage` 0 y 0. El validador reconoce todas las
    propiedades, incluido `openingHoursSpecification` anidado con los siete `dayOfWeek`.
    Control negativo por la misma vía (propiedad inventada y `dayOfWeek` «Lunes»): 2 errores
    (`INVALID_PREDICATE`, `INVALID_SCHEMA_ENUM_VALUE`), así que la automatización sí detecta
    errores. Log del servidor sin errores; servidor detenido.
- [x] T11 Corrección (mejora, hallazgo 4 de T05 y observación de T05): el logo se ve como un
  recuadro sobre la tarjeta OG porque el fondo (`#080808`) es más oscuro que el fondo del JPEG
  → prueba en `opengraph-image.test.tsx`: el fondo de `OgImageCard` es `#0a0b10`, el color de
  los bordes del logo medido por planner (falla) → cambiar el fondo en `og-image-card.tsx`.
  Antes de fijarlo, confirmar el color muestreando con `sharp` (resuelto desde `next`) varios
  píxeles de los bordes del logo y anotarlo en la evidencia. Regenerar con `pnpm build` y revisar
  a ojo que el recuadro ya no se ve. Aplica el alcance acordado («fondo oscuro como el logo»);
  el acento de color de D3 sigue pendiente del cliente. (paralela a T10)
  Archivos: `src/app/[lang]/og-image-card.tsx`, `src/app/[lang]/opengraph-image.test.tsx`.
  - Evidencia: muestreo con `sharp` del JPEG (1254×1254): puntos medios de los cuatro bordes e
    interiores cercanos `#0a0b10`/`#0a0b0f`, esquinas `#0b0c11`/`#0c0d12` (artefactos JPEG); se
    fija `#0a0b10`. Rojo, la prueba nueva falla en es/en (fondo `rgb(8, 8, 8)` en vez de
    `rgb(10, 11, 16)`); verde, 233/233 y `pnpm validate` OK. PNG regenerados por el build
    revisados a ojo (sin recuadro) y medidos: fondo `#0a0b10`, borde interior del logo
    `#0a0b0f`–`#0b0c11` (diferencia máxima 1 por canal).

### Corrección de la revisión de T10–T11
- [x] T12 Corrección (nit de reviwer en T11): el fondo `#0a0b10` de `og-image-card.tsx` es un
  valor sin nombre y nada en el código dice que es el fondo del logo; alguien podría «corregirlo»
  y volver a mostrar el recuadro → nombrarlo como constante junto a la del tamaño del logo, con un
  comentario breve que diga que es el color de fondo del JPEG del logo, medido en sus bordes.
  Refactor: la prueba de T11 sigue en verde antes y después. (independiente)
  Archivos: `src/app/[lang]/og-image-card.tsx`.
  - Evidencia: `#0a0b10` pasa a `LOGO_BACKGROUND`, junto a `LOGO_SIZE`, con comentario de que es
    el fondo del JPEG del logo medido en sus bordes. `opengraph-image.test.tsx` 4/4 en verde antes
    y después; `pnpm validate` OK (lint 0 errores y 6 avisos previos, 233/233 pruebas,
    arquitectura sin violaciones, build OK).

Descartado:
- Nit de T10 (falta el comando exacto de la petición al validador): la evidencia de T10 ya nombra
  el endpoint y el campo que se envía, suficiente para repetirla; un comando literal sería código
  en `task.md`, que el usuario excluyó.

### Cierre
- [x] T05 Verificación: `pnpm validate`; con `pnpm start`, `/es/opengraph-image` y
  `/en/opengraph-image` devuelven PNG 1200×630, `/fr/opengraph-image` da 404, y el HTML de `/es`
  y `/en` trae `og:image` y `og:image:alt`; footer en 1280 y 375 px; JSON-LD sin errores en
  validator.schema.org (T10). Anotar evidencia aquí. Se cierra con T12 y la confirmación de
  D1–D3 por el cliente (spec, `## Dudas`).
  (depende de T02, T03, T04, T06, T07, T08, T09, T10, T11 y T12)
  - Evidencia (2026-10-15, sobre `dd1e1d5`): `pnpm validate` OK (lint 0 errores y 6 avisos
    `no-img-element`, uno en `og-image-card.tsx`, donde `ImageResponse` no admite `next/image`;
    233/233 pruebas; arquitectura sin violaciones; build prerenderiza `/es/opengraph-image` y
    `/en/opengraph-image`). Con `pnpm start` y curl: `/es` y `/en` dan 200 y traen `og:image`
    (`https://solutionspjm.com/<lang>/opengraph-image?…`), `og:image:type` `image/png`,
    `og:image:width` 1200, `og:image:height` 630, `og:image:alt` «solutionsPJM» y sus pares
    `twitter:image*`. El JSON-LD `ProfessionalService` de es y en trae `email`, `logo` e `image`
    (`https://solutionspjm.com/logo/icono/LOGOsolutionsPJM.jpeg`), `sameAs` con Instagram y
    `openingHoursSpecification` lunes–domingo 00:00–23:59, sin `geo` (más el bloque `FAQPage`).
    `/es/opengraph-image` y `/en/opengraph-image`: 200, `image/png`, cabecera PNG 1200×630
    (98 753 y 99 682 bytes), revisados a ojo: logo, nombre y `seo.description` del idioma.
    `/fr/opengraph-image`: 404. Footer con Chrome headless (CDP) a 1280 y 375 px: «Instagram»
    debajo del correo en la columna de contacto y sin desbordamiento horizontal. Log del servidor
    sin errores; servidor detenido.
  - Actualización (2026-10-15): T10 cerrada (`d61ea4e`): los cuatro bloques JSON-LD de `/es` y
    `/en` con 0 errores y 0 advertencias en validator.schema.org. T11 cerrada (`f0d3947`): fondo de
    la tarjeta OG `#0a0b10`, sin recuadro. `pnpm validate` OK tras ambas (aprobadas por reviwer).
    La prueba de resultados enriquecidos de Google sobre la preview es opcional y no se ejecutó.
  - Cierre (2026-10-15): T12 cerrada (`9da1c49`, refactor sin cambio visible; `pnpm validate`
    OK). Todas las dependencias (T02–T04, T06–T12) están cerradas y aprobadas por reviwer. El
    cliente confirmó D1–D3 tal cual la propuesta (D1 `seo.description`, D2 Geist por defecto, D3
    sin acento de color): no hay cambios. Todos los criterios de la spec están marcados.
  - Opcional después del deploy: prueba de resultados enriquecidos de Google sobre la URL
    pública (el criterio ya se cumple con validator.schema.org).
  - Observaciones: el recuadro del logo en la imagen OG se corrigió en T11; el botón de chat que tapa
    «Privacidad» y el tamaño de `landingContent.ts` quedan en «Seguimiento» de la spec.
