import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Controller, Get, Module, Post } = require('@nestjs/common');
const { APP_GUARD, NestFactory } = require('@nestjs/core');
const {
  configureHttpSecurity,
  OriginGuard,
} = require('../apps/api/dist/common/app-security.js');

class SecurityController {
  read() {
    return { ok: true };
  }

  write() {
    return { ok: true };
  }
}
Controller('security')(SecurityController);
for (const [method, decorator] of [
  ['read', Get()],
  ['write', Post()],
]) {
  const descriptor = Object.getOwnPropertyDescriptor(
    SecurityController.prototype,
    method,
  );
  decorator(SecurityController.prototype, method, descriptor);
}

class ContractModule {}
Module({
  controllers: [SecurityController],
  providers: [{ provide: APP_GUARD, useClass: OriginGuard }],
})(ContractModule);

const previousOrigins = process.env.CORS_ORIGINS;
process.env.CORS_ORIGINS = 'https://davas.app';
const app = await NestFactory.create(ContractModule, { logger: false });
configureHttpSecurity(app);
await app.listen(0, '127.0.0.1');

try {
  const address = app.getHttpServer().address();
  assert(address && typeof address !== 'string');
  const endpoint = `http://127.0.0.1:${address.port}/security`;

  const read = await fetch(endpoint, {
    headers: { origin: 'https://evil.example' },
  });
  assert.equal(read.status, 200);
  assert.equal(read.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(read.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(read.headers.get('cross-origin-resource-policy'), 'cross-origin');
  assert.equal(read.headers.get('access-control-allow-origin'), null);

  const allowedWrite = await fetch(endpoint, {
    method: 'POST',
    headers: { origin: 'https://davas.app' },
  });
  assert.equal(allowedWrite.status, 201);
  assert.equal(
    allowedWrite.headers.get('access-control-allow-origin'),
    'https://davas.app',
  );
  assert.equal(allowedWrite.headers.get('access-control-allow-credentials'), 'true');

  const blockedWrite = await fetch(endpoint, {
    method: 'POST',
    headers: { origin: 'https://evil.example' },
  });
  assert.equal(blockedWrite.status, 403);

  console.log(
    'Security HTTP boundary passed: Helmet headers, exact CORS, allowed POST=201, cross-origin POST=403.',
  );
} finally {
  await app.close();
  if (previousOrigins === undefined) delete process.env.CORS_ORIGINS;
  else process.env.CORS_ORIGINS = previousOrigins;
}
