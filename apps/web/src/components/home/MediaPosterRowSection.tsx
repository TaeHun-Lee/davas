import type { MediaSearchResult } from '../../lib/api/media';
import { MoviePosterVisual } from './MoviePosterVisual';
import { SectionTitle } from './SectionTitle';

export type MediaPosterItem = {
  mediaId?: string;
  title: string;
  meta: string;
  rating: string;
  gradient: string;
  posterUrl?: string | null;
  sourceItem?: MediaSearchResult;
};

export type MediaPosterRowSectionProps = {
  title: string;
  items: MediaPosterItem[];
  itemClassName?: string;
  posterClassName?: string;
  actionLabel?: string;
  onAction?: () => void;
  onSelect?: (item: MediaSearchResult) => void;
  onItemClick?: (item: MediaPosterItem) => void;
};

export function MediaPosterRowSection({
  title,
  items,
  itemClassName = 'w-[70px]',
  posterClassName = 'h-[104px] w-[70px]',
  actionLabel,
  onAction,
  onSelect,
  onItemClick,
}: MediaPosterRowSectionProps) {
  return (
    <>
      <SectionTitle title={title} actionLabel={actionLabel} onAction={onAction} />
      <section className="-mx-4 overflow-x-auto px-4 pb-1 min-[390px]:-mx-5 min-[390px]:px-5 [scrollbar-width:none]">
        <div className="flex gap-3">
          {items.map((item) => {
            const card = (
              <>
                <MoviePosterVisual gradient={item.gradient} imageUrl={item.posterUrl} className={posterClassName} />
                <h3 className="mt-2 line-clamp-2 text-[11px] font-extrabold leading-4 text-[#27334a]">{item.title}</h3>
                <p className="mt-0.5 truncate text-[10px] font-semibold text-[#99a4b5]">{item.meta}</p>
                <p className="mt-0.5 text-[11px] font-extrabold text-[#ff5050]">★ {item.rating}</p>
              </>
            );

            return (
              <article key={`${item.title}-${item.meta}`} className={`${itemClassName} shrink-0`}>
                {onItemClick ? (
                  <button type="button" aria-label={`${item.title} 상세 보기`} className="block w-full text-left" onClick={() => onItemClick(item)}>
                    {card}
                  </button>
                ) : item.sourceItem && onSelect ? (
                  <button type="button" aria-label={`${item.title} 상세 보기`} className="block w-full text-left" onClick={() => onSelect(item.sourceItem!)}>
                    {card}
                  </button>
                ) : (
                  card
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
