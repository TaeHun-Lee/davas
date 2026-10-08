'use client';

import { useState } from 'react';
import { WATCH_PHOTO_MAX_COUNT } from '@davas/shared';
import { useWatchPhotoUploads } from '../../hooks/useWatchPhotoUploads';
import { setWatchEventPhotos, type WatchEvent } from '../../lib/api/watch-events';
import { PhotoPicker } from './PhotoPicker';

/**
 * My own photos on a record I am on, as its author or as a companion who confirmed being
 * there. Other people's photos stay theirs and only count toward the record's ten.
 */
export function MyPhotosPanel({
  watchEvent,
  myAccountId,
  onSaved,
}: {
  watchEvent: WatchEvent;
  myAccountId: string;
  onSaved: (next: WatchEvent) => void;
}) {
  const mine = watchEvent.photos.filter((photo) => photo.uploaderAccountId === myAccountId);
  const others = watchEvent.photos.length - mine.length;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const uploads = useWatchPhotoUploads(WATCH_PHOTO_MAX_COUNT - others);

  function start() {
    uploads.reset(mine);
    setError('');
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    setError('');
    try {
      // Saving waits for photos still uploading instead of dropping them.
      const items = await uploads.settle();
      if (items.some((item) => item.status === 'error')) {
        setError('올리지 못한 사진이 있어요. 다시 시도하거나 삭제한 뒤 저장해 주세요.');
        return;
      }
      const { watchEvent: next } = await setWatchEventPhotos(
        watchEvent.id,
        items.flatMap((item) => (item.photo ? [item.photo.id] : [])),
      );
      onSaved(next);
      setOpen(false);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message ? cause.message : '사진을 저장하지 못했어요.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open)
    return (
      <button
        type="button"
        className="record-photos-add"
        data-empty={mine.length ? undefined : true}
        onClick={start}
      >
        {mine.length ? (
          `내 사진 관리 (${mine.length}장)`
        ) : (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            내 사진 더하기
          </>
        )}
      </button>
    );

  return (
    <section className="core-card record-photos-panel" aria-labelledby="my-photos-title">
      <h2 id="my-photos-title" className="section-title">
        내 사진
      </h2>
      <p className="page-description">
        {others
          ? `다른 사람이 올린 ${others}장과 합쳐 기록 하나에 ${WATCH_PHOTO_MAX_COUNT}장까지예요. 내가 올린 사진만 바꿀 수 있어요.`
          : `기록 하나에 ${WATCH_PHOTO_MAX_COUNT}장까지 올릴 수 있어요.`}
      </p>
      <div className="mt-3">
        <PhotoPicker
          uploads={uploads}
          label="올릴 사진"
          help="‹ › 버튼으로 순서를 바꿀 수 있어요. 원본은 그대로 보관돼요."
          // The author's photos lead the record, so my first is its cover only when I wrote
          // it or nobody else has added any.
          coverBadge={watchEvent.author.accountId === myAccountId || others === 0}
        />
      </div>
      {error ? (
        <p className="form-error mt-3" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="secondary-button"
          disabled={busy}
          onClick={() => setOpen(false)}
        >
          취소
        </button>
        <button type="button" className="primary-button" disabled={busy} onClick={save}>
          {busy ? (uploads.uploadingCount ? '사진을 올리는 중…' : '저장 중…') : '사진 저장'}
        </button>
      </div>
    </section>
  );
}
