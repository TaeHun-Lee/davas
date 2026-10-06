import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CoreApiError } from '../lib/api/core';
import type { WatchPhotoView } from '../lib/api/watch-events';
import {
  createPhotoUploadQueue,
  MAX_PARALLEL_UPLOADS,
  type PhotoUploadItem,
  type UploadPhoto,
} from './useWatchPhotoUploads';

const photo = (id: string): WatchPhotoView => ({
  id,
  width: 1600,
  height: 1200,
  placeholder: null,
  thumbUrl: `/v1/watch-photos/${id}/thumb`,
  displayUrl: `/v1/watch-photos/${id}/display`,
  originalUrl: null,
  uploaderAccountId: 'me',
});

const jpeg = (name: string) =>
  new File([new Uint8Array([0xff, 0xd8, 0xff])], name, { type: 'image/jpeg' });

/** A fake server that lets the test decide when each upload finishes. */
function fakeServer(options: { busyFirst?: Set<string> } = {}) {
  let active = 0;
  let peak = 0;
  const calls: string[] = [];
  const pending = new Map<string, () => void>();
  const upload: UploadPhoto = (file, _onProgress, signal) => {
    calls.push(file.name);
    if (options.busyFirst?.delete(file.name)) {
      return Promise.reject(
        new CoreApiError(429, { statusCode: 429, code: 'TOO_MANY', message: '잠시 후 다시' }),
      );
    }
    active += 1;
    peak = Math.max(peak, active);
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        active -= 1;
        reject(new Error('aborted'));
      });
      pending.set(file.name, () => {
        active -= 1;
        resolve(photo(`server-${file.name}`));
      });
    });
  };
  const finish = async (name: string) => {
    // Let the queue start the upload before finishing it.
    for (let tries = 0; !pending.has(name) && tries < 50; tries += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    pending.get(name)?.();
    pending.delete(name);
  };
  return { calls, finish, peak: () => peak, upload };
}

describe('photo upload queue', () => {
  it('never runs more than two uploads at once and finishes all of them in order', async () => {
    const server = fakeServer();
    let latest: PhotoUploadItem[] = [];
    const queue = createPhotoUploadQueue((items) => (latest = items), server.upload, [1]);
    const names = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
    queue.add(names.map(jpeg));
    assert.deepEqual(
      latest.map((item) => item.status),
      ['uploading', 'uploading', 'queued', 'queued', 'queued'],
    );

    const settled = queue.settle();
    for (const name of names) await server.finish(name);
    const items = await settled;
    assert.equal(server.peak(), MAX_PARALLEL_UPLOADS);
    assert.deepEqual(
      items.map((item) => item.photo?.id),
      names.map((name) => `server-${name}`),
    );
  });

  it('retries a busy answer by itself instead of failing the photo', async () => {
    const server = fakeServer({ busyFirst: new Set(['busy.jpg']) });
    const queue = createPhotoUploadQueue(() => undefined, server.upload, [1]);
    queue.add([jpeg('busy.jpg')]);
    const settled = queue.settle();
    await server.finish('busy.jpg');
    const [item] = await settled;
    assert.equal(item.status, 'done');
    assert.deepEqual(server.calls, ['busy.jpg', 'busy.jpg']);
  });

  it('waits for photos picked while the save is already waiting', async () => {
    const server = fakeServer();
    const queue = createPhotoUploadQueue(() => undefined, server.upload, [1]);
    queue.add([jpeg('a.jpg'), jpeg('b.jpg')]);
    const settled = queue.settle();
    queue.add([jpeg('c.jpg')]);
    for (const name of ['a.jpg', 'b.jpg', 'c.jpg']) await server.finish(name);
    const items = await settled;
    assert.deepEqual(
      items.map((item) => item.status),
      ['done', 'done', 'done'],
    );
  });

  it('cancels a removed upload, starts the next one, and cancels everything on reset', async () => {
    const server = fakeServer();
    let latest: PhotoUploadItem[] = [];
    const queue = createPhotoUploadQueue((items) => (latest = items), server.upload, [1]);
    queue.add([jpeg('x.jpg'), jpeg('y.jpg'), jpeg('z.jpg')]);
    queue.remove(latest[0].key);
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.deepEqual(
      latest.map((item) => [item.file?.name, item.status]),
      [
        ['y.jpg', 'uploading'],
        ['z.jpg', 'uploading'],
      ],
    );

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/api';
    try {
      queue.reset([photo('kept')]);
    } finally {
      if (baseUrl === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
      else process.env.NEXT_PUBLIC_API_BASE_URL = baseUrl;
    }
    const items = await queue.settle();
    assert.deepEqual(
      items.map((item) => [item.key, item.status]),
      [['kept', 'done']],
    );
  });
});
