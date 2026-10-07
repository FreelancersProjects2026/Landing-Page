# Spec 008: Preguntas frecuentes (FAQ)

## Problema
La landing explica servicios, proceso, proyectos y equipo, pero no responde las dudas que frenan a
un cliente antes de escribir: cuánto cuesta, cuánto tarda, de quién es el código, qué soporte hay
y si trabajamos con clientes fuera de Costa Rica. El visitante con dudas se va sin contactar.

## Solución
Una sección «Preguntas frecuentes» en la landing (`es` y `en`), con preguntas y respuestas cortas,
y los mismos datos publicados como `FAQPage` en los datos estructurados para Google.

## Objetivo
Que el visitante resuelva sus objeciones principales en la página y llegue al contacto con menos
dudas; publicar un marcado `FAQPage` válido. Desde agosto de 2023, Google solo muestra los rich
results de FAQ en sitios gubernamentales y de salud: el marcado sirve a otros buscadores y a
asistentes de IA, pero no garantiza un rich result en Google.

## Alcance
1. **Sección FAQ** entre «Equipo» y «Contacto», desplegables nativos `<details>` (teclado sin JS; respuestas presentes en el HTML para Google).
2. **Menú:** enlace «Preguntas» / «FAQ» a la sección.
3. **Contenido** en `company-profile` (`es` y `en`), validado al cargarse: mínimo una pregunta,
   sin textos vacíos ni `[PENDIENTE]`.
4. **Datos estructurados:** `FAQPage` en el JSON-LD de la landing con las mismas preguntas.
5. Sin imagen ni partículas: el negocio las descartó el 2026-10-07; la columna del título queda
   fija en escritorio.

## Fuera de alcance
- Buscador de preguntas, categorías o página aparte de FAQ.
- Precios fijos publicados (el negocio decide si da un rango).
- Testimonios, capturas y métricas de proyectos (sin material real aún, 2026-10-07).

## Respuestas del negocio
Aprobadas el 2026-10-07 en `contenido.md`: precio por cotización; plazo de días a meses; código
de solutionsPJM; garantía y mantenimiento; clientes de todo país; contado, pagos o suscripción.
