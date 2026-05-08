type DiarySummaryCardProps = {
  icon: string;
  label: string;
  value: string;
  caption: string;
  tone: 'blue' | 'red' | 'yellow' | 'navy';
};

const toneClasses = {
  blue: 'bg-[#edf5ff] text-[#216bd8]',
  red: 'bg-[#fff1f2] text-[#ef5870]',
  yellow: 'bg-[#fff7db] text-[#d99a16]',
  navy: 'bg-[#eef1fb] text-[#435071]',
};

export function DiarySummaryCard({ icon, label, value, caption, tone }: DiarySummaryCardProps) {
  return (
    <article className="min-w-0 rounded-[20px] bg-white p-3 shadow-[0_12px_30px_rgba(31,42,68,0.07)]">
      <div className={`mb-3 grid h-8 w-8 place-items-center rounded-full text-[15px] ${toneClasses[tone]}`}>{icon}</div>
      <p className="truncate text-[11px] font-bold text-[#8d98aa]">{label}</p>
      <strong className="mt-1 block truncate text-[18px] font-black leading-6 tracking-[-0.03em] text-[#1f2a44]">{value}</strong>
      <span className="mt-1 block truncate text-[10px] font-semibold text-[#b0bac8]">{caption}</span>
    </article>
  );
}
