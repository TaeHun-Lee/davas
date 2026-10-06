'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaTypeLabel } from '../../lib/api/core';
import { pickWish, type SpaceWishPick, type WishMood } from '../../lib/api/wishes';
import { Poster } from '../core/CoreUi';

export const MOOD_OPTIONS: Array<{ value: WishMood; label: string }> = [
  { value: 'LIGHT', label: '가볍게' },
  { value: 'IMMERSIVE', label: '몰입해서' },
  { value: 'TEARS', label: '울고 싶을 때' },
  { value: 'CHILLS', label: '오싹하게' },
];

/**
 * "오늘 밤 후보": one title from the shared list that the space can watch now.
 * `variant="home"` stays quiet when the list is empty or the lookup fails.
 */
export function WishPickCard({
  spaceId,
  variant,
  refreshKey = 0,
}: {
  spaceId: string;
  variant: 'home' | 'list';
  refreshKey?: number;
}) {
  const [mood, setMood] = useState<WishMood | undefined>();
  const [pick, setPick] = useState<SpaceWishPick | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const shown = useRef<string[]>([]);
  // Changing the mood twice quickly must not let the slower, older answer win.
  const latestRequest = useRef(0);

  const load = useCallback(
    async (options: { mood?: WishMood; next?: boolean } = {}) => {
      const request = ++latestRequest.current;
      setStatus('loading');
      try {
        const exclude = options.next ? shown.current : [];
        let result = await pickWish(spaceId, { mood: options.mood, exclude });
        if (request !== latestRequest.current) return;
        if (!result.item && exclude.length) {
          // Every title has been shown once: start the round over instead of showing nothing.
          result = await pickWish(spaceId, { mood: options.mood });
          if (request !== latestRequest.current) return;
          shown.current = [];
        } else if (!options.next) {
          shown.current = [];
        }
        if (result.item) shown.current = [...shown.current, result.item.media.id];
        setPick(result);
        setStatus('ready');
      } catch {
        if (request === latestRequest.current) setStatus('error');
      }
    },
    [spaceId],
  );

  useEffect(() => {
    void load({ mood });
    // A changed mood starts a fresh round; refreshKey reloads after the list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, refreshKey]);

  if (variant === 'home' && (status === 'error' || (status === 'ready' && !pick?.item))) {
    return (
      <Link href="/spaces/wishes" className="wish-pick-empty">
        <span>
          <strong>같이 보고 싶은 작품을 담아 두세요</strong>
          <span>담아 두면 오늘 볼 작품을 여기서 골라 드려요.</span>
        </span>
        <span aria-hidden="true">›</span>
      </Link>
    );
  }

  const item = pick?.item;
  return (
    <section
      className="wish-pick"
      aria-labelledby={`wish-pick-${variant}`}
      aria-busy={status === 'loading'}
    >
      <div className="wish-pick-head">
        <h2 id={`wish-pick-${variant}`} className="wish-pick-eyebrow">
          {variant === 'home' ? '오늘 밤 후보' : '빠른 추천'}
        </h2>
        {variant === 'home' ? (
          <Link
            href="/spaces/wishes"
            className="wish-pick-link"
            aria-label="같이 보고 싶어요 목록 보기"
          >
            목록 <span aria-hidden="true">›</span>
          </Link>
        ) : null}
      </div>
      {variant === 'list' ? (
        <>
          <p className="wish-pick-title">목록에서 지금 볼 수 있는 작품부터 골라요</p>
          <div className="wish-pick-moods" role="group" aria-label="오늘 기분">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={mood === option.value}
                onClick={() => {
                  const next = mood === option.value ? undefined : option.value;
                  setMood(next);
                  void load({ mood: next });
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {status === 'loading' && !item ? (
        <div className="wish-pick-loading" aria-label="후보 고르는 중" />
      ) : status === 'error' ? (
        <p className="wish-pick-message" role="alert">
          후보를 고르지 못했어요.{' '}
          <button type="button" onClick={() => void load({ mood })}>
            다시 시도
          </button>
        </p>
      ) : item ? (
        <>
          <div className="wish-pick-body">
            <Poster url={item.media.posterUrl} title={item.media.title} />
            <div className="min-w-0">
              <h3>{item.media.title}</h3>
              <p>
                {[
                  mediaTypeLabel(item.media.mediaType),
                  item.media.releaseYear,
                  item.media.genres[0],
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {pick.reasons.length ? (
                <ul className="wish-pick-reasons">
                  {pick.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="wish-pick-actions">
            <button
              type="button"
              disabled={status === 'loading'}
              onClick={() => void load({ mood, next: true })}
            >
              다른 후보
            </button>
            <Link href={`/records/new?mediaId=${encodeURIComponent(item.media.id)}`}>
              보고 나서 기록하기
            </Link>
          </div>
        </>
      ) : (
        <p className="wish-pick-message">
          고를 작품이 없어요. 아래에서 같이 보고 싶은 작품을 담아 보세요.
        </p>
      )}
    </section>
  );
}
