'use client';

import { useId, useState } from 'react';
import { WATCH_PHOTO_MAX_COUNT } from '@davas/shared';
import { PHOTO_ACCEPT, type WatchPhotoUploads } from '../../hooks/useWatchPhotoUploads';

export function PhotoPicker({ uploads }: { uploads: WatchPhotoUploads }) {
  const inputId = useId();
  const [message, setMessage] = useState('');
  const { items } = uploads;
  const room = WATCH_PHOTO_MAX_COUNT - items.length;

  function pick(files: FileList | null) {
    if (!files?.length) return;
    const result = uploads.add(files);
    const notes = [
      result.overLimit
        ? `고른 ${result.added + result.overLimit}장 중 ${result.overLimit}장은 10장을 넘어서 추가하지 않았어요.`
        : '',
      result.unsupported
        ? `${result.unsupported}장은 JPEG, PNG, WebP가 아니라서 추가하지 않았어요.`
        : '',
    ].filter(Boolean);
    setMessage(notes.join(' '));
  }

  return (
    <fieldset className="photo-picker">
      <legend>
        <span>데이트 사진</span>
        <span className="photo-picker-count">
          {items.length}/{WATCH_PHOTO_MAX_COUNT}
        </span>
      </legend>
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
              onClick={() => uploads.remove(item.key)}
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
        <li className="photo-tile photo-tile-add">
          <label htmlFor={inputId} data-disabled={room <= 0 || undefined}>
            <span aria-hidden="true">＋</span>
            <span>{room > 0 ? '사진 추가' : '10장 모두 골랐어요'}</span>
          </label>
          <input
            id={inputId}
            className="sr-only"
            type="file"
            accept={PHOTO_ACCEPT}
            multiple
            disabled={room <= 0}
            aria-label={
              room > 0 ? `사진 추가, ${room}장 더 올릴 수 있어요` : '사진을 10장 모두 골랐어요'
            }
            onChange={(event) => {
              pick(event.target.files);
              event.target.value = '';
            }}
          />
        </li>
      </ul>
      <p className="photo-picker-help">
        최대 10장까지 올릴 수 있어요. 첫 번째 사진이 대표 사진이 되고, 원본은 그대로 보관해요.
      </p>
      {message ? (
        <p className="photo-picker-help" role="status">
          {message}
        </p>
      ) : null}
    </fieldset>
  );
}
