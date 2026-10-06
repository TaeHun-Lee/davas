'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from '../../lib/api/notifications';
import { AsyncState, EmptyState, TaskShell } from '../core/CoreUi';
import { relativeTime } from '../core/WatchReviews';
import { describeNotification, type NotificationIcon } from './notification-model';

const ICON_PATHS: Record<NotificationIcon, string> = {
  record: 'M5 4.5h14v15H5zM8 8h8M8 12h8M8 16h5',
  reveal: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z',
  like: 'M7 11v9H4v-9ZM7 11l4-7a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7',
  comment: 'M4 5h16v11H9l-5 4Z',
  match: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  people:
    'M9 6a3 3 0 1 0 0 6a3 3 0 1 0 0-6ZM3.5 19c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M16.5 7.5a2.5 2.5 0 1 0 0 5M14 15c3.5-.4 5.5.9 6 4',
};

export function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setItems((await listNotifications()).items);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function open(item: NotificationItem) {
    const target = describeNotification(item).href;
    if (!item.readAt) {
      // Opening still works if marking read fails; it just stays unread.
      await markNotificationRead(item.id).catch(() => undefined);
    }
    router.push(target);
  }

  async function readAll() {
    setError('');
    try {
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? now })));
    } catch {
      setError('모두 읽음으로 바꾸지 못했어요.');
    }
  }

  const unread = items.filter((item) => !item.readAt).length;
  return (
    <TaskShell title="알림" fallback="/">
      <div className="notifications-head">
        <p>{unread ? `안 읽은 알림 ${unread}개` : '모두 읽었어요'}</p>
        <button type="button" onClick={readAll} disabled={!unread}>
          모두 읽음
        </button>
      </div>
      {error ? (
        <p role="alert" className="form-error mt-2">
          {error}
        </p>
      ) : null}
      {status === 'loading' ? (
        <AsyncState kind="loading" />
      ) : status === 'error' ? (
        <AsyncState kind="error" onRetry={load} />
      ) : !items.length ? (
        <EmptyState
          title="아직 알림이 없어요"
          description="함께 본 기록, 열린 블라인드 리뷰, 좋아요와 댓글이 여기에 모여요."
        />
      ) : (
        <ul className="notifications-list">
          {items.map((item) => {
            const text = describeNotification(item);
            const when = relativeTime(item.createdAt);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  data-unread={!item.readAt || undefined}
                  data-icon={text.icon}
                  onClick={() => void open(item)}
                  aria-label={`${item.readAt ? '' : '읽지 않음, '}${text.title}, ${[
                    text.about,
                    when,
                  ]
                    .filter(Boolean)
                    .join(' · ')}`}
                >
                  <span className="notifications-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={ICON_PATHS[text.icon]} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <strong>{text.title}</strong>
                    <span>{[when, text.about].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="notifications-dot" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </TaskShell>
  );
}
