const filters = ['전체', '영화', '드라마', '배우', '감독', '장르', '평점순'];

export function ExploreFilterChips() {
  return (
    <section className="explore-filter-row -mx-1 mt-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      <div className="flex gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold leading-[16px] shadow-[0_6px_14px_rgba(31,65,114,0.07)] ${
              index === 0 ? 'bg-[#216bd8] text-white' : 'border border-[#edf2f8] bg-white text-[#59677d]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}
