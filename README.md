# solutionsPJM

Proyecto frontend para crear soluciones de software a medida que respondan a las necesidades reales de cada cliente.

## Equipo y enfoque

Somos un equipo de tres profesionales. Nuestro punto de partida es comprender el negocio, su lenguaje y sus reglas antes de desarrollar, aplicando los principios de Domain-Driven Design (DDD).

## Stack

- Next.js 16 (App Router) y React 19
- Tailwind CSS 4 y shadcn/ui
- TypeScript
- pnpm 10
- Vitest, jsdom y React Testing Library
- ESLint, Prettier y dependency-cruiser

## Desarrollo

- `pnpm install`: instala las dependencias.
- `pnpm dev`: inicia el entorno local de Next.js en `http://localhost:3000`.
- `pnpm build` / `pnpm start`: genera y sirve la compilación de producción.
- `pnpm test`: ejecuta las pruebas.
- `pnpm check`: formato, lint y tipos.
- `pnpm architecture`: valida las fronteras entre capas.
- `pnpm validate`: ejecuta todos los controles y el build.

## Estructura

- `src/app/[lang]/`: layout y página por idioma (`/es`, `/en`); `/` redirige a `/es`. Incluye privacidad (`/es/privacidad`, `/en/privacy`), JSON-LD e imagen OpenGraph por idioma.
- `src/app/`: `robots.ts`, `sitemap.ts`, iconos, fuentes, estilos globales y 404 global.
- `src/components/landing/`: secciones de la landing (hero, servicios, proceso, proyectos, equipo, FAQ, CTA, footer con contactos 3D y botón de WhatsApp); reciben el contenido por props.
- `src/components/ui/`, `src/hooks/`, `src/lib/`: componentes shadcn/ui y utilidades técnicas.
- `public/`: recursos estáticos (imágenes en WebP). Los estilos globales están en `src/app/globals.css`.
- `src/modules/`: módulos de dominio con sus capas (`company-profile`: contenido ES/EN de la landing).
- `src/shared/`, `src/test/`: recursos transversales y configuración de pruebas.

## Principios de desarrollo

- Mantener trazabilidad entre las especificaciones y el código.
- Separar las capas de interfaz, aplicación y dominio.
- Desarrollar mediante TDD y pruebas unitarias.
- Validar los datos y preservar su consistencia.
- Priorizar soluciones simples que aporten valor al cliente.

## Flujo de trabajo con agentes

Los agentes de `.claude/agents/` trabajan en ciclo:

1. `planner`: aclara el negocio y escribe `spec.md` → `plan.md` → `task.md` en `docs/specs/NNN-nombre/`.
2. `coder`: implementa cada tarea con TDD, un commit por tarea.
3. `reviwer`: revisa cada commit en solo lectura; sus hallazgos vuelven a `planner` como tareas nuevas.

`refactorizador` parte archivos grandes sin cambiar comportamiento. Las especificaciones van de la 001 a la 017 (`docs/specs/`).

## Documentación

- [Constitución del proyecto](docs/constitution.md)
- [Arquitectura frontend](docs/architecture.md)
- [ADR-001: arquitectura modular por dominio](docs/adr/001-arquitectura-modular-por-dominio.md)
- [ADR-002: migración de Vite a Next.js](docs/adr/002-migracion-de-vite-a-nextjs.md)
- [Contexto del proyecto](docs/contexto/) (arquitectura, convenciones, decisiones, errores conocidos, flujo de trabajo, glosario)
- [Especificaciones](docs/specs/)
- [Instrucciones para agentes](AGENTS.md) y [CLAUDE.md](CLAUDE.md)
