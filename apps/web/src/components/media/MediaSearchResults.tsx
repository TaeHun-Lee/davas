import type { MediaSearchResult } from '../../lib/api/media';
import type { MediaSearchStatus } from '../../hooks/useMediaSearch';
import { MediaDetailLoadingIndicator } from './MediaDetailLoadingIndicator';
import { getTmdbGenreNames } from './media-genres';

function SearchResultPoster({ item }: { item: MediaSearchResult }) {
  if (item.posterUrl) {
    return <img src={item.posterUrl} alt={`${item.title} 포스터`} className="h-[92px] w-[62px] shrink-0 rounded-[12px] object-cover shadow-[0_8px_16px_rgba(21,38,69,0.12)]" />;
  }

  return <div className="h-[92px] w-[62px] shrink-0 rounded-[12px] bg-gradient-to-br from-[#dbe7f8] to-[#9fb9df] shadow-[0_8px_16px_rgba(21,38,69,0.12)]" />;
}

export function MediaSearchResults({
  items,
  status,
  query,
  onSelect,
}: {
  items: MediaSearchResult[];
  status: MediaSearchStatus;
  query: string;
  onSelect: (item: MediaSearchResult) => void;
}) {
  if (query.trim().length < 2) {
    return null;
  }

  return (
    <section className="mt-5">
      <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">검색 결과</h2>
      {status === 'searching' ? <MediaDetailLoadingIndicator label="검색 중" fullScreen={false} /> : null}
      {status === 'empty' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#8b96a8]">검색 결과가 없어요</div> : null}
      {status === 'error' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#ef4444]">검색을 불러오지 못했어요. TMDB API 설정을 확인해주세요.</div> : null}
      {status === 'results' ? (
        <div className="mt-3 space-y-3">
          {items.map((item) => {
            const releaseYear = item.releaseDate?.slice(0, 4) ?? '연도 미상';
            const genreNames = getTmdbGenreNames({ genreIds: item.genreIds, mediaType: item.mediaType });
            const genreText = genreNames.slice(0, 2).join(' · ');
            const mediaMeta = [item.mediaType === 'TV' ? '드라마' : '영화', releaseYear, genreText].filter(Boolean).join(' · ');
            return (
              <button
                key={`${item.externalProvider}-${item.externalId}`}
                type="button"
                aria-label={`${item.title} 검색 결과 선택`}
                onClick={() => onSelect(item)}
                className="card-surface flex w-full gap-3 rounded-[18px] p-3 text-left transition active:scale-[0.99]"
              >
                <SearchResultPoster item={item} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-extrabold leading-[20px] text-[#1f2a44]">{item.title}</span>
                  <span className="mt-1 block text-[11px] font-bold text-[#8b96a8]">{mediaMeta}</span>
                  <span className="mt-2 block line-clamp-2 text-[11px] font-semibold leading-[17px] text-[#788395]">{item.overview || '작품 소개가 아직 준비되지 않았어요.'}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
