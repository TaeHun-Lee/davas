import { getApiBaseUrl } from './base-url';

export type ReactionEmoji = 'HEART' | 'CLAP' | 'SMILE' | 'TEAR';
export type DiaryReaction = { id: string; emoji: ReactionEmoji; userId: string; isMine: boolean };

async function parse<T>(response: Response) {
  if (!response.ok) throw Object.assign(new Error('reaction request failed'), { status: response.status });
  return response.json() as Promise<T>;
}

export async function getDiaryReactions(diaryId: string) {
  return parse<{ diaryId: string; items: DiaryReaction[] }>(await fetch(`${getApiBaseUrl()}/diaries/${diaryId}/reactions`, { credentials: 'include' }));
}

export async function addDiaryReaction(diaryId: string, emoji: ReactionEmoji) {
  return parse<DiaryReaction>(await fetch(`${getApiBaseUrl()}/diaries/${diaryId}/reactions`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emoji }) }));
}

export async function removeDiaryReaction(diaryId: string, emoji: ReactionEmoji) {
  return parse<{ deleted: true }>(await fetch(`${getApiBaseUrl()}/diaries/${diaryId}/reactions/${emoji}`, { method: 'DELETE', credentials: 'include' }));
}
