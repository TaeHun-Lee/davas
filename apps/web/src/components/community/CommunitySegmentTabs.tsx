import type { CommunityTab } from './community-types';

type CommunitySegmentTabsProps = {
  activeTab: CommunityTab;
  onChange: (tab: CommunityTab) => void;
};

const tabs: { key: CommunityTab; label: string }[] = [
  { key: 'recommended', label: '추천' },
  { key: 'popular', label: '인기' },
  { key: 'following', label: '팔로잉' },
  { key: 'latest', label: '최신' },
];

export function CommunitySegmentTabs({ activeTab, onChange }: CommunitySegmentTabsProps) {
  return (
    <div className="mb-6 rounded-[20px] bg-white p-1.5 shadow-[0_10px_24px_rgba(31,65,114,0.07)]" role="tablist" aria-label="커뮤니티 피드 필터">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.key)}
              className={`h-9 rounded-[16px] text-[13px] font-extrabold transition ${active ? 'bg-[#216bd8] text-white shadow-[0_8px_18px_rgba(33,107,216,0.25)]' : 'text-[#4c5b73]'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
