import { MoviePosterVisual } from './MoviePosterVisual';
import { SectionTitle } from './SectionTitle';

export type MediaPosterItem = {
  title: string;
  meta: string;
  rating: string;
  gradient: string;
};

export type MediaPosterRowSectionProps = {
  title: string;
  items: MediaPosterItem[];
  itemClassName?: string;
  posterClassName?: string;
};

export function MediaPosterRowSection({
  title,
  items,
  itemClassName = 'w-[70px]',
  posterClassName = 'h-[104px] w-[70px]',
}: MediaPosterRowSectionProps) {
  return (
    <>
      <SectionTitle title={title} />
      <section className="-mx-4 overflow-x-auto px-4 pb-1 min-[390px]:-mx-5 min-[390px]:px-5 [scrollbar-width:none]">
        <div className="flex gap-3">
          {items.map((item) => (
            <article key={item.title} className={`${itemClassName} shrink-0`}>
              <MoviePosterVisual gradient={item.gradient} className={posterClassName} />
              <h3 className="mt-2 line-clamp-2 text-[11px] font-extrabold leading-4 text-[#27334a]">{item.title}</h3>
              <p className="mt-0.5 truncate text-[10px] font-semibold text-[#99a4b5]">{item.meta}</p>
              <p className="mt-0.5 text-[11px] font-extrabold text-[#ff5050]">★ {item.rating}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
