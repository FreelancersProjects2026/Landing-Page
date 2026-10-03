# Glosario

## Dominio actual
- **PJM Solutions:** equipo de tres profesionales que crea software a medida para emprendimientos, negocios y empresas.
- **Company Profile / perfil de empresa:** entidad principal del único módulo actual.
- **`name`:** nombre público del equipo o empresa.
- **`teamSize`:** cantidad entera positiva de profesionales.
- **`audiences`:** públicos atendidos; los datos actuales son emprendimientos, negocios y empresas.
- **`valueProposition`:** texto principal que comunica el valor ofrecido.
- **Invariante:** condición protegida por dominio; campos no vacíos, equipo positivo y al menos un público válido.

## Arquitectura
- **Módulo:** capacidad aislada bajo `src/modules` con API pública propia.
- **Dominio:** tipos, reglas e invariantes sin React ni integraciones.
- **Aplicación:** casos de uso y contratos necesarios para ejecutarlos.
- **Infraestructura:** adaptadores y validación de datos externos.
- **Interfaz / UI:** componentes y estados visibles.
- **Repositorio:** contrato para obtener un perfil; hoy lo implementa `StaticCompanyProfileRepository`.
- **Caso de uso:** operación de aplicación; hoy solo existe `GetCompanyProfile`.
- **Plantilla / landing:** base visual oficial del sitio (Next.js), en `src/app/` y `src/components/landing/`; su contenido aún no está personalizado.
- **Sección:** bloque visual de la landing (hero, features, pricing, etc.).

## Siglas
- **DDD:** Domain-Driven Design; guía el modelado desde el negocio.
- **TDD:** Test-Driven Development; ciclo prueba fallida, implementación mínima y refactor.
- **ADR:** Architecture Decision Record; documento de una decisión arquitectónica.
- **API pública:** exportaciones del `index.ts` de un módulo, no una API HTTP.
- **PJM:** iniciales de Patrick, Jason y Michael, los integrantes del equipo.

[PENDIENTE: agregar términos y entidades cuando exista un dominio real de cliente.]
