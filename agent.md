# Instrucciones para agentes

## Contexto
Este proyecto pertenece a un equipo de tres profesionales que desarrolla software a medida. Antes de implementar una funcionalidad, comprende el negocio del cliente y expresa sus conceptos mediante DDD.

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
