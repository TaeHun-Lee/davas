import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  type RecordWritePayload,
  updateRecord,
} from './core';

const originalFetch = globalThis.fetch;

describe('record update HTTP contract', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  it('serializes only update fields when given a create payload object', async () => {
    let requestBody: unknown;
    globalThis.fetch = async (_input, init) => {
      requestBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ diary: { id: 'record-1' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const createPayload: RecordWritePayload = {
      mediaId: 'ddcb649a-67fc-46b7-b70e-74137fd2b806',
      viewingMethod: 'OTT',
      watchedDate: '2026-07-25',
      rating: 5,
      content: '좋았어요.',
      hasSpoiler: false,
      visibility: 'FRIENDS',
      clientRequestId: '2d1bd947-f493-433f-b72f-2d1ac566ea16',
      allowDuplicate: true,
    };

    await updateRecord('record-1', createPayload);

    assert.deepEqual(requestBody, {
      mediaId: createPayload.mediaId,
      viewingMethod: createPayload.viewingMethod,
      watchedDate: createPayload.watchedDate,
      rating: createPayload.rating,
      content: createPayload.content,
      hasSpoiler: createPayload.hasSpoiler,
      visibility: createPayload.visibility,
    });
  });
});
