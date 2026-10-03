# Spec 003: Generar el contenido de la landing de PJM Solutions

## Problema
Desarrollamos software que resuelve problemas reales de nuestros clientes, pero nadie nos conoce.
La landing actual conserva los textos de la plantilla "COMPUTE" (en inglés y sobre agentes de IA)
y no dice quiénes somos, qué desarrollamos ni cómo contactarnos, por lo que tampoco posiciona en
buscadores.

## Solución
Recopilar, definir y aprobar el contenido real de PJM Solutions (identidad, servicios, proyectos,
equipo, contacto y SEO) en español e inglés y, una vez aprobado, implementarlo en la landing
dentro de esta misma spec (ver `plan.md`).

## Objetivo
Contar con un contenido verídico, aprobado por el equipo y orientado a SEO que permita a negocios
de todo Costa Rica encontrarnos y contactarnos, publicado en la landing en `/es` y `/en`.

## Información recopilada

### Identidad
- Nombre: PJM Solutions (PJM: iniciales de Patrick, Jason y Michael).
- Equipo: tres desarrolladores full-stack.
- Ubicación: Paraíso de Cartago, Costa Rica.
- Alcance: todo Costa Rica; cualquier tipo de negocio (sin sector preferente).
- Idiomas: español e inglés.

### Propuesta de valor
- Eslogan: «Software que comienza por entender tu negocio.»
- Subtítulo: «Desarrollamos software a medida para negocios en Costa Rica: sistemas de gestión,
  control y métricas hechos para tu operación real.»
- Diferenciadores:
  1. Primero entendemos el negocio, después programamos (DDD).
  2. Trato directo con quienes construyen tu software, sin intermediarios.
  3. Software hecho para tu operación real, no plantillas genéricas.

### Servicios
- Aplicaciones web a medida para la gestión operativa: registros, métricas, historial, control de
  personal, cuentas y cobros.

### Proyectos
- **Agromonitoreo:** métricas para agricultores; historial de cosechas, tramos y producción por
  trabajador mediante plantillas.
- **Sistema Centralizado para el Control y Manejo de Turismo:** control de transporte privado;
  viajes, cuentas y cobros.

