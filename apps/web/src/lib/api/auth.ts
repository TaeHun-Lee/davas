import { getApiBaseUrl } from './base-url';

export type AuthenticatedUser = {
  id?: string;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  preferredGenres?: string[];
};

export type MeResponse = {
  user: AuthenticatedUser;
};

export { getApiBaseUrl };

export function normalizeProfileImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;
  if (/^(https?:|blob:|data:)/.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    return `${getApiBaseUrl().replace(/\/api$/, '')}${imageUrl}`;
  }
  return imageUrl;
}

export async function getMe() {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('auth me failed');
  }

  return ((await response.json()) as MeResponse).user;
}

export async function logout() {
  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('logout failed');
  }

  return response.json() as Promise<{ ok: boolean }>;
}
