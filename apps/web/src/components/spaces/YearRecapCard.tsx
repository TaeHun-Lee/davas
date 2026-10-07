'use client';

import { useState } from 'react';
import type { SpaceMemories } from '../../lib/api/memories';
import { WatchPhoto } from '../core/WatchPhoto';
import { recapLines } from './memories-model';
import { drawRecapImage } from './recap-image';

/**
 * The year at a glance: how much we watched, when, what we rated highest and where we went,
 * with a button that saves it as an image to keep or send.
 */
export function YearRecapCard({ data, spaceName }: { data: SpaceMemories; spaceName: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const { totals, recap } = data;
  const lines = recapLines(data);
  const top = Math.max(1, ...recap.monthly);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      const blob = await drawRecapImage(data, spaceName);
      const file = new File([blob], `davas-${data.year}-recap.png`, { type: 'image/png' });
      // On a phone the share sheet saves it to photos or sends it; elsewhere it downloads.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${data.year}년 우리 결산` });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      }
      setMessage({ tone: 'ok', text: '결산 카드를 이미지로 저장했어요.' });
    } catch (cause) {
      // Closing the share sheet is not a failure.
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      setMessage({ tone: 'error', text: '이미지를 만들지 못했어요. 다시 시도해 주세요.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="recap-card" aria-labelledby="recap-title">
      <p className="recap-eyebrow">{spaceName}</p>
      <h2 id="recap-title">{data.year}년 우리 결산</h2>
      <p className="recap-total">
        <strong>{totals.records}</strong>편을 함께 봤어요
      </p>
      <p className="recap-split">
        영화 {totals.movies}편 · 드라마 {totals.series}편 · 사진 {totals.photos}장
      </p>
      <div
        className="recap-months"
        role="img"
        aria-label={`달마다 본 편수: ${recap.monthly
          .map((count, index) => `${index + 1}월 ${count}편`)
          .join(', ')}`}
      >
        {recap.monthly.map((count, index) => (
          <span key={index} data-empty={count ? undefined : true}>
            <span style={{ height: `${Math.max(6, Math.round((count / top) * 100))}%` }} />
            <small>{index + 1}</small>
          </span>
        ))}
      </div>
      {lines.length ? (
        <dl className="recap-lines">
          {lines.map((line) => (
            <div key={line.label}>
              <dt>{line.label}</dt>
              <dd>{line.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {recap.topRated.length > 1 ? (
        <ol className="recap-top" aria-label="우리 별점이 높았던 작품">
          {recap.topRated.map((item) => (
            <li key={item.mediaId}>
              <span>{item.title}</span>
              <span>★ {item.averageRating.toFixed(1)}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {recap.coverPhotos.length ? (
        <div className="recap-photos" aria-label="올해의 사진">
          {recap.coverPhotos.map((photo) => (
            <span key={photo.id}>
              <WatchPhoto photo={photo} variant="thumb" alt="" />
            </span>
          ))}
        </div>
      ) : null}
      <button type="button" className="recap-save" disabled={busy} onClick={save}>
        {busy ? '이미지 만드는 중…' : '카드 이미지로 저장'}
      </button>
      {message ? (
        <p className="recap-message" role={message.tone === 'ok' ? 'status' : 'alert'}>
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