### Equipo
| Integrante | Rol | Enlaces |
|---|---|---|
| Patrick Jackson Gómez | Full-stack y análisis de datos; enlace con los clientes: entiende el negocio y lo traduce en tareas para el equipo | [LinkedIn](https://www.linkedin.com/in/patrickjacksongomez/), [GitHub](https://github.com/Jackson11p) |
| Jason Moya Brenes | Full-stack; enfocado en IA, agentes y LLM | [LinkedIn](https://www.linkedin.com/in/jason-moya-brns/), [GitHub](https://github.com/jasonmoyaB) |
| Michael Brenes Chaves | Full-stack | [LinkedIn](https://www.linkedin.com/in/michaelbreneschaves/) |

### Contacto
- WhatsApp: +506 6440-0832 (canal principal, con mensaje predefinido).

### Secciones de la landing
1. Hero: eslogan, subtítulo y botón de WhatsApp.
2. Servicios.
3. Cómo trabajamos: entender el negocio → diseñar → construir → acompañar.
4. Proyectos.
5. Equipo.
6. Contacto (CTA de WhatsApp).
7. Footer: nombre, ubicación y enlaces.

### SEO (palabras clave candidatas)
| Grupo | Español | Inglés |
|---|---|---|
| Principal | desarrollo de software a medida Costa Rica | custom software development Costa Rica |
| Intención | crear software a la medida; software a la medida Costa Rica; hacer un sistema para mi negocio; desarrollar una aplicación web; cotizar software a la medida; programador de sistemas Costa Rica | build custom software; custom software for my business; hire software developers Costa Rica; custom software quote |
| Empresa | empresa de desarrollo de software Costa Rica; desarrolladores de software Costa Rica | software development company Costa Rica; software developers Costa Rica |
| Local | desarrollo de software Cartago; empresa de software Paraíso de Cartago | software development Cartago |
| Servicio | aplicaciones web a medida; sistemas de gestión empresarial; software administrativo para pymes | custom web applications; business management software; small business software |
| Necesidad | control de personal y producción; control de cuentas y cobros; historial y métricas del negocio | employee and production tracking; billing and accounts management; business metrics |
| Agro | software agrícola Costa Rica; control de cosechas; registro de producción por trabajador | agricultural software Costa Rica; harvest tracking software |
| Turismo y transporte | software para empresas de turismo; sistema de control de transporte privado; gestión de viajes y cobros | tourism management software; private transport management system |
| Equipo | Patrick Jackson Gómez; Jason Moya Brenes; Michael Brenes Chaves | — |

## Alcance
- Documentar la información recopilada en esta spec.
- Redactar en `contenido.md` (misma carpeta) los textos finales de cada sección en español e
  inglés, incluidos el título y la meta description de cada idioma.
- Definir las palabras clave principales por idioma y su ubicación (título, H1, descripción).
- Revisar el contenido con el equipo y registrar su aprobación.
- Implementar el contenido aprobado en la landing según `plan.md`: rutas `/es` y `/en`, metadatos
  por idioma, las 7 secciones, JSON-LD y retiro de las secciones de la plantilla, con pruebas (TDD).

## Fuera de alcance
- URL canónica, `hreflang`, sitemap y `metadataBase` (bloqueados por el dominio).
- Secciones de precios, testimonios, métricas, integraciones, seguridad, infraestructura y
  desarrolladores de la plantilla.
- Dominio, correo corporativo, redes sociales y perfil de Google Business.
- Formulario de contacto o cualquier backend.
- Fotografías del equipo y capturas de los proyectos.

## Reglas del negocio
- Todo el contenido es verídico: no se inventan testimonios, métricas, clientes ni precios.
- De cada proyecto se publican solo su nombre y lo que se logró: sin enlaces a las aplicaciones,
  sin datos de clientes y sin capturas con información real.
- El software a medida se cotiza por proyecto; la landing no muestra precios.
- El contacto principal es WhatsApp; el formulario queda para cuando haya backend.
- Nombre, ubicación y contacto se escriben igual en todo el sitio y en ambos idiomas (consistencia
  para SEO local).
- El texto en inglés es una traducción fiel del español, aprobada por el equipo.
- Los datos no confirmados se marcan como `[PENDIENTE]`; nunca se suponen.
- Solo se usan palabras clave de servicios y experiencia reales; se integran en textos naturales,
  sin repetirlas de forma forzada (keyword stuffing).
- La palabra clave principal aparece en el título, el H1 y la meta description; los demás grupos se
  reparten entre las secciones donde correspondan.

## Pendientes
- [ ] Dominio (bloquea la URL canónica, el sitemap y el `hreflang`), correo, redes y Google Business.

## Criterios de aceptación
- [ ] La spec recoge identidad, propuesta de valor, servicios, proyectos, equipo, contacto,
      secciones y palabras clave, sin datos inventados.
- [x] `contenido.md` contiene los textos de las 7 secciones en español e inglés.
- [x] Cada idioma tiene un título (≤ 60 caracteres) y una meta description (≤ 160 caracteres) que
      incluyen la palabra clave principal y «Costa Rica».
- [ ] Cada grupo de palabras clave aparece al menos una vez en `contenido.md`, en ambos idiomas.
- [x] Los proyectos no incluyen enlaces, datos de clientes ni capturas.
- [x] No aparecen precios, testimonios ni métricas.
- [x] Nombre, ubicación y WhatsApp coinciden en todas las secciones e idiomas.
- [x] Los pendientes están marcados como `[PENDIENTE]` y no bloquean el resto del contenido.
- [x] El equipo aprueba el contenido en ambos idiomas.
- [x] `/es` y `/en` muestran las 7 secciones con los textos aprobados y `/` redirige a `/es`.
- [x] Cada idioma publica su título y meta description, un único `<h1>` con la palabra clave y el
      `lang` correcto.
- [x] Todos los botones de contacto abren WhatsApp con el mensaje del idioma.
- [x] `pnpm validate` pasa en verde.
