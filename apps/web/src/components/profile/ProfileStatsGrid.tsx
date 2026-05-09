import type { ProfileView } from './ProfileDashboard';

type ProfileStatsGridProps = {
  stats: ProfileView['stats'];
};

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  const statItems = [stats.recordedMovies, stats.diaryCount, stats.receivedLikes, stats.following];

  return (
    <section className="mt-3 grid grid-cols-4 divide-x divide-[#e7edf5] text-center" data-design="profile-stats-grid">
      {statItems.map((stat) => (
        <div key={stat.label} className="min-w-0 px-2 py-2">
          <p className="text-[24px] font-black leading-[28px] tracking-[-0.04em] text-[#284778]">{stat.value ?? stat.unavailableLabel}</p>
          <p className="mt-1 truncate text-[11px] font-bold leading-[15px] text-[#8a96a9]">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
