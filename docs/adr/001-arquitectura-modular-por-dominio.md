# ADR-001: Arquitectura modular por dominio

## Estado
Aceptada.

## Contexto
Un equipo de tres profesionales necesita entregar frontends React con rapidez, comprender distintos negocios mediante DDD y mantener especificaciones, pruebas y datos consistentes.

## Decisión
Organizar la aplicación por capacidades de negocio. Cada módulo separa dominio, aplicación, infraestructura e interfaz, publica una API explícita y se conecta desde la composición global.

## Alternativas evaluadas
- **Directorios globales por tipo:** simple al inicio, pero dispersa cada capacidad y aumenta el acoplamiento.
- **Componentes sin capas:** rápida para prototipos, pero mezcla negocio, datos y presentación.
- **Microfrontends:** ofrecen despliegue independiente, pero añaden una complejidad injustificada para tres personas.

## Consecuencias
- Las funcionalidades se localizan y evolucionan por dominio.
- Las reglas pueden probarse sin React ni servicios externos.
- Se requiere respetar APIs públicas y reglas de dependencia.
- Las capas solo se crean cuando existe una responsabilidad concreta.
