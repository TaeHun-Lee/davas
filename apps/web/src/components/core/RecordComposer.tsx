'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { MediaType, SpaceView } from '@davas/shared';
import { getMe } from '../../lib/api/auth';
import {
  getMediaDetail,
  selectMedia,
  type MediaSearchResult,
  type SelectedMedia,
} from '../../lib/api/media';
import { listSpaces } from '../../lib/api/spaces';
import {
  createWatchEvent,
  getWatchEvent,
  updateWatchEvent,
  type WatchEventWritePayload,
  type WatchSourceKind,
} from '../../lib/api/watch-events';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import {
  AsyncState,
  CoreAppShell,
  MediaTypeControl,
  Poster,
  SearchField,
  TaskShell,
} from './CoreUi';
import { WatchRatingControl } from './WatchRatingControl';

type Draft = {
  selected: SelectedMedia | null;
  sourceKind: WatchSourceKind | null;
  providerName: string;
  placeText: string;
  watchedDate: string;
  rating: number | null;
  content: string;
  spaceIds: string[];
  participantAccountIds: string[];
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
  sourceKind: null,
  providerName: '',
  placeText: '',
  watchedDate: today(),
  rating: null,
  content: '',
  spaceIds: [],
  participantAccountIds: [],
});

const sourceLabels: Record<WatchSourceKind, string> = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV/소장',
  OTHER: '기타',
};

