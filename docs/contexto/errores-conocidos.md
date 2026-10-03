# Errores conocidos y gotchas

## Estado del repositorio
- Los commits `first commit` y `second commit` no describen su contenido ni decisiones.

## Interfaz y contenido
- La etiqueta accesible del botón del menú móvil («Menú» / «Menu») no está en `contenido.md`; se define en
  `src/app/[lang]/page.tsx` como texto de interfaz.
- Algunos grupos de palabras clave de la spec aparecen integrados en frases naturales y no como la frase
  exacta (p. ej. «empresa de desarrollo de software de Paraíso de Cartago», «harvest tracking with full history»).
- El video del hero y 4 imágenes decorativas (servicios, cómo trabajamos, proyectos y footer) siguen
  cargándose desde el almacenamiento de la plantilla (`*.public.blob.vercel-storage.com`). Se conservan por
  decisión del equipo, con estos riesgos:
  - **Host ajeno:** el dueño de la plantilla puede borrarlos o moverlos y la landing quedaría sin ellos.
  - **Licencia desconocida:** no consta que su uso comercial esté permitido.
  - **Privacidad y disponibilidad:** cada visita hace peticiones a un tercero que no controlamos.
  - **Rendimiento:** el video se reproduce en `autoplay` sin `poster`, lo que perjudica el LCP.
  - **Marca:** no representan a PJM Solutions; habrá que sustituirlos por recursos propios.

## Arquitectura
- La regla de API pública protege imports desde `src/app/` y `src/components/`, pero no impide que un módulo futuro importe capas internas de otro módulo.
- Los alias están duplicados en `tsconfig.json` y `vitest.config.ts`; pueden desincronizarse.
- `src/shared` no contiene implementación; no debe usarse como depósito genérico.

## Calidad y operación
- No hay umbral ni reporte de cobertura configurado.
- Prettier ignora todos los Markdown; la documentación no participa en `format:check`.
- No existen CI/CD, deploy, variables de entorno ni monitorización.
- No aparecen comentarios `TODO`, `FIXME`, `HACK` o `XXX` en código o documentación.
- [PENDIENTE: registrar errores observados en ejecución real y su procedimiento de recuperación.]

## Plantilla Next.js
- ESLint advierte `@next/next/no-img-element` en 4 `<img>` de la landing; no se cambian a `<Image />` para no alterar lo visual.
- Algunas reglas de `react-hooks` (`set-state-in-effect`, `purity`) se desactivan por línea en la plantilla con su motivo.
- En pruebas, jsdom no implementa `IntersectionObserver` ni `canvas.getContext`; `src/test/setup.ts` los simula.
- `pnpm install` omite el script de build de `sharp`; no se necesita porque `images.unoptimized` está activo.
- **Resuelto:** el patrón ASCII aleatorio de la sección de testimonios provocaba "Hydration failed …" en
  `pnpm dev` (Spec 002, fase 9); la sección se eliminó en la Spec 003. `src/app/[lang]/page.test.tsx`
  sigue hidratando la página de cada idioma y falla ante cualquier error de hidratación.
- **Resuelto:** en `pnpm dev` aparecía "A tree hydrated but some attributes of the server rendered HTML
  didn't match the client properties" con `cz-shortcut-listen="true"` en `<body>` (en `RootLayout`). No
  lo genera nuestro código: lo inyecta la extensión del navegador ColorZilla antes de que React hidrate.
  `<body>` en `src/app/[lang]/layout.tsx` lleva `suppressHydrationWarning`, que solo ignora diferencias de
  atributos de ese elemento (no de sus hijos). `src/app/[lang]/layout.test.tsx` simula el atributo y falla sin
  esa propiedad.
