# Plan técnico: Proyecto Orgánico CR

## Referencias
- Especificación: `docs/specs/010-proyecto-organico-cr/spec.md`.
- Antecedente: `docs/specs/003-generarContenido/spec.md` (proyectos sin enlaces; enmendado por esta
  spec).

## Enfoque
El contenido vive en `company-profile` y la vista solo lo pinta. El cambio es de datos más un
campo opcional:
- **Dominio:** `Project` gana `link?: ExternalLink`. Se reutiliza el tipo que ya usa `TeamMember`.
  `validateLandingContent` agrega un problema si algún `projects.items[].link.url` no empieza con
  `https:`, usando `new URL(...).protocol` como en `siteUrl.ts`. El chequeo de textos vacíos y de
  `[PENDIENTE]` (`collectTexts`) ya cubre `label` y `url`.
- **Infraestructura:** el nuevo proyecto va en `es` y `en`. El `name` y el `link` se comparten en
  un `const`, como `projectNames`, para que ambos idiomas no diverjan.
- **Vista:** `projects-section.tsx` pinta el enlace con `externalLinkProps` (`./external-link`) y
  `ArrowUpRight`, el mismo patrón que `team-section.tsx`.

Sin dependencias nuevas.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `modules/company-profile/domain/landingContent.ts` | Ampliar | `Project.link?: ExternalLink`; valida `https:`. |
| `modules/company-profile/infrastructure/landingContentSource.ts` | Ampliar | Orgánico CR en `es` y `en`. |
| `components/landing/projects-section.tsx` | Ampliar | Enlace externo opcional bajo la descripción. |

## Pruebas
- **Dominio** (`landingContent.test.ts`): se rechaza un proyecto con `link.url` `http://…` y se
  acepta uno con `https://…` o sin `link`.
- **Infraestructura** (`landingContentSource.test.ts`):
  - 4 proyectos, con los mismos nombres y enlaces en `es` y `en`.
  - Orgánico CR enlaza a `https://organicocr.store`.
- **Vista** (`landing-sections.test.tsx`):
  - El test «sin enlaces» pasa a decir que solo los proyectos con `link` muestran un enlace.
  - El enlace se llama `organicocr.store`, apunta al `href` correcto y lleva `_blank` y
    `noopener noreferrer`.
  - Los demás proyectos no tienen enlace.
