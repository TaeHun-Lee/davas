'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSpace } from '../../hooks/useActiveSpace';
import { getSpaceMemories, type SpaceMemories } from '../../lib/api/memories';
import { AsyncState, EmptyState, Poster, TaskShell } from '../core/CoreUi';
import { WatchPhoto } from '../core/WatchPhoto';
import { SpaceCalendarView } from './SpaceCalendarView';
import { YearRecapCard } from './YearRecapCard';

const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

export function MemoriesScreen() {
  const { state } = useActiveSpace();
  const space = state.status === 'ready' ? state.space : null;
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [data, setData] = useState<SpaceMemories | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  // The year at a glance, or the records on a monthly calendar (`?view=calendar`).
  const [view, setView] = useState<'year' | 'calendar'>('year');
  // Stepping through years quickly must not let an older year's answer land last.
  const latestRequest = useRef(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'calendar') setView('calendar');
  }, []);

  function changeView(next: 'year' | 'calendar') {
    setView(next);
    window.history.replaceState(
      null,
      '',
      next === 'calendar' ? '/spaces/memories?view=calendar' : '/spaces/memories',
    );
  }

  const load = useCallback(async () => {
    if (!space || view !== 'year') return;
    const request = ++latestRequest.current;
    setStatus('loading');
    try {
      const memories = await getSpaceMemories(space.id, year);
      if (request !== latestRequest.current) return;
      setData(memories);
      setStatus('ready');
    } catch {
      if (request === latestRequest.current) setStatus('error');
    }
  }, [space, year, view]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === 'loading')
    return (
      <TaskShell title="우리 기록 모아보기" fallback="/spaces">
        <AsyncState kind="loading" loadingLabel="공간 불러오는 중" />
      </TaskShell>
    );
  if (state.status === 'error' || !space)
    return (
      <TaskShell title="우리 기록 모아보기" fallback="/spaces">
        <EmptyState
          title={state.status === 'error' ? '공간을 불러오지 못했어요' : '먼저 공간이 필요해요'}
          description="공간에 공유한 기록을 모아서 보여 드려요."
          action={
            <Link className="primary-button" href="/spaces">
              공간으로 가기
            </Link>
          }
        />
      </TaskShell>
    );

  return (
    <TaskShell title="우리 기록 모아보기" fallback="/spaces">
      <div className="segmented memories-view" role="group" aria-label="모아보기 방식">
        <button type="button" aria-pressed={view === 'year'} onClick={() => changeView('year')}>
          한 해 돌아보기
        </button>
        <button
          type="button"
          aria-pressed={view === 'calendar'}
          onClick={() => changeView('calendar')}
        >
          달력
        </button>
      </div>

      {view === 'calendar' ? (
        <SpaceCalendarView spaceId={space.id} />
      ) : (
        <>
          <div className="memories-year" role="group" aria-label="연도 고르기">
            <button
              type="button"
              onClick={() => setYear((value) => value - 1)}
              aria-label={`${year - 1}년 보기`}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <strong aria-live="polite">{year}년</strong>
            <button
              type="button"
              onClick={() => setYear((value) => value + 1)}
              disabled={year >= thisYear}
              aria-label={`${year + 1}년 보기`}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>

          {status === 'loading' && !data ? (
            <AsyncState kind="loading" loadingLabel="모아보기 불러오는 중" />
          ) : status === 'error' ? (
            <AsyncState kind="error" onRetry={load} errorTitle="모아보기를 불러오지 못했어요" />
          ) : data ? (
            <MemoriesBody data={data} spaceName={space.name} />
          ) : null}
        </>
      )}
    </TaskShell>
  );
}

