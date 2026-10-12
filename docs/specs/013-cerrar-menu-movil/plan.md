# Plan técnico: cerrar el menú móvil

## Referencias
- Especificación: `docs/specs/013-cerrar-menu-movil/spec.md`.
- Componente: `src/components/landing/navigation.tsx`.
- Pruebas existentes: `src/components/landing/landing-sections.test.tsx` (`describe('Navigation')`).

## Enfoque
Arreglar la causa raíz (orden de apilamiento), no agregar un segundo botón de cierre. El botón actual
ya alterna `Menu`/`X` y `aria-expanded`; solo está tapado. Cambio solo de UI: no toca el módulo
`company-profile` ni agrega textos.

## Diseño
- `<nav>`: agregar `relative z-50` para que quede encima del overlay (`z-40`) dentro del `<header>`.
- `useEffect` dependiente de `isMobileMenuOpen`: si está abierto, escuchar `keydown` y cerrar con
  `Escape`; limpiar el listener al cerrar o desmontar.
- Sin dependencias nuevas.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `src/components/landing/navigation.tsx` | Modificado | `nav` sobre el overlay; Escape cierra. |
| `src/components/landing/landing-sections.test.tsx` | Modificado | Pruebas de cierre del menú. |

## Pruebas
- Abrir con el botón «Menú» (`aria-expanded="true"`), volver a pulsarlo → `aria-expanded="false"`.
- Con el menú abierto, `fireEvent.keyDown(document, { key: 'Escape' })` → `aria-expanded="false"`.
- El `<nav>` tiene clases `relative` y `z-50` (jsdom no calcula apilamiento; protege contra regresión).
- Verificación manual en viewport móvil (375 px): la X se ve y cierra el menú.

## Riesgos
- Ninguno en desktop: el overlay es `md:hidden`.
