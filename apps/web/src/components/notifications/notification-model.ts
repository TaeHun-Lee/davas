import type { NotificationItem } from '../../lib/api/notifications';

export type NotificationIcon = 'record' | 'reveal' | 'like' | 'comment' | 'match' | 'people';

export type NotificationText = {
  title: string;
  /** What it is about; the screen appends the relative time. */
  about: string | null;
  href: string;
  icon: NotificationIcon;
};

const quoted = (title: string | undefined) => (title ? `‘${title}’` : '기록');

/** Korean copy and destination for each kind of notification. */
export function describeNotification(item: NotificationItem): NotificationText {
  const actor = item.actor.nickname || '공간 멤버';
  // Back from the record returns to this list.
  const record = item.diary
    ? `/records/${encodeURIComponent(item.diary.id)}?returnTo=${encodeURIComponent('/notifications')}`
    : '/';
  const title = item.diary?.title;
  switch (item.type) {
    case 'WATCH_SHARED':
      return {
        title: `${actor}님이 ${quoted(title)} 기록을 남겼어요`,
        about: null,
        href: record,
        icon: 'record',
      };
    case 'WATCH_PARTICIPATION_REQUESTED':
      return {
        title: `${quoted(title)} 함께 보셨나요?`,
        about: `${actor}님이 확인을 요청했어요`,
        href: record,
        icon: 'record',
      };
    case 'REVIEW_REVEALED':
      return {
        title: `${quoted(title)} 블라인드 리뷰가 열렸어요`,
        about: `${actor}님이 리뷰를 남겼어요`,
        href: record,
        icon: 'reveal',
      };
    case 'REVIEW_LIKED':
      return {
        title: `${actor}님이 내 리뷰에 좋아요를 눌렀어요`,
        about: title ?? null,
        href: record,
        icon: 'like',
      };
    case 'DIARY_LIKED':
      return {
        title: `${actor}님이 내 기록에 반응했어요`,
        about: title ?? null,
        href: record,
        icon: 'like',
      };
    case 'DIARY_COMMENTED':
      return {
        title: `${actor}님이 댓글을 남겼어요`,
        about: title ?? null,
        href: record,
        icon: 'comment',
      };
    case 'WISH_MATCHED':
      return {
        title: `${item.media?.title ? `‘${item.media.title}’` : '이 작품'}, 모두 같이 보고 싶어 해요`,
        about: '같이 보고 싶어요 목록',
        href: '/spaces/wishes',
        icon: 'match',
      };
    case 'SPACE_INVITE':
      return {
        title: `${actor}님이 공간에 초대했어요`,
        about: null,
        href: '/spaces',
        icon: 'people',
      };
    case 'SPACE_INVITE_DECLINED':
      return {
        title: `${actor}님이 공간 초대를 거절했어요`,
        about: '필요하면 새 초대 링크를 보낼 수 있어요',
        href: '/spaces',
        icon: 'people',
      };
    case 'RECOMMENDATION_REQUESTED':
      return {
        title: `${actor}님이 함께 볼 작품을 고르고 있어요`,
        about: '후보에 의견을 남겨 주세요',
        href: '/spaces?view=recommend',
        icon: 'match',
      };
    case 'RECOMMENDATION_MATCHED':
      return {
        title: '함께 볼 작품이 정해졌어요',
        about: item.media?.title ?? '함께 고르기',
        href: '/spaces?view=recommend',
        icon: 'match',
      };
    case 'FRIEND_REQUESTED':
      return {
        title: `${actor}님이 친구 요청을 보냈어요`,
        about: null,
        href: '/friends',
        icon: 'people',
      };
    case 'FRIEND_ACCEPTED':
      return { title: `${actor}님과 친구가 됐어요`, about: null, href: '/friends', icon: 'people' };
  }
}
