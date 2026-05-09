import type { FavoriteMediaItem } from '../../lib/api/media';

type ProfileFavoriteMediaSectionProps = {
  items: FavoriteMediaItem[];
};

function mediaTypeLabel(mediaType: string) {
  return mediaType === 'TV' ? '시리즈' : '영화';
}

function releaseYear(releaseDate: string | null) {
  return releaseDate?.slice(0, 4) ?? '연도 미상';
}

function FavoriteMediaCard({ item }: { item: FavoriteMediaItem }) {
  return (
    <article className="w-[118px] shrink-0" data-design="profile-favorite-media-card">
      <div className="relative h-[176px] overflow-hidden rounded-[16px] bg-[#dfe7f3] shadow-[0_14px_28px_rgba(31,65,114,0.14)]">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#e7eef8_0%,#cbd9ee_100%)]" aria-hidden="true" />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/52 px-2 py-1 text-[10px] font-black text-white backdrop-blur">
          {mediaTypeLabel(item.mediaType)}
        </span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[13px] font-black leading-[17px] tracking-[-0.03em] text-[#263d61]">{item.title}</h3>
      <p className="mt-1 line-clamp-1 text-[11px] font-bold text-[#8a96a9]">
        {item.genres[0] ?? '장르 미상'} · {releaseYear(item.releaseDate)}
      </p>
    </article>
  );
}

export function ProfileFavoriteMediaSection({ items }: ProfileFavoriteMediaSectionProps) {
  return (
    <section className="mt-6" data-design="profile-favorite-media-section">
      <div className="mb-3">
        <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#284778]">내가 찜한 컨텐츠</h2>
        <p className="mt-1 text-[12px] font-bold text-[#8a96a9]">작품 상세에서 찜한 콘텐츠를 모아봤어요.</p>
      </div>
      {items.length > 0 ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-1 min-[390px]:-mx-5 min-[390px]:px-5">
          <div className="flex gap-3">
            {items.map((item) => (
              <FavoriteMediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card-surface rounded-[20px] bg-white px-5 py-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
          <p className="text-[13px] font-bold leading-5 text-[#8a96a9]">아직 찜한 컨텐츠가 없어요.</p>
        </div>
      )}
    </section>
  );
}
