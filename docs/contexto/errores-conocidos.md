# Errores conocidos y gotchas

## Estado del repositorio
- La implementación, configuración y pruebas actuales están sin seguimiento; Git solo tiene versionados `README.md`, `agent.md` y la documentación previa.
- `agent.md` está versionado pero eliminado; `AGENTS.md` lo reemplaza en el worktree sin estar versionado.
- Los commits `first commit` y `second commit` no describen su contenido ni decisiones.

## Interfaz y estado
- `body > p` no aplica a los mensajes de carga, vacío o error porque React los monta dentro de `#root`; esos estados quedan sin ese estilo.
- Si cambia la función `getCompanyProfile`, el efecto vuelve a cargar pero conserva el estado anterior hasta resolver; no vuelve explícitamente a `loading`.
- Los errores se convierten en un mensaje genérico sin registro, reintento ni mecanismo de diagnóstico.
- No hay prueba del estado `loading`, desmontaje durante una promesa pendiente ni cambio de dependencia.

## Arquitectura
- La regla de API pública protege imports desde `src/app`, pero no impide que un módulo futuro importe capas internas de otro módulo.
- Los alias están duplicados en `vite.config.ts` y `vitest.config.ts`; pueden desincronizarse.
- `src/shared` no contiene implementación; no debe usarse como depósito genérico.
- El repositorio estático simula asincronía, pero no prueba red, persistencia ni cancelación reales.

## Calidad y operación
- No hay umbral ni reporte de cobertura configurado.
- Prettier ignora todos los Markdown; la documentación no participa en `format:check`.
- No existen CI/CD, deploy, variables de entorno ni monitorización.
- No aparecen comentarios `TODO`, `FIXME`, `HACK` o `XXX` en código o documentación.
- [PENDIENTE: registrar errores observados en ejecución real y su procedimiento de recuperación.]
