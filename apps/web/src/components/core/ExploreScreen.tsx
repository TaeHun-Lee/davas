'use client';

import { SEARCH_MIN_LENGTH } from '@davas/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import {
  getMediaDetail,
  selectMedia,
  type MediaDetail,
  type MediaSearchResult,
} from '../../lib/api/media';
import {
  getGenreRecommendations,
  getNowShowing,
  getTrendingRecommendations,
  type MediaRecommendationItem,
  type NowShowingItem,
} from '../../lib/api/recommendations';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { showtimesReadLabel } from '../media/media-showtimes-model';
import { AsyncState, CoreAppShell, EmptyState, Poster, SearchField } from './CoreUi';
import { mediaTypeLabel } from '../../lib/api/core';

type Kind = 'THEATER' | 'MOVIE' | 'TV';
type Loaded<T> = { status: 'loading' | 'ready' | 'error'; items: T[] };

/** The four mood cards and the genre preset each one asks for. */
export const EXPLORE_MOODS = [
  { preset: 'light-comedy', title: '가볍게 웃고 싶어요', detail: '코미디', tone: 'laugh' },
  {
    preset: 'immersive-thriller',
    title: '푹 빠져서 몰입',
    detail: '스릴러·미스터리',
    tone: 'focus',
  },
  { preset: 'good-cry', title: '실컷 울고 싶어요', detail: '드라마·가족', tone: 'cry' },
  { preset: 'chills', title: '오싹하게', detail: '공포', tone: 'chills' },
] as const;

const KINDS: Array<{ value: Kind; label: string }> = [
  { value: 'THEATER', label: '극장' },
  { value: 'MOVIE', label: '영화' },
  { value: 'TV', label: '드라마' },
];

const kindLabel = (kind: Kind) => (kind === 'THEATER' ? '극장 상영작' : mediaTypeLabel(kind));

function meta(item: MediaSearchResult) {
  if ('showing' in item) {
    return `서울·경기 ${(item as NowShowingItem).showing.theaters}곳 상영`;
  }
  return [mediaTypeLabel(item.mediaType), item.releaseDate?.slice(0, 4)]
    .filter(Boolean)
    .join(' · ');
}

