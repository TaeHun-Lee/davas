import type { MediaSelectionResponse, RecordDetailData, ViewingMethod } from '@davas/shared';

export type DraftSelectedMedia = Pick<
  MediaSelectionResponse,
  'id' | 'mediaType' | 'title' | 'posterUrl'
>;

export type RecordDraft = {
  selected: DraftSelectedMedia | null;
  viewingMethod: ViewingMethod | null;
  watchedDate: string;
  rating: number | null;
  content: string;
  hasSpoiler: boolean;
  visibility: 'FRIENDS' | 'PRIVATE' | 'SELECTED';
  clientRequestId: string;
};

export type SavedDraftRestoreResult = {
  draft: RecordDraft | null;
  invalidStorage: boolean;
  preselectionError: boolean;
};

export const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export const freshDraft = (): RecordDraft => ({
  selected: null,
  viewingMethod: null,
  watchedDate: today(),
  rating: null,
  content: '',
  hasSpoiler: false,
  visibility: 'FRIENDS',
  clientRequestId: crypto.randomUUID(),
});

export function resolveCreateStep(draft: RecordDraft, mediaId: string | null): 'find' | 'write' {
  return mediaId || draft.selected ? 'write' : 'find';
}

export async function applyPreselectedMedia(
  draft: RecordDraft,
  mediaId: string | null,
  load: (id: string) => Promise<DraftSelectedMedia>,
): Promise<RecordDraft> {
  if (!mediaId) return draft;
  const media = await load(mediaId);
  return {
    ...draft,
    selected: media,
  };
}

export async function restoreSavedDraft(
  saved: string,
  mediaId: string | null,
  load: (id: string) => Promise<DraftSelectedMedia>,
): Promise<SavedDraftRestoreResult> {
  let restored: RecordDraft;
  try {
    restored = JSON.parse(saved) as RecordDraft;
  } catch {
    return { draft: null, invalidStorage: true, preselectionError: false };
  }

  try {
    return {
      draft: await applyPreselectedMedia(restored, mediaId, load),
      invalidStorage: false,
      preselectionError: false,
    };
  } catch {
    return { draft: restored, invalidStorage: false, preselectionError: true };
  }
}

export function draftStorageKey(userId: string, editId?: string) {
  return `davas:draft:${userId}:${editId ? 'edit' : 'create'}:${editId ?? 'new'}`;
}

export function savedDraftMatchesSubmission(storedDraft: string | null, submittedDraft: string) {
  return storedDraft === submittedDraft;
}

export function draftFromRecord(record: RecordDetailData): RecordDraft {
  return {
    selected: {
      id: record.media.id,
      mediaType: record.media.mediaType,
      title: record.media.title,
      posterUrl: record.media.posterUrl,
    },
    viewingMethod: record.viewingMethod,
    watchedDate: record.watchedDate,
    rating: record.rating,
    content: record.content,
    hasSpoiler: record.hasSpoiler,
    visibility: record.visibility,
    clientRequestId: crypto.randomUUID(),
  };
}
