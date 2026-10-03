# Arquitectura actual

## Stack
- Frontend: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, shadcn/ui y TypeScript 6.
- Paquetes: pnpm 10.33.2.
- Pruebas: Vitest 5, jsdom y React Testing Library (sin plugin de Vite; `vite` es peer transitivo de Vitest).
- Calidad: ESLint 10 con `@next/eslint-plugin-next`, Prettier 3 y dependency-cruiser 18.
- Analítica: `<Analytics />` de `@vercel/analytics` está en el layout, sin configurar.

## Mapa
- `src/app/[lang]/layout.tsx`: layout raíz por idioma (`<html lang>`, fuentes, `generateMetadata`,
  `generateStaticParams` con `es` y `en`, `dynamicParams = false`).
- `src/app/[lang]/page.tsx`: compone las secciones con el contenido del idioma y publica el JSON-LD
  (`structured-data.ts`). `next.config.mjs` redirige `/` a `/es` (307).
- `src/components/landing`: menú, hero, servicios, cómo trabajamos, proyectos, equipo, contacto y footer;
  reciben los textos por props.
- `src/components/ui`, `src/hooks`, `src/lib`: componentes shadcn/ui y utilidades.
- `public` (en la raíz): iconos. Los estilos globales están en `src/app/globals.css`.
- `src/modules/company-profile`: contenido de la landing; contiene `domain`, `application`, `infrastructure`
  e `index.ts` público.
- `src/shared`: reservado para recursos técnicos reutilizados; hoy solo contiene un README.
- `src/test`: configuración global de pruebas.
- `docs/specs`, `docs/adr`: especificación, plan, tareas y decisión arquitectónica.

## Flujo de datos
1. `infrastructure/landingContentSource.ts` define los textos ES/EN de `contenido.md` y los datos comunes
   (nombre, ubicación, teléfono, proyectos, enlaces del equipo); cada idioma pasa por
   `validateLandingContent` al cargarse, así que un contenido inválido rompe el build.
2. `index.ts` compone `getLandingContent = createGetLandingContent(landingContentSource)`; el caso de uso
   rechaza idiomas desconocidos.
3. La página (Server Component) obtiene el contenido del idioma, calcula el enlace con
   `buildWhatsAppUrl` y pasa a cada sección solo su parte por props.

## Fronteras
- Dominio no depende de React ni de capas externas.
- Aplicación define contratos; infraestructura los implementa.
- `src/app/` y `src/components/` consumen módulos solo mediante su `index.ts`.
- `pnpm architecture` bloquea ciclos y varias dependencias prohibidas.

## No existe
- Backend, API remota, base de datos o persistencia real.
- Autenticación, formularios funcionales o librería global de estado.
- CI/CD, configuración de hosting o proceso de despliegue.
- Módulos de negocio de clientes; `company-profile` es el único módulo.
- URL canónica, `hreflang`, sitemap y `metadataBase` (bloqueados por el dominio).
