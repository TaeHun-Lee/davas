#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  if (!condition) errors.push(message);
}

function read(relative) {
  return readFileSync(join(root, relative), 'utf8');
}

function isIgnored(relative) {
  const result = spawnSync('git', ['check-ignore', '--no-index', '--quiet', '--', relative], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0 && result.status !== 1) {
    errors.push(
      `git check-ignore failed for ${relative}: ${result.stderr.trim() || `exit ${result.status}`}`,
    );
  }
  return result.status === 0;
}

const rootPackage = JSON.parse(read('package.json'));
const apiPackage = JSON.parse(read('apps/api/package.json'));
const sharedPackage = JSON.parse(read('packages/shared/package.json'));
const scripts = rootPackage.scripts ?? {};

check(
  scripts['start:api'] === 'npm run start --workspace @davas/api',
  'root start:api must delegate to the API workspace start script',
);
check(
  apiPackage.scripts?.start === 'node dist/main.js',
  'API workspace start must execute the compiled entry point',
);
check(
  scripts['test:shared'] === 'node scripts/run-tests.mjs shared',
  'root test:shared must select the shared test scope',
);
check(
  sharedPackage.scripts?.test === 'node ../../scripts/run-tests.mjs shared',
  'Shared workspace test must select the shared test scope',
);
check(
  scripts['docker:up'] === 'docker compose up --build -d',
  'root docker:up must build and start the local Compose stack in detached mode',
);
check(
  scripts['docker:down'] === 'docker compose down',
  'root docker:down must stop the local Compose stack without deleting volumes',
);
check(
  scripts['docker:logs'] === 'docker compose logs -f',
  'root docker:logs must follow local Compose service logs',
);
check(
  scripts['db:show:prod'] === 'npm run migration:show --workspace @davas/api',
  'root db:show:prod must use the compiled API migration command',
);
check(
  scripts['db:migrate:prod'] === 'npm run migration:run --workspace @davas/api',
  'root db:migrate:prod must use the compiled API migration command',
);
check(
  scripts['verify:deployment'] === 'node scripts/verify-deployment-contracts.mjs',
  'verify:deployment must execute this contract checker',
);
check(
  (scripts.verify ?? '').includes('npm run verify:deployment'),
  'verify must include deployment contracts',
);

const formattingVerifier = read('scripts/verify-formatting.mjs');
check(
  formattingVerifier.includes("['diff', '--name-only', '-z', 'HEAD', '--']") &&
    formattingVerifier.includes('changed files cannot use the legacy baseline'),
  'formatting verifier must reject changed files that still use the legacy baseline',
);

const releaseChain = scripts['verify:release'] ?? '';
const caddyIndex = releaseChain.indexOf('npm run verify:caddy');
const auditIndex = releaseChain.indexOf('npm run audit:prod');
check(
  !releaseChain.includes('verify-release-content.mjs'),
  'verify:release must not enforce official legal content for unofficial self-hosting',
);
check(caddyIndex >= 0, 'verify:release must include the Caddy verifier');
check(
  auditIndex > caddyIndex,
  'verify:release must run the production audit after the Caddy verifier',
);

const ignoredRuntimePaths = [
  'uploads/avatar.png',
  'apps/api/uploads/users/avatar.png',
  'backups/2026-07-27/davas.dump',
  'ops/dumps/davas.sql',
  '.env.production',
  'apps/api/.env.local',
  'logs/api.log',
  'apps/web/.next/cache/build.bin',
  'apps/api/dist/main.js',
  'packages/shared/node_modules/example/index.js',
  'apps/web/.cache/tool-state',
  'artifacts/private-export.tar.gz',
  'data/local.sqlite3',
];
for (const path of ignoredRuntimePaths) {
  check(isIgnored(path), `.gitignore must ignore runtime path ${path}`);
}

const trackableSourceFixtures = [
  '.env.production.example',
  'apps/web/.env.example',
  'apps/api/src/fixture/schema.sql',
  'apps/api/src/fixtures/schema.sql',
  'apps/web/src/__fixtures__/response.zip',
  'packages/shared/fixtures/local.sqlite3',
];
for (const path of trackableSourceFixtures) {
  check(!isIgnored(path), `.gitignore must keep source fixture/example trackable: ${path}`);
}

const productionEnvironment = read('.env.production.example');
check(
  !productionEnvironment.includes('DAVAS_OFFICIAL_SERVICE'),
  '.env.production.example must not add an official-service restriction',
);
check(
  productionEnvironment.includes('JWT_ACCESS_SECRET=change-this-long-random-secret') &&
    !productionEnvironment.includes('at-least-32-characters'),
  '.env.production.example must retain its prior JWT placeholder rather than add a password rule',
);

const productionCompose = read('docker-compose.prod.yml');
check(
  !productionCompose.includes('DAVAS_OFFICIAL_SERVICE'),
  'production Compose must not load or require an official legal mode',
);
check(
  productionCompose.includes('${NEXT_PUBLIC_API_BASE_URL:?'),
  'production Compose must require the Web API build URL',
);

