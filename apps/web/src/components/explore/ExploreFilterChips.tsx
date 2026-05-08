export type ExploreFilter = '전체' | '영화' | '드라마' | '인물';

const filters: ExploreFilter[] = ['전체', '영화', '드라마', '인물'];

export function ExploreFilterChips({ activeFilter, onChange }: { activeFilter: ExploreFilter; onChange: (filter: ExploreFilter) => void }) {
  return (
    <section className="explore-filter-row -mx-1 mt-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-label={`${filter} 필터`}
            aria-pressed={filter === activeFilter}
            data-active={filter === activeFilter}
            onClick={() => onChange(filter)}
            className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold leading-[16px] shadow-[0_6px_14px_rgba(31,65,114,0.07)] transition ${
              filter === activeFilter ? 'bg-[#216bd8] text-white ring-[3px] ring-[#d8e8ff]' : 'border border-[#edf2f8] bg-white text-[#59677d]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}
