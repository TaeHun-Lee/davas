export type MediaSearchResult = {
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: 'MOVIE' | 'TV';
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  genreIds: number[];
  country: string | null;
};

export type MediaSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: MediaSearchResult[];
};

export type SelectedMedia = MediaSearchResult & {
  id: string;
  genres?: string[];
};

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

export async function searchMedia({
  query,
  type = 'multi',
  page = 1,
  language = 'ko-KR',
}: {
  query: string;
  type?: 'movie' | 'tv' | 'multi';
  page?: number;
  language?: string;
}) {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('type', type);
  params.set('page', String(page));
  params.set('language', language);

  const response = await fetch(`${getApiBaseUrl()}/media/search?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('media search failed');
  }

  return (await response.json()) as MediaSearchResponse;
}

export async function selectMedia(selection: MediaSearchResult) {
  const response = await fetch(`${getApiBaseUrl()}/media/selections`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selection),
  });

  if (!response.ok) {
    throw new Error('media selection failed');
  }

  const selected = (await response.json()) as SelectedMedia;
  return {
    ...selection,
    ...selected,
    genreIds: selection.genreIds,
  } as SelectedMedia;
}
