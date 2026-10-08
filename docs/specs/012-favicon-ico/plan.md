# Plan técnico: favicon.ico en la raíz

## Referencias
- Especificación: `docs/specs/012-favicon-ico/spec.md`.
- Antecedente: `docs/specs/009-cambio-logo/plan.md` (favicon PNG de 192 px).
- Google: favicons cuadrados, múltiplos de 48 px, accesibles para Googlebot.

## Enfoque
Asset estático en `public/`: Next lo sirve en `/favicon.ico` sin tocar metadatos. No se usa
`src/app/favicon.ico` para no agregar un `<link>` más a los que ya define `icons.ts`.

Sin dependencias nuevas: los PNG se generan una vez con `pnpm dlx sharp-cli` (como en 008-T09 y
009-T01) y se empaquetan en el ICO con un script de Node de un solo uso. `png-to-ico` se descartó:
agregaba una imagen BMP de 256 px (270 KB).

## Diseño
- ICO con imágenes PNG de 16, 32 y 48 px desde `LOGOsolutionsPJM.jpeg` (1254×1254).

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `public/favicon.ico` | Nuevo | Favicon por defecto en la raíz. |
| `src/app/favicon.test.ts` | Nuevo | Verifica el ICO y sus tamaños. |

## Pruebas
- `favicon.test.ts`: lee el directorio del ICO (cabecera `00 00 01 00`) y comprueba que incluye
  16, 32 y 48 px.

## Riesgos y seguimiento
- Tras el deploy: Search Console → Inspección de URLs → solicitar indexación de `/es` y `/`.
