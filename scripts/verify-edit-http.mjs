import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('reflect-metadata');

const { Module, ValidationPipe } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const {
  AuthService,
} = require('../apps/api/dist/auth/auth.service.js');
const {
  DiariesDashboardService,
} = require('../apps/api/dist/diaries/diaries-dashboard.service.js');
const {
  DiariesController,
} = require('../apps/api/dist/diaries/diaries.controller.js');
const {
  DiariesService,
} = require('../apps/api/dist/diaries/diaries.service.js');

const updates = [];
const dashboard = {};
const auth = {
  async findMe(token) {
    return token ? { id: 'contract-user' } : null;
  },
};
const diaries = {
  async update(userId, id, dto) {
    updates.push({ userId, id, dto: { ...dto } });
    return { id, ...dto };
  },
};

class EditContractModule {}
Module({
  controllers: [DiariesController],
  providers: [
    { provide: DiariesDashboardService, useValue: dashboard },
    { provide: AuthService, useValue: auth },
    { provide: DiariesService, useValue: diaries },
  ],
})(EditContractModule);

const app = await NestFactory.create(EditContractModule, { logger: false });
app.setGlobalPrefix('api');
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);

try {
  await app.listen(0, '127.0.0.1');
  const address = app.getHttpServer().address();
  assert.ok(address && typeof address !== 'string');
  const endpoint = `http://127.0.0.1:${address.port}/api/diaries/record-1`;

  const validPayload = {
    mediaId: 'ddcb649a-67fc-46b7-b70e-74137fd2b806',
    viewingMethod: 'OTT',
    watchedDate: '2026-07-25',
    rating: null,
    content: '',
    hasSpoiler: false,
    visibility: 'FRIENDS',
  };
  const validResponse = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'davas_access_token=contract-token',
    },
    body: JSON.stringify(validPayload),
  });

  assert.equal(validResponse.status, 200);
  assert.equal(updates.length, 1);
  assert.deepEqual(updates[0], {
    userId: 'contract-user',
    id: 'record-1',
    dto: validPayload,
  });

  const invalidResponse = await fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'davas_access_token=contract-token',
    },
    body: JSON.stringify({
      content: '수정',
      clientRequestId: '2d1bd947-f493-433f-b72f-2d1ac566ea16',
      allowDuplicate: true,
    }),
  });
  const invalidBody = await invalidResponse.json();

  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(invalidBody.message, [
    'property clientRequestId should not exist',
    'property allowDuplicate should not exist',
  ]);

  console.log(
    'Edit HTTP contract passed: projected PATCH=200, create-only fields=400.',
  );
} finally {
  await app.close();
}
