import type { CommunityAuthorProfileResponse, CommunityCommentsResponse, CommunityComment, CommunityDashboardResponse, CommunityDiaryDetail, CommunityTab } from '../../components/community/community-types';
import { getApiBaseUrl } from './base-url';

export type CommunityDashboardParams = {
  tab?: CommunityTab;
  q?: string;
  topic?: string;
};

export async function getCommunityDashboard(params: CommunityDashboardParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.tab) searchParams.set('tab', params.tab);
  if (params.q?.trim()) searchParams.set('q', params.q.trim());
  if (params.topic?.trim()) searchParams.set('topic', params.topic.trim());
  const query = searchParams.toString();
  const response = await fetch(`${getApiBaseUrl()}/community/dashboard${query ? `?${query}` : ''}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('community dashboard failed');
  }

  return (await response.json()) as CommunityDashboardResponse;
}

async function parseJsonResponse<T>(response: Response, message: string) {
  if (!response.ok) {
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function getCommunityDiary(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/community/diaries/${id}`, {
    credentials: 'include',
  });

  return parseJsonResponse<CommunityDiaryDetail>(response, 'community diary failed');
}

export async function getDiaryComments(diaryId: string) {
  const response = await fetch(`${getApiBaseUrl()}/diaries/${diaryId}/comments`, {
    credentials: 'include',
  });
  return parseJsonResponse<CommunityCommentsResponse>(response, 'diary comments failed');
}

export async function createDiaryComment(diaryId: string, content: string) {
  const response = await fetch(`${getApiBaseUrl()}/diaries/${diaryId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });
  return parseJsonResponse<CommunityComment>(response, 'create diary comment failed');
}

export async function updateDiaryComment(commentId: string, content: string) {
  const response = await fetch(`${getApiBaseUrl()}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });
  return parseJsonResponse<CommunityComment>(response, 'update diary comment failed');
}

export async function deleteDiaryComment(commentId: string) {
  const response = await fetch(`${getApiBaseUrl()}/comments/${commentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return parseJsonResponse<{ id: string; deleted: boolean }>(response, 'delete diary comment failed');
}

export async function getCommunityAuthorProfile(authorId: string) {
  const response = await fetch(`${getApiBaseUrl()}/community/authors/${authorId}`, {
    credentials: 'include',
  });
  return parseJsonResponse<CommunityAuthorProfileResponse>(response, 'community author profile failed');
}
