# Plan técnico: Definición de la arquitectura

## Referencias
- Especificación: `docs/specs/001-definir-arquitectura/spec.md`.
- Constitución: `docs/constitution.md`.

## Enfoque
Se evaluará y documentará una arquitectura frontend modular por dominio para React. Cada módulo representará una capacidad del negocio y separará dominio, aplicación e interfaz, evitando complejidad innecesaria para un equipo de tres personas.

## Arquitectura propuesta
- **Dominio:** conceptos, reglas e invariantes del negocio, sin dependencias de React ni de servicios externos.
- **Aplicación:** casos de uso y coordinación de flujos; dependerá del dominio mediante contratos explícitos.
- **Interfaz:** componentes, páginas y adaptación de eventos de usuario; dependerá de aplicación y no contendrá reglas de negocio.
- **Infraestructura:** integraciones, persistencia local y acceso a APIs; implementará los contratos requeridos por aplicación.
- **Compartido:** utilidades técnicas realmente transversales, sin reglas propias de un dominio.

## Reglas de dependencia
- Las dependencias apuntarán hacia dominio y aplicación.
- Dominio no conocerá React, infraestructura ni detalles de presentación.
- Los módulos no accederán a detalles internos de otros módulos; se comunicarán mediante contratos públicos.
- Toda excepción arquitectónica deberá quedar justificada mediante una decisión documentada.

## Organización prevista
La aplicación se organizará primero por módulos de negocio y, dentro de cada módulo, por sus capas. Los elementos globales se limitarán a la composición de la aplicación, navegación, configuración y recursos compartidos.

## Consistencia de datos
- Definir una fuente de verdad para cada estado.
- Validar datos al entrar desde formularios, almacenamiento o servicios externos.
- Representar explícitamente estados de carga, éxito, vacío y error.
- Mantener las invariantes del negocio dentro del dominio.
- Evitar duplicar o sincronizar manualmente estado derivado.

## Estrategia de pruebas
- Aplicar TDD a reglas de dominio y casos de uso.
- Probar componentes desde su comportamiento observable.
- Sustituir integraciones mediante contratos controlados en las pruebas.
- Priorizar pruebas rápidas, aisladas y deterministas.

## Trazabilidad
Cada cambio futuro deberá identificar la especificación que lo origina, sus criterios de aceptación y las pruebas que demuestran su cumplimiento. Las decisiones arquitectónicas relevantes se registrarán antes de modificar la estructura acordada.

## Fases del plan
1. Identificar dominios, lenguaje común, actores y flujos principales.
2. Comparar la propuesta con alternativas según simplicidad, rapidez, mantenibilidad y evolución.
3. Definir responsabilidades, límites y contratos de cada capa.
4. Acordar la estructura de módulos, nombres y dependencias permitidas.
5. Establecer reglas de validación, estado y manejo de errores.
6. Definir la estrategia TDD y los tipos de pruebas requeridos.
7. Revisar la propuesta con los tres integrantes y registrar la decisión final.

## Entregables
- Diagrama de módulos, capas y dirección de dependencias.
- Convenciones de organización y nombres.
- Matriz de responsabilidades por capa.
- Estrategia de datos, errores y pruebas.
- Registro de la decisión arquitectónica aprobada.

## Criterios de aceptación
- La arquitectura cumple todos los principios de la constitución.
- Las responsabilidades y dependencias de cada capa son inequívocas.
- La propuesta puede aplicarse de forma consistente por los tres integrantes.
- Existe trazabilidad entre especificaciones, decisiones y futuras pruebas.
- La solución no incorpora backend, infraestructura de despliegue ni funcionalidades de negocio.
- La decisión final está justificada frente a las alternativas evaluadas.

## Riesgos y mitigaciones
- **Sobrearquitectura:** introducir capas solo cuando tengan una responsabilidad concreta.
- **Acoplamiento entre módulos:** exigir contratos públicos y revisar dependencias.
- **Duplicidad de estado:** asignar una única fuente de verdad y derivar el resto.
- **Desalineación del equipo:** revisar y aprobar conjuntamente las convenciones.
