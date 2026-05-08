export function DiaryContentField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-[22px] bg-white p-4 shadow-[0_12px_28px_rgba(31,65,114,0.06)]">
      <span className="text-[14px] font-black text-[#1f2a44]">감상 기록</span>
      <span className="mt-3 block rounded-[18px] bg-[#f6f9fd] p-4">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={3000}
          placeholder="이 작품을 보고 느낀 감정을 자유롭게 기록해보세요."
          className="min-h-[210px] w-full resize-none bg-transparent text-[14px] font-semibold leading-[22px] text-[#2f415f] outline-none placeholder:text-[#a1acba]"
        />
        <span className="block text-right text-[11px] font-bold text-[#98a5b7]">{value.length} / 3000</span>
      </span>
    </label>
  );
}