const webDockerfile = read('apps/web/Dockerfile');
const apiDockerfile = read('apps/api/Dockerfile');
check(
  /^ARG NEXT_PUBLIC_API_BASE_URL$/m.test(webDockerfile),
  'Web Dockerfile must declare NEXT_PUBLIC_API_BASE_URL without a default',
);
check(
  !/^ARG NEXT_PUBLIC_API_BASE_URL=/m.test(webDockerfile),
  'Web Dockerfile must not default the API URL',
);
check(
  /RUN test -n "\$NEXT_PUBLIC_API_BASE_URL"/.test(webDockerfile),
  'Web Dockerfile must fail when the API URL build argument is empty',
);
check(
  webDockerfile.includes('new URL(process.env.NEXT_PUBLIC_API_BASE_URL)') &&
    webDockerfile.includes("['api', 'web', 'db', 'host.docker.internal']"),
  'Web Dockerfile must reject invalid or Docker-internal browser API URLs',
);
check(
  !webDockerfile.includes('http://localhost:4000/api'),
  'Web production Dockerfile must not embed a localhost API fallback',
);
check(
  !webDockerfile.includes('COPY --from=deps /app/apps/api/node_modules'),
  'Web Dockerfile must rely on npm workspace root dependencies instead of copying a missing API node_modules directory',
);
for (const [name, dockerfile] of [
  ['API', apiDockerfile],
  ['Web', webDockerfile],
]) {
  const stageImages = [...dockerfile.matchAll(/^FROM node:([^ ]+) AS /gm)].map((match) => match[1]);
  check(stageImages.length === 3, `${name} Dockerfile must define deps, builder and runner stages`);
  check(
    stageImages.every((image) => image === '20-alpine'),
    `${name} Dockerfile stages must match the declared Node.js 20 engine`,
  );
  check(
    !/COPY --from=(?:deps|builder) \/app\/apps\/(?:api|web)\/node_modules/.test(dockerfile),
    `${name} Dockerfile must not copy workspace-local node_modules that npm does not create`,
  );
}

const productionDatabaseCaution = read('PRODUCTION_DATABASE_CAUTION.md');
const backupScript = read('deploy/backup.sh');
check(
  /^umask 077$/m.test(backupScript),
  'production backup script must create database and upload backups with owner-only permissions',
);
check(
  productionDatabaseCaution.includes('npm run db:show:prod') &&
    productionDatabaseCaution.includes('npm run db:migrate:prod'),
  'production database caution must use compiled production migration commands',
);
check(
  !/^npm run db:(?:show|migrate)$/m.test(productionDatabaseCaution),
  'production database caution must not recommend source-mode migration commands',
);

const typeormConfig = read('apps/api/src/database/typeorm.config.ts');
const migrationArray = typeormConfig.match(/migrations:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
const registeredMigrations = migrationArray.match(/\b[A-Z][A-Za-z0-9]*\d{10,}\b/g) ?? [];
const operations = read('docs/operations/raspberry-pi-deployment.md');
check(registeredMigrations.length > 0, 'TypeORM config must register at least one migration');
check(
  new Set(registeredMigrations).size === registeredMigrations.length,
  'TypeORM config migration registration must not contain duplicates',
);
for (const migration of registeredMigrations) {
  check(
    operations.includes(`\`${migration}\``),
    `operations runbook is missing registered migration ${migration}`,
  );
}
check(
  operations.includes(
    `Current registered chain (${registeredMigrations.length} migrations in this revision)`,
  ),
  'operations runbook migration count must match the registered chain',
);
check(
  operations.includes('npm run migration:show --workspace @davas/api'),
  'operations runbook must use the compiled API workspace migration:show command',
);
check(
  operations.includes('npm run migration:run --workspace @davas/api'),
  'operations runbook must use the compiled API workspace migration:run command',
);
check(
  !/stop caddy web api|read-only maintenance mode|keep application writers stopped/i.test(
    operations,
  ),
  'operations runbook must not add coordinated backup/read-only enforcement',
);

const architecture = read('docs/architecture/system-overview.md');
check(
  architecture.includes('`/search?scope=friends` or `/search?scope=mine`'),
  'architecture route table must not contain an unescaped scope pipe',
);
const product = read('docs/product/core-experience.md');
check(!product.includes('~~'), 'product ranges must not render as Markdown strikethrough');
check(
  product.includes('비공식·비상업 self-hosting') &&
    product.includes('release 과정에서 legal 원문을 검사하지 않는다.'),
  'product docs must preserve unofficial self-host legal behavior without a release check',
);

const qualityGates = read('docs/verification/quality-gates.md');
check(
  qualityGates.includes('`verify` → `verify:caddy` → `audit:prod`'),
  'quality-gate docs must state the release chain without a legal gate',
);

if (errors.length > 0) {
  console.error(`Deployment contract verification failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Deployment contract verification passed: ${assertions} assertions, ${registeredMigrations.length} registered migrations.`,
);
