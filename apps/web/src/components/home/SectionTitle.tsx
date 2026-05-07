export type SectionTitleProps = {
  title: string;
  actionLabel?: string;
};

export function SectionTitle({ title, actionLabel = '전체 보기 ›' }: SectionTitleProps) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">{title}</h2>
      <button className="text-[12px] font-bold leading-[16px] text-[#8d98aa]">{actionLabel}</button>
    </div>
  );
}
