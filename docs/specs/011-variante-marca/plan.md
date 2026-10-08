# Plan técnico: Variante de la marca en búsquedas

## Referencias
- Especificación: `docs/specs/011-variante-marca/spec.md`.
- Antecedentes: `docs/specs/004-indexarSearchConsole/spec.md` (JSON-LD con `url`).
- schema.org: `Thing.alternateName`.

## Enfoque
La variante es un dato del negocio, así que vive con el resto de la empresa en `Contact`
(dominio) y en `landingContentSource.ts` (infraestructura). `buildStructuredData` solo la copia.

## Diseño
- `Contact.alternateName: string` (requerido; una sola variante, sin lista hasta que haga falta).
- JSON-LD: `alternateName` justo después de `name`.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `modules/company-profile/domain/landingContent.ts` | Ampliar | `Contact.alternateName`. |
| `modules/company-profile/infrastructure/landingContentSource.ts` | Ampliar | Valor `solutions PJM`. |
| `app/[lang]/structured-data.ts` | Ampliar | Publica `alternateName`. |

## Pruebas
- `structured-data.test.ts`: el JSON-LD de `es` y `en` incluye `alternateName: 'solutions PJM'`.
- `landingContentSource.test.ts`: `company` incluye la variante y es igual entre idiomas.

## Riesgos y seguimiento
- Google tarda días o semanas en reflejar el cambio; no garantiza aparecer en `solutions pjm`.
  Las señales externas (Business Profile, enlaces) pesan más.
