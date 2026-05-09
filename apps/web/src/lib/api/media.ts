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

export type PersonSearchResult = {
  id: string;
  name: string;
  profileUrl: string | null;
  knownForDepartment: string | null;
  knownFor: MediaSearchResult[];
};

export type PersonSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: PersonSearchResult[];
};

export type PersonCreditsResponse = {
  personId: string;
  items: MediaSearchResult[];
};

export type SelectedMedia = MediaSearchResult & {
  id: string;
  genres?: string[];
};

export type MyMediaDiary = {
  id: string;
  rating: number;
  title: string;
  contentPreview: string;
  watchedDate: string;
  updatedAt: string;
};

export type MediaDetail = Omit<SelectedMedia, 'genreIds'> & {
  tagline: string | null;
  runtime: number | null;
  genres: string[];
  countries: string[];
  tmdbRating: number | null;
  tmdbVoteCount: number | null;
  director: string | null;
  creators: string[];
  numberOfEpisodes: number | null;
  numberOfSeasons: number | null;
  cast: string[];
  stillCuts: string[];
  certification: string | null;
  myDiary?: MyMediaDiary | null;
  myDiaries?: MyMediaDiary[];
  myAverageRating?: number | null;
  isFavorite?: boolean;
  genreIds?: number[];
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

export async function searchPeople({
  query,
  page = 1,
  language = 'ko-KR',
}: {
  query: string;
  page?: number;
  language?: string;
}) {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('page', String(page));
  params.set('language', language);

  const response = await fetch(`${getApiBaseUrl()}/media/people/search?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('person search failed');
  }

  return (await response.json()) as PersonSearchResponse;
}

export async function getPersonCredits(personId: string, { language = 'ko-KR' }: { language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('language', language);

  const response = await fetch(`${getApiBaseUrl()}/media/people/${personId}/credits?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('person credits failed');
  }

  return (await response.json()) as PersonCreditsResponse;
}

function toMediaSelectionPayload(selection: MediaSearchResult): MediaSearchResult {
  return {
    externalProvider: selection.externalProvider,
    externalId: selection.externalId,
    mediaType: selection.mediaType,
    title: selection.title,
    originalTitle: selection.originalTitle,
    overview: selection.overview,
    posterUrl: selection.posterUrl,
    backdropUrl: selection.backdropUrl,
    releaseDate: selection.releaseDate,
    genreIds: selection.genreIds,
    country: selection.country,
  };
}

export async function selectMedia(selection: MediaSearchResult) {
  const response = await fetch(`${getApiBaseUrl()}/media/selections`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toMediaSelectionPayload(selection)),
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

export async function getMediaDetail(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/media/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('media detail failed');
  }

  return (await response.json()) as MediaDetail;
}

export async function toggleMediaFavorite(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/media/${id}/favorite`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('media favorite toggle failed');
  }

  return (await response.json()) as { mediaId: string; isFavorite: boolean };
}
