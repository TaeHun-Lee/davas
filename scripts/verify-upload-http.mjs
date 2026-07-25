import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Module } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { AuthService } = require('../apps/api/dist/auth/auth.service.js');
const {
  JwtCookieAuthGuard,
} = require('../apps/api/dist/auth/jwt-cookie-auth.guard.js');
const {
  PROFILE_IMAGE_MAX_BYTES,
  validateProfileImageContent,
} = require('../apps/api/dist/users/profile-image-upload.js');
const {
  UsersController,
} = require('../apps/api/dist/users/users.controller.js');
const {
  UsersService,
} = require('../apps/api/dist/users/users.service.js');

let saveCalls = 0;
const users = {
  async saveProfileImage(_token, file) {
    saveCalls += 1;
    const validated = validateProfileImageContent(file);
    return {
      id: 'contract-user',
      profileImageUrl: `/uploads/profile-images/contract.${validated.extension}`,
    };
  },
};
const auth = {
  async findMe(token) {
    return token ? { id: 'contract-user' } : null;
  },
};

class UploadContractModule {}
Module({
  controllers: [UsersController],
  providers: [
    { provide: UsersService, useValue: users },
    { provide: AuthService, useValue: auth },
    JwtCookieAuthGuard,
  ],
})(UploadContractModule);

function formWithFile(bytes, type) {
  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), 'avatar');
  return form;
}

async function upload(endpoint, form, authenticated) {
  return fetch(endpoint, {
    method: 'POST',
    headers: authenticated
      ? { Cookie: 'davas_access_token=contract-token' }
      : undefined,
    body: form,
  });
}

const app = await NestFactory.create(UploadContractModule, { logger: false });
app.setGlobalPrefix('api');

try {
  await app.listen(0, '127.0.0.1');
  const address = app.getHttpServer().address();
  assert.ok(address && typeof address !== 'string');
  const endpoint = `http://127.0.0.1:${address.port}/api/users/me/profile-image`;
  const oversized = new Uint8Array(PROFILE_IMAGE_MAX_BYTES + 1);
  oversized.set([0xff, 0xd8, 0xff, 0xe0]);

  const unauthenticated = await upload(
    endpoint,
    formWithFile(oversized, 'image/jpeg'),
    false,
  );
  assert.equal(unauthenticated.status, 401);
  assert.equal(saveCalls, 0);

  const tooLarge = await upload(
    endpoint,
    formWithFile(oversized, 'image/jpeg'),
    true,
  );
  assert.equal(tooLarge.status, 413);
  assert.equal(saveCalls, 0);

  const spoofed = await upload(
    endpoint,
    formWithFile(Buffer.from('<script>'), 'image/jpeg'),
    true,
  );
  assert.equal(spoofed.status, 400);
  assert.equal(saveCalls, 1);

  const valid = await upload(
    endpoint,
    formWithFile(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg'),
    true,
  );
  assert.equal(valid.status, 201);
  assert.equal(saveCalls, 2);

  console.log(
    'Upload HTTP contract passed: unauthenticated=401, oversized=413, spoofed=400, valid=201.',
  );
} finally {
  await app.close();
}
