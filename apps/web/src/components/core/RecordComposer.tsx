'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  WATCH_HEADLINE_MAX_LENGTH,
  WATCH_MEMORY_NOTE_MAX_LENGTH,
  WATCH_REVIEW_MAX_LENGTH,
  type MediaType,
  type SpaceView,
} from '@davas/shared';
import { getMe } from '../../lib/api/auth';
import {
  getMediaDetail,
  selectMedia,
  type MediaDetail,
  type MediaSearchResult,
} from '../../lib/api/media';
import type { WatchProgress } from '../../lib/api/memories';
import { listSpaces } from '../../lib/api/spaces';
import {
  createWatchEvent,
  getWatchEvent,
  updateWatchEvent,
  type TheaterFormat,
  type WatchEventWritePayload,
  type WatchSourceKind,
} from '../../lib/api/watch-events';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import { useWatchPhotoUploads } from '../../hooks/useWatchPhotoUploads';
import {
  ChoiceChips,
  CountedField,
  OTT_SERVICES,
  SeriesProgress,
  THEATER_FORMAT_LABELS,
  ToggleSwitch,
} from './ComposerFields';
import {
  AsyncState,
  CoreAppShell,
  MediaTypeControl,
  Poster,
  SearchField,
  TaskShell,
} from './CoreUi';
import { PhotoPicker } from './PhotoPicker';
import { WatchRatingControl } from './WatchRatingControl';
import { MediaDetailModal } from '../media/MediaDetailModal';
import {
  asSelected,
  canResumeDraft,
  continueSeries,
  draftWithDefaults,
  readSavedDraft,
  today,
  type Draft,
} from './composer-draft';

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
  const mediaId = params.get('mediaId');
  const detailMediaId = params.get('detail');
  const requestedStep = params.get('step');
  const [userId, setUserId] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState<'find' | 'write'>(editId || mediaId ? 'write' : 'find');
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [spaces, setSpaces] = useState<SpaceView[]>([]);
  const [spacesError, setSpacesError] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [detailPreview, setDetailPreview] = useState<MediaDetail | null>(null);
  const [waitingForPhotos, setWaitingForPhotos] = useState(false);
  const [continuedFrom, setContinuedFrom] = useState<WatchProgress | null>(null);
  const photoUploads = useWatchPhotoUploads();
  const { reset: resetPhotos } = photoUploads;
  const searchType = mediaType === 'MOVIE' ? 'movie' : mediaType === 'TV' ? 'tv' : 'multi';
  const results = useMediaSearch(query, searchType);
  const key = userId
    ? `davas:draft:${userId}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`
    : '';

  useEffect(() => {
    let active = true;
    Promise.all([
      getMe(),
      // A failed space list still lets the user save a private record.
      listSpaces()
        .then(({ items }) => items)
        .catch(() => null),
    ])
      .then(async ([user, spaceItems]) => {
        if (!active) return;
        const id = user.id!;
        setUserId(id);
        if (spaceItems) setSpaces(spaceItems);
        else setSpacesError(true);
        const storageKey = `davas:draft:${id}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`;
        const saved = readSavedDraft(storageKey);

        if (editId) {
          if (saved) {
            resetPhotos(saved.photos);
            setDraft(saved);
            return;
          }
          const record = await getWatchEvent(editId);
          if (!active) return;
          const mine = record.reactions.find(
            (reaction) => reaction.accountId === record.author.accountId,
          );
          resetPhotos(record.photos);
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
            rating: mine?.rating ?? null,
            headline: mine?.headline ?? '',
            content: mine?.review ?? '',
            hasSpoiler: mine?.hasSpoiler ?? false,
            isBlind: mine?.isBlind ?? false,
            memoryNote: record.memoryNote ?? '',
            theaterFormat: record.source?.theaterFormat ?? null,
            seatText: record.source?.seatText ?? '',
            episodeWatched: record.source?.episodeWatched ?? null,
            episodeTotal: record.source?.episodeTotal ?? null,
            completed: record.source?.completed ?? false,
            photos: record.photos,
            spaceIds: record.spaceIds,
            participantAccountIds: record.participants
              .filter(
                (participant) =>
                  participant.accountId !== record.author.accountId &&
                  participant.status !== 'DECLINED',
              )
              .map((participant) => participant.accountId),
            seriesPrefilledFor: record.media.id,
          });
          return;
        }

        // Fetched before anything is reset: if TMDB is briefly down, the saved draft stays.
        const requested = mediaId ?? detailMediaId;
        const media = requested ? await getMediaDetail(requested) : null;
        if (!active) return;
        const resumable = canResumeDraft(saved, requested);
        const next = resumable ? saved : draftWithDefaults(spaceItems, id);
        let progress: WatchProgress | null = null;
        if (media) {
          next.selected = asSelected(media);
          if (next.seriesPrefilledFor !== media.id) progress = await continueSeries(next, media);
        }
        if (!active) return;
        setContinuedFrom(progress);
        if (detailMediaId && media) setDetailPreview(media);
        resetPhotos(resumable ? next.photos : []);
        setDraft(next);
      })
      .catch(() => {
        if (active) setError('작성 화면을 준비하지 못했어요. 연결을 확인하고 다시 시도해 주세요.');
      });
    return () => {
      active = false;
    };
  }, [detailMediaId, editId, mediaId, resetPhotos]);
  const uploadedPhotos = photoUploads.items.flatMap((item) =>
    item.status === 'done' && item.photo ? [item.photo] : [],
  );
  const uploadedPhotoKey = uploadedPhotos.map((photo) => photo.id).join(',');
  useEffect(() => {
    if (!key || !draft) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ ...draft, photos: uploadedPhotos }));
    } catch {
      // A full or blocked storage only loses the safety copy, never the form itself.
    }
    // uploadedPhotoKey stands in for the photo list, which is rebuilt on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, draft, uploadedPhotoKey]);
  useEffect(() => {
    if (editId) return;
    setStep(mediaId || requestedStep === 'write' ? 'write' : 'find');
  }, [editId, mediaId, requestedStep]);
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
        fallback={editId ? `/records/${editId}` : '/'}
      >
        {error ? <p className="form-error">{error}</p> : <AsyncState kind="loading" />}
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
    setBusy(true);
    setError('');
    try {
      const selected = await selectMedia(item);
      const detail = await getMediaDetail(selected.id);
      const switching = Boolean(draft?.selected && draft.selected.id !== selected.id);
      if (switching) resetPhotos([]);
      setDraft((value) =>
        value && !switching
          ? { ...value, selected }
          : { ...draftWithDefaults(spaces, userId), selected },
      );
      setDetailPreview(detail);
      router.push(`/records/new?step=find&detail=${encodeURIComponent(selected.id)}`);
    } catch {
      setError('작품 상세 정보를 불러오지 못했어요. 다시 시도해 주세요.');
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
    // Saving while photos are still uploading waits for them instead of dropping them.
    setWaitingForPhotos(photoUploads.uploadingCount > 0);
    const photoItems = await photoUploads.settle();
    setWaitingForPhotos(false);
    if (photoItems.some((item) => item.status === 'error')) {
      setBusy(false);
      setError('올리지 못한 사진이 있어요. 다시 시도하거나 삭제한 뒤 저장해 주세요.');
      return;
    }
    const theater = draft!.sourceKind === 'THEATER';
    const shared = draft!.spaceIds.length > 0;
    const payload: WatchEventWritePayload = {
      mediaId: draft!.selected.id,
      watchedDate: draft!.watchedDate,
      source: {
        kind: draft!.sourceKind,
        providerName: draft!.providerName.trim() || null,
        placeText: draft!.placeText.trim() || null,
        theaterFormat: theater ? draft!.theaterFormat : null,
        seatText: theater ? draft!.seatText.trim() || null : null,
        episodeWatched: theater ? null : draft!.episodeWatched,
        episodeTotal: theater ? null : draft!.episodeTotal,
        completed: theater ? false : draft!.completed,
      },
      spaceIds: draft!.spaceIds,
      participantAccountIds: draft!.participantAccountIds,
      rating: draft!.rating,
      headline: draft!.headline.trim() || null,
      review: draft!.content.trim() || null,
      hasSpoiler: draft!.hasSpoiler,
      // Blind reveal only means something when someone else can see the review.
      isBlind: shared && draft!.isBlind,
      memoryNote: draft!.memoryNote.trim() || null,
      photoIds: photoItems.flatMap((item) => (item.photo ? [item.photo.id] : [])),
    };
    try {
      // Companions are only asked when the record is created; an edit never re-sends requests.
      const changes: Partial<WatchEventWritePayload> = { ...payload };
      delete changes.participantAccountIds;
      const result = editId
        ? await updateWatchEvent(editId, changes)
        : await createWatchEvent(payload);
      sessionStorage.removeItem(key);
      router.replace(
        `/records/${result.id}?returnTo=${encodeURIComponent(shared ? '/' : '/me')}&saved=${shared ? 'space' : 'private'}`,
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '기록을 저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }

  if (step === 'find' && !editId)
    return (
      <CoreAppShell>
        <h1 className="page-title">어떤 작품을 봤나요?</h1>
        <p className="page-description">제목을 검색한 뒤 작품 정보를 확인해 주세요.</p>
        <div className="mt-6">
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
          {mediaType === 'MOVIE'
            ? '영화만 검색하고 있어요.'
            : mediaType === 'TV'
              ? '드라마만 검색하고 있어요.'
              : '영화와 드라마를 함께 검색하고 있어요.'}
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
                    {busy ? '상세 불러오는 중…' : '작품 상세 보기'}
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
        {detailPreview ? (
          <MediaDetailModal
            media={detailPreview}
            isOpen
            onClose={() => {
              setDetailPreview(null);
              if (window.history.length > 1) router.back();
              else router.replace('/records/new?step=find');
            }}
            returnTo={`/records/new?step=find&detail=${detailPreview.id}`}
            onRecord={() => {
              const selectedId = detailPreview.id;
              setDetailPreview(null);
              router.push(
                `/records/new?mediaId=${encodeURIComponent(selectedId)}&returnTo=${encodeURIComponent(`/records/new?step=find&detail=${selectedId}`)}`,
              );
            }}
          />
        ) : null}
      </CoreAppShell>
    );

  return (
    <TaskShell
      title={editId ? '기록 수정' : '기록 작성'}
      fallback={editId ? `/records/${editId}` : '/'}
    >
      <div className="record-compose-flow">
        <section className="record-compose-media core-card p-3">
          <div className="flex gap-3">
            <Poster
              url={draft.selected?.posterUrl ?? null}
              title={draft.selected?.title ?? '선택 작품'}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-black text-[var(--heading)]">
                {draft.selected?.title ?? '작품을 선택해 주세요'}
              </h1>
              <p className="record-compose-media-type">
                {draft.selected?.mediaType === 'TV' ? '드라마' : '영화'}
              </p>
              {!editId ? (
                <button
                  className="secondary-button mt-3"
                  onClick={() => {
                    setStep('find');
                    setDraft({ ...draft, selected: null });
                    router.replace('/records/new?step=find');
                  }}
                >
                  작품 바꾸기
                </button>
              ) : null}
            </div>
          </div>
        </section>
        <section className="record-compose-panel mt-4">
          <PhotoPicker uploads={photoUploads} />
        </section>
        <section className="record-compose-panel mt-4">
          <div>
            <span className="field-label">어디서 봤나요? *</span>
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
            <div className="mt-4">
              <ChoiceChips
                legend="OTT 서비스 (선택)"
                options={OTT_SERVICES.map((service) => ({ value: service, label: service }))}
                value={OTT_SERVICES.includes(draft.providerName) ? draft.providerName : null}
                onChange={(value) => setDraft({ ...draft, providerName: value ?? '' })}
              />
              <label className="mt-2 block">
                <span className="sr-only">다른 OTT 서비스 이름</span>
                <input
                  className="date-input"
                  maxLength={80}
                  placeholder="목록에 없으면 직접 입력"
                  value={OTT_SERVICES.includes(draft.providerName) ? '' : draft.providerName}
                  onChange={(event) => setDraft({ ...draft, providerName: event.target.value })}
                />
              </label>
            </div>
          ) : null}
          {draft.sourceKind === 'THEATER' ? (
            <div className="mt-4 space-y-4">
              <ChoiceChips
                legend="상영 형식 (선택)"
                options={(Object.keys(THEATER_FORMAT_LABELS) as TheaterFormat[]).map((format) => ({
                  value: format,
                  label: THEATER_FORMAT_LABELS[format],
                }))}
                value={draft.theaterFormat}
                onChange={(value) => setDraft({ ...draft, theaterFormat: value })}
              />
              <label className="block">
                <span className="field-label">좌석 (선택)</span>
                <input
                  className="date-input"
                  maxLength={40}
                  placeholder="예: H열 12, 13"
                  value={draft.seatText}
                  onChange={(event) => setDraft({ ...draft, seatText: event.target.value })}
                />
              </label>
            </div>
          ) : null}
          {draft.sourceKind &&
          draft.sourceKind !== 'THEATER' &&
          draft.selected?.mediaType === 'TV' ? (
            <div className="mt-4">
              {continuedFrom?.episodeWatched && !editId ? (
                <p className="record-compose-helper" role="status">
                  지난 기록에서 {continuedFrom.episodeWatched}화까지 봐서{' '}
                  {continuedFrom.completed ? '끝까지 본 상태예요.' : '다음 화부터 이어서 적었어요.'}
                </p>
              ) : null}
              <SeriesProgress
                watched={draft.episodeWatched}
                total={draft.episodeTotal}
                completed={draft.completed}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    episodeWatched: value.watched,
                    episodeTotal: value.total,
                    completed: value.completed,
                  })
                }
              />
            </div>
          ) : null}
          {draft.sourceKind ? (
            <label className="mt-4 block">
              <span className="field-label">
                {draft.sourceKind === 'THEATER' ? '극장 이름 (선택)' : '장소 (선택)'}
              </span>
              <input
                className="date-input"
                maxLength={160}
                placeholder={
                  draft.sourceKind === 'THEATER' ? '예: 대한극장 3관' : '예: 우리 집 거실'
                }
                value={draft.placeText}
                onChange={(event) => setDraft({ ...draft, placeText: event.target.value })}
              />
            </label>
          ) : (
            <p className="record-compose-helper">
              경로를 선택하면 서비스와 장소를 더 입력할 수 있어요.
            </p>
          )}
          <label className="mt-4 block">
            <span className="field-label">본 날짜 *</span>
            <input
              className="date-input"
              type="date"
              max={today()}
              value={draft.watchedDate}
              onChange={(event) => setDraft({ ...draft, watchedDate: event.target.value })}
            />
          </label>
        </section>
        <section className="record-compose-panel mt-4">
          <fieldset>
            <legend className="field-label">별점 (선택)</legend>
            <WatchRatingControl
              value={draft.rating}
              onChange={(rating) => setDraft({ ...draft, rating })}
              name="record-rating"
            />
          </fieldset>
          <div className="mt-4">
            <CountedField
              label="한줄평 (선택)"
              max={WATCH_HEADLINE_MAX_LENGTH}
              placeholder="한 문장으로 남겨 보세요"
              value={draft.headline}
              onChange={(headline) => setDraft({ ...draft, headline })}
            />
          </div>
          <div className="mt-4">
            <CountedField
              label="소감 (선택)"
              multiline
              max={WATCH_REVIEW_MAX_LENGTH}
              placeholder="기억하고 싶은 장면이나 느낌을 자유롭게 남겨 보세요."
              value={draft.content}
              onChange={(content) => setDraft({ ...draft, content })}
            />
          </div>
          <div className="mt-4">
            <ToggleSwitch
              label="스포일러 포함"
              description="켜면 목록에서 내용이 가려지고, 눌러야 보여요."
              checked={draft.hasSpoiler}
              onChange={(hasSpoiler) => setDraft({ ...draft, hasSpoiler })}
            />
          </div>
        </section>
        <section className="core-card mt-5 p-4" aria-labelledby="share-scope-title">
          <h2 id="share-scope-title" className="section-title">
            어디에 남길까요? *
          </h2>
          <p className="page-description">
            지금 보고 있는 공간이 기본으로 선택돼요. 나만 보려면 개인 기록을 고르세요. 새 공간에
            가입해도 과거 기록은 자동으로 공유되지 않아요.
          </p>
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
                          participantAccountIds: draft.participantAccountIds.filter((id) =>
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
          {draft.spaceIds.length > 0 ? (
            <div className="mt-4">
              <ToggleSwitch
                label="상대가 리뷰를 쓰면 공개(블라인드)"
                description="함께 본 사람이 이 기록에 리뷰를 남기기 전까지 내 별점·한줄평·소감이 가려져요."
                checked={draft.isBlind}
                onChange={(isBlind) => setDraft({ ...draft, isBlind })}
              >
                {draft.isBlind ? (
                  <p className="composer-switch-preview">
                    상대에게는 &lsquo;리뷰가 잠겨 있어요 · 내 리뷰를 남기면 열려요&rsquo;로 보여요.
                  </p>
                ) : null}
              </ToggleSwitch>
            </div>
          ) : null}
        </section>
        {draft.spaceIds.length > 0 && !editId ? (
          <fieldset className="core-card mt-4 p-4">
            <legend className="section-title px-1">함께 본 사람</legend>
            <p className="page-description">
              선택한 사람에게 &lsquo;함께 봤어요&rsquo; 확인 요청이 가요. 상대가 확인하면 각자
              별점과 리뷰를 남길 수 있어요.
            </p>
            {participantOptions.length === 1 ? (
              <p className="record-compose-helper">
                둘이 쓰는 공간이라 상대를 미리 골라 뒀어요. 혼자 봤다면 선택을 풀어 주세요.
              </p>
            ) : null}
            {participantOptions.length ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {participantOptions.map((member) => (
                  <label
                    key={member.accountId}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 text-sm font-bold shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={draft.participantAccountIds.includes(member.accountId)}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          participantAccountIds: event.target.checked
                            ? [...new Set([...draft.participantAccountIds, member.accountId])]
                            : draft.participantAccountIds.filter((id) => id !== member.accountId),
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
        <section className="record-compose-panel mt-4">
          <CountedField
            label={draft.spaceIds.length ? '추억 메모 · 공간 사람만 봐요' : '추억 메모 · 나만 봐요'}
            multiline
            rows={3}
            max={WATCH_MEMORY_NOTE_MAX_LENGTH}
            placeholder="그날의 데이트를 적어 두세요. 예: 팝콘 반반 먹고 근처 국밥집"
            value={draft.memoryNote}
            onChange={(memoryNote) => setDraft({ ...draft, memoryNote })}
          />
        </section>
        {error ? (
          <p className="form-error mt-4" role="alert">
            {error}
          </p>
        ) : null}
        {photoUploads.uploadingCount > 0 ? (
          <p className="record-compose-note mt-4" role="status">
            사진 {photoUploads.uploadingCount}장을 올리는 중이에요. 저장을 누르면 다 올라간 뒤에
            저장돼요.
          </p>
        ) : null}
        <p className="record-compose-note mt-4">
          같은 작품을 다시 봤다면 날짜와 감상 경로가 같은 경우에도 새 감상으로 저장돼요.
        </p>
        <button
          className="commit-button sticky-commit mt-5"
          disabled={busy || !draft.selected || !draft.sourceKind || !draft.watchedDate}
          onClick={() => save()}
        >
          {waitingForPhotos
            ? '사진을 올리는 중… 끝나면 저장돼요'
            : busy
              ? '저장 중…'
              : !draft.sourceKind
                ? '감상 경로를 선택해 주세요'
                : editId
                  ? '수정 내용 저장하기'
                  : draft.spaceIds.length === 0
                    ? '개인 기록으로 저장하기'
                    : draft.spaceIds.length === 1
                      ? `${spaces.find((space) => space.id === draft.spaceIds[0])?.name ?? '선택한 공간'}에 공유하기`
                      : `공간 ${draft.spaceIds.length}곳에 공유하기`}
        </button>
      </div>
    </TaskShell>
  );
}
