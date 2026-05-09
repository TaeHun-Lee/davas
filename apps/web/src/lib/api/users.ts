import { getApiBaseUrl, type AuthenticatedUser } from './auth';

export type UpdateMePayload = {
  nickname?: string;
  bio?: string | null;
  preferredGenres?: string[];
};

type UserResponse = {
  user: AuthenticatedUser;
};

export async function updateMe(payload: UpdateMePayload) {
  const response = await fetch(`${getApiBaseUrl()}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('profile update failed');
  }

  return ((await response.json()) as UserResponse).user;
}

export async function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getApiBaseUrl()}/users/me/profile-image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('profile image upload failed');
  }

  return ((await response.json()) as UserResponse).user;
}

export async function deleteProfileImage() {
  const response = await fetch(`${getApiBaseUrl()}/users/me/profile-image`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('profile image delete failed');
  }

  return ((await response.json()) as UserResponse).user;
}
