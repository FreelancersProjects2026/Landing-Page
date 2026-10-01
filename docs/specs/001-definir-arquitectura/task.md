# Tareas: Implementar la arquitectura

## Base acordada
- Gestor de paquetes: pnpm.
- Aplicación: React + Vite + TypeScript.
- Diseño: módulos por dominio con capas internas.
- Capas: dominio, aplicación, infraestructura e interfaz.
- Método: TDD y cambios pequeños.

## 1. Inicialización
- [ ] T01 Verificar la versión estable de Node.js y pnpm.
- [ ] T02 Crear el proyecto Vite con React y TypeScript.
- [ ] T03 Instalar las dependencias con pnpm.
- [ ] T04 Confirmar que la aplicación inicia con pnpm.
- [ ] T05 Eliminar el contenido de demostración de Vite.

## 2. Calidad
- [ ] T06 Configurar TypeScript en modo estricto.
- [ ] T07 Configurar ESLint para React y TypeScript.
- [ ] T08 Configurar Prettier sin solapar reglas de ESLint.
- [ ] T09 Crear scripts de formato, lint y comprobación de tipos.
- [ ] T10 Verificar que todos los controles finalizan correctamente.

## 3. Pruebas
- [ ] T11 Instalar Vitest y React Testing Library.
- [ ] T12 Configurar el entorno de pruebas del DOM.
- [ ] T13 Crear scripts para pruebas únicas y en observación.
- [ ] T14 Añadir una prueba mínima de arranque de la aplicación.
- [ ] T15 Confirmar el ciclo rojo, verde y refactor de TDD.

## 4. Estructura principal
- [ ] T16 Crear el espacio de composición global de la aplicación.
- [ ] T17 Crear el espacio para módulos de negocio.
- [ ] T18 Crear el espacio compartido para recursos transversales.
- [ ] T19 Definir alias de importación claros y consistentes.
- [ ] T20 Documentar la responsabilidad de cada espacio.

## 5. Módulo de referencia
- [ ] T21 Elegir un dominio mínimo sin reglas específicas de cliente.
- [ ] T22 Crear dentro del módulo las capas de dominio, aplicación, infraestructura e interfaz.
- [ ] T23 Definir la API pública del módulo.
- [ ] T24 Impedir importaciones directas a elementos internos del módulo.
- [ ] T25 Comprobar que el módulo no depende de otros módulos concretos.

## 6. Reglas entre capas
- [ ] T26 Mantener el dominio libre de React y servicios externos.
- [ ] T27 Definir en aplicación los contratos requeridos por los casos de uso.
- [ ] T28 Implementar los contratos externos solo en infraestructura.
- [ ] T29 Limitar la interfaz a presentación y adaptación de eventos.
- [ ] T30 Conectar las capas únicamente desde la composición global.

## 7. Datos y estados
- [ ] T31 Definir una fuente de verdad para cada estado.
- [ ] T32 Validar entradas en formularios e integraciones.
- [ ] T33 Modelar estados de carga, éxito, vacío y error.
- [ ] T34 Mantener las invariantes dentro del dominio.
- [ ] T35 Evitar almacenar datos que puedan derivarse.

## 8. Pruebas arquitectónicas
- [ ] T36 Probar las reglas del dominio sin React.
- [ ] T37 Probar los casos de uso con dobles de sus contratos.
- [ ] T38 Probar la interfaz mediante comportamiento observable.
- [ ] T39 Añadir una comprobación automática de dependencias prohibidas.
- [ ] T40 Confirmar que las pruebas son aisladas y deterministas.

## 9. Documentación
- [ ] T41 Crear el diagrama de módulos y dependencias.
- [ ] T42 Documentar convenciones de nombres e importaciones.
- [ ] T43 Documentar la matriz de responsabilidades por capa.
- [ ] T44 Registrar la decisión arquitectónica y sus alternativas.
- [ ] T45 Vincular la implementación con la spec y el plan.

## 10. Validación final
- [ ] T46 Ejecutar formato, lint, tipos, pruebas y build.
- [ ] T47 Revisar la arquitectura con los tres integrantes.
- [ ] T48 Corregir dependencias o responsabilidades ambiguas.
- [ ] T49 Confirmar el cumplimiento de la constitución.
- [ ] T50 Aprobar la arquitectura como base de futuros proyectos.

## Terminado cuando
- [ ] El proyecto funciona con pnpm, React, Vite y TypeScript.
- [ ] Las capas tienen responsabilidades y dependencias verificables.
- [ ] El flujo TDD está configurado y documentado.
- [ ] Los datos se validan en los límites definidos.
- [ ] La spec, el plan, las decisiones y las pruebas son trazables.
