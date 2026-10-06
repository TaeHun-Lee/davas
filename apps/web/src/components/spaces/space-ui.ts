import { CoreApiError } from '../../lib/api/core';
import type { SpaceInviteInspection, SpaceView } from '../../lib/api/spaces';

export const ACTIVE_SPACE_KEY = 'davas:active-space-id';

export function chooseActiveSpace(spaces: SpaceView[], preferredSpaceId?: string | null) {
  return spaces.find((space) => space.id === preferredSpaceId) ?? spaces[0] ?? null;
}

// Storage can throw in private windows or when site data is blocked; the active space is
// only a convenience, so fall back to the first space instead of failing the screen.
export function readActiveSpaceId() {
  try {
    return window.localStorage.getItem(ACTIVE_SPACE_KEY);
  } catch {
    return null;
  }
}

export function rememberActiveSpace(spaceId: string | null) {
  try {
    if (spaceId) window.localStorage.setItem(ACTIVE_SPACE_KEY, spaceId);
    else window.localStorage.removeItem(ACTIVE_SPACE_KEY);
  } catch {
    // Keep working with the in-memory selection.
  }
}

export function activeMembers(space: SpaceView) {
  return space.members.filter((member) => member.status === 'ACTIVE');
}

// In a two-person space the other member is almost always the one you watched with, so the
// composer preselects them. They still have to confirm before the record counts as theirs.
export function defaultWatchPartners(space: SpaceView | null, myAccountId: string) {
  if (!space) return [];
  const members = activeMembers(space);
  const others = members.filter((member) => member.accountId !== myAccountId);
  return members.length === 2 && others.length === 1 ? [others[0].accountId] : [];
}

export function spaceErrorMessage(error: unknown) {
  const code = error instanceof CoreApiError ? error.body.code : undefined;
  switch (code) {
    case 'SPACE_FULL':
      return '공간 정원 5명이 모두 찼어요. 다른 공간을 선택하거나 자리가 생긴 뒤 다시 시도해 주세요.';
    case 'SPACE_INVITE_EXPIRED':
      return '초대 링크가 만료됐어요. 공간 소유자에게 새 링크를 요청해 주세요.';
    case 'SPACE_INVITE_CANCELLED':
      return '취소된 초대 링크예요. 공간 소유자에게 새 링크를 요청해 주세요.';
    case 'SPACE_INVITE_USED':
      return '이미 수락된 초대 링크예요. 내 공간 목록을 확인해 주세요.';
    case 'ALREADY_SPACE_MEMBER':
      return '이미 참여 중인 공간이에요. 내 공간 목록에서 선택해 주세요.';
    case 'LAST_SPACE_OWNER':
      return '소유자는 먼저 다른 멤버에게 소유권을 이전하거나 공간을 종료해야 해요.';
    case 'SPACE_OWNER_REQUIRED':
      return '이 작업은 공간 소유자만 할 수 있어요.';
    case 'SPACE_NOT_FOUND':
    case 'SPACE_INVITE_NOT_FOUND':
      return '공간을 찾을 수 없거나 접근 권한이 없어요.';
    default:
      return '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
}

export function inviteStatusMessage(status: Exclude<SpaceInviteInspection['status'], 'VALID'>) {
  switch (status) {
    case 'EXPIRED':
      return '초대 링크가 만료됐어요.';
    case 'CANCELLED':
      return '공간 소유자가 취소한 초대예요.';
    case 'USED':
      return '이미 수락된 초대 링크예요.';
    case 'ALREADY_MEMBER':
      return '이미 참여 중인 공간이에요.';
    case 'CLOSED':
      return '종료된 공간이라 참여할 수 없어요.';
    case 'INVALID':
      return '유효하지 않은 초대 링크예요.';
  }
}
