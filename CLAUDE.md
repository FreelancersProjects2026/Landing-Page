# CLAUDE.md

Guía operativa para agentes de IA en este repositorio. Complementa a `AGENTS.md`, que se importa abajo y
tiene prioridad ante cualquier conflicto.

@AGENTS.md

## Proyecto

- **Cliente/negocio:** solutionsPJM, equipo de tres desarrolladores (Patrick, Jason y Michael) de Paraíso de
  Cartago que crea software a medida para negocios de Costa Rica.
- **Producto actual:** landing estática bilingüe (`/es`, `/en`) con SEO local, FAQ, política de privacidad,
  JSON-LD, imagen OpenGraph, `robots.ts` y `sitemap.ts`. `/` redirige a `/es` (307).
- **Sin backend:** no hay API, base de datos, autenticación ni formularios funcionales. El contacto es por
  WhatsApp, correo e Instagram.
- **Lenguaje:** documentación, specs, commits, descripciones de pruebas y textos de UI en español.

## Mapa del código

| Ruta                               | Responsabilidad                                                       |
| ---------------------------------- | --------------------------------------------------------------------- |
| `src/app/[lang]/`                  | Composición por idioma: layout, página, metadatos, JSON-LD, OG.       |
| `src/app/`                         | `robots`, `sitemap`, iconos, fuentes, `globals.css`, 404 global.      |
| `src/components/landing/`          | Secciones visuales; reciben textos por props, sin reglas de negocio.  |
| `src/components/ui/`               | shadcn/ui (terceros): no editar salvo necesidad; fuera de lint.       |
| `src/modules/company-profile/`     | Único módulo de dominio: contenido ES/EN, contacto, privacidad, URLs. |
| `src/test/`                        | Setup global de pruebas (simula `IntersectionObserver` y `canvas`).   |
| `docs/specs/NNN-nombre/`           | `spec.md`, `plan.md`, `task.md` de cada cambio.                       |
| `docs/contexto/`, `docs/adr/`      | Contexto, convenciones, decisiones, gotchas, glosario y ADRs.         |

### Flujo de datos

1. `infrastructure/landingContentSource.ts` define los textos y los valida con `validateLandingContent`;
   un contenido inválido rompe el build.
2. `index.ts` compone los casos de uso (`getLandingContent`, `getPrivacyPolicy`) y expone la API pública.
3. Las páginas (Server Components) obtienen el contenido del idioma y pasan a cada sección solo su parte.

## Reglas de arquitectura

- Dependencias hacia dentro: `ui`/`infrastructure` → `application` → `domain`.
- `domain` no importa React ni capas externas; `application` define contratos (puertos) que
  `infrastructure` implementa.
- `src/app/` y `src/components/` importan módulos **solo** desde su `index.ts`. `pnpm architecture` lo
  verifica junto con la ausencia de ciclos.
- Reglas de negocio e invariantes en `domain`; validación de datos externos en `infrastructure`.
- Datos de contacto (NAP) definidos una sola vez y compartidos entre idiomas. Enlaces de contacto con
  `buildWhatsAppUrl` y `buildEmailComposeUrl`; nunca URLs escritas a mano.
- Un cambio de contenido visible se aprueba primero en `docs/specs/003-generarContenido/contenido.md`.
- `src/shared/` no es un depósito genérico: solo recursos técnicos usados por más de un módulo.
- Una decisión arquitectónica nueva requiere un ADR en `docs/adr/`.

## Flujo de trabajo obligatorio

1. **Entender:** lee la spec relacionada y `docs/contexto/`. No supongas reglas de negocio; pregunta o
   documenta la duda en la spec.
2. **Especificar:** crea `docs/specs/NNN-nombre/` con el siguiente número libre y escribe
   `spec.md` → `plan.md` → `task.md`, en ese orden. `plan.md` es obligatorio antes de implementar.
