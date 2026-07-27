import type { AuthenticatedUser, LogoutResponse, MeResponse } from '@davas/shared';
import { getApiBaseUrl } from './base-url';
import { coreFetch, type CoreFetchOptions } from './core';

export type { AuthenticatedUser } from '@davas/shared';
export { CoreApiError as ApiResponseError } from './core';
export { getApiBaseUrl };

export function normalizeProfileImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;
  if (/^(https?:|blob:|data:)/.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    return `${getApiBaseUrl().replace(/\/api$/, '')}${imageUrl}`;
  }
  return imageUrl;
}

export function getMe(options?: CoreFetchOptions): Promise<AuthenticatedUser> {
  return coreFetch<MeResponse>('/auth/me', {}, options).then((response) => response.user);
}

export function logout() {
  return coreFetch<LogoutResponse>('/auth/logout', { method: 'POST' });
}
