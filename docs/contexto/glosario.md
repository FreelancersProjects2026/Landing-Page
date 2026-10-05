# Glosario

## Dominio actual
- **solutionsPJM:** equipo de tres desarrolladores full-stack (Patrick, Jason y Michael) de Paraíso de Cartago
  que crea software a medida para negocios de todo Costa Rica.
- **Contenido de la landing (`LandingContent`):** textos de un idioma: SEO, menú, hero, servicios, cómo
  trabajamos, proyectos, equipo, contacto y footer.
- **Idioma (`Locale`):** `es` o `en`.
- **Datos de contacto (`Contact`):** nombre, ubicación, dirección, área de servicio y teléfono; iguales en
  ambos idiomas (consistencia NAP para SEO local).
- **Palabra clave principal:** «desarrollo de software a medida» / «custom software development» junto con
  «Costa Rica»; debe aparecer en título, H1 y meta description.
- **Invariante:** condición protegida por dominio; ver `validateLandingContent`.

## Arquitectura
- **Módulo:** capacidad aislada bajo `src/modules` con API pública propia.
- **Dominio:** tipos, reglas e invariantes sin React ni integraciones.
- **Aplicación:** casos de uso y contratos necesarios para ejecutarlos.
- **Infraestructura:** adaptadores y validación de datos externos.
- **Interfaz / UI:** componentes y estados visibles.
- **Fuente de contenido (`LandingContentSource`):** contrato con el contenido de cada idioma; hoy lo implementa `landingContentSource`.
- **Caso de uso:** operación de aplicación; hoy `getLandingContent` y `buildWhatsAppUrl`.
- **Plantilla / landing:** base visual oficial del sitio (Next.js), en `src/app/[lang]/` y `src/components/landing/`; con el contenido de solutionsPJM desde la Spec 003.
- **Sección:** bloque visual de la landing (hero, servicios, cómo trabajamos, proyectos, equipo, contacto, footer).

## Siglas
- **DDD:** Domain-Driven Design; guía el modelado desde el negocio.
- **TDD:** Test-Driven Development; ciclo prueba fallida, implementación mínima y refactor.
- **ADR:** Architecture Decision Record; documento de una decisión arquitectónica.
- **API pública:** exportaciones del `index.ts` de un módulo, no una API HTTP.
- **PJM:** iniciales de Patrick, Jason y Michael, los integrantes del equipo.

[PENDIENTE: agregar términos y entidades cuando exista un dominio real de cliente.]
