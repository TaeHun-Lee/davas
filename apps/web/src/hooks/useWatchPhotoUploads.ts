'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { WATCH_PHOTO_MAX_COUNT } from '@davas/shared';
import { CoreApiError } from '../lib/api/core';
import { photoSrc, uploadWatchPhoto, type WatchPhotoView } from '../lib/api/watch-events';

export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';
const ACCEPTED_TYPES = new Set(PHOTO_ACCEPT.split(','));
const MAX_BYTES = 15 * 1024 * 1024;

export type PhotoUploadItem = {
  key: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  previewUrl: string;
  photo: WatchPhotoView | null;
  file: File | null;
  error: string | null;
};

export type AddPhotosResult = { added: number; overLimit: number; unsupported: number };

let keySequence = 0;

/**
 * Photos upload as soon as they are picked, so the record itself saves quickly. The list is
 * kept in a ref as well as state: `save` awaits `settle()` and must read the final list
 * without waiting for a re-render.
 */
export function useWatchPhotoUploads() {
  const [items, setItems] = useState<PhotoUploadItem[]>([]);
  const itemsRef = useRef<PhotoUploadItem[]>([]);
  const inflight = useRef(new Map<string, { promise: Promise<void>; abort: () => void }>());
  const objectUrls = useRef(new Set<string>());

  const commit = useCallback((next: PhotoUploadItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);
  const update = useCallback(
    (key: string, change: Partial<PhotoUploadItem>) =>
      commit(itemsRef.current.map((item) => (item.key === key ? { ...item, ...change } : item))),
    [commit],
  );

  useEffect(() => {
    const urls = objectUrls.current;
    const uploads = inflight.current;
    return () => {
      uploads.forEach((upload) => upload.abort());
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const start = useCallback(
    (key: string, file: File) => {
      const controller = new AbortController();
      const promise = uploadWatchPhoto(
        file,
        (progress) => update(key, { progress: Math.min(progress, 99) }),
        controller.signal,
      )
        .then((photo) => update(key, { status: 'done', progress: 100, photo, error: null }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          update(key, {
            status: 'error',
            error:
              error instanceof CoreApiError && error.status !== 0 && error.body.message
                ? error.body.message
                : '사진을 올리지 못했어요.',
          });
        })
        .finally(() => inflight.current.delete(key));
      inflight.current.set(key, { promise, abort: () => controller.abort() });
    },
    [update],
  );

  const add = useCallback(
    (files: FileList | File[]): AddPhotosResult => {
      const picked = Array.from(files);
      const supported = picked.filter((file) => ACCEPTED_TYPES.has(file.type));
      const room = Math.max(0, WATCH_PHOTO_MAX_COUNT - itemsRef.current.length);
      const accepted = supported.slice(0, room);
      const created = accepted.map((file): PhotoUploadItem => {
        const previewUrl = URL.createObjectURL(file);
        objectUrls.current.add(previewUrl);
        const tooLarge = file.size > MAX_BYTES;
        return {
          key: `local-${++keySequence}`,
          status: tooLarge ? 'error' : 'uploading',
          progress: 0,
          previewUrl,
          photo: null,
          file: tooLarge ? null : file,
          error: tooLarge ? '15MB 이하 사진만 올릴 수 있어요.' : null,
        };
      });
      commit([...itemsRef.current, ...created]);
      for (const item of created) if (item.file) start(item.key, item.file);
      return {
        added: created.length,
        overLimit: supported.length - accepted.length,
        unsupported: picked.length - supported.length,
      };
    },
    [commit, start],
  );

  const retry = useCallback(
    (key: string) => {
      const item = itemsRef.current.find((candidate) => candidate.key === key);
      if (!item?.file) return;
      update(key, { status: 'uploading', progress: 0, error: null });
      start(key, item.file);
    },
    [start, update],
  );

  const remove = useCallback(
    (key: string) => {
      inflight.current.get(key)?.abort();
      const item = itemsRef.current.find((candidate) => candidate.key === key);
      if (item && objectUrls.current.has(item.previewUrl)) {
        URL.revokeObjectURL(item.previewUrl);
        objectUrls.current.delete(item.previewUrl);
      }
      commit(itemsRef.current.filter((candidate) => candidate.key !== key));
    },
    [commit],
  );

  const move = useCallback(
    (key: string, offset: -1 | 1) => {
      const next = [...itemsRef.current];
      const index = next.findIndex((item) => item.key === key);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= next.length) return;
      [next[index], next[target]] = [next[target], next[index]];
      commit(next);
    },
    [commit],
  );

  /** Starts from photos the record already has (editing, or a restored draft). */
  const reset = useCallback(
    (photos: WatchPhotoView[]) =>
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
      ),
    [commit],
  );

  const settle = useCallback(async () => {
    await Promise.allSettled([...inflight.current.values()].map((upload) => upload.promise));
    return itemsRef.current;
  }, []);

  return {
    items,
    add,
    retry,
    remove,
    move,
    reset,
    settle,
    uploadingCount: items.filter((item) => item.status === 'uploading').length,
    failedCount: items.filter((item) => item.status === 'error').length,
  };
}

export type WatchPhotoUploads = ReturnType<typeof useWatchPhotoUploads>;