function MemoriesBody({ data, spaceName }: { data: SpaceMemories; spaceName: string }) {
  const { totals, sources } = data;
  const topCount = data.genres[0]?.count ?? 0;
  // Records by someone who left the space have no known source, so the split uses its own sum.
  const sourceTotal = sources.theater + sources.ott + sources.other;
  return (
    <>
      {totals.records ? (
        <YearRecapCard data={data} spaceName={spaceName} />
      ) : (
        <section className="memories-total" aria-labelledby="memories-total-title">
          <h2 id="memories-total-title">{data.year}년에 함께 본 작품</h2>
          <p className="memories-total-count">{totals.records}편</p>
          <p>
            영화 {totals.movies}편 · 드라마 {totals.series}편 · 사진 {totals.photos}장
          </p>
        </section>
      )}

      {totals.records ? (
        <div className="memories-grid">
          <section className="memories-card" aria-labelledby="memories-genres-title">
            <h2 id="memories-genres-title">자주 본 장르</h2>
            {data.genres.length ? (
              <ol className="memories-genres">
                {data.genres.map((genre) => (
                  <li key={genre.name}>
                    <div>
                      <span>{genre.name}</span>
                      <span>{genre.count}편</span>
                    </div>
                    <span className="memories-bar" aria-hidden="true">
                      <span style={{ width: `${percent(genre.count, topCount)}%` }} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="page-description">장르 정보가 아직 없어요.</p>
            )}
          </section>
          <section className="memories-card" aria-labelledby="memories-where-title">
            <h2 id="memories-where-title">극장 vs OTT</h2>
            <div
              className="memories-split"
              role="img"
              aria-label={`극장 ${sources.theater}편 ${percent(sources.theater, sourceTotal)}%, OTT ${sources.ott}편 ${percent(sources.ott, sourceTotal)}%`}
            >
              <span style={{ width: `${percent(sources.theater, sourceTotal)}%` }} />
              <span style={{ width: `${percent(sources.ott, sourceTotal)}%` }} />
            </div>
            <ul className="memories-legend">
              <li data-tone="theater">극장 {sources.theater}편</li>
              <li data-tone="ott">OTT {sources.ott}편</li>
              {sources.other ? <li data-tone="other">그 밖에 {sources.other}편</li> : null}
            </ul>
          </section>
        </div>
      ) : (
        <p className="page-description mt-4">
          이 해에는 공간에 공유한 기록이 없어요. 함께 본 작품을 기록하면 여기에 모여요.
        </p>
      )}

      {data.onThisDay.map((item) => (
        <Link
          key={item.watchEventId}
          href={`/records/${encodeURIComponent(item.watchEventId)}?returnTo=${encodeURIComponent('/spaces/memories')}`}
          className="memories-on-this-day"
        >
          {item.coverPhoto ? (
            <span className="memories-cover">
              <WatchPhoto photo={item.coverPhoto} variant="thumb" alt="" />
            </span>
          ) : (
            <Poster url={item.posterUrl} title={item.title} />
          )}
          <span className="min-w-0">
            <span className="memories-eyebrow">{item.yearsAgo}년 전 오늘</span>
            <strong>&lsquo;{item.title}&rsquo; 함께 봤어요</strong>
            <span>
              {[
                item.watchedDate.replaceAll('-', '.'),
                item.sourceKind === 'THEATER' ? '극장' : item.sourceKind === 'OTT' ? 'OTT' : null,
                item.photoCount ? `사진 ${item.photoCount}장` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
          <span aria-hidden="true">›</span>
        </Link>
      ))}

      <section className="memories-dramas" aria-labelledby="memories-dramas-title">
        <h2 id="memories-dramas-title" className="section-title">
          보고 있는 드라마
        </h2>
        {data.inProgress.length ? (
          <ul>
            {data.inProgress.map((drama) => (
              <li key={drama.mediaId}>
                <div className="memories-drama-head">
                  <strong>{drama.title}</strong>
                  <span>
                    {drama.episodeTotal
                      ? `${drama.episodeWatched}/${drama.episodeTotal}화`
                      : `${drama.episodeWatched}화까지`}
                    {drama.providerName ? ` · ${drama.providerName}` : ''}
                  </span>
                </div>
                {drama.episodeTotal ? (
                  <span
                    className="memories-bar"
                    role="img"
                    aria-label={`${drama.episodeTotal}화 중 ${drama.episodeWatched}화까지 봤어요`}
                  >
                    <span
                      style={{ width: `${percent(drama.episodeWatched, drama.episodeTotal)}%` }}
                    />
                  </span>
                ) : null}
                <Link
                  href={`/records/new?mediaId=${encodeURIComponent(drama.mediaId)}`}
                  className="memories-continue"
                  aria-label={`${drama.title} 이어서 기록하기`}
                >
                  이어서 기록하기
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="page-description">
            드라마를 기록할 때 어디까지 봤는지 남기면 여기서 이어 볼 수 있어요.
          </p>
        )}
      </section>
    </>
  );
}
