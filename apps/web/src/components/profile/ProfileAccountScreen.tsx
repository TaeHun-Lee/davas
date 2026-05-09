'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../../lib/api/auth';
import { AppShell } from '../layout/AppShell';

export function ProfileAccountScreen() {
  const router = useRouter();
  async function handleLogout() {
    await logout();
    router.replace('/login');
  }
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-account-screen">
        <h1 className="py-3 text-[22px] font-black text-[#23426f]">계정 관리</h1>
        <div className="rounded-[20px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <p className="text-[14px] font-bold text-[#6f7c91]">현재 로그인된 계정을 안전하게 관리해요.</p>
          <button type="button" onClick={handleLogout} className="mt-5 h-[46px] w-full rounded-[16px] bg-[#284778] text-[14px] font-black text-white">로그아웃</button>
        </div>
      </section>
    </AppShell>
  );
}
