'use client';


import { useEffect, useState } from 'react';
import { AppShell } from '../layout/AppShell';

const storageKey = 'davas.privacySettings';

export function ProfilePrivacyScreen() {
  const [privateProfile, setPrivateProfile] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setPrivateProfile(JSON.parse(saved).privateProfile);
  }, []);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ privateProfile }));
  }, [privateProfile]);
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-privacy-screen">
        <h1 className="py-3 text-[22px] font-black text-[#23426f]">개인정보 및 보안</h1>
        <button type="button" onClick={() => setPrivateProfile((value) => !value)} className="flex h-[56px] w-full items-center justify-between rounded-[20px] bg-white px-4 text-[14px] font-black text-[#284778] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          비공개 프로필 <span className={privateProfile ? 'text-[#2f65b8]' : 'text-[#8a96a9]'}>{privateProfile ? '켜짐' : '꺼짐'}</span>
        </button>
      </section>
    </AppShell>
  );
}