function ResultList({
  label,
  items,
  opening,
  onOpen,
}: {
  label: string;
  items: MediaSearchResult[];
  opening: string | null;
  onOpen: (item: MediaSearchResult) => void;
}) {
  return (
    <ul className="explore-results" aria-label={label}>
      {items.map((item) => (
        <li key={`${item.mediaType}-${item.externalId}`}>
          <button
            type="button"
            className="explore-result"
            disabled={opening !== null}
            aria-busy={opening === item.externalId || undefined}
            onClick={() => onOpen(item)}
          >
            <Poster url={item.posterUrl} title={item.title} />
            <span className="min-w-0">
              <strong>{item.title}</strong>
              <span>{meta(item)}</span>
            </span>
            <span aria-hidden="true">›</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * 탐색: find a title by its name, or browse what is popular and what fits tonight's mood.
 * Any title opens the same title sheet as elsewhere, to record it or add it to the shared list.
 */
export function ExploreScreen() {
  const [query, setQuery] = useState('');
  const search = useMediaSearch(query, 'multi');
  const searching = query.trim().length >= SEARCH_MIN_LENGTH;
  const [kind, setKind] = useState<Kind>('THEATER');
  const [trending, setTrending] = useState<Loaded<MediaRecommendationItem>>({
    status: 'loading',
    items: [],
  });
  const [showing, setShowing] = useState<
    Loaded<MediaRecommendationItem> & { updatedAt?: string | null }
  >({ status: 'loading', items: [] });
  const [mood, setMood] = useState<(typeof EXPLORE_MOODS)[number]['preset'] | null>(null);
  const [moodPicks, setMoodPicks] = useState<Loaded<MediaRecommendationItem>>({
    status: 'loading',
    items: [],
  });
  const [trendingAttempt, setTrendingAttempt] = useState(0);
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [openError, setOpenError] = useState('');

  useEffect(() => {
    let active = true;
    setTrending({ status: 'loading', items: [] });
    getTrendingRecommendations({ limit: 20 })
      .then((response) => {
        if (active) setTrending({ status: 'ready', items: response.items });
      })
      .catch(() => {
        if (active) setTrending({ status: 'error', items: [] });
      });
    return () => {
      active = false;
    };
  }, [trendingAttempt]);

  useEffect(() => {
    let active = true;
    setShowing({ status: 'loading', items: [] });
    getNowShowing({ limit: 20 })
      .then((response) => {
        if (active)
          setShowing({ status: 'ready', items: response.items, updatedAt: response.updatedAt });
      })
      .catch(() => {
        if (active) setShowing({ status: 'error', items: [] });
      });
    return () => {
      active = false;
    };
  }, [trendingAttempt]);

  useEffect(() => {
    if (!mood) return;
    let active = true;
    setMoodPicks({ status: 'loading', items: [] });
    getGenreRecommendations(mood, { limit: 8 })
      .then((response) => {
        if (active) setMoodPicks({ status: 'ready', items: response.items });
      })
      .catch(() => {
        if (active) setMoodPicks({ status: 'error', items: [] });
      });
    return () => {
      active = false;
    };
  }, [mood]);

  async function open(item: MediaSearchResult) {
    setOpening(item.externalId);
    setOpenError('');
    try {
      const selected = await selectMedia(item);
      setDetail(await getMediaDetail(selected.id));
    } catch {
      setOpenError('작품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setOpening(null);
    }
  }

  const popularList = kind === 'THEATER' ? showing : trending;
  const popular = (
    kind === 'THEATER' ? showing.items : trending.items.filter((item) => item.mediaType === kind)
  ).slice(0, 10);
  const showingRead = showtimesReadLabel(showing.updatedAt ?? null);
  const moodCard = EXPLORE_MOODS.find((item) => item.preset === mood);

  return (
    <CoreAppShell>
      <h1 className="page-title">탐색</h1>
      <div className="mt-4">
        <SearchField
          value={query}
          onChange={setQuery}
          label="영화, 드라마 제목으로 찾기"
          placeholder="영화, 드라마 제목으로 찾기"
        />
      </div>
      {openError ? (
        <p role="alert" className="form-error mt-3">
          {openError}
        </p>
      ) : null}

      {searching ? (
        <section className="explore-section" aria-labelledby="explore-search-title">
          <h2 id="explore-search-title" className="section-title explore-count-title">
            검색 결과
            {search.status === 'results' ? <span>{search.items.length}</span> : null}
          </h2>
          {search.status === 'searching' ? (
            <AsyncState kind="loading" />
          ) : search.status === 'error' ? (
            <EmptyState
              title="작품을 찾지 못했어요"
              description="연결 상태를 확인하고 다시 검색해 주세요."
            />
          ) : search.status === 'empty' ? (
            <EmptyState
              title={`‘${query.trim()}’에 맞는 작품이 없어요`}
              description="띄어쓰기나 원제로도 찾아보세요."
            />
          ) : (
            <>
              <ResultList
                label="검색 결과"
                items={search.items}
                opening={opening}
                onOpen={(item) => void open(item)}
              />
              <p className="explore-hint">작품을 누르면 작품 정보가 열려요.</p>
            </>
          )}
        </section>
      ) : (
        <>
          <section className="explore-section" aria-labelledby="explore-popular-title">
            <div className="explore-section-head">
              <h2 id="explore-popular-title" className="section-title">
                지금 화제작
              </h2>
              <div className="explore-kinds" role="group" aria-label="화제작 종류">
                {KINDS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={kind === option.value}
                    onClick={() => setKind(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {popularList.status === 'loading' ? (
              <AsyncState kind="loading" />
            ) : popularList.status === 'error' ? (
              <EmptyState
                title="화제작을 불러오지 못했어요"
                description="검색은 그대로 쓸 수 있어요."
                action={
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setTrendingAttempt((value) => value + 1)}
                  >
                    다시 시도
                  </button>
                }
              />
            ) : kind === 'THEATER' && !popular.length ? (
              <p className="explore-hint">
                극장 시간표를 준비하고 있어요. 시간표는 매일 정오에 새로 받아요.
              </p>
            ) : (
              <ul className="explore-rail" aria-label={`지금 화제작, ${kindLabel(kind)}`}>
                {popular.map((item) => (
                  <li key={item.externalId}>
                    <button
                      type="button"
                      disabled={opening !== null}
                      aria-busy={opening === item.externalId || undefined}
                      aria-label={`${item.title} 상세 보기`}
                      onClick={() => void open(item)}
                    >
                      <Poster url={item.posterUrl} title={item.title} />
                      <strong>{item.title}</strong>
                      <span>{meta(item)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {kind === 'THEATER' && popular.length ? (
              <p className="explore-hint">
                상영 정보: 영화진흥위원회 통합전산망(KOBIS){showingRead ? ` · ${showingRead}` : ''}
              </p>
            ) : null}
          </section>

          <section className="explore-section" aria-labelledby="explore-mood-title">
            <h2 id="explore-mood-title" className="section-title">
              오늘은 어떤 기분이에요?
            </h2>
            <div className="explore-moods">
              {EXPLORE_MOODS.map((item) => (
                <button
                  key={item.preset}
                  type="button"
                  data-tone={item.tone}
                  aria-pressed={mood === item.preset}
                  onClick={() => setMood(mood === item.preset ? null : item.preset)}
                >
                  {mood === item.preset ? (
                    <span className="explore-mood-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </span>
                  ) : null}
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
            </div>
            {moodCard ? (
              <div className="explore-mood-picks" aria-live="polite">
                <p className="explore-picks-caption">‘{moodCard.title}’에 어울리는 작품</p>
                {moodPicks.status === 'loading' ? (
                  <AsyncState kind="loading" />
                ) : moodPicks.status === 'error' || !moodPicks.items.length ? (
                  <p className="explore-hint">
                    {moodCard.title}에 맞는 작품을 불러오지 못했어요. 다른 기분을 골라 보세요.
                  </p>
                ) : (
                  <ResultList
                    label={`${moodCard.title}에 어울리는 작품`}
                    items={moodPicks.items}
                    opening={opening}
                    onOpen={(item) => void open(item)}
                  />
                )}
              </div>
            ) : null}
          </section>

          <Link href="/spaces?view=recommend" className="secondary-button explore-together">
            둘이 같이 고르기 ›
          </Link>
        </>
      )}

      {detail ? (
        <MediaDetailModal
          media={detail}
          isOpen
          onClose={() => setDetail(null)}
          returnTo="/explore"
          recordHref={`/records/new?mediaId=${encodeURIComponent(detail.id)}&returnTo=${encodeURIComponent('/explore')}`}
        />
      ) : null}
    </CoreAppShell>
  );
}
