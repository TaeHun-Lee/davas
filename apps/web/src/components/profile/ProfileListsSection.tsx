import Link from 'next/link';
import type { ProfileListCard } from './ProfileDashboard';

type ProfileListsSectionProps = {
  lists: ProfileListCard[];
};

function ClapperBadge({ label }: { label: string }) {
  return (
    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-black text-white backdrop-blur">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h16v11H4zM4 8l15-3 1 3" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 7.2 10 4.5M13 6.4 15 3.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}

function ProfileListTile({ item }: { item: ProfileListCard }) {
  return (
    <article className="relative h-[126px] w-[160px] shrink-0 overflow-hidden rounded-[14px] bg-[#d9e4f2] shadow-[0_12px_26px_rgba(31,65,114,0.14)]" data-design="profile-list-card">
      {item.posterUrl ? (
        <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`h-full w-full ${item.posterGradient}`} aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,30,0.06)_0%,rgba(9,16,30,0.82)_100%)]" />
      <ClapperBadge label={item.countLabel} />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <h3 className="line-clamp-2 text-[13px] font-black leading-[17px] tracking-[-0.03em]">{item.title}</h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-bold text-white/82">{item.subtitle}</p>
      </div>
    </article>
  );
}

export function ProfileListsSection({ lists }: ProfileListsSectionProps) {
  return (
    <section className="mt-5" data-design="profile-lists-section">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#284778]">나의 리스트</h2>
        <Link href="/diary" aria-label="나의 리스트 전체 보기" className="text-[12px] font-extrabold text-[#8a96a9]">
          전체 보기 ›
        </Link>
      </div>
      {lists.length > 0 ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-1 min-[390px]:-mx-5 min-[390px]:px-5">
          <div className="flex gap-3">
            {lists.map((item) => (
              <ProfileListTile key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card-surface rounded-[20px] bg-white px-5 py-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <p className="text-[13px] font-bold leading-5 text-[#8a96a9]">아직 리스트로 보여줄 기록이 없어요.</p>
        </div>
      )}
    </section>
  );
}
