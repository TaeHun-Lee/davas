import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Module } = require('@nestjs/common');
const { APP_GUARD, NestFactory } = require('@nestjs/core');
const {
  ThrottlerGuard,
  ThrottlerModule,
} = require('@nestjs/throttler');
const { AuthService } = require('../apps/api/dist/auth/auth.service.js');
const {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
} = require('../apps/api/dist/auth/jwt-cookie-auth.guard.js');
const {
  validateProfileImageContent,
} = require('../apps/api/dist/users/profile-image-upload.js');
const {
  UploadConcurrencyInterceptor,
} = require('../apps/api/dist/users/upload-concurrency.interceptor.js');
const {
  UsersController,
} = require('../apps/api/dist/users/users.controller.js');
const { UsersService } = require('../apps/api/dist/users/users.service.js');

let saveCalls = 0;
const usersService = {
  async saveProfileImage(_token, file) {
    saveCalls += 1;
    validateProfileImageContent(file);
    return { id: 'user-1', profileImageUrl: '/uploads/profile-images/test.jpg' };
  },
  async updateMe() {},
  async deleteProfileImage() {},
  async deleteMe() {},
};
const authService = {
  async findMe(token) {
    assert.equal(token, 'valid-token');
    return { id: 'user-1' };
  },
};

class ContractModule {}
Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 100, blockDuration: 60_000 },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    { provide: UsersService, useValue: usersService },
    { provide: AuthService, useValue: authService },
    JwtCookieAuthGuard,
    UploadConcurrencyInterceptor,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtCookieAuthGuard },
  ],
})(ContractModule);

const app = await NestFactory.create(ContractModule, { logger: false });
app.setGlobalPrefix('api');
await app.listen(0, '127.0.0.1');

try {
  const address = app.getHttpServer().address();
  assert(address && typeof address === 'object');
  const endpoint = `http://127.0.0.1:${address.port}/api/users/me/profile-image`;

  async function upload(bytes, declaredType, authenticated) {
    const form = new FormData();
    form.append('file', new Blob([bytes], { type: declaredType }), 'avatar');
    return fetch(endpoint, {
      method: 'POST',
      headers: authenticated
        ? { cookie: `${ACCESS_TOKEN_COOKIE}=valid-token` }
        : {},
      body: form,
    });
  }

  const oversizedBytes = new Uint8Array(5 * 1024 * 1024 + 1);
  oversizedBytes.set([0xff, 0xd8, 0xff, 0xdb]);
  const unauthorized = await upload(oversizedBytes, 'image/jpeg', false);
  assert.equal(unauthorized.status, 401);
  assert.equal(saveCalls, 0);

  const oversized = await upload(oversizedBytes, 'image/jpeg', true);
  assert.equal(oversized.status, 413);
  assert.equal(saveCalls, 0);

  const spoofed = await upload(
    new TextEncoder().encode('<script>alert(1)</script>'),
    'image/jpeg',
    true,
  );
  assert.equal(spoofed.status, 400);
  assert.equal(saveCalls, 1);

  const validBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xdb]);
  const valid = await upload(validBytes, 'image/jpeg', true);
  assert.equal(valid.status, 201);
  assert.equal(saveCalls, 2);

  const fifth = await upload(validBytes, 'image/jpeg', true);
  assert.equal(fifth.status, 201);
  assert.equal(saveCalls, 3);

  const throttled = await upload(validBytes, 'image/jpeg', true);
  assert.equal(throttled.status, 429);
  assert.equal(saveCalls, 3);

  console.log(
    'Upload HTTP contract passed: unauthenticated=401, oversized=413, spoofed=400, valid=201, throttled=429.',
  );
} finally {
  await app.close();
}
