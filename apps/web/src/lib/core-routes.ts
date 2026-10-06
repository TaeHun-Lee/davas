const CORE_ORIGIN = 'https://davas.invalid';
const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/;

function hasOnlySingleValueParams(params: URLSearchParams, allowed: ReadonlySet<string>) {
  for (const key of params.keys()) {
    if (!allowed.has(key) || params.getAll(key).length !== 1) return false;
  }
  return true;
}

function isSafeSearchQuery(params: URLSearchParams) {
  const allowed = new Set(['scope', 'q', 'mediaType', 'viewingMethod']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const scope = params.get('scope');
  const mediaType = params.get('mediaType');
  const viewingMethod = params.get('viewingMethod');
  return (
    (scope === 'friends' || scope === 'mine') &&
    (mediaType === null || mediaType === 'MOVIE' || mediaType === 'TV') &&
    (viewingMethod === null || viewingMethod === 'THEATER' || viewingMethod === 'OTT')
  );
}

function isSafeRecordListReturnTo(value: string) {
  if (value === '/' || value === '/me') return true;
  if (!value.startsWith('/search?')) return false;

  const url = new URL(value, CORE_ORIGIN);
  return (
    url.origin === CORE_ORIGIN && url.pathname === '/search' && isSafeSearchQuery(url.searchParams)
  );
}

function isSafeNewRecordQuery(params: URLSearchParams) {
  const allowed = new Set(['mediaId', 'step']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const mediaId = params.get('mediaId');
  const step = params.get('step');
  return (
    (mediaId === null || SAFE_SEGMENT.test(mediaId)) &&
    (step === null || step === 'write') &&
    (mediaId !== null || step !== null)
  );
}

function isSafeRecordDetailQuery(params: URLSearchParams) {
  const allowed = new Set(['returnTo', 'saved']);
  if (!hasOnlySingleValueParams(params, allowed)) return false;

  const returnTo = params.get('returnTo');
  const saved = params.get('saved');
  return (
    (returnTo === null || isSafeRecordListReturnTo(returnTo)) &&
    (saved === null || saved === 'private' || saved === 'friends')
  );
}

export function isSafeCoreReturnTo(value: string | null | undefined): value is string {
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
  if (
    pathname === '/' ||
    pathname === '/me' ||
    pathname === '/friends' ||
    pathname === '/settings'
  ) {
    return searchParams.size === 0;
  }
  if (pathname === '/search') return isSafeSearchQuery(searchParams);
  if (pathname === '/records/new') {
    return searchParams.size === 0 || isSafeNewRecordQuery(searchParams);
  }

  const recordMatch = pathname.match(/^\/records\/([A-Za-z0-9_-]+)(\/edit)?$/);
  if (recordMatch) {
    if (recordMatch[2]) return searchParams.size === 0;
    return searchParams.size === 0 || isSafeRecordDetailQuery(searchParams);
  }

  const inviteMatch = pathname.match(/^\/friends\/invite\/([A-Za-z0-9_-]+)$/);
  return Boolean(inviteMatch) && searchParams.size === 0;
}

export function safeCoreReturnTo(value: string | null | undefined, fallback: string): string {
  return isSafeCoreReturnTo(value) ? value : fallback;
}
