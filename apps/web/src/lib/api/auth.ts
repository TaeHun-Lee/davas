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

export function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
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
