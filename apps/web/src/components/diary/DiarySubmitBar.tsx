export function DiarySubmitBar({ disabled, isSubmitting, onSubmit }: { disabled: boolean; isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-[#f5f8fc] via-[#f5f8fc]/95 to-transparent px-5 pb-5 pt-4">
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
