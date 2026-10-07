// Allow-list for in-app `returnTo` targets. Anything not listed falls back, so a crafted
// link can never bounce a user to another origin or to an unexpected screen after login.
const CORE_ORIGIN = 'https://davas.invalid';
const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/;
const MAX_NESTED_RETURN_DEPTH = 2;

const PARAMLESS_PATHS = new Set([
  '/',
  '/me',
  '/explore',
  '/friends',
  '/settings',
  '/diary',
  '/spaces/wishes',
  '/notifications',
]);

function hasOnlySingleValueParams(params: URLSearchParams, allowed: ReadonlySet<string>) {
  for (const key of params.keys()) {
    if (!allowed.has(key) || params.getAll(key).length !== 1) return false;
  }
  return true;
}

function isSafeSearchQuery(params: URLSearchParams) {
  const allowed = new Set(['scope', 'q', 'mediaId', 'mediaType', 'viewingMethod', 'sourceKind']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const scope = params.get('scope');
  const mediaId = params.get('mediaId');
  const mediaType = params.get('mediaType');
  const viewingMethod = params.get('viewingMethod');
  const sourceKind = params.get('sourceKind');
  return (
    (scope === null || scope === 'friends' || scope === 'mine' || scope === 'space') &&
    (mediaId === null || SAFE_SEGMENT.test(mediaId)) &&
    (mediaType === null || mediaType === 'MOVIE' || mediaType === 'TV') &&
    (viewingMethod === null || viewingMethod === 'THEATER' || viewingMethod === 'OTT') &&
    (sourceKind === null || ['THEATER', 'OTT', 'TV_OWNED', 'OTHER'].includes(sourceKind))
  );
}

function isSafeSpacesQuery(params: URLSearchParams) {
  if (params.size === 0) return true;
  if (!hasOnlySingleValueParams(params, new Set(['view']))) return false;
  const view = params.get('view');
  return view === 'timeline' || view === 'recommend';
}

function isSafeNewRecordQuery(params: URLSearchParams, depth: number) {
  const allowed = new Set(['mediaId', 'step', 'detail', 'returnTo']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const mediaId = params.get('mediaId');
  const step = params.get('step');
  const detail = params.get('detail');
  const returnTo = params.get('returnTo');
  return (
    (mediaId === null || SAFE_SEGMENT.test(mediaId)) &&
    (step === null || step === 'find' || step === 'write') &&
    (detail === null || SAFE_SEGMENT.test(detail)) &&
    (returnTo === null || isSafeAtDepth(returnTo, depth + 1))
  );
}

function isSafeRecordDetailQuery(params: URLSearchParams, depth: number) {
  const allowed = new Set(['returnTo', 'saved']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const returnTo = params.get('returnTo');
  const saved = params.get('saved');
  return (
    (returnTo === null || isSafeAtDepth(returnTo, depth + 1)) &&
    (saved === null || saved === 'private' || saved === 'friends' || saved === 'space')
  );
}

function isSafeAtDepth(value: string | null | undefined, depth: number): value is string {
  if (depth > MAX_NESTED_RETURN_DEPTH) return false;
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    value.includes('#') ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(value, CORE_ORIGIN);
  } catch {
    return false;
  }
  if (url.origin !== CORE_ORIGIN) return false;
  if (/%2f|%5c/i.test(url.pathname)) return false;

  const { pathname, searchParams } = url;
  if (PARAMLESS_PATHS.has(pathname)) return searchParams.size === 0;
  if (pathname === '/search') return isSafeSearchQuery(searchParams);
  if (pathname === '/spaces') return isSafeSpacesQuery(searchParams);
  // 모아보기 opens on the year or, with `view=calendar`, on the calendar.
  if (pathname === '/spaces/memories') {
    return (
      searchParams.size === 0 ||
      (hasOnlySingleValueParams(searchParams, new Set(['view'])) &&
        searchParams.get('view') === 'calendar')
    );
  }
  if (pathname === '/records/new') {
    return searchParams.size === 0 || isSafeNewRecordQuery(searchParams, depth);
  }

  const recordMatch = pathname.match(/^\/records\/([A-Za-z0-9_-]+)(\/edit)?$/);
  if (recordMatch) {
    if (recordMatch[2]) return searchParams.size === 0;
    return searchParams.size === 0 || isSafeRecordDetailQuery(searchParams, depth);
  }

  return /^\/(?:friends|spaces)\/invite\/[A-Za-z0-9_-]+$/.test(pathname) && searchParams.size === 0;
}

export function isSafeCoreReturnTo(value: string | null | undefined): value is string {
  return isSafeAtDepth(value, 0);
}

export function safeCoreReturnTo(value: string | null | undefined, fallback: string): string {
  return isSafeCoreReturnTo(value) ? value : fallback;
}
