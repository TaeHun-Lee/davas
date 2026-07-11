'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCommunityNotifications, markCommunityNotificationRead, type CommunityNotificationItem } from '../../lib/api/notifications';
import { AppShell } from '../layout/AppShell';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';

type NotificationStatus = 'loading' | 'ready' | 'error';

function notificationMessage(item: CommunityNotificationItem) {
  if (item.type === 'DIARY_LIKED') {
    return `${item.actor.nickname}님이 ${item.diary ? `「${item.diary.title}」 기록에` : '내 기록에'} 반응을 남겼어요.`;
  }
  if (item.type === 'DIARY_COMMENTED') {
    return `${item.actor.nickname}님이 ${item.diary ? `「${item.diary.title}」 기록에` : '내 기록에'} 댓글을 남겼어요.`;
  }
  if (item.type === 'FRIEND_REQUESTED') return `${item.actor.nickname}님이 친구 요청을 보냈어요.`;
  if (item.type === 'FRIEND_ACCEPTED') return `${item.actor.nickname}님이 친구 요청을 수락했어요.`;
  return `${item.actor.nickname}님이 친구 요청을 수락했어요.`;
}

function formatNotificationDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function ProfileNotificationsScreen() {
  const [status, setStatus] = useState<NotificationStatus>('loading');
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<CommunityNotificationItem[]>([]);

  useEffect(() => {
    let mounted = true;
    getCommunityNotifications()
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setUnreadCount(result.unreadCount);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('error');
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleMarkRead(id: string) {
    const previous = items;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item)));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      const updated = await markCommunityNotificationRead(id);
      setItems((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch {
      setItems(previous);
      setUnreadCount(previous.filter((item) => !item.readAt).length);
    }
  }

  if (status === 'loading') {
    return <MediaDetailLoadingIndicator label="알림을 불러오는 중" />;
  }

  return (
    <AppShell>
      <section className="overflow-x-hidden pb-8" data-design="profile-notifications-screen">
        <div className="py-3"><Link href="/profile" className="mb-2 inline-flex min-h-11 items-center rounded-full px-3 text-[13px] font-black text-[#2f65b8]">‹ 프로필</Link>
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#7f8ca4]">Notifications</p>
          <h1 className="text-[22px] font-black text-[#23426f]">알림 설정</h1>
        </div>

        <p className="rounded-[20px] bg-[#eef4fa] p-4 text-[12px] font-bold leading-5 text-[#52677e]">현재는 앱 안 알림만 제공합니다. 서버에서 효력이 없는 푸시 알림 토글은 표시하지 않습니다.</p>

        <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]" aria-label="커뮤니티 알림 목록">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-black text-[#23426f]">커뮤니티 알림</h2>
            <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-[12px] font-black text-[#2f65b8]">읽지 않음 {unreadCount}</span>
          </div>

          {status === 'error' ? (
            <p className="mt-4 rounded-[18px] bg-[#fff5f5] p-4 text-[13px] font-bold text-[#c44747]">알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p>
          ) : items.length === 0 ? (
            <p className="mt-4 rounded-[18px] bg-[#f5f7fb] p-4 text-[13px] font-bold text-[#7f8ca4]">아직 도착한 커뮤니티 알림이 없어요.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-[18px] border border-[#e8edf5] bg-[#fbfdff] p-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.readAt ? 'bg-[#c8d1df]' : 'bg-[#2f65b8]'}`} aria-label={item.readAt ? '읽은 알림' : '읽지 않은 알림'} />
                    <div className="min-w-0 flex-1">
                      {item.diary ? <Link href={`/diary/${item.diary.id}`} className="block text-[14px] font-black leading-[1.45] text-[#284778] underline decoration-[#b9cce4] underline-offset-4">{notificationMessage(item)}</Link> : <Link href="/friends" className="block text-[14px] font-black leading-[1.45] text-[#284778] underline decoration-[#b9cce4] underline-offset-4">{notificationMessage(item)}</Link>}
                      <p className="mt-1 text-[12px] font-bold text-[#8a96a9]">{formatNotificationDate(item.createdAt)}</p>
                    </div>
                  </div>
                  {!item.readAt && (
                    <button type="button" onClick={() => handleMarkRead(item.id)} className="mt-3 min-h-11 rounded-[14px] bg-[#284778] px-4 text-[12px] font-black text-white">
                      읽음 처리
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </AppShell>
  );
}
