import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { MoviePosterVisual } from '../home/MoviePosterVisual';

export type GenreRecommendationTile = {
  id: string;
  label: string;
  description: string;
  items: MediaRecommendationItem[];
  gradient?: string;
};

const defaultGenreTiles: GenreRecommendationTile[] = [
  { id: 'rainy-day', label: '비 오는 날 보기 좋은 영화', description: '차분한 밤에 어울리는 작품', items: [], gradient: 'from-[#1f2937] via-[#526173] to-[#c08b5e]' },
  { id: 'immersive-thriller', label: '몰입감 높은 스릴러', description: '긴장감 있는 이야기', items: [], gradient: 'from-[#0f172a] via-[#1e3a5f] to-[#a6c8e7]' },
];

export type GenreRecommendationSectionProps = {
  tiles: GenreRecommendationTile[];
  onSelect?: (item: MediaRecommendationItem) => void;
};

export function GenreRecommendationSection({ tiles = defaultGenreTiles, onSelect }: GenreRecommendationSectionProps) {
  const genreTiles = tiles.length > 0 ? tiles : defaultGenreTiles;

  return (
    <section className="card-surface mt-6 rounded-[24px] p-4">
      <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">장르별 추천</h2>
      <div className="mt-3 space-y-4">
        {genreTiles.map((tile, index) => {
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
                  <button key={`${tile.id}-${item.externalId}`} type="button" onClick={() => onSelect?.(item)} className="w-[62px] shrink-0 text-left">
                    <MoviePosterVisual gradient="from-white/20 via-white/10 to-white/5" imageUrl={item.posterUrl} className="h-[92px] w-[62px] rounded-[13px] shadow-[0_8px_16px_rgba(0,0,0,0.18)]" />
                    <span className="mt-1.5 block line-clamp-2 text-[10px] font-extrabold leading-[13px] text-white">{item.title}</span>
                  </button>
                ))}
                {tile.items.length === 0 ? <p className="rounded-[14px] bg-white/15 px-3 py-4 text-[11px] font-bold text-white/80">추천 작품을 불러오는 중이에요.</p> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
