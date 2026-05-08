export type CreateDiaryPayload = {
  mediaId: string;
  rating: number;
  watchedDate: string;
  title: string;
  content: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  hasSpoiler: boolean;
  tags: string[];
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

export async function getDiaryDashboard() {
  const response = await fetch(`${getApiBaseUrl()}/diaries/dashboard`, {
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
