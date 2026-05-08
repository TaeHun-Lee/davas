export function DiarySubmitBar({ disabled, isSubmitting, onSubmit }: { disabled: boolean; isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#f8fafd] via-[#f8fafd]/95 to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
      <button
        type="button"
        disabled={disabled || isSubmitting}
        onClick={onSubmit}
        className="w-full rounded-[22px] bg-[#ff5a52] py-4 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(255,90,82,0.28)] disabled:bg-[#c8d1df] disabled:shadow-none"
      >
        {isSubmitting ? '작성 중...' : '작성 완료'}
      </button>
    </div>
  );
}
