import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { MoviePosterVisual } from '../home/MoviePosterVisual';

export type GenreRecommendationTile = {
  id: string;
  label: string;
  description: string;
  items: MediaRecommendationItem[];
  gradient?: string;
};

const placeholderGenreTiles = [
  { id: 'genre-placeholder-1', gradient: 'from-[#1f2937] via-[#526173] to-[#c08b5e]' },
  { id: 'genre-placeholder-2', gradient: 'from-[#0f172a] via-[#1e3a5f] to-[#a6c8e7]' },
];

export type GenreRecommendationSectionProps = {
  tiles?: GenreRecommendationTile[];
  onSelect?: (item: MediaRecommendationItem) => void;
};

export function GenreRecommendationSection({ tiles = [], onSelect }: GenreRecommendationSectionProps) {
  const genreTiles = tiles;

  return (
    <section className="card-surface mt-6 rounded-[24px] p-4">
      <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">장르별 추천</h2>
      <div className="mt-3 space-y-4">
        {genreTiles.length === 0
          ? placeholderGenreTiles.map((tile) => (
              <article key={tile.id} data-design="genre-recommendation-placeholder" aria-label="장르 추천을 불러오는 중" className={`overflow-hidden rounded-[20px] bg-gradient-to-br ${tile.gradient} p-3 shadow-[0_12px_24px_rgba(17,35,64,0.14)]`}>
                <div className="space-y-2" aria-hidden="true">
                  <div className="h-4 w-2/3 rounded-full bg-white/35" />
                  <div className="h-3 w-1/2 rounded-full bg-white/25" />
                </div>
                <div className="mt-3 flex gap-2 overflow-hidden pb-1" aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="h-[92px] w-[62px] shrink-0 rounded-[13px] bg-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.12)]" />
                  ))}
                </div>
              </article>
            ))
          : genreTiles.map((tile, index) => {
              const gradient = tile.gradient ?? (index % 2 === 0 ? 'from-[#1f2937] via-[#526173] to-[#c08b5e]' : 'from-[#0f172a] via-[#1e3a5f] to-[#a6c8e7]');

              return (
                <article key={tile.id} className={`overflow-hidden rounded-[20px] bg-gradient-to-br ${gradient} p-3 shadow-[0_12px_24px_rgba(17,35,64,0.14)]`}>
                  <div className="flex items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-extrabold leading-[18px] text-white drop-shadow">{tile.label}</h3>
                      <p className="mt-1 line-clamp-1 text-[10px] font-bold text-white/80">{tile.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {tile.items.map((item) => (
                      <button key={`${tile.id}-${item.externalId}`} type="button" aria-label={`${item.title} 상세 보기`} onClick={() => onSelect?.(item)} className="w-[62px] shrink-0 text-left">
                        <MoviePosterVisual gradient="from-white/20 via-white/10 to-white/5" imageUrl={item.posterUrl} className="h-[92px] w-[62px] rounded-[13px] shadow-[0_8px_16px_rgba(0,0,0,0.18)]" />
                        <span className="mt-1.5 block line-clamp-2 text-[10px] font-extrabold leading-[13px] text-white">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
      </div>
    </section>
  );
}
