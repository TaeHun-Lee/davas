'use client';

import type { MediaType, ViewingMethod } from '@davas/shared';
import type { RefObject } from 'react';
import type { MediaSearchResult } from '../../lib/api/media';
import type { useMediaSearch } from '../../hooks/useMediaSearch';
import {
  AsyncState,
  CoreAppShell,
  MediaTypeControl,
  Poster,
  SearchField,
  ViewingMethodControl,
} from './CoreUi';
import type { RecordDraft } from './record-composer-model';

type MediaSearchState = ReturnType<typeof useMediaSearch>;

export function RecordFinderView({
  draft,
  query,
  mediaType,
  error,
  busy,
  results,
  viewingRef,
  onDraftChange,
  onQueryChange,
  onMediaTypeChange,
  onChoose,
}: {
  draft: RecordDraft;
  query: string;
  mediaType: MediaType | null;
  error: string;
  busy: boolean;
  results: MediaSearchState;
  viewingRef: RefObject<HTMLDivElement | null>;
  onDraftChange: (draft: RecordDraft) => void;
  onQueryChange: (value: string) => void;
  onMediaTypeChange: (value: MediaType | null) => void;
  onChoose: (item: MediaSearchResult) => void;
}) {
  const viewingLabel = (value: ViewingMethod) => (value === 'THEATER' ? '영화관' : 'OTT');
  return (
    <CoreAppShell>
      <h1 className="page-title">어떤 작품을 봤나요?</h1>
      <p className="page-description">본 곳과 작품 종류는 서로 다른 정보예요.</p>
      <div className="mt-6" ref={viewingRef}>
        <span className="field-label">어디서 봤나요?</span>
        <ViewingMethodControl
          value={draft.viewingMethod}
          onChange={(value) => {
            onDraftChange({ ...draft, viewingMethod: value });
          }}
        />
      </div>
      <p className="page-description">선택한 본 곳은 내 기록에 저장돼요.</p>
      <div className="mt-5">
        <SearchField
          value={query}
          onChange={onQueryChange}
          label="작품 제목"
          placeholder="영화나 드라마 제목 입력"
        />
      </div>
      <div className="mt-4">
        <span className="field-label">작품 종류</span>
        <MediaTypeControl value={mediaType} onChange={onMediaTypeChange} />
      </div>
      <p className="page-description">
        {draft.viewingMethod
          ? `${viewingLabel(draft.viewingMethod)}에서 본 ${
              mediaType === 'MOVIE' ? '영화' : mediaType === 'TV' ? '드라마' : '작품'
            }을 찾는 중`
          : '본 곳을 먼저 선택해 주세요.'}
      </p>
      {error ? (
        <p className="form-error mt-3" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-5 space-y-3">
        {results.status === 'idle' ? (
          <p className="core-card p-5 text-center text-sm font-bold text-[var(--muted)]">
            본 작품의 제목을 두 글자 이상 입력해 주세요.
          </p>
        ) : results.status === 'searching' && !results.items.length ? (
          <AsyncState kind="loading" />
        ) : results.status === 'empty' ? (
          <p className="core-card p-5 text-center text-sm font-bold text-[var(--muted)]">
            조건에 맞는 작품을 찾지 못했어요.
          </p>
        ) : results.status === 'error' ? (
          <p className="form-error">검색하지 못했어요. 입력값을 확인해 주세요.</p>
        ) : (
          results.items.map((item) => (
            <article
              key={`${item.mediaType}-${item.externalId}`}
              className="core-card flex gap-3 p-3"
            >
              <Poster url={item.posterUrl} title={item.title} />
              <div className="min-w-0 flex-1 py-1">
                <h2 className="truncate text-[15px] font-extrabold text-[var(--heading)]">
                  {item.title}
                </h2>
                <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  {[item.originalTitle, item.releaseDate?.slice(0, 4)].filter(Boolean).join(' · ')}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-bold text-[var(--blue)]">
                  {item.mediaType === 'MOVIE' ? '영화' : '드라마'}
                </span>
                <button
                  className="secondary-button mt-3 w-full"
                  disabled={busy}
                  onClick={() => onChoose(item)}
                >
                  이 작품 선택
                </button>
              </div>
            </article>
          ))
        )}
      </div>
      {results.hasMore ? (
        <button className="secondary-button mt-4 w-full" onClick={results.loadMore}>
          다음 결과 보기
        </button>
      ) : null}
    </CoreAppShell>
  );
}
