# Spec 011: Variante de la marca en búsquedas

## Problema
Search Console (export del 2026-10-08) muestra a `/es` y `/en` en posición media 1.1 para
búsquedas de la marca, pero quien busca `solutions pjm` (separado, en incógnito) no encuentra el
sitio. El nombre se publica siempre como una sola palabra (`solutionsPJM`), así que Google no lo
asocia con la consulta en dos palabras, donde `pjm` compite con otras empresas de alta autoridad.

## Solución
Declarar en el JSON-LD de la organización (`ProfessionalService`) la variante `solutions PJM`
como `alternateName`, para que Google relacione ambas escrituras con el mismo negocio.

## Alcance
1. `company.alternateName` = `solutions PJM` en el contenido de la empresa (igual en `es` y `en`).
2. `buildStructuredData` publica `alternateName` junto a `name`.

## Fuera de alcance
- Cambiar el nombre oficial o los textos visibles (requieren aprobar contenido, spec 003).
- Otras variantes como `PJM Solutions`.
- Google Business Profile, redes y backlinks (fuera del código, spec 004).

## Decisiones del negocio (2026-10-08)
- El nombre oficial es `solutionsPJM`; `solutions PJM` es solo la misma marca con espacio, para
  búsquedas.

## Criterios de aceptación
- [x] El JSON-LD de `/es` y `/en` incluye `"alternateName": "solutions PJM"` y mantiene
      `"name": "solutionsPJM"`.
- [x] `pnpm validate` en verde.
