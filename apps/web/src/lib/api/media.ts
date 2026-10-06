import type {
  MediaDetail,
  MediaSelectionResponse,
  MediaSearchResponse,
  MediaSearchResult,
  MediaSearchType,
} from '@davas/shared';
import { coreFetch } from './core';

export type {
  MediaDetail,
  MediaSearchResponse,
  MediaSearchResult,
  MyMediaDiary,
  SelectedMedia,
} from '@davas/shared';

export function searchMedia({
  query,
  type = 'multi',
  page = 1,
  language = 'ko-KR',
}: {
  query: string;
  type?: MediaSearchType;
  page?: number;
  language?: string;
}) {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('type', type);
  params.set('page', String(page));
  params.set('language', language);
  return coreFetch<MediaSearchResponse>(`/media/search?${params.toString()}`);
}

function toMediaSelectionPayload(selection: MediaSearchResult) {
  return {
    externalProvider: selection.externalProvider,
    externalId: selection.externalId,
    mediaType: selection.mediaType,
  } as const;
}

export async function selectMedia(selection: MediaSearchResult) {
  const selected = await coreFetch<MediaSelectionResponse>('/media/selections', {
    method: 'POST',
    body: JSON.stringify(toMediaSelectionPayload(selection)),
  });
  return selected;
}

export function getMediaDetail(id: string) {
  return coreFetch<MediaDetail>(`/media/${encodeURIComponent(id)}`);
}
