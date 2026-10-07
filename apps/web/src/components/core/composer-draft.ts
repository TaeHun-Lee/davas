import type { SpaceView } from '@davas/shared';
import type { MediaDetail, SelectedMedia } from '../../lib/api/media';
import { getWatchProgress, type WatchProgress } from '../../lib/api/memories';
import type { TheaterFormat, WatchPhotoView, WatchSourceKind } from '../../lib/api/watch-events';
import { chooseActiveSpace, defaultWatchPartners, readActiveSpaceId } from '../spaces/space-ui';

// Draft rules for the record composer, kept free of React so they can be tested directly.

export type Draft = {
  selected: SelectedMedia | null;
  sourceKind: WatchSourceKind | null;
  providerName: string;
  placeText: string;
  watchedDate: string;
  rating: number | null;
  /** 한줄평 */
  headline: string;
  /** 소감 */
  content: string;
  hasSpoiler: boolean;
  isBlind: boolean;
  memoryNote: string;
  theaterFormat: TheaterFormat | null;
  seatText: string;
  episodeWatched: number | null;
  episodeTotal: number | null;
  completed: boolean;
  spaceIds: string[];
  participantAccountIds: string[];
  /** Photos already uploaded; kept so a reloaded draft does not lose them. */
  photos: WatchPhotoView[];
  /** Media id the series fields were last filled in for, so a resume does not redo it. */
  seriesPrefilledFor: string | null;
};
/** Today in Korea, as `YYYY-MM-DD`. */
export const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
export const freshDraft = (): Draft => ({
  selected: null,
  sourceKind: null,
  providerName: '',
  placeText: '',
  watchedDate: today(),
  rating: null,
  headline: '',
  content: '',
  hasSpoiler: false,
  isBlind: false,
  memoryNote: '',
  theaterFormat: null,
  seatText: '',
  episodeWatched: null,
  episodeTotal: null,
  completed: false,
  spaceIds: [],
  participantAccountIds: [],
  photos: [],
  seriesPrefilledFor: null,
});

/**
 * A new record starts in the space the user is looking at, with the partner of a two-person
 * space preselected. Both stay visible and can be changed before saving.
 */
export function draftWithDefaults(spaces: SpaceView[] | null, accountId: string): Draft {
  const draft = freshDraft();
  const space = spaces ? chooseActiveSpace(spaces, readActiveSpaceId()) : null;
  if (space) {
    draft.spaceIds = [space.id];
    draft.participantAccountIds = defaultWatchPartners(space, accountId);
  }
  return draft;
}

export const asSelected = (media: MediaDetail): SelectedMedia => ({
  ...media,
  externalProvider: media.externalProvider,
  genreIds: media.genreIds ?? [],
});

export function readSavedDraft(storageKey: string) {
  const saved = sessionStorage.getItem(storageKey);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as Partial<Draft> & { viewingMethod?: 'THEATER' | 'OTT' };
    return {
      ...freshDraft(),
      ...parsed,
      sourceKind: parsed.sourceKind ?? parsed.viewingMethod ?? null,
      spaceIds: parsed.spaceIds ?? [],
      participantAccountIds: parsed.participantAccountIds ?? [],
      photos: parsed.photos ?? [],
      seriesPrefilledFor: parsed.seriesPrefilledFor ?? null,
    } satisfies Draft;
  } catch {
    sessionStorage.removeItem(storageKey);
    return null;
  }
}

/**
 * A new record of a series carries on from the latest one: same service, the next episode,
 * and the series' episode count. Returns the progress it continued from, for the hint.
 */
export async function continueSeries(
  draft: Draft,
  media: MediaDetail,
  loadProgress: (mediaId: string) => Promise<WatchProgress | null> = getWatchProgress,
) {
  const previous = draft.seriesPrefilledFor;
  draft.seriesPrefilledFor = media.id;
  if (previous && previous !== media.id) {
    // Episode numbers written for another title do not carry over to this one.
    draft.episodeWatched = null;
    draft.episodeTotal = null;
    draft.completed = false;
  }
  if (media.mediaType !== 'TV') return null;
  draft.episodeTotal = draft.episodeTotal ?? media.numberOfEpisodes ?? null;
  const progress = await loadProgress(media.id).catch(() => null);
  if (!progress) return null;
  // Only fill what is still empty, so anything the user already chose stays.
  draft.sourceKind = draft.sourceKind ?? progress.sourceKind;
  draft.providerName = draft.providerName || progress.providerName || '';
  draft.episodeTotal = draft.episodeTotal ?? progress.episodeTotal;
  if (draft.episodeWatched === null && progress.episodeWatched && !progress.completed) {
    const next = progress.episodeWatched + 1;
    draft.episodeWatched = draft.episodeTotal ? Math.min(next, draft.episodeTotal) : next;
  }
  return progress;
}

/**
 * The line under the episode stepper, as on the C안 board: where this record leaves the
 * series and where the next one will pick up (`continueSeries` fills in the next episode).
 */
export function seriesProgressSummary(
  watched: number | null,
  total: number | null,
  completed: boolean,
) {
  if (completed) return total ? `전체 ${total}화를 끝까지 다 봤어요.` : '끝까지 다 봤어요.';
  if (!watched) return null;
  const where = total ? `전체 ${total}화 중 ${watched}화` : `${watched}화까지`;
  return total && watched >= total
    ? where
    : `${where} · 다음 기록 때 ${watched + 1}화부터 이어서 적을 수 있어요.`;
}

/**
 * The tab keeps one unsaved create draft. It comes back only for the same title, or when it is
 * still waiting for one (작품 바꾸기 keeps what was written); a different title starts clean so
 * photos and notes never move to the wrong record.
 */
export function canResumeDraft(
  saved: Pick<Draft, 'selected'> | null,
  requestedMediaId: string | null,
): saved is Draft {
  return Boolean(
    saved && (!requestedMediaId || !saved.selected || saved.selected.id === requestedMediaId),
  );
}
