# Plan técnico: Implementar el contenido de la landing de PJM Solutions

## Referencias
- Especificación: `docs/specs/003-generarContenido/spec.md`.
- Textos aprobables: `docs/specs/003-generarContenido/contenido.md`.
- Arquitectura vigente: `docs/specs/002-migrationProject/plan.md`, `docs/adr/`.
- Constitución: `docs/constitution.md`.

## Requisito previo
El equipo aprueba `contenido.md` (último criterio de aceptación de la spec). Sin aprobación no se
empieza la fase 2: los textos aprobados son la fuente de verdad del código.

## Enfoque
El contenido es estático y conocido en tiempo de compilación. Se modela como datos tipados y
validados en el módulo `company-profile`, se lee de forma síncrona desde Server Components y se
renderiza en páginas estáticas `/es` y `/en`. Los componentes de `src/components/landing/` solo
reciben textos por props; no contienen reglas del negocio. Se reutiliza el estilo visual de la
plantilla y se eliminan las secciones que la spec deja fuera.

## Estructura objetivo
| Ruta | Cambio | Responsabilidad |
|------|--------|-----------------|
| `src/modules/company-profile/domain/` | Ampliar | Tipos del contenido (`LandingContent`, `Service`, `Project`, `TeamMember`, `Contact`, `Seo`), `Locale = 'es' \| 'en'` y validaciones. |
| `src/modules/company-profile/application/` | Reemplazar | `getLandingContent(locale)` síncrono y `buildWhatsAppUrl(phone, message)`. |
| `src/modules/company-profile/infrastructure/` | Reemplazar | Datos ES/EN copiados de `contenido.md`, validados al cargarse. |
| `src/modules/company-profile/ui/` | Retirar | `CompanyProfileSection` y `useCompanyProfile` (estados de carga innecesarios para datos estáticos). |
| `src/modules/company-profile/index.ts` | Actualizar | Exporta `getLandingContent`, `buildWhatsAppUrl`, `locales` y los tipos. |
| `src/app/[lang]/layout.tsx` | Nuevo | `<html lang>`, fuentes, `generateStaticParams`, `generateMetadata` por idioma. |
| `src/app/[lang]/page.tsx` | Nuevo | Compone las 7 secciones con el contenido del idioma; JSON-LD. |
| `src/app/layout.tsx`, `src/app/page.tsx` | Ajustar | `/` redirige a `/es`; el layout raíz deja de fijar `lang="en"` y metadatos de COMPUTE. |
| `src/components/landing/` | Adaptar / retirar | Ver «Secciones». |

## Secciones
| # | Sección (id de ancla) | Componente | Origen |
|---|---|---|---|
| — | Menú | `navigation.tsx` | Adaptar: enlaces a anclas, botón WhatsApp, selector ES/EN. |
| 1 | Hero (`#inicio`) | `hero-section.tsx` | Adaptar: H1 = etiqueta superior, eslogan como titular visual (`<p>`), subtítulo, botón. |
| 2 | Servicios (`#servicios`) | `features-section.tsx` → `services-section.tsx` | Adaptar: título, introducción y 4 servicios. |
| 3 | Cómo trabajamos (`#como-trabajamos`) | `how-it-works-section.tsx` | Adaptar: 4 pasos y 2 diferenciadores. |
| 4 | Proyectos (`#proyectos`) | `projects-section.tsx` | Nuevo (basado en `developers-section.tsx`): nombre y logro, sin enlaces ni capturas. |
| 5 | Equipo (`#equipo`) | `team-section.tsx` | Nuevo: 3 tarjetas con rol y enlaces externos. |
| 6 | Contacto (`#contacto`) | `cta-section.tsx` | Adaptar: título, texto, botón WhatsApp. |
| 7 | Footer | `footer-section.tsx` | Adaptar: texto, ubicación, WhatsApp, derechos. |

Se eliminan: `infrastructure`, `metrics`, `integrations`, `security`, `developers`, `testimonials`
y `pricing` (fuera de alcance por la spec). `ascii-scene.tsx` se conserva solo si el hero lo usa.

## Decisiones técnicas
- **Idiomas:** segmento dinámico `src/app/[lang]` con `generateStaticParams` → `['es', 'en']` y
  `dynamicParams = false` (otro valor da 404). Sin librería de i18n: dos objetos de contenido bastan.
- **Ruta raíz:** `/` redirige a `/es` con `redirects()` en `next.config.mjs` (no permanente), porque el
  layout raíz pasa a `src/app/[lang]/layout.tsx` y `/` deja de tener página propia. Sin detección por
  `Accept-Language` (se añade si el equipo lo pide).
