import type { DiaryGenreRatio } from './diary-dashboard-types';

type DiaryGenreRatioCardProps = {
  items: DiaryGenreRatio[];
};

const iconByKind = {
  sf: '✦',
  drama: '●',
  thriller: '◆',
  action: '▲',
  etc: '◇',
};

export function DiaryGenreRatioCard({ items }: DiaryGenreRatioCardProps) {
  return (
    <article className="flex flex-col rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(31,42,68,0.07)] min-[390px]:max-h-[430px]">
      <h3 className="mb-4 shrink-0 text-[15px] font-extrabold text-[#1f2a44]">장르별 기록 비율</h3>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 overscroll-contain">
        {items.map((item) => (
          <div key={item.genre}>
            <div className="mb-1 flex items-center justify-between gap-3 text-[12px] font-bold">
              <span className="min-w-0 truncate text-[#4b5875]"><span aria-hidden="true" className="mr-2 text-[#216bd8]">{iconByKind[item.iconKind]}</span>{item.genre}</span>
              <span className="shrink-0 text-[#8d98aa]">{item.percentage}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={item.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.genre} 기록 비율 ${item.percentage}%`}
              className="h-2 overflow-hidden rounded-full bg-[#eef2f7]"
            >
              <div className="h-full rounded-full bg-[#216bd8]" style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
