'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../layout/AppShell';

const storageKey = 'davas.notificationSettings';

export function ProfileNotificationsScreen() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setEnabled(JSON.parse(saved).enabled);
  }, []);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ enabled }));
  }, [enabled]);
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-notifications-screen">
        <h1 className="py-3 text-[22px] font-black text-[#23426f]">알림 설정</h1>
        <button type="button" onClick={() => setEnabled((value) => !value)} className="flex h-[56px] w-full items-center justify-between rounded-[20px] bg-white px-4 text-[14px] font-black text-[#284778] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          다이어리 알림 <span className={enabled ? 'text-[#2f65b8]' : 'text-[#8a96a9]'}>{enabled ? '켜짐' : '꺼짐'}</span>
        </button>
      </section>
    </AppShell>
  );
}
