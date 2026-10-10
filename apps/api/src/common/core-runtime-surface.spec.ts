import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

const sourceRoot = join(process.cwd(), 'src');

function source(path: string) {
  return readFileSync(join(sourceRoot, path), 'utf8');
}

function controllerFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return controllerFiles(path);
    return entry.isFile() && entry.name.endsWith('.controller.ts') ? [path] : [];
  });
}

// Every route is private by default (global JwtCookieAuthGuard). Opening a new route to
// anonymous callers must be a deliberate change to this list.
const PUBLIC_ROUTES = [
  'auth/auth.controller.ts#login',
  'auth/auth.controller.ts#logout',
  'auth/auth.controller.ts#resetPassword',
  'auth/auth.controller.ts#signup',
  'friends/friend-invites.controller.ts#inspect',
  'health.controller.ts#check',
  'invites/invites.controller.ts#validate',
  'spaces/space-invites.controller.ts#inspect',
  'users/users.controller.ts#cancelDeletion',
];

function publicRoutes() {
  return controllerFiles().flatMap((path) => {
    const file = relative(sourceRoot, path).replaceAll('\\', '/');
    const text = readFileSync(path, 'utf8');
    return [
      ...text.matchAll(/@Public\(\)(?:\s*(?:\/\/[^\n]*|@\w+\([^)]*\)))*\s*(?:async\s+)?(\w+)\(/g),
    ].map((match) => `${file}#${match[1]}`);
  });
}

describe('API runtime surface', () => {
  it('keeps the anonymous route list explicit', () => {
    assert.deepEqual(publicRoutes().sort(), [...PUBLIC_ROUTES].sort());
  });

  it('guards every route by default and rate limits globally', () => {
    const appModule = source('app.module.ts');
    assert.match(appModule, /provide: APP_GUARD, useClass: ThrottlerGuard/);
    assert.match(appModule, /provide: APP_GUARD, useClass: OriginGuard/);
    assert.match(appModule, /provide: APP_GUARD, useClass: JwtCookieAuthGuard/);
  });

  it('keeps the product feature modules registered', () => {
    const appModule = source('app.module.ts');
    for (const featureModule of [
      'CommentsModule',
      'NotificationsModule',
      'RecommendationsModule',
      'SpacesModule',
      'WatchlistModule',
    ]) {
      assert.match(appModule, new RegExp(`\\b${featureModule},`), featureModule);
    }
  });

  it('serves Swagger only outside production', () => {
    const main = source('main.ts');
    assert.match(main, /if \(shouldEnableSwagger\(\)\)/);
  });

  it('keeps the shared error shape and uncacheable API responses', () => {
    const main = source('main.ts');
    assert.match(main, /app\.useGlobalFilters\(new ApiExceptionFilter\(\)\)/);
    assert.match(main, /'Cache-Control', 'private, no-store'/);
  });
});
