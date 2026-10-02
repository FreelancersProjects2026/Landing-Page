# Arquitectura actual

## Stack
- Frontend: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, shadcn/ui y TypeScript 6.
- Paquetes: pnpm 10.33.2.
- Pruebas: Vitest 5, jsdom y React Testing Library (sin plugin de Vite; `vite` es peer transitivo de Vitest).
- Calidad: ESLint 10 con `@next/eslint-plugin-next`, Prettier 3 y dependency-cruiser 18.
- Analítica: `<Analytics />` de `@vercel/analytics` está en el layout, sin configurar.

## Mapa
- `app/layout.tsx` y `app/page.tsx`: layout raíz (fuentes, metadatos) y página principal de la plantilla.
- `components/landing`: 13 secciones de la landing (navegación, hero, features, ..., footer); `ascii-scene.tsx` existe pero no se usa.
- `components/ui`, `hooks`, `lib`: componentes shadcn/ui y utilidades.
- `public`, `styles`: imágenes, iconos y estilos globales.
- `src/modules/company-profile`: único módulo; contiene `domain`, `application`, `infrastructure`, `ui` e `index.ts` público.
- `src/shared`: reservado para recursos técnicos reutilizados; hoy solo contiene un README.
- `src/test`: configuración global de pruebas.
- `docs/specs`, `docs/adr`: especificación, plan, tareas y decisión arquitectónica.

## Flujo de datos
La landing actual es estática y no usa ningún módulo. `company-profile` no está conectado a ninguna
página desde la Spec 002; su flujo, cubierto por pruebas, es:
1. Un componente de composición crea `StaticCompanyProfileRepository` y lo inyecta en `createGetCompanyProfile`.
2. El caso de uso llama al contrato `CompanyProfileRepository.find()`.
3. El adaptador estático valida datos `unknown` y delega las invariantes a `createCompanyProfile`.
4. `useCompanyProfile` transforma la promesa en `loading`, `empty`, `success` o `error`.
5. `CompanyProfileSection` renderiza el estado; los errores internos no se exponen.

## Fronteras
- Dominio no depende de React ni de capas externas.
- Aplicación define contratos; infraestructura los implementa.
- `app/` y `components/` consumen módulos solo mediante su `index.ts`.
- `pnpm architecture` bloquea ciclos y varias dependencias prohibidas.

## No existe
- Backend, API remota, base de datos o persistencia real.
- Autenticación, formularios funcionales o librería global de estado.
- CI/CD, configuración de hosting o proceso de despliegue.
- Módulos de negocio de clientes; `company-profile` es el único módulo de referencia.
