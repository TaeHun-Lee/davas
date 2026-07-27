import type { MediaType, ViewingMethod } from '@davas/shared';

export type RecordListFilters = {
  q?: string;
  mediaType?: MediaType;
  viewingMethod?: ViewingMethod;
};

export type RecordListFailureMode = 'initial' | 'pagination';

export function recordListRequestIsCurrent(
  requestGeneration: number,
  currentGeneration: number,
): boolean {
  return requestGeneration === currentGeneration;
}

export function recordListFailureMode(isPagination: boolean): RecordListFailureMode {
  return isPagination ? 'pagination' : 'initial';
}

export function recordListReturnTo(scope: 'friends' | 'mine', filters: RecordListFilters): string {
  if (!filters.q && !filters.mediaType && !filters.viewingMethod) {
    return scope === 'mine' ? '/me' : '/';
  }

  const params = new URLSearchParams({ scope });
  if (filters.q) params.set('q', filters.q);
  if (filters.mediaType) params.set('mediaType', filters.mediaType);
  if (filters.viewingMethod) params.set('viewingMethod', filters.viewingMethod);
  return `/search?${params.toString()}`;
}
