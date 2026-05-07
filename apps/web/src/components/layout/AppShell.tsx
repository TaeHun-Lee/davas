import type { ReactNode } from 'react';
import { BottomTabBar } from './BottomTabBar';
import { DavasHeader } from './DavasHeader';

type AppShellProps = {
  children: ReactNode;
  nickname?: string;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f8fc] text-[#1f2a44] sm:bg-[#eef2f7]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#f6f8fc] pb-[112px] shadow-[0_0_44px_rgba(31,42,68,0.06)] sm:my-0 sm:min-h-screen sm:rounded-none">
        <DavasHeader />
        <div className="px-4 pt-[64px] min-[390px]:px-5">{children}</div>
      </div>
      <BottomTabBar />
    </main>
  );
}
