'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { MediaType, ViewingMethod } from '@davas/shared';
import { getMe } from '../../lib/api/auth';
import {
  getMediaDetail,
  selectMedia,
  type MediaSearchResult,
  type SelectedMedia,
} from '../../lib/api/media';
import {
  CoreApiError,
  createRecord,
  getRecord,
  updateRecord,
  type RecordWritePayload,
} from '../../lib/api/core';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import {
  AsyncState,
  CoreAppShell,
  MediaTypeControl,
  Poster,
  SearchField,
  TaskShell,
  ViewingMethodControl,
} from './CoreUi';

type Draft = {
  selected: SelectedMedia | null;
  viewingMethod: ViewingMethod | null;
  watchedDate: string;
  rating: number | null;
  content: string;
  hasSpoiler: boolean;
  visibility: 'FRIENDS' | 'PRIVATE' | 'SELECTED';
  clientRequestId: string;
};
const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
const freshDraft = (): Draft => ({
  selected: null,
  viewingMethod: null,
  watchedDate: today(),
  rating: null,
  content: '',
  hasSpoiler: false,
  visibility: 'FRIENDS',
  clientRequestId: crypto.randomUUID(),
});

export function RecordComposer({ editId }: { editId?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [userId, setUserId] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState<'find' | 'write'>(
    editId || params.get('mediaId') ? 'write' : 'find',
  );
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rewatchId, setRewatchId] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const viewingRef = useRef<HTMLDivElement>(null);
  const searchType =
    mediaType === 'MOVIE' ? 'movie' : mediaType === 'TV' ? 'tv' : 'multi';
  const results = useMediaSearch(query, searchType);
  const key = userId
    ? `davas:draft:${userId}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`
    : '';

  useEffect(() => {
    let active = true;
    getMe()
      .then(async (user) => {
        if (!active) return;
        const id = user.id!;
        setUserId(id);
        const storageKey = `davas:draft:${id}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`;
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          try {
            setDraft(JSON.parse(saved));
            setStep('write');
            return;
          } catch {
            sessionStorage.removeItem(storageKey);
          }
        }
        if (editId) {
          const record = await getRecord(editId);
          setDraft({
            selected: {
              id: record.media.id,
              externalProvider: 'TMDB',
              externalId: '',
              mediaType: record.media.mediaType,
              title: record.media.title,
              originalTitle: record.media.originalTitle ?? '',
              overview: '',
              posterUrl: record.media.posterUrl,
              backdropUrl: null,
              releaseDate: record.media.releaseYear
                ? `${record.media.releaseYear}-01-01`
                : null,
              genreIds: [],
              country: null,
            },
            viewingMethod: record.viewingMethod,
            watchedDate: record.watchedDate,
            rating: record.rating,
            content: record.content,
            hasSpoiler: record.hasSpoiler,
            visibility: record.visibility,
            clientRequestId: crypto.randomUUID(),
          });
          return;
        }
        const next = freshDraft();
        const mediaId = params.get('mediaId');
        if (mediaId) {
          const media = await getMediaDetail(mediaId);
          next.selected = {
            ...media,
            externalProvider: media.externalProvider,
            genreIds: media.genreIds ?? [],
          };
        }
        setDraft(next);
      })
      .catch(() => setError('작성 화면을 준비하지 못했어요.'));
    return () => {
      active = false;
    };
  }, [editId, params]);
  useEffect(() => {
    if (key && draft) sessionStorage.setItem(key, JSON.stringify(draft));
  }, [key, draft]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (draft?.selected || draft?.content) {
        event.preventDefault();
      }
    };
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [draft]);

  if (!draft)
    return (
      <TaskShell
        title={editId ? '기록 수정' : '기록 작성'}
        fallback={editId ? `/records/${editId}` : '/records/new'}
      >
        {error ? (
          <p className="form-error">{error}</p>
        ) : (
          <AsyncState kind="loading" />
        )}
      </TaskShell>
    );

  async function choose(item: MediaSearchResult) {
    if (!draft!.viewingMethod) {
      setError('먼저 실제로 본 곳을 선택해 주세요.');
      viewingRef.current?.querySelector('button')?.focus();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const selected = await selectMedia(item);
      setDraft((value) => value && { ...value, selected });
      setStep('write');
      router.push('/records/new?step=write');
    } catch {
      setError('작품을 선택하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  async function save(allowDuplicate = false) {
    if (busy) return;
    if (!draft!.selected || !draft!.viewingMethod) {
      setError('작품과 본 곳을 선택해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    const payload: RecordWritePayload = {
      mediaId: draft!.selected.id,
      viewingMethod: draft!.viewingMethod,
      watchedDate: draft!.watchedDate,
      rating: draft!.rating,
      content: draft!.content.trim(),
      hasSpoiler: Boolean(draft!.content.trim()) && draft!.hasSpoiler,
      visibility: draft!.visibility === 'PRIVATE' ? 'PRIVATE' : 'FRIENDS',
      clientRequestId: draft!.clientRequestId,
      allowDuplicate,
    };
    try {
      const result = editId
        ? await updateRecord(editId, {
            ...payload,
            visibility:
              draft!.visibility === 'SELECTED' ? undefined : payload.visibility,
          })
        : await createRecord(payload);
      sessionStorage.removeItem(key);
      router.replace(
        `/records/${result.diary.id}?returnTo=${encodeURIComponent('/me')}&saved=${draft!.visibility === 'PRIVATE' ? 'private' : 'friends'}`,
      );
    } catch (cause) {
      if (
        cause instanceof CoreApiError &&
        cause.body.code === 'POSSIBLE_REWATCH'
      ) {
        const existing = cause.body.details?.existingRecord as
          | { id?: string }
          | undefined;
        setRewatchId(existing?.id ?? null);
        setError('같은 작품을 같은 날 같은 곳에서 본 기록이 있어요.');
      } else
        setError(
          cause instanceof Error ? cause.message : '기록을 저장하지 못했어요.',
        );
    } finally {
      setBusy(false);
    }
  }

  if (step === 'find' && !editId)
    return (
      <CoreAppShell>
        <h1 className="page-title">어떤 작품을 봤나요?</h1>
        <p className="page-description">
          본 곳과 작품 종류는 서로 다른 정보예요.
        </p>
        <div className="mt-6" ref={viewingRef}>
          <span className="field-label">어디서 봤나요?</span>
          <ViewingMethodControl
            value={draft.viewingMethod}
            onChange={(value) => {
              setDraft({ ...draft, viewingMethod: value });
              setError('');
            }}
          />
        </div>
        <p className="page-description">선택한 본 곳은 내 기록에 저장돼요.</p>
        <div className="mt-5">
          <SearchField
            value={query}
            onChange={setQuery}
            label="작품 제목"
            placeholder="영화나 드라마 제목 입력"
          />
        </div>
        <div className="mt-4">
          <span className="field-label">작품 종류</span>
          <MediaTypeControl value={mediaType} onChange={setMediaType} />
        </div>
        <p className="page-description">
          {draft.viewingMethod
            ? `${draft.viewingMethod === 'THEATER' ? '영화관' : 'OTT'}에서 본 ${mediaType === 'MOVIE' ? '영화' : mediaType === 'TV' ? '드라마' : '작품'}을 찾는 중`
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
            <p className="form-error">
              검색하지 못했어요. 입력값을 확인해 주세요.
            </p>
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
                    {[item.originalTitle, item.releaseDate?.slice(0, 4)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-bold text-[var(--blue)]">
                    {item.mediaType === 'MOVIE' ? '영화' : '드라마'}
                  </span>
                  <button
                    className="secondary-button mt-3 w-full"
                    disabled={busy}
                    onClick={() => choose(item)}
                  >
                    이 작품 선택
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        {results.hasMore ? (
          <button
            className="secondary-button mt-4 w-full"
            onClick={results.loadMore}
          >
            다음 결과 보기
          </button>
        ) : null}
      </CoreAppShell>
    );

  return (
    <TaskShell
      title={editId ? '기록 수정' : '기록 작성'}
      fallback={editId ? `/records/${editId}` : '/records/new'}
      onBack={() => setConfirmDiscard(true)}
    >
      <section className="core-card p-4">
        <div className="flex gap-3">
          <Poster
            url={draft.selected?.posterUrl ?? null}
            title={draft.selected?.title ?? '선택 작품'}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-black text-[var(--heading)]">
              {draft.selected?.title ?? '작품을 선택해 주세요'}
            </h1>
            <p className="page-description">
              {draft.selected?.mediaType === 'TV' ? '드라마' : '영화'}
            </p>
            {!editId ? (
              <button
                className="secondary-button mt-3"
                onClick={() => {
                  setStep('find');
                  setDraft({ ...draft, selected: null });
                  router.replace('/records/new');
                }}
              >
                작품 바꾸기
              </button>
            ) : null}
          </div>
        </div>
      </section>
      <div className="mt-5" ref={viewingRef}>
        <span className="field-label">본 곳 *</span>
        <ViewingMethodControl
          value={draft.viewingMethod}
          onChange={(value) => setDraft({ ...draft, viewingMethod: value })}
        />
        {draft.viewingMethod === null && editId ? (
          <p className="form-error mt-2">
            이전 기록에는 본 곳이 없어요. 수정하려면 선택해 주세요.
          </p>
        ) : null}
      </div>
      <label className="mt-5 block">
        <span className="field-label">본 날짜 *</span>
        <input
          className="date-input"
          type="date"
          max={today()}
          value={draft.watchedDate}
          onChange={(event) =>
            setDraft({ ...draft, watchedDate: event.target.value })
          }
        />
      </label>
      <fieldset className="mt-5">
        <legend className="field-label">별점 (선택)</legend>
        <div className="segmented" role="radiogroup" aria-label="별점">
          {[null, 1, 2, 3, 4, 5].map((rating) => (
            <label
              key={rating ?? 'none'}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-bold has-[:checked]:bg-[var(--blue-soft)] has-[:checked]:text-[var(--blue)]"
            >
              <input
                className="sr-only"
                type="radio"
                name="rating"
                value={rating ?? ''}
                checked={draft.rating === rating}
                onChange={() => setDraft({ ...draft, rating })}
              />
              {rating === null ? '안 남김' : `${rating}점`}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-5 block">
        <span className="field-label">어땠나요? (선택)</span>
        <textarea
          className="text-area"
          maxLength={500}
          value={draft.content}
          onChange={(event) =>
            setDraft({
              ...draft,
              content: event.target.value,
              hasSpoiler: event.target.value ? draft.hasSpoiler : false,
            })
          }
        />
        <span className="mt-1 block text-right text-xs font-semibold text-[var(--muted)]">
          {draft.content.length}/500
        </span>
      </label>
      {draft.content.trim() ? (
        <label className="mt-3 flex min-h-11 items-center gap-3 text-sm font-bold">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[var(--blue)]"
            checked={draft.hasSpoiler}
            onChange={(event) =>
              setDraft({ ...draft, hasSpoiler: event.target.checked })
            }
          />
          스포일러가 있어요
        </label>
      ) : null}
      <label className="mt-3 flex min-h-11 items-center justify-between gap-3 text-sm font-bold">
        <span>
          친구에게 보여주기
          <small className="block text-xs font-semibold text-[var(--muted)]">
            끄면 나만 볼 수 있어요.
          </small>
        </span>
        <input
          type="checkbox"
          className="h-6 w-6 accent-[var(--blue)]"
          checked={draft.visibility !== 'PRIVATE'}
          onChange={(event) =>
            setDraft({
              ...draft,
              visibility: event.target.checked ? 'FRIENDS' : 'PRIVATE',
            })
          }
        />
      </label>
      {draft.visibility === 'SELECTED' ? (
        <div className="form-error mt-2">
          <p>일부 친구 공개(이전 방식) 기록이에요. 명시적으로 바꾸기 전까지 기존 대상을 유지해요.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="secondary-button" onClick={() => setDraft({ ...draft, visibility: 'FRIENDS' })}>친구 전체로 변경</button>
            <button type="button" className="danger-button" onClick={() => setDraft({ ...draft, visibility: 'PRIVATE' })}>나만 보기로 변경</button>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="form-error mt-4" role="alert">
          {error}
        </p>
      ) : null}
      {rewatchId ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="secondary-button"
            onClick={() => router.push(`/records/${rewatchId}`)}
          >
            기존 기록 보기
          </button>
          <button
            className="commit-button"
            disabled={busy}
            onClick={() => save(true)}
          >
            새 기록으로 저장
          </button>
        </div>
      ) : (
        <button
          className="commit-button sticky-commit mt-5"
          disabled={busy || !draft.selected || !draft.viewingMethod}
          onClick={() => save()}
        >
          {busy
            ? '저장 중…'
            : editId
              ? '수정 내용 저장하기'
              : draft.visibility === 'PRIVATE'
                ? '나만 저장하기'
                : '친구와 공유하기'}
        </button>
      )}
      {confirmDiscard ? (
        <section role="dialog" aria-modal="true" aria-labelledby="discard-title" className="core-card mt-4 p-5">
          <h2 id="discard-title" className="section-title">작성 중인 내용을 버릴까요?</h2>
          <p className="page-description">버리면 이 기기의 현재 draft가 삭제돼요.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" autoFocus className="secondary-button" onClick={() => setConfirmDiscard(false)}>계속 작성</button>
            <button type="button" className="danger-button" onClick={() => { sessionStorage.removeItem(key); if (editId) router.push(`/records/${editId}`); else { setDraft(freshDraft()); setStep('find'); router.replace('/records/new'); } }}>작성 내용 버리기</button>
          </div>
        </section>
      ) : null}
    </TaskShell>
  );
}
