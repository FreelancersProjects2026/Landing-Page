# Spec 010: Proyecto Orgánico CR

## Problema
La sección «Proyectos» muestra tres sistemas internos sin enlace. El equipo construyó y publicó
la tienda en línea **Orgánico CR** (`https://organicocr.store`), un proyecto público que el
visitante puede abrir y comprobar, pero no aparece en la landing.

## Solución
Agregar Orgánico CR como cuarto proyecto (`es` y `en`), con una descripción corta y un enlace
externo al sitio.

## Alcance
1. **Contenido:** proyecto «Orgánico CR» al final de `projects.items` en `es` y `en`.
   - es: «Tienda en línea de productos orgánicos de productores locales de Costa Rica: catálogo,
     carrito, cuenta de usuario y pedidos por WhatsApp con entrega a domicilio.»
   - en: «Online store for organic produce from local Costa Rican growers: catalog, shopping
     cart, user accounts and WhatsApp ordering with home delivery.»
2. **Enlace opcional por proyecto:** `Project.link?: ExternalLink` (`label` + `url`), validado en
   el dominio: si existe, la `url` usa `https:`. Orgánico CR lleva
   `{ label: 'organicocr.store', url: 'https://organicocr.store' }`.
3. **Vista:** si el proyecto tiene `link`, se muestra bajo la descripción como enlace externo
   (nueva pestaña, `noopener noreferrer`, ícono `ArrowUpRight`, como en el equipo). Los proyectos
   sin `link` se ven igual que hoy.

## Fuera de alcance
- Capturas, logo o métricas de Orgánico CR.
- Enlaces para los otros tres proyectos (siguen sin enlace, ver 003).
- Cambiar el orden de los proyectos existentes.

## Decisiones del negocio (2026-10-08)
- Nombre visible: «Orgánico CR».
- El equipo construyó la tienda completa: catálogo, carrito, cuenta de usuario y pedidos por
  WhatsApp con entrega.
- **Enmienda a 003** (`spec.md:99`, «sin enlaces a las aplicaciones»): un proyecto público puede
  llevar enlace. Solo Orgánico CR lo tiene.

## Criterios de aceptación
- [ ] `/es` y `/en` muestran Orgánico CR con su descripción en el idioma de la página.
- [ ] El enlace abre `https://organicocr.store` en una pestaña nueva con `rel="noopener noreferrer"`.
- [ ] El dominio rechaza un `link.url` que no use `https:`.
- [ ] Los otros tres proyectos no muestran enlace.
- [ ] `pnpm validate` en verde.
