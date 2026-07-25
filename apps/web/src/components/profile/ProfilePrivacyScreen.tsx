'use client';


import Link from 'next/link';
import { AppShell } from '../layout/AppShell';

export function ProfilePrivacyScreen() {
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-privacy-screen">
        <div className="flex min-h-12 items-center gap-3"><Link href="/profile" className="flex min-h-11 items-center rounded-full px-3 text-[13px] font-black text-[#2f65b8]">‹ 프로필</Link><h1 className="text-[22px] font-black text-[#23426f]">개인정보 및 보안</h1></div>
        <section className="rounded-[20px] bg-white p-5 shadow-[0_12px_28px_rgba(31,65,114,0.08)]"><h2 className="text-[15px] font-black text-[#284778]">기록별 공개 범위</h2><p className="mt-2 text-[13px] font-bold leading-6 text-[#52677e]">새 기록은 항상 나만 보기로 시작합니다. 작성 화면에서 친구 공개 또는 선택한 친구 공개를 명시적으로 고를 수 있어요.</p><p className="mt-3 rounded-[14px] bg-[#eef4fa] p-3 text-[12px] font-bold leading-5 text-[#52677e]">프로필 전체 비공개 설정은 서버 정책과 연결되기 전까지 제공하지 않습니다.</p></section>
      </section>
    </AppShell>
  );
}
