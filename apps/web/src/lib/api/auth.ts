export type AuthenticatedUser = {
  email: string;
  nickname: string;
};

export type MeResponse = {
  user: AuthenticatedUser;
};

function getApiBaseUrl() {
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
