'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  type MediaType,
  seoulToday,
  type SpaceView,
  WATCH_HEADLINE_MAX_LENGTH,
  WATCH_MEMORY_NOTE_MAX_LENGTH,
  WATCH_PHOTO_MAX_COUNT,
  WATCH_PLACE_MAX_LENGTH,
  WATCH_PROVIDER_NAME_MAX_LENGTH,
  WATCH_REVIEW_MAX_LENGTH,
  WATCH_SEAT_MAX_LENGTH,
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
  type Draft,
} from './composer-draft';
import { mediaTypeLabel } from '../../lib/api/core';

const sourceLabels: Record<WatchSourceKind, string> = {
  THEATER: '극장',
  OTT: 'OTT',
  TV_OWNED: 'TV·소장',
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
          className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-bold has-[:checked]:bg-[var(--blue-soft)] has-[:checked]:text-[var(--blue-ink)]"
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
  const [shareOpen, setShareOpen] = useState(false);
  // Companions may have added photos to the record being edited; they count toward its ten.
  const [otherPhotoCount, setOtherPhotoCount] = useState(0);
  // Bumped by "다시 시도" to run the first load again after it failed.
  const [loadAttempt, setLoadAttempt] = useState(0);
  const photoUploads = useWatchPhotoUploads(WATCH_PHOTO_MAX_COUNT - otherPhotoCount);
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
          // Only the author's own photos are theirs to edit here.
          const ownPhotos = record.photos.filter(
            (photo) => photo.uploaderAccountId === record.author.accountId,
          );
          setOtherPhotoCount(record.photos.length - ownPhotos.length);
          resetPhotos(ownPhotos);
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
              // Only its year is shown, on the title card.
              releaseDate: record.media.releaseYear ?? null,
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
            photos: ownPhotos,
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
  }, [detailMediaId, editId, mediaId, resetPhotos, loadAttempt]);
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
        title={editId ? '기록 수정' : '기록 남기기'}
        fallback={editId ? `/records/${editId}` : '/'}
      >
        {error ? (
          <>
            <p className="form-error" role="alert">
              {error}
            </p>
            <button
              type="button"
              className="primary-button mt-3 w-full"
              onClick={() => {
                setError('');
                setLoadAttempt((value) => value + 1);
              }}
            >
              다시 시도
            </button>
          </>
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
        // The service field is only shown for OTT; a name left from before switching stays out.
        providerName: draft!.sourceKind === 'OTT' ? draft!.providerName.trim() || null : null,
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
      // Blind reveal only means something when someone watched along and can write a review.
      isBlind: shared && draft!.participantAccountIds.length > 0 && draft!.isBlind,
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
                  <span className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-bold text-[var(--blue-ink)]">
                    {mediaTypeLabel(item.mediaType)}
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

  const sharedSpaces = spaces.filter((space) => draft.spaceIds.includes(space.id));
  const shareSummary = !draft.spaceIds.length
    ? '나만 보기'
    : draft.spaceIds.length === 1 && sharedSpaces.length === 1
      ? sharedSpaces[0].name
      : `공간 ${draft.spaceIds.length}곳`;
  const memberNames = new Map(
    spaces.flatMap((space) => space.members).map((member) => [member.accountId, member.nickname]),
  );
  const myName = memberNames.get(userId) || '';
  // Me first, then up to two of the people the record is shared with.
  const shareFaces = [
    { accountId: userId, initial: (myName || '나').slice(0, 1), me: true },
    ...participantOptions.slice(0, 2).map((member) => ({
      accountId: member.accountId,
      initial: (member.nickname || '공').slice(0, 1),
      me: false,
    })),
  ];
  const companionNames = draft.participantAccountIds
    .map((id) => memberNames.get(id) || '공간 멤버')
    .join(', ');
  const series = draft.selected?.mediaType === 'TV';
  const mediaFacts = [
    series ? '드라마' : '영화',
    draft.selected?.releaseDate?.slice(0, 4),
    series && draft.episodeTotal ? `전체 ${draft.episodeTotal}화` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const theater = draft.sourceKind === 'THEATER';
  const placeField = draft.sourceKind ? (
    <label className="block">
      <span className="field-label">{theater ? '극장 이름 (선택)' : '장소 (선택)'}</span>
      <input
        className="date-input"
        maxLength={WATCH_PLACE_MAX_LENGTH}
        placeholder={theater ? '예: 대한극장 3관' : '예: 우리 집 거실'}
        value={draft.placeText}
        onChange={(event) => setDraft({ ...draft, placeText: event.target.value })}
      />
    </label>
  ) : null;

  return (
    <TaskShell
      title={editId ? '기록 수정' : '기록 남기기'}
      fallback={editId ? `/records/${editId}` : '/'}
    >
      <div className="record-compose-flow">
        <section className="record-compose-media">
          <Poster
            url={draft.selected?.posterUrl ?? null}
            title={draft.selected?.title ?? '선택 작품'}
          />
          <div className="min-w-0 flex-1">
            <h1>{draft.selected?.title ?? '작품을 선택해 주세요'}</h1>
            <p>{mediaFacts}</p>
          </div>
          {!editId ? (
            <button
              type="button"
              className="record-compose-change"
              onClick={() => {
                setStep('find');
                setDraft({ ...draft, selected: null });
                router.replace('/records/new?step=find');
              }}
            >
              작품 바꾸기
            </button>
          ) : null}
        </section>

        {/* Where it goes, as one line under the title; the choices open from it. */}
        <button
          type="button"
          className="record-compose-share"
          aria-expanded={shareOpen}
          aria-controls="share-options"
          onClick={() => setShareOpen((value) => !value)}
        >
          <span className="record-compose-share-label">공유할 곳</span>
          <span className="record-compose-share-faces" aria-hidden="true">
            {(draft.spaceIds.length ? shareFaces : shareFaces.slice(0, 1)).map((face) => (
              <span key={face.accountId} data-me={face.me || undefined}>
                {face.initial}
              </span>
            ))}
          </span>
          <strong>{shareSummary}</strong>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
        {shareOpen ? (
          <div id="share-options" className="record-compose-card mt-2">
            <p className="record-compose-helper">
              지금 보고 있는 공간이 기본으로 선택돼요. 새 공간에 가입해도 과거 기록은 자동으로
              공유되지 않아요.
            </p>
            {spaces.length ? (
              <fieldset>
                <legend className="field-label">공간에 공유</legend>
                <div className="space-y-2">
                  {spaces.map((space) => (
                    <label key={space.id} className="record-compose-space">
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
                      <small>{space.members.length}명</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p className="record-compose-helper">
                {spacesError
                  ? '공간 목록을 불러오지 못했어요. 개인 기록으로는 저장할 수 있어요.'
                  : '참여 중인 공간이 없어요. 개인 기록으로 저장돼요.'}
              </p>
            )}
            <button
              type="button"
              aria-pressed={draft.spaceIds.length === 0}
              className="record-compose-private"
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
          </div>
        ) : null}

        <label className="record-compose-section block">
          <span className="record-compose-title">본 날짜</span>
          <input
            className="date-input"
            type="date"
            max={seoulToday()}
            value={draft.watchedDate}
            onChange={(event) => setDraft({ ...draft, watchedDate: event.target.value })}
          />
        </label>

        <div className="record-compose-section">
          <span className="record-compose-title">어디서 봤나요?</span>
          <SourceKindControl
            value={draft.sourceKind}
            onChange={(value) => setDraft({ ...draft, sourceKind: value })}
          />
          {draft.sourceKind === null && editId ? (
            <p className="form-error mt-2">
              이전 기록에는 감상 경로가 없어요. 수정하려면 선택해 주세요.
            </p>
          ) : null}
          {draft.sourceKind ? (
            <div className="record-compose-card mt-3">
              {theater ? (
                <>
                  {placeField}
                  <ChoiceChips
                    legend="상영 형식 (선택)"
                    columns={4}
                    options={(Object.keys(THEATER_FORMAT_LABELS) as TheaterFormat[]).map(
                      (format) => ({
                        value: format,
                        label: THEATER_FORMAT_LABELS[format],
                      }),
                    )}
                    value={draft.theaterFormat}
                    onChange={(value) => setDraft({ ...draft, theaterFormat: value })}
                  />
                  <label className="block">
                    <span className="field-label">좌석 (선택)</span>
                    <input
                      className="date-input"
                      maxLength={WATCH_SEAT_MAX_LENGTH}
                      placeholder="예: H열 12, 13"
                      value={draft.seatText}
                      onChange={(event) => setDraft({ ...draft, seatText: event.target.value })}
                    />
                  </label>
                </>
              ) : (
                <>
                  {draft.sourceKind === 'OTT' ? (
                    <div>
                      <ChoiceChips
                        legend="서비스 (선택)"
                        columns={3}
                        options={OTT_SERVICES.map((service) => ({
                          value: service,
                          label: service,
                        }))}
                        value={
                          OTT_SERVICES.includes(draft.providerName) ? draft.providerName : null
                        }
                        onChange={(value) => setDraft({ ...draft, providerName: value ?? '' })}
                      />
                      <label className="mt-2 block">
                        <span className="sr-only">다른 OTT 서비스 이름</span>
                        <input
                          className="date-input"
                          maxLength={WATCH_PROVIDER_NAME_MAX_LENGTH}
                          placeholder="목록에 없으면 직접 입력"
                          value={
                            OTT_SERVICES.includes(draft.providerName) ? '' : draft.providerName
                          }
                          onChange={(event) =>
                            setDraft({ ...draft, providerName: event.target.value })
                          }
                        />
                      </label>
                    </div>
                  ) : null}
                  {series ? (
                    <div>
                      {continuedFrom?.episodeWatched && !editId ? (
                        <p className="record-compose-helper record-compose-continued" role="status">
                          지난 기록에서 {continuedFrom.episodeWatched}화까지 봐서{' '}
                          {continuedFrom.completed
                            ? '끝까지 본 상태예요.'
                            : '다음 화부터 이어서 적었어요.'}
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
                  {placeField}
                </>
              )}
            </div>
          ) : (
            <p className="record-compose-helper">
              경로를 선택하면 서비스와 장소를 더 입력할 수 있어요.
            </p>
          )}
        </div>

        {draft.spaceIds.length > 0 && !editId ? (
          <fieldset className="record-compose-section">
            <legend className="record-compose-title">함께 본 사람 (선택)</legend>
            {participantOptions.length ? (
              <div className="companion-chips">
                {participantOptions.map((member) => {
                  const picked = draft.participantAccountIds.includes(member.accountId);
                  return (
                    <label key={member.accountId} className="companion-chip">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={picked}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            participantAccountIds: event.target.checked
                              ? [...new Set([...draft.participantAccountIds, member.accountId])]
                              : draft.participantAccountIds.filter((id) => id !== member.accountId),
                          })
                        }
                      />
                      <span className="companion-chip-avatar" aria-hidden="true">
                        {(member.nickname || '공').slice(0, 1)}
                      </span>
                      {member.nickname || '공간 멤버'}
                      {picked ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="record-compose-helper">요청할 다른 공간 멤버가 없어요.</p>
            )}
            {participantOptions.length ? (
              <p className="record-compose-helper">
                {draft.participantAccountIds.length
                  ? `저장하면 ${companionNames}님에게 함께 봤는지 확인을 요청해요. 혼자 봤다면 선택을 풀어 주세요.`
                  : '고른 사람에게 함께 봤는지 확인을 요청해요. 상대가 확인하면 각자 별점과 리뷰를 남길 수 있어요.'}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        <fieldset className="record-compose-section">
          <legend className="record-compose-title">별점 (선택)</legend>
          <WatchRatingControl
            value={draft.rating}
            onChange={(rating) => setDraft({ ...draft, rating })}
            name="record-rating"
          />
          {series && !draft.completed ? (
            <p className="record-compose-helper">드라마는 다 본 뒤에 매겨도 돼요.</p>
          ) : null}
        </fieldset>
        <div className="record-compose-section">
          <CountedField
            label="한줄평 (선택)"
            max={WATCH_HEADLINE_MAX_LENGTH}
            placeholder="한 문장으로 남겨 보세요"
            value={draft.headline}
            onChange={(headline) => setDraft({ ...draft, headline })}
          />
        </div>
        <div className="record-compose-section">
          <CountedField
            label="소감 (선택)"
            multiline
            max={WATCH_REVIEW_MAX_LENGTH}
            placeholder={
              series && draft.episodeWatched && !draft.completed
                ? `${draft.episodeWatched}화까지 보고 느낀 점을 적어 보세요`
                : '기억하고 싶은 장면이나 느낌을 자유롭게 남겨 보세요.'
            }
            value={draft.content}
            onChange={(content) => setDraft({ ...draft, content })}
          />
        </div>
        <div className="record-compose-section record-compose-switch">
          <ToggleSwitch
            label="스포일러 포함"
            description="켜면 목록에서 내용이 가려지고, 눌러야 보여요."
            checked={draft.hasSpoiler}
            onChange={(hasSpoiler) => setDraft({ ...draft, hasSpoiler })}
          />
        </div>
        {draft.spaceIds.length > 0 && draft.participantAccountIds.length > 0 ? (
          <div className="record-compose-switch record-compose-blind mt-3">
            <ToggleSwitch
              label="상대가 리뷰를 쓰면 공개(블라인드)"
              description={
                draft.isBlind
                  ? `${companionNames}님이 이 기록에 리뷰를 남기기 전까지 내 별점·한줄평·소감이 가려져요.`
                  : `꺼져 있으면 저장하는 즉시 ${companionNames}님에게 보여요.`
              }
              checked={draft.isBlind}
              onChange={(isBlind) => setDraft({ ...draft, isBlind })}
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
                </svg>
              }
            >
              {draft.isBlind ? (
                <p className="composer-switch-preview">
                  {companionNames}님에게는 &lsquo;
                  {myName ? `${myName}님 리뷰가 잠겨 있어요` : '리뷰가 잠겨 있어요'}&rsquo;로
                  보여요.
                </p>
              ) : null}
            </ToggleSwitch>
          </div>
        ) : draft.spaceIds.length > 0 && !editId ? (
          <p className="record-compose-helper">
            위에서 함께 본 사람을 고르면 블라인드 공개를 켤 수 있어요.
          </p>
        ) : null}
        <div className="record-compose-section">
          <CountedField
            label="추억 메모"
            badge={
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5Z" />
                </svg>
                {draft.spaceIds.length ? '공간 사람만 봐요' : '나만 봐요'}
              </>
            }
            tone="memo"
            multiline
            rows={3}
            max={WATCH_MEMORY_NOTE_MAX_LENGTH}
            placeholder="그날 있었던 일을 적어 두세요. 예: 팝콘 반반 먹고 근처 국밥집"
            value={draft.memoryNote}
            onChange={(memoryNote) => setDraft({ ...draft, memoryNote })}
          />
        </div>
        {/* Optional, so it comes after everything about the viewing itself. */}
        <div className="record-compose-section">
          <PhotoPicker uploads={photoUploads} />
        </div>
        {error ? (
          <p className="form-error mt-4" role="alert">
            {error}
          </p>
        ) : null}
        {editId ? null : (
          <p className="record-compose-note mt-6">
            같은 작품을 다시 봤다면 날짜와 감상 경로가 같은 경우에도 새 감상으로 저장돼요.
          </p>
        )}
        <div className="sticky-commit-bar">
          {photoUploads.uploadingCount > 0 ? (
            <p className="sticky-commit-status" role="status">
              사진 {photoUploads.uploadingCount}장을 올리는 중이에요. 저장을 누르면 다 올라간 뒤에
              저장돼요.
            </p>
          ) : null}
          <button
            className="commit-button"
            disabled={busy || !draft.selected || !draft.sourceKind || !draft.watchedDate}
            onClick={() => save()}
          >
            {waitingForPhotos
              ? '사진을 올리는 중… 끝나면 저장돼요'
              : busy
                ? '저장 중…'
                : !draft.sourceKind
                  ? '감상 경로를 선택해 주세요'
                  : !draft.watchedDate
                    ? '본 날짜를 골라 주세요'
                    : editId
                      ? '수정 내용 저장하기'
                      : draft.spaceIds.length === 0
                        ? '개인 기록으로 저장하기'
                        : draft.spaceIds.length === 1
                          ? `${spaces.find((space) => space.id === draft.spaceIds[0])?.name ?? '선택한 공간'}에 공유하기`
                          : `공간 ${draft.spaceIds.length}곳에 공유하기`}
          </button>
        </div>
      </div>
    </TaskShell>
  );
}
