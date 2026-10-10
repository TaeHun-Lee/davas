import type { AuthenticatedUser, MeResponse } from '@davas/shared';
import { getApiBaseUrl } from './base-url';
import { coreFetch } from './core';

export type { AuthenticatedUser };

export function normalizeProfileImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;
  if (/^(https?:|blob:|data:)/.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    return `${getApiBaseUrl().replace(/\/api$/, '')}${imageUrl}`;
  }
  return imageUrl;
}

export async function getMe() {
  return (await coreFetch<MeResponse>('/auth/me', {}, { auth: 'optional' })).user;
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

/** Signed out, so a wrong password stays on the login screen instead of redirecting. */
export function login(email: string, password: string) {
  return coreFetch<MeResponse>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    { auth: 'optional' },
  ).then((response) => response.user);
}

/** Every other device signs in again; this one stays signed in. */
export function changePassword(currentPassword: string, newPassword: string) {
  return coreFetch<MeResponse>('/auth/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }).then((response) => response.user);
}

/** The plain code comes back this once; a new code replaces the old one. */
export function createRecoveryCode(password: string) {
  return coreFetch<{ recoveryCode: string; createdAt: string }>('/auth/recovery-code', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function resetPassword(input: { email: string; recoveryCode: string; newPassword: string }) {
  return coreFetch<{ ok: true }>(
    '/auth/password/reset',
    { method: 'POST', body: JSON.stringify(input) },
    { auth: 'optional' },
  );
}
