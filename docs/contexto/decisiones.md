# Decisiones técnicas detectadas

## Arquitectura modular por dominio
- **Decisión:** agrupar por capacidad y separar dominio, aplicación, infraestructura e interfaz.
- **Por qué documentado:** rapidez, mantenibilidad, evolución y DDD para un equipo de tres personas.
- **Descartado:** carpetas globales por tipo, componentes sin capas y microfrontends; el ADR cita dispersión, mezcla de responsabilidades y complejidad, respectivamente.

## API pública y dependencias hacia dentro
- **Decisión:** módulos consumidos por `index.ts`; dominio aislado; contratos en aplicación; composición en `app`.
- **Por qué documentado:** reducir acoplamiento y permitir pruebas sin React ni servicios externos.
- **Control:** dependency-cruiser y script `pnpm architecture`.

## React, Vite, TypeScript y pnpm
- **Decisión:** React está exigido por la constitución; Vite, TypeScript y pnpm figuran en tareas y configuración.
- [PENDIENTE: documentar por qué se eligieron Vite, TypeScript y pnpm frente a alternativas.]

## Datos consistentes
- **Decisión:** infraestructura valida forma y tipos; dominio normaliza texto, protege invariantes y devuelve datos congelados.
- **Por qué documentado:** la constitución exige validar límites y conservar estados coherentes.

## Estado y errores de interfaz
- **Decisión:** modelar `loading`, `empty`, `success` y `error`; mostrar un mensaje genérico ante errores.
- **Evidencia:** hook, componente y pruebas de `company-profile`.
- [PENDIENTE: definir política de registro, reintentos y observabilidad.]

## Fuente de datos actual
- **Decisión observable:** repositorio estático asíncrono con el perfil de PJM Solutions.
- [PENDIENTE: documentar si es temporal y qué integración lo sustituirá.]

## Historial
- Los dos commits recientes solo incorporan README y documentación; la implementación actual no está consolidada en commits.
