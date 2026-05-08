import { MoviePosterVisual } from '../home/MoviePosterVisual';
import type { DiaryListItemView } from './diary-dashboard-types';

type DiaryListItemProps = {
  item: DiaryListItemView;
};

export function DiaryListItem({ item }: DiaryListItemProps) {
  return (
    <article className="flex gap-3 rounded-[24px] bg-white p-3 shadow-[0_12px_30px_rgba(31,42,68,0.07)]">
      <MoviePosterVisual gradient={item.posterGradient} imageUrl={item.posterUrl} label={item.posterUrl ? undefined : item.mediaTitle} className="h-[104px] w-[72px] shrink-0 rounded-[18px]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-extrabold text-[#1f2a44]">{item.mediaTitle}</h3>
            <p className="mt-0.5 truncate text-[12px] font-bold text-[#216bd8]">{item.diaryTitle}</p>
          </div>
          <div className="flex shrink-0 gap-1 text-[#9aa6b7]">
            <button type="button" aria-label={`${item.mediaTitle} 북마크`} className="grid h-7 w-7 place-items-center rounded-full bg-[#f6f8fc]">{item.isBookmarked ? '♥' : '♡'}</button>
            <button type="button" aria-label={`${item.mediaTitle} 더보기`} className="grid h-7 w-7 place-items-center rounded-full bg-[#f6f8fc]">⋯</button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#8d98aa]">
          <span>{item.watchedDate}</span>
          <span aria-label={`평점 ${item.rating}점`} className="text-[#ef9b2d]">★ {item.rating.toFixed(1)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-[18px] text-[#6d7890]">{item.contentPreview}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 gap-1 overflow-hidden">
            {item.genreNames.slice(0, 2).map((genre) => (
              <span key={genre} className="shrink-0 rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-bold text-[#216bd8]">{genre}</span>
            ))}
          </div>
          <button type="button" aria-label={`${item.mediaTitle} 다이어리 수정`} className="shrink-0 rounded-full bg-[#1f2a44] px-3 py-1.5 text-[11px] font-extrabold text-white">수정</button>
        </div>
      </div>
    </article>
  );
}
