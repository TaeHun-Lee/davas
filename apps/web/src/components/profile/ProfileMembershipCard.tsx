function CrownIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4.5 9 4 3.2L12 6l3.5 6.2 4-3.2-1.6 8.4H6.1L4.5 9Z" fill="white" />
      <path d="M7 19h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="#8e9aaf" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProfileMembershipCard() {
  return (
    <section className="card-surface mt-4 flex items-center gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(31,65,114,0.08)]" data-design="profile-membership-card">
      <div className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-full bg-[#326ed0] shadow-[0_10px_18px_rgba(50,110,208,0.25)]">
        <CrownIcon />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-black leading-[20px] text-[#284778]">Davas Pro 멤버십</h3>
        <p className="mt-1 truncate text-[12px] font-semibold text-[#8a96a9]">프로 멤버만의 특별한 기능을 경험해보세요.</p>
      </div>
      <button type="button" className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-white px-4 text-[12px] font-extrabold text-[#63738c] shadow-[0_8px_18px_rgba(31,65,114,0.08)]">
        혜택 보기 <ChevronIcon />
      </button>
    </section>
  );
}
