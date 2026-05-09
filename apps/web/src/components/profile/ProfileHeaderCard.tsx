import type { AuthenticatedUser } from '../../lib/api/auth';

type ProfileHeaderCardProps = {
  user: AuthenticatedUser;
};

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="#6f84a3" strokeWidth="1.8" />
      <path d="M19.4 13.4c.1-.5.1-.9.1-1.4s0-.9-.1-1.4l2-1.5-2-3.4-2.4 1a8.4 8.4 0 0 0-2.4-1.4L14.2 2h-4l-.4 3.3c-.9.3-1.7.8-2.4 1.4l-2.4-1-2 3.4 2 1.5c-.1.5-.1.9-.1 1.4s0 .9.1 1.4l-2 1.5 2 3.4 2.4-1c.7.6 1.5 1.1 2.4 1.4l.4 3.3h4l.4-3.3c.9-.3 1.7-.8 2.4-1.4l2.4 1 2-3.4-2-1.5Z" stroke="#6f84a3" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

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
      <button
        type="button"
        data-design="profile-settings-button"
        className="absolute right-0 top-[-48px] grid h-10 w-10 place-items-center rounded-full bg-white text-[#6f84a3] shadow-[0_8px_20px_rgba(34,57,92,0.12)]"
        aria-label="프로필 설정"
      >
        <SettingsIcon />
      </button>
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
