# Instrucciones para agentes

## Contexto
Este proyecto pertenece a un equipo de tres profesionales que desarrolla software a medida. Antes de implementar una funcionalidad, comprende el negocio del cliente y expresa sus conceptos mediante DDD.

## Estructura
- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TypeScript y pnpm 10.
- `src/app/[lang]/`: layout y página por idioma (`es`, `en`); solo composición.
- `src/components/landing/`: secciones visuales de la landing, sin reglas de negocio (reciben textos por props);
  `src/components/ui/` es código de shadcn/ui
  (fuera de ESLint y Prettier).
- `src/modules/<modulo>/`: capas `domain`, `application`, `infrastructure` y `ui`, con su API pública en `index.ts`.
- `src/app/` y `src/components/` consumen los módulos solo mediante su `index.ts` (`pnpm architecture`).
- Antes de terminar, ejecuta `pnpm validate`.

## Reglas de desarrollo
- Usa React para toda implementación frontend.
- Vincula cada cambio con una especificación clara y mantén ambos sincronizados.
- Separa interfaz, aplicación y dominio; evita introducir lógica de negocio en componentes visuales.
- Aplica TDD: escribe primero una prueba que falle, implementa el comportamiento mínimo y refactoriza con las pruebas en verde.
- Valida los datos en los límites de cada capa y conserva estados coherentes durante todo el flujo.
- Prefiere cambios pequeños, legibles y enfocados en aportar valor al cliente.
- No supongas reglas del negocio: documenta las dudas y solicita aclaraciones.

## Criterios de finalización
Un cambio está completo cuando satisface su especificación, respeta las capas, incluye pruebas unitarias y mantiene la consistencia de los datos.
