import type { MediaSearchResult } from '../../lib/api/media';
import type { PersonCreditsStatus } from '../../hooks/usePeopleSearch';
import { getTmdbGenreNames } from './media-genres';

function CreditPoster({ item }: { item: MediaSearchResult }) {
  if (item.posterUrl) {
    return <img src={item.posterUrl} alt={`${item.title} 포스터`} className="h-[86px] w-[58px] shrink-0 rounded-[13px] object-cover shadow-[0_8px_18px_rgba(21,38,69,0.13)]" />;
  }

  return (
    <div className="flex h-[86px] w-[58px] shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#d9e9ff] via-[#f3f7ff] to-[#ffe5df] text-[10px] font-black text-[#216bd8] shadow-[0_8px_18px_rgba(21,38,69,0.1)]">
      DAVAS
    </div>
  );
}

function formatCreditMeta(item: MediaSearchResult) {
  const year = item.releaseDate?.slice(0, 4);
  const type = item.mediaType === 'TV' ? '드라마' : '영화';
  const genres = getTmdbGenreNames({ genreIds: item.genreIds, mediaType: item.mediaType }).slice(0, 2).join(' · ');

  return [type, genres, year].filter(Boolean).join(' · ');
}

export function PersonCreditResults({
  personName,
  items,
  status,
  onSelect,
}: {
  personName?: string;
  items: MediaSearchResult[];
  status: PersonCreditsStatus;
  onSelect: (item: MediaSearchResult) => void;
}) {
  if (status === 'idle' && !personName) {
    return null;
  }

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-extrabold leading-[22px] tracking-[-0.02em] text-[#1f2a44]">출연 작품</h2>
        {personName ? <span className="truncate text-[11px] font-bold text-[#9aa6b8]">{personName}</span> : null}
      </div>
      {status === 'loading' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#8b96a8]">출연 작품을 불러오고 있어요...</div> : null}
      {status === 'empty' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#8b96a8]">선택 가능한 출연 작품이 없어요</div> : null}
      {status === 'error' ? <div className="card-surface mt-3 rounded-[18px] p-4 text-[13px] font-bold text-[#ef4444]">출연 작품을 불러오지 못했어요.</div> : null}
      {status === 'results' ? (
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <button key={`${item.mediaType}-${item.externalId}`} type="button" onClick={() => onSelect(item)} className="card-surface flex w-full gap-3 rounded-[18px] p-3 text-left transition active:scale-[0.99]">
              <CreditPoster item={item} />
              <span className="flex min-w-0 flex-1 flex-col py-1">
                <span className="line-clamp-1 text-[15px] font-extrabold leading-[20px] text-[#1f2a44]">{item.title}</span>
                <span className="mt-1 text-[11px] font-bold leading-[15px] text-[#8b96a8]">{formatCreditMeta(item)}</span>
                <span className="mt-2 line-clamp-2 text-[11px] font-semibold leading-[16px] text-[#747f91]">{item.overview || 'TMDB에서 제공한 소개가 아직 없어요.'}</span>
                <span className="mt-auto pt-2 text-[11px] font-extrabold text-[#216bd8]">작품 선택</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
