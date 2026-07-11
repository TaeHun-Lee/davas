import Link from 'next/link';
import type { WatchlistItem } from '../../lib/api/watchlist';

export function ProfileWatchlistSection({ items }: { items: WatchlistItem[] }) {
  return (
    <section className="mt-6" aria-labelledby="profile-watchlist-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="profile-watchlist-title" className="text-[17px] font-black tracking-[-0.03em] text-[#284778]">보고 싶은 작품</h2>
          <p className="mt-1 text-[12px] font-bold text-[#65758a]">다음 감상을 위해 저장한 목록이에요.</p>
        </div>
        <Link href="/watchlist" className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-[12px] font-black text-[#216bd8]">전체 보기</Link>
      </div>
      {items.length ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-1 min-[390px]:-mx-5 min-[390px]:px-5">
          <div className="flex gap-3">
            {items.slice(0, 6).map((item) => (
              <Link key={item.id} href={`/explore?mediaId=${item.mediaId}`} className="w-[118px] shrink-0 rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#216bd8]">
                <div className="h-[176px] overflow-hidden rounded-[16px] bg-[#dfe7f3] shadow-[0_14px_28px_rgba(31,65,114,0.14)]">
                  {item.media?.posterUrl ? <img src={item.media.posterUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#e7eef8,#cbd9ee)]" />}
                </div>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-black leading-[17px] text-[#263d61]">{item.media?.title ?? '작품 정보 없음'}</h3>
                <p className="mt-1 text-[11px] font-bold text-[#65758a]">{item.priority === 'HIGH' ? '우선 감상' : item.priority === 'LOW' ? '여유 있게' : '보통'}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : <div className="rounded-[20px] bg-white px-5 py-6 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"><p className="text-[13px] font-bold text-[#65758a]">아직 저장한 작품이 없어요.</p><Link href="/explore" className="mt-3 inline-flex min-h-11 items-center rounded-[15px] bg-[#fff0ee] px-4 text-[13px] font-black text-[#b93832]">작품 찾아보기</Link></div>}
    </section>
  );
}