- **Metadatos:** `generateMetadata` toma título y meta description del contenido del idioma;
  `openGraph` con `locale` `es_CR` / `en_US` y `siteName`. Se quita `generator: 'v0.app'`.
- **Bloqueado por dominio:** `metadataBase`, `alternates.canonical`, `hreflang`, `sitemap.ts` y
  `robots.ts` con URL absoluta. Se dejan anotados en «Pendientes» de la spec, sin código.
- **Datos estructurados:** JSON-LD `ProfessionalService` en `[lang]/page.tsx` con nombre,
  dirección (Paraíso, Cartago, CR), teléfono y `areaServed: Costa Rica`; sin `url` hasta tener dominio.
- **HTML semántico:** un único `<h1>` por página; cada sección es `<section id aria-labelledby>`
  con su `<h2>`; menú en `<nav>`; enlaces externos con `target="_blank" rel="noopener noreferrer"`.
- **WhatsApp:** `buildWhatsAppUrl` usa `encodeURIComponent` y el número en formato `50664400832`;
  todos los botones usan la misma función (consistencia NAP).
- **Validación en el límite:** al cargar el contenido se verifica título ≤ 60, descripción ≤ 160,
  palabra clave principal en dos partes («desarrollo de software a medida» / «custom software
  development» y, por separado, «Costa Rica», sin distinguir mayúsculas) en título, H1 y descripción, textos no vacíos y ausencia de
  `[PENDIENTE]`. Un contenido inválido rompe el build, nunca llega a producción.
- **Consistencia entre idiomas:** nombre, ubicación, teléfono, número de proyectos y de integrantes
  y enlaces del equipo se definen una vez y se comparten; solo los textos cambian por idioma.
- **Componentes cliente:** solo los que ya usan estado o efectos (menú móvil, animaciones); el
  contenido se pasa por props desde el Server Component.
- **Imágenes y recursos:** sin fotos ni capturas (fuera de alcance). Se elimina todo lo que quede sin
  uso: `placeholder-*`, `public/images/*`, `ascii-scene.tsx` y, si nada más las usa, las dependencias
  `three` y `@react-three/fiber`.

## Pruebas (TDD)
Cada comportamiento se escribe primero como prueba que falla:
1. **Dominio:** las validaciones rechazan título > 60, descripción > 160, falta de palabra clave,
   textos vacíos y `[PENDIENTE]`.
2. **Aplicación:** `buildWhatsAppUrl` codifica el mensaje y produce `https://wa.me/50664400832?text=…`;
   `getLandingContent` devuelve el contenido de cada idioma y rechaza un idioma desconocido.
3. **Infraestructura:** el contenido ES y EN pasa la validación; nombre, ubicación y WhatsApp
   coinciden entre idiomas; los proyectos no tienen enlaces.
4. **Página:** para cada idioma, las 7 secciones aparecen en orden, hay un solo `<h1>` con la palabra
   clave, el `lang` del documento es correcto y todos los botones de contacto apuntan a WhatsApp.
5. **Metadatos:** `generateMetadata` devuelve el título y la descripción de `contenido.md`.
6. **Hidratación:** se conserva la prueba actual de hidratación sin errores, ahora por idioma.

`page.test.tsx` se reescribe: deja de esperar las secciones de COMPUTE.

## Fases
1. **Preparación:** confirmar la aprobación de `contenido.md` y verificar `pnpm validate` en verde como línea base.
2. **Dominio y aplicación:** tipos, validaciones, `buildWhatsAppUrl` y `getLandingContent` (TDD).
3. **Contenido:** cargar los textos ES/EN en infraestructura; retirar la UI antigua del módulo.
4. **Rutas e idiomas:** `src/app/[lang]/`, redirección de `/`, `generateMetadata`, JSON-LD.
5. **Secciones:** adaptar menú, hero, servicios, cómo trabajamos, contacto y footer; crear
   proyectos y equipo; eliminar las secciones fuera de alcance.
6. **Verificación:** `pnpm validate` en verde; revisión manual con `pnpm dev` en `/es` y `/en`
   (móvil y escritorio) y Lighthouse SEO/accesibilidad.
7. **Documentación:** marcar criterios de la spec, actualizar `README.md`, `AGENTS.md` y
   `docs/contexto/` si cambian rutas o módulos; commit por fase.

## Riesgos
- **Textos sin aprobar:** cambios tardíos obligan a tocar datos y pruebas; mitigado por el requisito previo.
- **Animaciones de la plantilla en jsdom:** ya mitigado en `src/test/setup.ts` (spec 002).
- **SEO sin dominio:** el posicionamiento real depende de `canonical`, sitemap y Google Business;
  la landing queda preparada y esos pasos se activan al definir el dominio.
