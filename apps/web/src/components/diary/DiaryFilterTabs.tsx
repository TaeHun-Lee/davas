import type { DiaryFilterTab } from './diary-dashboard-types';

const tabs: DiaryFilterTab[] = ['전체', '최근', '평점순', '캘린더'];

type DiaryFilterTabsProps = {
  activeTab: DiaryFilterTab;
  onChange: (tab: DiaryFilterTab) => void;
};

export function DiaryFilterTabs({ activeTab, onChange }: DiaryFilterTabsProps) {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="다이어리 보기 필터">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === activeTab}
          aria-pressed={tab === activeTab}
          aria-label={`${tab} 다이어리 필터`}
          onClick={() => onChange(tab)}
          className={
            tab === activeTab
              ? 'h-9 shrink-0 rounded-full bg-[#216bd8] px-4 text-[13px] font-extrabold text-white shadow-[0_8px_18px_rgba(33,107,216,0.22)]'
              : 'h-9 shrink-0 rounded-full bg-white px-4 text-[13px] font-bold text-[#8d98aa] shadow-[0_8px_18px_rgba(31,42,68,0.05)]'
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