function SourceKindControl({
  value,
  onChange,
}: {
  value: WatchSourceKind | null;
  onChange: (value: WatchSourceKind) => void;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label="감상 경로">
      {(Object.keys(sourceLabels) as WatchSourceKind[]).map((kind) => (
        <label
          key={kind}
          className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-bold has-[:checked]:bg-[var(--blue-soft)] has-[:checked]:text-[var(--blue)]"
        >
          <input
            className="sr-only"
            type="radio"
            name="source-kind"
            value={kind}
            checked={value === kind}
            onChange={() => onChange(kind)}
          />
          {sourceLabels[kind]}
        </label>
      ))}
    </div>
  );
}

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
  const [spaces, setSpaces] = useState<SpaceView[]>([]);
  const [spacesError, setSpacesError] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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
        void listSpaces()
          .then(({ items }) => {
            if (active) setSpaces(items);
          })
          .catch(() => {
            if (active) setSpacesError(true);
          });
        const storageKey = `davas:draft:${id}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`;
        const mediaId = params.get('mediaId');
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as Partial<Draft> & {
              viewingMethod?: 'THEATER' | 'OTT';
            };
            const resumedDraft = {
              ...freshDraft(),
              ...parsed,
              sourceKind: parsed.sourceKind ?? parsed.viewingMethod ?? null,
              spaceIds: parsed.spaceIds ?? [],
              participantAccountIds: parsed.participantAccountIds ?? [],
            };
            if (mediaId) {
              const media = await getMediaDetail(mediaId);
              resumedDraft.selected = {
                ...media,
                externalProvider: media.externalProvider,
                genreIds: media.genreIds ?? [],
              };
            }
            if (!active) return;
            setDraft(resumedDraft);
            setStep('write');
            return;
          } catch {
            sessionStorage.removeItem(storageKey);
          }
        }
        if (editId) {
          const record = await getWatchEvent(editId);
          setDraft({
            selected: {
              id: record.media.id,
              externalProvider: 'TMDB',
              externalId: '',
              mediaType: record.media.mediaType,
              title: record.media.title,
              originalTitle: '',
              overview: '',
              posterUrl: record.media.posterUrl,
              backdropUrl: null,
              releaseDate: null,
              genreIds: [],
              country: null,
            },
            sourceKind: record.source?.kind ?? null,
            providerName: record.source?.providerName ?? '',
            placeText: record.source?.placeText ?? '',
            watchedDate: record.watchedDate,
            rating:
              record.reactions.find(
                (reaction) => reaction.accountId === record.author.accountId,
              )?.rating ?? null,
            content:
              record.reactions.find(
                (reaction) => reaction.accountId === record.author.accountId,
              )?.review ?? '',
            spaceIds: record.spaceIds,
            participantAccountIds: record.participants
              .filter(
                (participant) =>
                  participant.accountId !== record.author.accountId &&
                  participant.status !== 'DECLINED',
              )
              .map((participant) => participant.accountId),
          });
          return;
        }
        const next = freshDraft();
        if (mediaId) {
          const media = await getMediaDetail(mediaId);
          next.selected = {
            ...media,
            externalProvider: media.externalProvider,
            genreIds: media.genreIds ?? [],
          };
        }
        if (!active) return;
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

  const participantOptions = Array.from(
    new Map(
      spaces
        .filter((space) => draft.spaceIds.includes(space.id))
        .flatMap((space) => space.members)
        .filter((member) => member.accountId !== userId)
        .map((member) => [member.accountId, member] as const),
    ).values(),
  );

  async function choose(item: MediaSearchResult) {
    if (!draft!.sourceKind) {
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

  async function save() {
    if (busy) return;
    if (!draft!.selected || !draft!.sourceKind || !draft!.watchedDate) {
      setError('작품과 본 곳을 선택해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    const payload: WatchEventWritePayload = {
      mediaId: draft!.selected.id,
      watchedDate: draft!.watchedDate,
      source: {
        kind: draft!.sourceKind,
        providerName: draft!.providerName.trim() || null,
        placeText: draft!.placeText.trim() || null,
      },
      spaceIds: draft!.spaceIds,
      participantAccountIds: draft!.participantAccountIds,
      rating: draft!.rating,
      review: draft!.content.trim() || null,
    };
    try {
      const result = editId
        ? await updateWatchEvent(editId, {
            mediaId: payload.mediaId,
            watchedDate: payload.watchedDate,
            source: payload.source,
            spaceIds: payload.spaceIds,
            rating: payload.rating,
            review: payload.review,
          })
        : await createWatchEvent(payload);
      sessionStorage.removeItem(key);
      router.replace(
        `/records/${result.id}?returnTo=${encodeURIComponent('/me')}&saved=${draft!.spaceIds.length ? 'space' : 'private'}`,
      );
    } catch (cause) {
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
          <SourceKindControl
            value={draft.sourceKind}
            onChange={(value) => {
              setDraft({ ...draft, sourceKind: value });
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
          {draft.sourceKind
            ? `${sourceLabels[draft.sourceKind]}에서 본 ${mediaType === 'MOVIE' ? '영화' : mediaType === 'TV' ? '드라마' : '작품'}을 찾는 중`
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
        <span className="field-label">감상 경로 *</span>
        <SourceKindControl
          value={draft.sourceKind}
          onChange={(value) => setDraft({ ...draft, sourceKind: value })}
        />
        {draft.sourceKind === null && editId ? (
          <p className="form-error mt-2">
            이전 기록에는 감상 경로가 없어요. 수정하려면 선택해 주세요.
          </p>
        ) : null}
      </div>
      {draft.sourceKind === 'OTT' ? (
        <label className="mt-4 block">
          <span className="field-label">OTT 서비스 (선택)</span>
          <input
            className="date-input"
            maxLength={80}
            placeholder="예: 넷플릭스, 왓챠"
            value={draft.providerName}
            onChange={(event) =>
              setDraft({ ...draft, providerName: event.target.value })
            }
          />
        </label>
      ) : null}
      <label className="mt-4 block">
        <span className="field-label">장소 (선택)</span>
        <input
          className="date-input"
          maxLength={160}
          placeholder={
            draft.sourceKind === 'THEATER'
              ? '예: 대한극장 3관'
              : '예: 우리 집 거실'
          }
          value={draft.placeText}
          onChange={(event) =>
            setDraft({ ...draft, placeText: event.target.value })
          }
        />
      </label>
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
        <WatchRatingControl
          value={draft.rating}
          onChange={(rating) => setDraft({ ...draft, rating })}
          name="record-rating"
        />
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
            })
          }
        />
        <span className="mt-1 block text-right text-xs font-semibold text-[var(--muted)]">
          {draft.content.length}/500
        </span>
      </label>
      <section className="core-card mt-5 p-4" aria-labelledby="share-scope-title">
        <h2 id="share-scope-title" className="section-title">공유 범위 *</h2>
        <p className="page-description">
          저장 시점에 선택한 공간에만 공유돼요. 새 공간에 가입해도 과거 기록은 자동으로 공유되지 않아요.
        </p>
        <button
          type="button"
          aria-pressed={draft.spaceIds.length === 0}
          className={`mt-3 min-h-12 w-full rounded-2xl px-4 text-left text-sm font-black ${draft.spaceIds.length === 0 ? 'bg-[var(--blue-soft)] text-[var(--blue)]' : 'bg-white text-[var(--text)] shadow-sm'}`}
          onClick={() =>
            setDraft({
              ...draft,
              spaceIds: [],
              participantAccountIds: [],
            })
          }
        >
          개인 기록 · 나만 보기
        </button>
        {spaces.length ? (
          <fieldset className="mt-3">
            <legend className="field-label">공간에 공유</legend>
            <div className="space-y-2">
              {spaces.map((space) => (
                <label
                  key={space.id}
                  className="flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 text-sm font-bold shadow-sm"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-[var(--blue)]"
                    checked={draft.spaceIds.includes(space.id)}
                    onChange={(event) => {
                      const spaceIds = event.target.checked
                        ? [...new Set([...draft.spaceIds, space.id])]
                        : draft.spaceIds.filter((id) => id !== space.id);
                      const allowedAccounts = new Set(
                        spaces
                          .filter((item) => spaceIds.includes(item.id))
                          .flatMap((item) => item.members)
                          .map((member) => member.accountId),
                      );
                      setDraft({
                        ...draft,
                        spaceIds,
                        participantAccountIds:
                          draft.participantAccountIds.filter((id) =>
                            allowedAccounts.has(id),
                          ),
                      });
                    }}
                  />
                  <span>{space.name}</span>
                  <small className="ml-auto text-xs text-[var(--muted)]">
                    {space.members.length}명
                  </small>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="page-description mt-3">
            {spacesError
              ? '공간 목록을 불러오지 못했어요. 개인 기록으로는 저장할 수 있어요.'
              : '참여 중인 공간이 없어요. 개인 기록으로 저장돼요.'}
          </p>
        )}
      </section>
      {draft.spaceIds.length > 0 && !editId ? (
        <fieldset className="core-card mt-4 p-4">
          <legend className="section-title px-1">함께 본 사람</legend>
          <p className="page-description">
            선택한 사람에게 참여 요청이 가며, 확인한 뒤 각자 별점과 리뷰를 남길 수 있어요.
          </p>
          {participantOptions.length ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {participantOptions.map((member) => (
                <label
                  key={member.accountId}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 text-sm font-bold shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={draft.participantAccountIds.includes(
                      member.accountId,
                    )}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        participantAccountIds: event.target.checked
                          ? [
                              ...new Set([
                                ...draft.participantAccountIds,
                                member.accountId,
                              ]),
                            ]
                          : draft.participantAccountIds.filter(
                              (id) => id !== member.accountId,
                            ),
                      })
                    }
                  />
                  {member.nickname || '공간 멤버'}
                </label>
              ))}
            </div>
          ) : (
            <p className="page-description mt-3">요청할 다른 공간 멤버가 없어요.</p>
          )}
        </fieldset>
      ) : null}
      {error ? (
        <p className="form-error mt-4" role="alert">
          {error}
        </p>
      ) : null}
      <p className="page-description mt-4">
        같은 작품을 다시 봤다면 날짜와 감상 경로가 같은 경우에도 새 감상으로 저장돼요.
      </p>
      <button
        className="commit-button sticky-commit mt-5"
        disabled={
          busy || !draft.selected || !draft.sourceKind || !draft.watchedDate
        }
        onClick={() => save()}
      >
        {busy
          ? '저장 중…'
          : editId
            ? '수정 내용 저장하기'
            : draft.spaceIds.length === 0
              ? '개인 기록으로 저장하기'
              : '선택한 공간에 공유하기'}
      </button>
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
