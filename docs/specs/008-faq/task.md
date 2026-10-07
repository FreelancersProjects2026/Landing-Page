# Tareas: Preguntas frecuentes

## Base acordada
- Spec: `docs/specs/008-faq/spec.md`. Textos: `contenido.md`.
- Método: TDD y `pnpm validate` en verde tras cada tarea. Un commit por tarea.

## Tareas
- [x] T01 Negocio aprueba respuestas en `contenido.md` (2026-10-07).
- [x] T02 Dominio: `LandingContent.faq` (`title`, `items: { question, answer }[]`, mínimo 1) y
      `menu.faq`, con pruebas.
- [x] T03 Infraestructura: textos `es` y `en` copiados de `contenido.md`.
- [x] T04 Vista `components/landing/faq-section.tsx` (`<details>` nativo: respuestas en el HTML del servidor, sin JS), id en `section-ids.ts`,
      montada entre Equipo y Contacto; prueba en `landing-sections.test.tsx`.
- [x] T05 `FAQPage` en `structured-data.ts` con su prueba.
- [ ] T06 Verificación: `pnpm validate`, `/es` y `/en` en dev, Rich Results Test de Google:
      marcado válido sin errores (Google no muestra rich results de FAQ fuera de sitios
      gubernamentales y de salud desde agosto de 2023).
      - Hecho (2026-10-07): `pnpm validate` en verde (167 pruebas). HTML prerenderizado de `/es` y
        `/en`: 7 `<details>` con respuestas en el HTML, 1 `FAQPage`, 2 anclas `#preguntas-frecuentes`.
      - Pendiente: revisión visual en `pnpm dev` y Rich Results Test tras el deploy.
- [x] T07 Correcciones de revisión: preguntas frecuentes únicas en el dominio, ícono con
      `motion-safe:`, `FaqItem` en orden alfabético y comparación con `contenido.md` acotada a la FAQ.
- [x] T08 Expectativa de rich results ajustada en `spec.md` y en el criterio de T06.
- [x] T09 Asset `public/preguntas/preguntas-frecuentes.webp` (1672×941, 126 KB, calidad 80) con
      `sharp-cli`; prueba de existencia y peso ≤ 250 KB en `page.test.tsx`. El PNG original no se
      versiona.
- [x] T10 `FaqSection` recibe `imageSrc` desde `page.tsx`: imagen decorativa (`alt=""`, carga
      diferida) bajo el título, en tarjeta 16:10 (móvil) / 4:5 (escritorio) con degradado y zoom
      `motion-safe` al pasar el mouse; columna izquierda `lg:sticky`. `<main>` pasa de
      `overflow-x-hidden` a `overflow-x-clip`, porque `hidden` lo volvía contenedor de scroll y
      anulaba el sticky.
      - Ajuste (2026-10-07): tarjeta `lg:aspect-square` y recorte `object-[85%_center]`. Con 75 %
        el recorte cuadrado cortaba la burbuja del check en el borde derecho; con 85 % las tres
        burbujas quedan centradas. A 1440×900 la tarjeta mide 515×515 y la columna 736 px. Fija a
        112 px, la tarjeta termina en 848 px y entra completa.
- [x] T11 Alcance 5 en `spec.md` y estas tareas.
      - Medido (2026-10-07, `pnpm build && pnpm start`, iframes de 1440×900 y 390×844): sin scroll
        horizontal (`scrollWidth` 1425 con barra / 375). Escritorio: la columna fija se detiene a
        112 px, bajo el menú (termina en 74–80 px), y no tapa las preguntas, que empiezan en
        x = 624 px y la columna termina en 576 px. Con las 7 preguntas cerradas, ambas columnas
        miden lo mismo (865 px) y no hay nada que fijar; el efecto se nota al abrir respuestas.
        La columna (865 px) es más alta que el espacio visible bajo el menú (788 px): mientras
        está fija, los ~77 px inferiores de la tarjeta quedan fuera de pantalla. Consola de `/es`
        y `/en` sin avisos de hidratación. Falta que el negocio vea la imagen.
