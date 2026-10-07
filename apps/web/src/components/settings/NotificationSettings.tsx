'use client';

import { useEffect, useState } from 'react';
import {
  listNotificationPreferences,
  setNotificationPreference,
  type NotificationPreference,
  type NotificationPreferenceCategory,
} from '../../lib/api/notifications';
import { ToggleSwitch } from '../core/ComposerFields';

const LABELS: Record<NotificationPreferenceCategory, { label: string; description: string }> = {
  SPACE_INVITE: {
    label: '공간 초대',
    description: '공간 초대와 거절 소식이에요. 꼭 알아야 해서 끌 수 없어요.',
  },
  WATCH_PARTICIPATION: {
    label: '함께 봤나요?',
    description: '나를 함께 본 사람으로 넣은 기록의 확인 요청이에요. 끌 수 없어요.',
  },
  SOCIAL: {
    label: '기록과 반응',
    description: '공간의 새 기록, 열린 블라인드 리뷰, 좋아요, 댓글, 친구 소식이에요.',
  },
  RECOMMENDATION: {
    label: '함께 고르기',
    description: '같이 보고 싶어요가 겹쳤을 때, 함께 볼 작품 고르기 요청과 결과예요.',
  },
};

/** Which kinds of in-app notification arrive. Invites and "함께 봤나요?" always do. */
export function NotificationSettings() {
  const [items, setItems] = useState<NotificationPreference[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<NotificationPreferenceCategory | null>(null);

  useEffect(() => {
    listNotificationPreferences()
      .then(setItems)
      .catch(() => setError('알림 설정을 불러오지 못했어요.'));
  }, []);

  async function toggle(category: NotificationPreferenceCategory, enabled: boolean) {
    setBusy(category);
    setError('');
    const before = items;
    setItems(
      (current) =>
        current?.map((item) => (item.category === category ? { ...item, enabled } : item)) ??
        current,
    );
    try {
      await setNotificationPreference(category, enabled);
    } catch {
      setItems(before);
      setError('알림 설정을 저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="core-card mt-5 p-5" aria-labelledby="notification-settings-title">
      <h2 id="notification-settings-title" className="section-title">
        알림
      </h2>
      <p className="page-description">앱 안의 알림 중 받을 것을 골라요.</p>
      {items ? (
        <div className="mt-3 space-y-4">
          {items.map((item) => (
            <ToggleSwitch
              key={item.category}
              label={LABELS[item.category].label}
              description={LABELS[item.category].description}
              checked={item.enabled}
              disabled={item.required || busy === item.category}
              onChange={(enabled) => toggle(item.category, enabled)}
            />
          ))}
        </div>
      ) : error ? null : (
        <p className="page-description mt-3">불러오는 중…</p>
      )}
      {error ? (
        <p className="form-error mt-3" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
