import type { AuthenticatedUser } from '../../lib/api/auth';

type ProfileHeaderCardProps = {
  user: AuthenticatedUser;
};

function ChevronIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="#91a0b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  const displayName = user.nickname || '필름메이트';
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <section data-design="profile-hero-card" className="relative mt-1 pb-3">
      <div className="flex items-center gap-5 pr-2">
        <div className="grid h-[86px] w-[86px] shrink-0 place-items-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#dbe7f8,#f7f0e6)] text-[30px] font-black text-[#2e5c9f] shadow-[0_12px_24px_rgba(31,65,114,0.13)]">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[18px] font-black leading-[24px] tracking-[-0.03em] text-[#284778]">{displayName}</h2>
            <span className="rounded-full bg-[#3a6fc6] px-2.5 py-0.5 text-[11px] font-extrabold text-white">Pro</span>
          </div>
          <p className="mt-2 max-w-[180px] text-[13px] font-semibold leading-[19px] text-[#7d8aa0]">
            영화를 기록하고, 기억하고,
            <br />나만의 아카이브로 남겨요.
          </p>
        </div>
        <ChevronIcon />
      </div>
    </section>
  );
}
