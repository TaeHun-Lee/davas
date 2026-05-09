export type CreateDiaryPayload = {
  mediaId: string;
  mediaPosterUrl?: string | null;
  rating: number;
  watchedDate: string;
  title: string;
  content: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  hasSpoiler: boolean;
  tags: string[];
};

export type EditableDiary = CreateDiaryPayload & {
  id: string;
  media: {
    id: string;
    title: string;
    originalTitle?: string | null;
    posterUrl?: string | null;
    releaseDate?: string | null;
    runtime?: number | null;
    mediaType: 'MOVIE' | 'TV';
    genres: string[];
  };
};

import type { DiaryDashboardView } from '../../components/diary/diary-dashboard-types';

export type CreatedDiaryResponse = {
  message?: string;
  diary?: CreateDiaryPayload;
  id?: string;
};

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

export async function getDiaryDashboard(params?: { year?: number; month?: number; day?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', String(params.year));
  if (params?.month) searchParams.set('month', String(params.month));
  if (params?.day) searchParams.set('day', String(params.day));
  const queryString = searchParams.toString();
  const response = await fetch(`${getApiBaseUrl()}/diaries/dashboard${queryString ? `?${queryString}` : ''}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('diary dashboard failed');
  }

  return (await response.json()) as DiaryDashboardView;
}

export async function createDiary(payload: CreateDiaryPayload) {
  const response = await fetch(`${getApiBaseUrl()}/diaries`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('diary create failed');
  }

  return (await response.json()) as CreatedDiaryResponse;
}

export async function getDiary(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/diaries/${encodeURIComponent(id)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('diary detail failed');
  }

  return ((await response.json()) as { diary: EditableDiary }).diary;
}

export async function updateDiary(id: string, payload: CreateDiaryPayload) {
  const response = await fetch(`${getApiBaseUrl()}/diaries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('diary update failed');
  }

  return (await response.json()) as { diary: EditableDiary };
}
