'use client';

import { useId, useState } from 'react';
import { WATCH_PHOTO_MAX_COUNT } from '@davas/shared';
import { PHOTO_ACCEPT, type WatchPhotoUploads } from '../../hooks/useWatchPhotoUploads';

type Notice = { text: string; forCount: number };

export function PhotoPicker({ uploads }: { uploads: WatchPhotoUploads }) {
  const inputId = useId();
  const [notice, setNotice] = useState<Notice | null>(null);
  const { items } = uploads;
  const room = WATCH_PHOTO_MAX_COUNT - items.length;
  const full = room <= 0;
  // A notice belongs to the list it was about: removing or resetting photos retires it.
  const shownNotice = notice && notice.forCount === items.length ? notice : null;

  function pick(files: FileList | null) {
    if (!files?.length) return;
    const result = uploads.add(files);
    // Every file the person chose counts, including the ones in a format we cannot take.
    const picked = result.added + result.overLimit + result.unsupported;
    const skipped = result.overLimit + result.unsupported;
    const text = result.overLimit
      ? `사진은 기록 하나에 ${WATCH_PHOTO_MAX_COUNT}장까지예요. 고른 ${picked}장 중 ${skipped}장은 추가하지 않았어요.${
          result.unsupported ? ` 그중 ${result.unsupported}장은 JPEG, PNG, WebP가 아니에요.` : ''
        }`
      : result.unsupported
        ? `${result.unsupported}장은 JPEG, PNG, WebP가 아니라서 추가하지 않았어요.`
        : '';
    setNotice(text ? { text, forCount: items.length + result.added } : null);
  }

  return (
    <fieldset className="photo-picker">
      <legend>
        <span>사진 첨부 (선택)</span>
        <span className="photo-picker-count" data-full={full || undefined}>
          {items.length}/{WATCH_PHOTO_MAX_COUNT}
        </span>
      </legend>
      {shownNotice ? (
        <p className="photo-picker-notice" role="alert">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4 2.5 20h19ZM12 10v4M12 17h.01" />
          </svg>
          <span>{shownNotice.text}</span>
        </p>
      ) : null}
      <ul className="photo-picker-grid" aria-label="고른 사진">
        {items.map((item, index) => (
          <li key={item.key} className="photo-tile" data-status={item.status}>
            <img src={item.previewUrl} alt={`사진 ${index + 1}`} />
            {index === 0 && item.status === 'done' ? (
              <span className="photo-tile-badge">대표</span>
            ) : null}
            {item.status === 'queued' ? (
              <div className="photo-tile-overlay">
                <span>차례를 기다리는 중</span>
              </div>
            ) : null}
            {item.status === 'uploading' ? (
              <div className="photo-tile-overlay">
                <span>올리는 중 {item.progress}%</span>
                <span
                  role="progressbar"
                  aria-label={`사진 ${index + 1} 올리는 중`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.progress}
                  className="photo-tile-progress"
                >
                  <span style={{ width: `${item.progress}%` }} />
                </span>
              </div>
            ) : null}
            {item.status === 'error' ? (
              <div className="photo-tile-overlay" data-tone="error">
                <span>{item.error ?? '못 올렸어요'}</span>
                {item.file ? (
                  <button
                    type="button"
                    onClick={() => uploads.retry(item.key)}
                    aria-label={`사진 ${index + 1} 다시 올리기`}
                  >
                    다시 시도
                  </button>
                ) : null}
              </div>
            ) : null}
            <button
              type="button"
              className="photo-tile-remove"
              onClick={() => {
                uploads.remove(item.key);
                setNotice(null);
              }}
              aria-label={
                item.status === 'uploading' || item.status === 'queued'
                  ? `사진 ${index + 1} 올리기 취소`
                  : `사진 ${index + 1} 삭제`
              }
            >
              <span aria-hidden="true">×</span>
            </button>
            {items.length > 1 ? (
              <div className="photo-tile-order">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => uploads.move(item.key, -1)}
                  aria-label={`사진 ${index + 1} 앞으로 옮기기`}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => uploads.move(item.key, 1)}
                  aria-label={`사진 ${index + 1} 뒤로 옮기기`}
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            ) : null}
          </li>
        ))}
        {full ? null : (
          <li className="photo-tile photo-tile-add">
            <label htmlFor={inputId}>
              <span aria-hidden="true">＋</span>
              <span>사진 추가</span>
            </label>
            <input
              id={inputId}
              className="sr-only"
              type="file"
              accept={PHOTO_ACCEPT}
              multiple
              aria-label={`사진 추가, ${room}장 더 올릴 수 있어요`}
              onChange={(event) => {
                pick(event.target.files);
                event.target.value = '';
              }}
            />
          </li>
        )}
      </ul>
      {/* Once the ten are there, the add tile becomes one plain, disabled row saying so. */}
      {full ? (
        <button type="button" className="photo-picker-full" disabled>
          사진 추가 ({WATCH_PHOTO_MAX_COUNT}장을 모두 채웠어요)
        </button>
      ) : null}
      <p className="photo-picker-help">
        사진 없이도 저장할 수 있어요. 최대 10장까지 첨부할 수 있고, 첫 번째 사진이 대표 사진으로
        보여요. 원본은 그대로 보관돼요.
      </p>
    </fieldset>
  );
}
