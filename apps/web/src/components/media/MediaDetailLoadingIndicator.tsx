type MediaDetailLoadingIndicatorProps = {
  label?: string;
  fullScreen?: boolean;
};

function LoadingSpinner() {
  return <span className="size-7 animate-spin rounded-full border-[3px] border-[#dbe7f6] border-t-[#2f7eea]" aria-hidden="true" />;
}

export function MediaDetailLoadingIndicator({ label = '상세 정보를 불러오는 중', fullScreen = true }: MediaDetailLoadingIndicatorProps) {
  if (!fullScreen) {
    return (
      <div className="card-surface mt-3 grid min-h-[72px] place-items-center rounded-[18px] p-4" role="status" aria-label={label}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0d1726]/18 backdrop-blur-[1px]" role="status" aria-label={label}>
      <div className="grid size-14 place-items-center rounded-full bg-white/95 shadow-[0_16px_36px_rgba(23,41,71,0.18)]">
        <LoadingSpinner />
      </div>
    </div>
  );
}
