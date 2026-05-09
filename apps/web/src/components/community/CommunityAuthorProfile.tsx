'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../layout/AppShell';
import { getCommunityAuthorProfile } from '../../lib/api/community';
import type { CommunityAuthorProfileResponse } from './community-types';
import { CommunityDiaryCard } from './CommunityDiaryCard';

export function CommunityAuthorProfile({ authorId }: { authorId: string }) {
  const [profile, setProfile] = useState<CommunityAuthorProfileResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    getCommunityAuthorProfile(authorId)
      .then((nextProfile) => {
        if (!mounted) return;
        setProfile(nextProfile);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setProfile(null);
        setStatus('error');
      });
    return () => {
      mounted = false;
    };
  }, [authorId]);

  return (
    <AppShell>
      <section className="overflow-x-hidden pb-8" data-design="community-author-profile">
        {status === 'loading' ? <div className="h-[240px] rounded-[28px] bg-white shadow-[0_14px_34px_rgba(31,65,114,0.06)]" aria-label="작성자 프로필을 불러오는 중" /> : null}
        {status === 'error' ? <p className="rounded-[24px] bg-white px-5 py-8 text-center text-[13px] font-bold text-[#e85b6a] shadow-[0_12px_28px_rgba(31,65,114,0.06)]">작성자 프로필을 불러오지 못했어요.</p> : null}
        {profile && status === 'ready' ? (
          <>
            <header className="rounded-[30px] bg-white p-5 shadow-[0_16px_36px_rgba(31,42,68,0.08)]">
              <div className="flex items-center gap-3">
                {profile.author.profileImageUrl ? <img src={profile.author.profileImageUrl} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf1ff] text-[20px] font-black text-[#216bd8]">{profile.author.nickname.slice(0, 1)}</span>}
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-[22px] font-black tracking-[-0.03em] text-[#1f2a44]">{profile.author.nickname}</h1>
                  <p className="mt-1 text-[12px] font-bold text-[#7d8798]">{profile.author.bio ?? '소개가 아직 없어요.'}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[18px] bg-[#f5f8fd] px-2 py-3">
                  <p className="text-[16px] font-black text-[#1f2a44]">{profile.stats.publicDiaryCount}</p>
                  <p className="text-[10px] font-extrabold text-[#8a95a8]">공개 기록</p>
                </div>
                <div className="rounded-[18px] bg-[#f5f8fd] px-2 py-3">
                  <p className="text-[16px] font-black text-[#1f2a44]">{profile.stats.followerCount}</p>
                  <p className="text-[10px] font-extrabold text-[#8a95a8]">팔로워</p>
                </div>
                <div className="rounded-[18px] bg-[#f5f8fd] px-2 py-3">
                  <p className="text-[16px] font-black text-[#1f2a44]">{profile.stats.followingCount}</p>
                  <p className="text-[10px] font-extrabold text-[#8a95a8]">팔로잉</p>
                </div>
              </div>
            </header>
            <section className="mt-6">
              <h2 className="px-1 text-[16px] font-black tracking-[-0.02em] text-[#1f2a44]">작성자의 공개 기록</h2>
              <div className="mt-3 space-y-3">
                {profile.feed.length > 0 ? profile.feed.map((item) => <CommunityDiaryCard key={item.id} item={item} />) : <p className="rounded-[24px] bg-white px-5 py-8 text-center text-[13px] font-bold text-[#8a95a8]">공개 기록이 아직 없어요.</p>}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}
