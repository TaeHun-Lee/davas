import type { ProfileView } from './ProfileDashboard';

type ProfileActivitySectionProps = {
  activity: ProfileView['activity'];
};

type ActivityIconName = 'clapper' | 'eye' | 'pen' | 'heart';

function ActivityIcon({ name }: { name: ActivityIconName }) {
  const common = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
  switch (name) {
    case 'clapper':
      return (
        <svg {...common}>
          <path d="M4 8h16v11.5H4z" stroke="#6f84a3" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 8l15-3 1 3M7 7.4l2.1-2.7M12 6.4l2-2.7M16.7 5.4l1.9-2.3" stroke="#6f84a3" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M3 12s3.4-5.2 9-5.2S21 12 21 12s-3.4 5.2-9 5.2S3 12 3 12Z" stroke="#6f84a3" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="2.7" stroke="#6f84a3" strokeWidth="1.7" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...common}>
          <path d="M5 18.5 6.2 14 15.6 4.6a2 2 0 0 1 2.8 2.8L9 16.8 5 18.5Z" stroke="#6f84a3" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M13.8 6.4 16.6 9.2M5 20h14" stroke="#6f84a3" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 19.3S4.5 15 4.5 9.3A3.8 3.8 0 0 1 11.3 7 3.8 3.8 0 0 1 18 9.3C18 15 12 19.3 12 19.3Z" stroke="#6f84a3" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function ProfileActivitySection({ activity }: ProfileActivitySectionProps) {
  const activityItems = [
    { ...activity.wantToWatch, icon: 'clapper' as const },
    { ...activity.watched, icon: 'eye' as const },
    { ...activity.writtenDiaries, icon: 'pen' as const },
    { ...activity.likedPosts, icon: 'heart' as const },
  ];

  return (
    <section className="mt-5" data-design="profile-activity-section">
      <div className="mb-3">
        <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#284778]">활동</h2>
      </div>
      <div className="card-surface grid grid-cols-4 divide-x divide-[#e7edf5] rounded-[20px] bg-white px-2 py-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
        {activityItems.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center px-1 text-center">
            <ActivityIcon name={item.icon} />
            <p className="mt-2 truncate text-[12px] font-bold text-[#7d8aa0]">{item.label}</p>
            <p className="mt-1 text-[18px] font-black leading-[22px] text-[#2a4a7d]">{item.value ?? item.unavailableLabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
