import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Controller, Get, Module, Req } = require('@nestjs/common');
const { APP_GUARD, NestFactory } = require('@nestjs/core');
const { AuthService } = require('../apps/api/dist/auth/auth.service.js');
const {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
} = require('../apps/api/dist/auth/jwt-cookie-auth.guard.js');
const {
  IS_PUBLIC_KEY,
  Public,
} = require('../apps/api/dist/auth/public.decorator.js');
const {
  AuthController,
} = require('../apps/api/dist/auth/auth.controller.js');
const {
  InvitesController,
} = require('../apps/api/dist/invites/invites.controller.js');
const {
  FriendInvitesController,
} = require('../apps/api/dist/friends/friend-invites.controller.js');
const {
  HealthController,
} = require('../apps/api/dist/health.controller.js');

function publicMetadata(controller, method) {
  return Reflect.getMetadata(
    IS_PUBLIC_KEY,
    Object.getOwnPropertyDescriptor(controller.prototype, method).value,
  );
}

assert.equal(publicMetadata(HealthController, 'check'), true);
assert.equal(publicMetadata(AuthController, 'signup'), true);
assert.equal(publicMetadata(AuthController, 'login'), true);
assert.notEqual(publicMetadata(AuthController, 'logout'), true);
assert.notEqual(publicMetadata(AuthController, 'me'), true);
assert.equal(publicMetadata(InvitesController, 'validate'), true);
assert.notEqual(publicMetadata(InvitesController, 'create'), true);
assert.notEqual(publicMetadata(InvitesController, 'list'), true);
assert.equal(publicMetadata(FriendInvitesController, 'inspect'), true);
assert.notEqual(publicMetadata(FriendInvitesController, 'create'), true);
assert.notEqual(publicMetadata(FriendInvitesController, 'accept'), true);

class BoundaryController {
  publicRoute() {
    return { public: true };
  }

  privateRoute(request) {
    return { userId: request.user.id };
  }
}
Controller('boundary')(BoundaryController);
for (const [method, path, isPublic] of [
  ['publicRoute', 'public', true],
  ['privateRoute', 'private', false],
]) {
  const descriptor = Object.getOwnPropertyDescriptor(
    BoundaryController.prototype,
    method,
  );
  Get(path)(BoundaryController.prototype, method, descriptor);
  if (isPublic) Public()(BoundaryController.prototype, method, descriptor);
}
Req()(BoundaryController.prototype, 'privateRoute', 0);

class ContractModule {}
Module({
  controllers: [BoundaryController],
  providers: [
    {
      provide: AuthService,
      useValue: {
        findMe: async (token) => {
          if (token !== 'valid-token') return null;
          return { id: 'user-1' };
        },
      },
    },
    JwtCookieAuthGuard,
    { provide: APP_GUARD, useClass: JwtCookieAuthGuard },
  ],
})(ContractModule);

const app = await NestFactory.create(ContractModule, { logger: false });
app.setGlobalPrefix('api');
await app.listen(0, '127.0.0.1');

try {
  const address = app.getHttpServer().address();
  assert(address && typeof address !== 'string');
  const base = `http://127.0.0.1:${address.port}/api/boundary`;

  const publicResponse = await fetch(`${base}/public`);
  assert.equal(publicResponse.status, 200);

  const anonymousPrivate = await fetch(`${base}/private`);
  assert.equal(anonymousPrivate.status, 401);

  const authenticatedPrivate = await fetch(`${base}/private`, {
    headers: { cookie: `${ACCESS_TOKEN_COOKIE}=valid-token` },
  });
  assert.equal(authenticatedPrivate.status, 200);
  assert.deepEqual(await authenticatedPrivate.json(), { userId: 'user-1' });

  console.log(
    'Auth HTTP boundary passed: public=200, anonymous-private=401, authenticated-private=200.',
  );
} finally {
  await app.close();
}
