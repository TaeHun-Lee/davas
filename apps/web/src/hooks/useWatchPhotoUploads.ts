'use client';

import { useEffect, useRef, useState } from 'react';
import { WATCH_PHOTO_MAX_BYTES, WATCH_PHOTO_MAX_COUNT } from '@davas/shared';
import { CoreApiError } from '../lib/api/core';
import { photoSrc, uploadWatchPhoto, type WatchPhotoView } from '../lib/api/watch-events';

export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';
const ACCEPTED_TYPES = new Set(PHOTO_ACCEPT.split(','));
// The API processes at most two uploads per person at once and answers 429 to a third, so
// the queue never sends more than that.
export const MAX_PARALLEL_UPLOADS = 2;
// A 429 can still happen (another tab, the per-IP limit); a short wait usually clears it.
const RETRY_DELAYS_MS = [1500, 4000];

export type PhotoUploadItem = {
  key: string;
  status: 'queued' | 'uploading' | 'done' | 'error';
  progress: number;
  previewUrl: string;
  photo: WatchPhotoView | null;
  file: File | null;
  error: string | null;
};

export type AddPhotosResult = { added: number; overLimit: number; unsupported: number };

export type UploadPhoto = (
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
) => Promise<WatchPhotoView>;

let keySequence = 0;

const errorMessage = (error: unknown) =>
  error instanceof CoreApiError && error.status !== 0 && error.body.message
    ? error.body.message
    : '사진을 올리지 못했어요.';

const retryable = (error: unknown) =>
  error instanceof CoreApiError && (error.status === 429 || error.body.code === 'NETWORK_ERROR');

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new Error('aborted'));
      },
      { once: true },
    );
  });
}

/**
 * The upload queue, kept outside React state so `settle()` can wait for it and read the final
 * list without waiting for a re-render. Photos upload as soon as they are picked, at most
 * MAX_PARALLEL_UPLOADS at a time, so the record itself saves quickly.
 */
