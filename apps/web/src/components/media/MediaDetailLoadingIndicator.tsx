export function MediaDetailLoadingIndicator() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0d1726]/18 backdrop-blur-[1px]" role="status" aria-label="상세 정보를 불러오는 중">
      <div className="grid size-14 place-items-center rounded-full bg-white/95 shadow-[0_16px_36px_rgba(23,41,71,0.18)]">
        <span className="size-7 animate-spin rounded-full border-[3px] border-[#dbe7f6] border-t-[#2f7eea]" aria-hidden="true" />
      </div>
    </div>
  );
}
