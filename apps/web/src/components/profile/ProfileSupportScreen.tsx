import { AppShell } from '../layout/AppShell';

export function ProfileSupportScreen() {
  return (
    <AppShell>
      <section className="pb-8" data-design="profile-support-screen">
        <h1 className="py-3 text-[22px] font-black text-[#23426f]">고객센터</h1>
        <div className="rounded-[20px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <p className="text-[14px] font-bold leading-6 text-[#6f7c91]">문의나 오류 제보가 필요하면 메일로 알려주세요.</p>
          <a href="mailto:support@davas.app" className="mt-4 block h-[46px] rounded-[16px] bg-[#2f65b8] text-center text-[14px] font-black leading-[46px] text-white">메일 보내기</a>
        </div>
      </section>
    </AppShell>
  );
}
