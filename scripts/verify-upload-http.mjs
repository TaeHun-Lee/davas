import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Module } = require('@nestjs/common');
const { APP_GUARD, NestFactory } = require('@nestjs/core');
const { ThrottlerGuard, ThrottlerModule } = require('@nestjs/throttler');
const { AuthService } = require('../apps/api/dist/auth/auth.service.js');
const {
  ACCESS_TOKEN_COOKIE,
  JwtCookieAuthGuard,
} = require('../apps/api/dist/auth/jwt-cookie-auth.guard.js');
const { validateProfileImageContent } = require('../apps/api/dist/users/profile-image-upload.js');
const {
  UploadConcurrencyInterceptor,
} = require('../apps/api/dist/users/upload-concurrency.interceptor.js');
const { UsersController } = require('../apps/api/dist/users/users.controller.js');
const { UsersService } = require('../apps/api/dist/users/users.service.js');
const { servePublicUploads } = require('../apps/api/dist/common/public-uploads.js');

// A profile picture is public; a record photo next to it in the same volume must never be.
const uploadsDir = mkdtempSync(join(tmpdir(), 'davas-uploads-'));
mkdirSync(join(uploadsDir, 'profile-images'));
mkdirSync(join(uploadsDir, 'watch-photos', 'ab'), { recursive: true });
writeFileSync(join(uploadsDir, 'profile-images', 'avatar.jpg'), 'avatar');
writeFileSync(join(uploadsDir, 'watch-photos', 'ab', 'secret.webp'), 'RECORD-PHOTO-BYTES');
writeFileSync(join(uploadsDir, 'notes.txt'), 'VOLUME-ROOT-BYTES');

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
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100, blockDuration: 60_000 }]),
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
servePublicUploads(app, uploadsDir);
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
      headers: authenticated ? { cookie: `${ACCESS_TOKEN_COOKIE}=valid-token` } : {},
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

  const origin = `http://127.0.0.1:${address.port}`;
  const avatar = await fetch(`${origin}/uploads/profile-images/avatar.jpg`);
  assert.equal(avatar.status, 200);
  assert.equal(await avatar.text(), 'avatar');
  for (const path of [
    '/uploads/watch-photos/ab/secret.webp',
    '/uploads/watch%2Dphotos/ab/secret.webp',
    '/uploads/WATCH-PHOTOS/ab/secret.webp',
    '/uploads//watch-photos/ab/secret.webp',
    '/uploads/./watch-photos/ab/secret.webp',
    '/uploads/profile-images/..%2Fwatch-photos/ab/secret.webp',
    '/uploads/profile-images/%2e%2e/watch-photos/ab/secret.webp',
    '/uploads/notes.txt',
  ]) {
    const response = await fetch(`${origin}${path}`);
    const body = await response.text();
    assert.notEqual(response.status, 200, path);
    assert.doesNotMatch(body, /RECORD-PHOTO-BYTES|VOLUME-ROOT-BYTES/, path);
  }

  console.log(
    'Upload HTTP contract passed: unauthenticated=401, oversized=413, spoofed=400, valid=201, throttled=429, public uploads=profile images only.',
  );
} finally {
  await app.close();
  rmSync(uploadsDir, { recursive: true, force: true });
}
