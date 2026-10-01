# Flujo de trabajo

## Antes de cambiar
1. Leer `docs/constitution.md`, `AGENTS.md` y la especificación relacionada.
2. Comprender el dominio y no asumir reglas no documentadas.
3. Crear o actualizar `spec.md`, `plan.md` y `task.md` para mantener trazabilidad.
4. Identificar el módulo y la capa responsables; registrar cambios arquitectónicos en un ADR.

## Implementación
1. Escribir primero una prueba que falle.
2. Implementar el comportamiento mínimo para ponerla en verde.
3. Refactorizar manteniendo las pruebas verdes.
4. Validar entradas en infraestructura y reglas en dominio.
5. Exponer solo la API necesaria desde el `index.ts` del módulo.
6. Representar explícitamente carga, vacío, éxito y error cuando exista asincronía.

## Comandos
- `pnpm install`: instalar dependencias.
- `pnpm dev`: desarrollo local.
- `pnpm test:watch`: TDD interactivo.
- `pnpm validate`: formato, lint, tipos, pruebas, arquitectura y build.

## Checklist de terminado
- [ ] La especificación y el código están sincronizados.
- [ ] Las pruebas cubren dominio, caso de uso, adaptador o UI según corresponda.
- [ ] No se rompen las fronteras de capas ni la API pública.
- [ ] Los datos se validan en sus límites y mantienen sus invariantes.
- [ ] `pnpm validate` termina correctamente.
- [ ] La documentación y el ADR se actualizan si cambió una decisión.
- [ ] El equipo revisa y aprueba el cambio cuando corresponda.

## Git y deploy
- La rama actual es `main`, un commit por delante de `origin/main`.
- [PENDIENTE: definir ramas, revisión, formato de commits y política de push.]
- El build genera `dist/`, que está ignorado por Git.
- [PENDIENTE: definir hosting, variables de entorno, CI/CD, pasos de despliegue y rollback.]
