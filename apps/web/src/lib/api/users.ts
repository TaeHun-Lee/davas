import type { AccountDeletionResponse, UpdateMeInput, UserResponse } from '@davas/shared';
import { coreFetch } from './core';

export type { UpdateMeInput as UpdateMePayload } from '@davas/shared';

export function updateMe(payload: UpdateMeInput) {
  return coreFetch<UserResponse>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }).then((response) => response.user);
}

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return coreFetch<UserResponse>('/users/me/profile-image', {
    method: 'POST',
    body: formData,
  }).then((response) => response.user);
}

export function deleteProfileImage() {
  return coreFetch<UserResponse>('/users/me/profile-image', {
    method: 'DELETE',
  }).then((response) => response.user);
}

export function deleteMe(password: string): Promise<AccountDeletionResponse> {
  return coreFetch('/users/me', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
