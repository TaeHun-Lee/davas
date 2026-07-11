import { getApiBaseUrl } from './base-url';
import type { DiaryDashboardView } from '../../components/diary/diary-dashboard-types';

export type CreateDiaryPayload = {
  mediaId: string;
  mediaPosterUrl?: string | null;
  rating: number;
  watchedDate: string;
  title: string;
  content: string;
  visibility: 'PRIVATE' | 'FRIENDS' | 'SELECTED';
  hasSpoiler: boolean;
  tags: string[];
  companions?: Array<{ id?: string; userId?: string; displayName: string }>;
  watchedPlace?: string | null;
  mood?: string | null;
  memoryNote?: string | null;
  selectedUserIds?: string[];
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
  ownerMode?: boolean;
  author?: { id: string; nickname: string };
  commentCount?: number;
  reactions?: Array<{ id: string; emoji: string; userId: string }>;
};

export type CreatedDiaryResponse = {
  message?: string;
  diary?: CreateDiaryPayload;
  id?: string;
};

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

  if (!response.ok) throw Object.assign(new Error('diary detail failed'), { status: response.status });

  return ((await response.json()) as { diary: EditableDiary }).diary;
}

export async function deleteDiary(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/diaries/${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' });
  if (!response.ok) throw Object.assign(new Error('diary delete failed'), { status: response.status });
  return response.json() as Promise<{ id: string; deleted: true }>;
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
