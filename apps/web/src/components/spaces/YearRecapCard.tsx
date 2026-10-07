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
      <p className="recap-total">{totals.records}편을 함께 봤어요</p>
      <p className="recap-split">
        영화 {totals.movies}편 · 드라마 {totals.series}편 · 사진 {totals.photos}장
      </p>
      <div
        className="recap-months"
        role="img"
        aria-label={`월별로 본 작품 수${
          recap.busiestMonth
            ? `, ${recap.busiestMonth.month}월이 ${recap.busiestMonth.count}편으로 가장 많아요`
            : ''
        }: ${recap.monthly.map((count, index) => `${index + 1}월 ${count}편`).join(', ')}`}
      >
        {recap.monthly.map((count, index) => (
          <span
            key={index}
            data-empty={count ? undefined : true}
            data-busiest={recap.busiestMonth?.month === index + 1 || undefined}
          >
            {/* The busiest month reaches the top; an empty one keeps a sliver. */}
            <span style={{ height: count ? `${Math.round((count / top) * 80)}px` : '4px' }} />
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
      {recap.topRated.length ? (
        <>
          <h3 className="recap-subtitle">별점 상위</h3>
          <ol className="recap-top">
            {recap.topRated.map((item, index) => (
              <li key={item.mediaId}>
                <span className="recap-rank">{index + 1}</span>
                <span className="recap-poster" aria-hidden="true">
                  {item.posterUrl ? (
                    <img src={item.posterUrl} alt="" loading="lazy" />
                  ) : (
                    [...item.title][0]
                  )}
                </span>
                <span className="recap-top-title">{item.title}</span>
                <span className="recap-top-score">★ {item.averageRating.toFixed(1)}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
      {recap.coverPhotos.length ? (
        <>
          <h3 className="recap-subtitle">대표 사진</h3>
          <ul className="recap-photos">
            {recap.coverPhotos.map((photo, index) => (
              <li key={photo.id}>
                <WatchPhoto photo={photo} variant="thumb" alt={`대표 사진 ${index + 1}`} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <button type="button" className="recap-save" disabled={busy} onClick={save}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </svg>
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
