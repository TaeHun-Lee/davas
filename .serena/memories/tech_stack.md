# Technology stack
- Package manager/build orchestration: npm workspaces; root package is private.
- Language: TypeScript 5.7, strict mode, ES2022, NodeNext resolution.
- API: NestJS 10, TypeORM 0.3, PostgreSQL; JWT/Passport auth; class-validator/transformer; Swagger.
- Web: Next.js 15 App Router, React 19, TanStack React Query 5, Zod, Tailwind CSS 3.
- Shared workspace: `@davas/shared`, ESM TypeScript package.
- Tests: Node built-in test runner with `tsx`; tests are colocated as `*.spec.ts` or `*.test.ts`.
- Formatting/lint: Prettier 3; web ESLint flat config with Next core-web-vitals/typescript; API lint command is strict TypeScript no-emit.
- Runtime/deploy: Docker Compose; production stack includes PostgreSQL, API, web, Caddy; Raspberry Pi/DuckDNS deployment is documented.