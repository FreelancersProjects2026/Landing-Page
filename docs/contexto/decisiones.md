# Decisiones técnicas detectadas

## Arquitectura modular por dominio
- **Decisión:** agrupar por capacidad y separar dominio, aplicación, infraestructura e interfaz.
- **Por qué documentado:** rapidez, mantenibilidad, evolución y DDD para un equipo de tres personas.
- **Descartado:** carpetas globales por tipo, componentes sin capas y microfrontends; el ADR cita dispersión, mezcla de responsabilidades y complejidad, respectivamente.

## API pública y dependencias hacia dentro
- **Decisión:** módulos consumidos por `index.ts`; dominio aislado; contratos en aplicación; composición en `src/app/`.
- **Por qué documentado:** reducir acoplamiento y permitir pruebas sin React ni servicios externos.
- **Control:** dependency-cruiser y script `pnpm architecture`.

## Next.js, TypeScript y pnpm
- **Decisión:** React está exigido por la constitución; Next.js 16 sustituye a Vite para adoptar la nueva plantilla visual (ADR-002, Spec 002).
- **Dependencias:** `vite` solo queda como peer transitivo de Vitest 5; se usa `@next/eslint-plugin-next` en lugar de `eslint-config-next` por incompatibilidad con ESLint 10.
- [PENDIENTE: documentar por qué se eligieron TypeScript y pnpm frente a alternativas.]

## Datos consistentes
- **Decisión:** el contenido de la landing se valida al cargarse (`validateLandingContent`): título <= 60,
  descripción <= 160, palabra clave principal en dos partes en título, H1 y descripción, textos no vacíos y
  sin `[PENDIENTE]`. Un contenido inválido rompe el build y nunca llega a producción.
- **Consistencia NAP:** nombre, ubicación, dirección, teléfono, proyectos y enlaces del equipo se definen una
  vez y se comparten entre idiomas; todos los botones de contacto usan `buildWhatsAppUrl`.

## Contenido estático e idiomas
- **Decisión:** el contenido es estático y conocido en compilación; se lee de forma síncrona desde Server
  Components y se publica como páginas estáticas `/es` y `/en` (sin librería de i18n ni estados de carga).
- **Ruta raíz:** `/` redirige a `/es` (307) con `redirects()` en `next.config.mjs`.
- **SEO:** `generateMetadata` por idioma y JSON-LD `ProfessionalService` sin `url`.
- [PENDIENTE: dominio; bloquea URL canónica, `hreflang`, sitemap y `metadataBase`.]

## Fuente de datos actual
- **Decisión:** textos de `docs/specs/003-generarContenido/contenido.md` (aprobado) copiados en
  `infrastructure/landingContentSource.ts`; un cambio de contenido se aprueba primero en ese archivo.

## Historial
- La migración a Next.js (Spec 002) se registró en la rama `migration/design`, un commit por fase.
- El contenido de la landing (Spec 003) se registró en la rama `startingLanding`, un commit por tarea.
