# Arquitectura actual

## Stack
- SPA frontend: React 19, React DOM, Vite 8 y TypeScript 6.
- Paquetes: pnpm 10.33.2.
- Pruebas: Vitest 5, jsdom y React Testing Library.
- Calidad: ESLint 10, Prettier 3 y dependency-cruiser 18.

## Mapa
- `index.html` y `src/main.tsx`: entrada y montaje en `#root` con `StrictMode`.
- `src/app`: composición de dependencias y componente raíz.
- `src/modules/company-profile`: único módulo; contiene `domain`, `application`, `infrastructure`, `ui` e `index.ts` público.
- `src/shared`: reservado para recursos técnicos reutilizados; hoy solo contiene un README.
- `src/test`: configuración global de pruebas.
- `docs/specs`, `docs/adr`: especificación, plan, tareas y decisión arquitectónica.

## Flujo de datos
1. `App` crea `StaticCompanyProfileRepository` y lo inyecta en `createGetCompanyProfile`.
2. El caso de uso llama al contrato `CompanyProfileRepository.find()`.
3. El adaptador estático valida datos `unknown` y delega las invariantes a `createCompanyProfile`.
4. `useCompanyProfile` transforma la promesa en `loading`, `empty`, `success` o `error`.
5. `CompanyProfileSection` renderiza el estado; los errores internos no se exponen.

## Fronteras
- Dominio no depende de React ni de capas externas.
- Aplicación define contratos; infraestructura los implementa.
- `app` consume módulos mediante su `index.ts`.
- `pnpm architecture` bloquea ciclos y varias dependencias prohibidas.

## No existe
- Backend, API remota, base de datos o persistencia real.
- Router, autenticación, formularios o librería global de estado.
- CI/CD, configuración de hosting o proceso de despliegue.
- Módulos de negocio de clientes; `company-profile` es el único módulo de referencia.
