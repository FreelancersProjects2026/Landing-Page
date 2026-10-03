# Errores conocidos y gotchas

## Estado del repositorio
- Los commits `first commit` y `second commit` no describen su contenido ni decisiones.
- `company-profile` no está conectado a ninguna página tras la Spec 002; conectarlo queda para una spec posterior.

## Interfaz y estado
- Si cambia la función `getCompanyProfile`, el efecto vuelve a cargar pero conserva el estado anterior hasta resolver; no vuelve explícitamente a `loading`.
- Los errores se convierten en un mensaje genérico sin registro, reintento ni mecanismo de diagnóstico.
- No hay prueba del estado `loading`, desmontaje durante una promesa pendiente ni cambio de dependencia.

## Arquitectura
- La regla de API pública protege imports desde `src/app/` y `src/components/`, pero no impide que un módulo futuro importe capas internas de otro módulo.
- Los alias están duplicados en `tsconfig.json` y `vitest.config.ts`; pueden desincronizarse.
- `src/shared` no contiene implementación; no debe usarse como depósito genérico.
- El repositorio estático simula asincronía, pero no prueba red, persistencia ni cancelación reales.

## Calidad y operación
- No hay umbral ni reporte de cobertura configurado.
- Prettier ignora todos los Markdown; la documentación no participa en `format:check`.
- No existen CI/CD, deploy, variables de entorno ni monitorización.
- No aparecen comentarios `TODO`, `FIXME`, `HACK` o `XXX` en código o documentación.
- [PENDIENTE: registrar errores observados en ejecución real y su procedimiento de recuperación.]

## Plantilla Next.js
- ESLint advierte `@next/next/no-img-element` en 10 `<img>` de la landing; no se cambian a `<Image />` para no alterar lo visual.
- Algunas reglas de `react-hooks` (`set-state-in-effect`, `purity`) se desactivan por línea en la plantilla con su motivo.
- En pruebas, jsdom no implementa `IntersectionObserver` ni `canvas.getContext`; `src/test/setup.ts` los simula.
- `pnpm install` omite el script de build de `sharp`; no se necesita porque `images.unoptimized` está activo.
- **Resuelto:** `src/components/landing/testimonials-section.tsx` genera el patrón ASCII de fondo con
  `Math.random()` durante el render, lo que producía en `pnpm dev` el error "Hydration failed because the
  server rendered text didn't match the client" (heredado de la plantilla original, `85d7d28`). Como el
  patrón es decorativo y aleatorio a propósito, su `<div>` lleva `suppressHydrationWarning`: React conserva
  el texto del servidor y no hay cambio visual. `src/app/page.test.tsx` hidrata la página en jsdom y falla
  ante cualquier error de hidratación.
- **Resuelto:** en `pnpm dev` aparecía "A tree hydrated but some attributes of the server rendered HTML
  didn't match the client properties" con `cz-shortcut-listen="true"` en `<body>` (en `RootLayout`). No
  lo genera nuestro código: lo inyecta la extensión del navegador ColorZilla antes de que React hidrate.
  `<body>` en `src/app/layout.tsx` lleva `suppressHydrationWarning`, que solo ignora diferencias de
  atributos de ese elemento (no de sus hijos). `src/app/layout.test.tsx` simula el atributo y falla sin
  esa propiedad.