export function createPhotoUploadQueue(
  publish: (items: PhotoUploadItem[]) => void,
  upload: UploadPhoto = uploadWatchPhoto,
  retryDelaysMs: readonly number[] = RETRY_DELAYS_MS,
) {
  let items: PhotoUploadItem[] = [];
  // Ten per record in all; less when other people have already added photos to it.
  let limit = WATCH_PHOTO_MAX_COUNT;
  const waiting: string[] = [];
  const inflight = new Map<string, { promise: Promise<void>; abort: () => void }>();
  const objectUrls = new Set<string>();

  const commit = (next: PhotoUploadItem[]) => {
    items = next;
    publish(next);
  };
  const find = (key: string) => items.find((item) => item.key === key);
  const update = (key: string, change: Partial<PhotoUploadItem>) => {
    if (!find(key)) return;
    commit(items.map((item) => (item.key === key ? { ...item, ...change } : item)));
  };
  const revoke = (url: string) => {
    if (!objectUrls.has(url)) return;
    URL.revokeObjectURL(url);
    objectUrls.delete(url);
  };

  async function uploadWithRetry(key: string, file: File, signal: AbortSignal) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await upload(
          file,
          (percent) => update(key, { progress: Math.min(percent, 99) }),
          signal,
        );
      } catch (error) {
        if (signal.aborted || !retryable(error) || attempt >= retryDelaysMs.length) throw error;
        update(key, { progress: 0 });
        await wait(retryDelaysMs[attempt], signal);
      }
    }
  }

  function start(key: string, file: File) {
    const controller = new AbortController();
    update(key, { status: 'uploading', progress: 0, error: null });
    const promise = uploadWithRetry(key, file, controller.signal)
      .then((photo) => update(key, { status: 'done', progress: 100, photo, error: null }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          update(key, { status: 'error', error: errorMessage(error) });
      })
      .finally(() => {
        inflight.delete(key);
        pump();
      });
    inflight.set(key, { promise, abort: () => controller.abort() });
  }

  function pump() {
    while (inflight.size < MAX_PARALLEL_UPLOADS && waiting.length) {
      const key = waiting.shift()!;
      const item = find(key);
      if (item?.file && item.status === 'queued') start(key, item.file);
    }
  }

  function enqueue(key: string) {
    waiting.push(key);
    pump();
  }

  function stopAll() {
    waiting.length = 0;
    inflight.forEach((entry) => entry.abort());
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
  }

  return {
    setLimit(value: number) {
      limit = Math.max(0, Math.min(WATCH_PHOTO_MAX_COUNT, value));
    },

    add(files: FileList | File[]): AddPhotosResult {
      const picked = Array.from(files);
      const supported = picked.filter((file) => ACCEPTED_TYPES.has(file.type));
      const room = Math.max(0, limit - items.length);
      const accepted = supported.slice(0, room);
      const created = accepted.map((file): PhotoUploadItem => {
        const previewUrl = URL.createObjectURL(file);
        objectUrls.add(previewUrl);
        const tooLarge = file.size > WATCH_PHOTO_MAX_BYTES;
        return {
          key: `local-${++keySequence}`,
          status: tooLarge ? 'error' : 'queued',
          progress: 0,
          previewUrl,
          photo: null,
          file: tooLarge ? null : file,
          error: tooLarge ? '15MB 이하 사진만 올릴 수 있어요.' : null,
        };
      });
      commit([...items, ...created]);
      for (const item of created) if (item.file) enqueue(item.key);
      return {
        added: created.length,
        overLimit: supported.length - accepted.length,
        unsupported: picked.length - supported.length,
      };
    },

    retry(key: string) {
      const item = find(key);
      if (!item?.file || item.status !== 'error') return;
      update(key, { status: 'queued', progress: 0, error: null });
      enqueue(key);
    },

    remove(key: string) {
      inflight.get(key)?.abort();
      const index = waiting.indexOf(key);
      if (index >= 0) waiting.splice(index, 1);
      const item = find(key);
      if (item) revoke(item.previewUrl);
      commit(items.filter((candidate) => candidate.key !== key));
    },

    move(key: string, offset: -1 | 1) {
      const next = [...items];
      const index = next.findIndex((item) => item.key === key);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= next.length) return;
      [next[index], next[target]] = [next[target], next[index]];
      commit(next);
    },

    /**
     * Starts from photos a record already has (editing, or a restored draft). Uploads still
     * running for the previous list are cancelled so none of them lands in the new one.
     */
    reset(photos: WatchPhotoView[]) {
      stopAll();
      commit(
        photos.map((photo) => ({
          key: photo.id,
          status: 'done',
          progress: 100,
          previewUrl: photoSrc(photo.thumbUrl),
          photo,
          file: null,
          error: null,
        })),
      );
    },

    /** Resolves once nothing is queued or uploading, including photos added meanwhile. */
    async settle() {
      while (inflight.size || waiting.length) {
        if (!inflight.size) pump();
        if (!inflight.size) break;
        await Promise.allSettled([...inflight.values()].map((entry) => entry.promise));
      }
      return items;
    },

    dispose: stopAll,
  };
}

/**
 * `limit` is how many of the record's ten photos this person may hold: all ten for a new
 * record, fewer when others have already added theirs.
 */
export function useWatchPhotoUploads(limit: number = WATCH_PHOTO_MAX_COUNT) {
  const [items, setItems] = useState<PhotoUploadItem[]>([]);
  const queueRef = useRef<ReturnType<typeof createPhotoUploadQueue> | null>(null);
  if (!queueRef.current) queueRef.current = createPhotoUploadQueue(setItems);
  const queue = queueRef.current;
  queue.setLimit(limit);

  useEffect(() => () => queue.dispose(), [queue]);

  return {
    items,
    limit: Math.max(0, Math.min(WATCH_PHOTO_MAX_COUNT, limit)),
    add: queue.add,
    retry: queue.retry,
    remove: queue.remove,
    move: queue.move,
    reset: queue.reset,
    settle: queue.settle,
    uploadingCount: items.filter((item) => item.status === 'uploading' || item.status === 'queued')
      .length,
    failedCount: items.filter((item) => item.status === 'error').length,
  };
}

export type WatchPhotoUploads = ReturnType<typeof useWatchPhotoUploads>;
