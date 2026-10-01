# Tareas: Implementar la arquitectura

## Base acordada
- Gestor de paquetes: pnpm.
- Aplicación: React + Vite + TypeScript.
- Diseño: módulos por dominio con capas internas.
- Capas: dominio, aplicación, infraestructura e interfaz.
- Método: TDD y cambios pequeños.

## 1. Inicialización
- [x] T01 Verificar la versión estable de Node.js y pnpm.
- [x] T02 Crear el proyecto Vite con React y TypeScript.
- [x] T03 Instalar las dependencias con pnpm.
- [x] T04 Confirmar que la aplicación inicia con pnpm.
- [x] T05 Eliminar el contenido de demostración de Vite.

## 2. Calidad
- [x] T06 Configurar TypeScript en modo estricto.
- [x] T07 Configurar ESLint para React y TypeScript.
- [x] T08 Configurar Prettier sin solapar reglas de ESLint.
- [x] T09 Crear scripts de formato, lint y comprobación de tipos.
- [x] T10 Verificar que todos los controles finalizan correctamente.

## 3. Pruebas
- [x] T11 Instalar Vitest y React Testing Library.
- [x] T12 Configurar el entorno de pruebas del DOM.
- [x] T13 Crear scripts para pruebas únicas y en observación.
- [x] T14 Añadir una prueba mínima de arranque de la aplicación.
- [x] T15 Confirmar el ciclo rojo, verde y refactor de TDD.

## 4. Estructura principal
- [x] T16 Crear el espacio de composición global de la aplicación.
- [x] T17 Crear el espacio para módulos de negocio.
- [x] T18 Crear el espacio compartido para recursos transversales.
- [x] T19 Definir alias de importación claros y consistentes.
- [x] T20 Documentar la responsabilidad de cada espacio.

## 5. Módulo de referencia
- [x] T21 Elegir un dominio mínimo sin reglas específicas de cliente.
- [x] T22 Crear dentro del módulo las capas de dominio, aplicación, infraestructura e interfaz.
- [x] T23 Definir la API pública del módulo.
- [x] T24 Impedir importaciones directas a elementos internos del módulo.
- [x] T25 Comprobar que el módulo no depende de otros módulos concretos.

## 6. Reglas entre capas
- [x] T26 Mantener el dominio libre de React y servicios externos.
- [x] T27 Definir en aplicación los contratos requeridos por los casos de uso.
- [x] T28 Implementar los contratos externos solo en infraestructura.
- [x] T29 Limitar la interfaz a presentación y adaptación de eventos.
- [x] T30 Conectar las capas únicamente desde la composición global.

## 7. Datos y estados
- [x] T31 Definir una fuente de verdad para cada estado.
- [x] T32 Validar entradas en formularios e integraciones.
- [x] T33 Modelar estados de carga, éxito, vacío y error.
- [x] T34 Mantener las invariantes dentro del dominio.
- [x] T35 Evitar almacenar datos que puedan derivarse.

## 8. Pruebas arquitectónicas
- [x] T36 Probar las reglas del dominio sin React.
- [x] T37 Probar los casos de uso con dobles de sus contratos.
- [x] T38 Probar la interfaz mediante comportamiento observable.
- [x] T39 Añadir una comprobación automática de dependencias prohibidas.
- [x] T40 Confirmar que las pruebas son aisladas y deterministas.

## 9. Documentación
- [x] T41 Crear el diagrama de módulos y dependencias.
- [x] T42 Documentar convenciones de nombres e importaciones.
- [x] T43 Documentar la matriz de responsabilidades por capa.
- [x] T44 Registrar la decisión arquitectónica y sus alternativas.
- [x] T45 Vincular la implementación con la spec y el plan.

## 10. Validación final
- [x] T46 Ejecutar formato, lint, tipos, pruebas y build.
- [ ] T47 Revisar la arquitectura con los tres integrantes.
- [x] T48 Corregir dependencias o responsabilidades ambiguas.
- [x] T49 Confirmar el cumplimiento de la constitución.
- [ ] T50 Aprobar la arquitectura como base de futuros proyectos.

## Terminado cuando
- [x] El proyecto funciona con pnpm, React, Vite y TypeScript.
- [x] Las capas tienen responsabilidades y dependencias verificables.
- [x] El flujo TDD está configurado y documentado.
- [x] Los datos se validan en los límites definidos.
- [x] La spec, el plan, las decisiones y las pruebas son trazables.