3. **Implementar con TDD:** prueba que falla → mínimo código en verde → refactor con pruebas en verde.
4. **Revisar:** cada tarea terminada pasa por revisión antes de la siguiente.
5. **Validar:** `pnpm validate` debe pasar antes de dar algo por terminado.
6. **Sincronizar:** marca las tareas en `task.md` y actualiza spec, `docs/contexto/` o ADR si cambió algo.

### Agentes del equipo (`.claude/agents/`)

| Agente           | Rol                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------- |
| `planner`        | Pregunta, modela con DDD, escribe spec/plan/task y orquesta el ciclo. No escribe código. |
| `coder`          | Implementa una tarea con TDD y skill `senior-dev`; un commit por tarea.               |
| `reviwer`        | Revisa cada commit en solo lectura; reporta hallazgos a `planner`.                    |
| `refactorizador` | Parte un archivo en piezas < 150 líneas sin cambiar el comportamiento.                |

- Tras cada tarea de `coder`, lanza `reviwer` sin preguntar.
- Los hallazgos de `reviwer` vuelven a `planner`, que los convierte en tareas nuevas de corrección.
- `reviwer` nunca modifica archivos (ni `sed -i`, `mv`, `rm`, ni en el scratchpad).

## Comandos

```bash
pnpm install        # dependencias (pnpm 10; no usar npm ni yarn)
pnpm dev            # http://localhost:3000
pnpm test           # Vitest una vez
pnpm test:watch     # TDD interactivo
pnpm check          # Prettier + ESLint + tsc
pnpm architecture   # fronteras entre capas (dependency-cruiser)
pnpm validate       # check + test + architecture + build
```

## Convenciones de código

- TypeScript `strict`; imports internos de módulos con extensión `.ts`/`.tsx` y rutas relativas.
- Alias solo para cruzar espacios: `@/*` (`./src/*`), `@modules`, `@shared`.
- Prettier: sin punto y coma, comillas simples, coma final. Finales de línea LF.
- `PascalCase` para componentes y clases; `camelCase` para funciones, hooks y casos de uso;
  `kebab-case` para módulos y archivos de componentes de landing.
- Tipos y propiedades del dominio `readonly`; objetos creados congelados.
- Estilos con Tailwind CSS 4 y tokens de `globals.css`; no añadir CSS-in-JS ni dependencias sin
  justificarlo en la spec.
- Accesibilidad mínima: `aria-label` en enlaces de solo icono, `:focus-visible` visible, áreas táctiles
  ≥ 44 px y respeto de `prefers-reduced-motion`.

## Pruebas

- Archivos `*.test.ts(x)` junto al código; descripciones en español.
- Dominio y aplicación: Vitest puro, dobles con `vi.fn()`.
- UI: React Testing Library sobre comportamiento observable (roles, nombres accesibles, `href`), no sobre
  nombres de clase.
- `src/app/[lang]/page.test.tsx` hidrata cada idioma y falla ante errores de hidratación: no lo debilites.

## Git

- Trabaja en la rama actual; no hagas commit en `main` ni push sin que el usuario lo pida.
- Formato: `tipo(ámbito): NNN-Tnn descripción` (p. ej. `feat(footer): 017-T03 iconos de marca`).
  Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`.
- Un commit por tarea; no incluyas cambios ajenos a la tarea.

## Errores conocidos

- ESLint advierte `@next/next/no-img-element` en `<img>` de la landing; se mantienen a propósito.
- jsdom no implementa `IntersectionObserver` ni `canvas.getContext`; ya están simulados en `src/test/setup.ts`.
- `<body>` lleva `suppressHydrationWarning` por extensiones del navegador; no lo quites.
- Alias duplicados en `tsconfig.json` y `vitest.config.ts`: cámbialos en ambos.
- Prettier ignora Markdown; revisa a mano el formato de la documentación.

## Definición de terminado

- [ ] Spec, plan y tareas sincronizados con el código.
- [ ] Pruebas escritas primero y en verde para la capa afectada.
- [ ] Fronteras de capas y API pública intactas (`pnpm architecture`).
- [ ] Datos validados en sus límites e invariantes protegidos.
- [ ] `pnpm validate` en verde.
- [ ] Dudas de negocio documentadas y reportadas al usuario.
