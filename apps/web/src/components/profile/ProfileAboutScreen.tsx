import { AppShell } from '../layout/AppShell';

export function ProfileAboutScreen() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.2.0';
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-about-screen">
        <h1 className="py-3 text-[22px] font-black text-[#23426f]">앱 정보</h1>
        <div className="rounded-[20px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <p className="text-[15px] font-black text-[#284778]">Davas</p>
          <p className="mt-2 text-[13px] font-bold text-[#6f7c91]">버전 {version}</p>
        </div>
      </section>
    </AppShell>
  );
}
