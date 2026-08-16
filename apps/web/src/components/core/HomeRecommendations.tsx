'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { selectMedia } from '../../lib/api/media';
import {
  getTrendingRecommendations,
  type MediaRecommendationItem,
} from '../../lib/api/recommendations';

type RecommendationType = 'MOVIE' | 'TV';
type RecommendationStatus = 'loading' | 'ready' | 'error';

const recommendationTabs: Array<{ value: RecommendationType; label: string }> = [
  { value: 'MOVIE', label: '영화' },
  { value: 'TV', label: '드라마' },
];

function RecommendationSkeleton() {
  return (
    <div className="home-recommendation-row" aria-label="추천 작품 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div className="home-recommendation-skeleton" key={item} />
      ))}
    </div>
  );
}

export function HomeRecommendations() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<RecommendationType>('MOVIE');
  const [items, setItems] = useState<MediaRecommendationItem[]>([]);
  const [status, setStatus] = useState<RecommendationStatus>('loading');
  const [retryKey, setRetryKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState('');
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setSelectionError('');

    getTrendingRecommendations({ limit: 20 })
      .then((response) => {
        if (!active) return;
        setItems(response.items);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.mediaType === activeType).slice(0, 8),
    [activeType, items],
  );

  const syncCarouselControls = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setCanScrollBack(carousel.scrollLeft > 4);
    setCanScrollForward(
      carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 4,
    );
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ left: 0 });
      syncCarouselControls();
    });
    window.addEventListener('resize', syncCarouselControls);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', syncCarouselControls);
    };
  }, [activeType, syncCarouselControls, visibleItems.length]);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({
      left: direction * Math.max(carousel.clientWidth * 0.82, 240),
      behavior: 'smooth',
    });
  };

  const openRecommendation = async (item: MediaRecommendationItem) => {
    setBusyId(item.externalId);
    setSelectionError('');
    try {
      const selected = await selectMedia(item);
      router.push(`/records/new?mediaId=${encodeURIComponent(selected.id)}`);
    } catch {
      setSelectionError('기록 작성을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="home-recommendations" aria-labelledby="home-recommendations-title">
      <div className="home-section-heading">
        <div>
          <h2 id="home-recommendations-title" className="section-title">오늘 뭐 볼까요?</h2>
          <p>지금 인기 있는 영화와 드라마를 골라봤어요.</p>
        </div>
        <Link href="/explore">더 보기 <span aria-hidden="true">›</span></Link>
      </div>

      <div className="home-recommendation-toolbar">
        <div className="home-recommendation-tabs" role="group" aria-label="추천 작품 종류">
          {recommendationTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={activeType === tab.value}
              onClick={() => setActiveType(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {status === 'ready' && visibleItems.length > 0 ? (
          <div className="home-carousel-controls" aria-label="추천 캐러셀 이동">
            <button
              type="button"
              aria-label={`이전 ${activeType === 'MOVIE' ? '영화' : '드라마'} 추천`}
              disabled={!canScrollBack}
              onClick={() => moveCarousel(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              aria-label={`다음 ${activeType === 'MOVIE' ? '영화' : '드라마'} 추천`}
              disabled={!canScrollForward}
              onClick={() => moveCarousel(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>

      {status === 'loading' ? <RecommendationSkeleton /> : null}
      {status === 'error' ? (
        <div className="home-recommendation-message" role="status">
          <p><strong>추천을 불러오지 못했어요.</strong><br />친구 기록과 관계없이 다시 불러올 수 있어요.</p>
          <button type="button" onClick={() => setRetryKey((value) => value + 1)}>다시 시도</button>
        </div>
      ) : null}
      {status === 'ready' && visibleItems.length === 0 ? (
        <div className="home-recommendation-message">
          <p><strong>{activeType === 'MOVIE' ? '영화' : '드라마'} 추천을 준비하고 있어요.</strong><br />다른 작품도 둘러보세요.</p>
          <Link href="/explore">추천 둘러보기</Link>
        </div>
      ) : null}
      {status === 'ready' && visibleItems.length > 0 ? (
        <div
          ref={carouselRef}
          className="home-recommendation-row"
          onScroll={syncCarouselControls}
          aria-label={`${activeType === 'MOVIE' ? '영화' : '드라마'} 추천 목록`}
        >
          {visibleItems.map((item) => {
            const year = item.releaseDate?.slice(0, 4) ?? '연도 미상';
            const rating = item.voteAverage && item.voteAverage > 0
              ? `★ ${(item.voteAverage / 2).toFixed(1)}`
              : '평점 준비 중';
            const itemId = `${item.mediaType}-${item.externalId}`;
            return (
              <article className="home-recommendation-card" key={itemId}>
                <button
                  type="button"
                  aria-label={`${item.title} 기록 작성하기`}
                  aria-busy={busyId === item.externalId}
                  disabled={busyId !== null}
                  onClick={() => void openRecommendation(item)}
                >
                  <span className="home-recommendation-poster">
                    {item.posterUrl ? (
                      <Image
                        unoptimized
                        fill
                        sizes="104px"
                        src={item.posterUrl}
                        alt=""
                      />
                    ) : (
                      <span aria-hidden="true">{item.title.slice(0, 1)}</span>
                    )}
                    <span className="home-recommendation-compose" aria-hidden="true">＋</span>
                    {busyId === item.externalId ? <span className="home-recommendation-busy">기록 준비 중…</span> : null}
                  </span>
                  <strong>{item.title}</strong>
                  <span>{year} · {rating}</span>
                </button>
              </article>
            );
          })}
        </div>
      ) : null}
      {selectionError ? <p className="home-recommendation-error" role="alert">{selectionError}</p> : null}
    </section>
  );
}
