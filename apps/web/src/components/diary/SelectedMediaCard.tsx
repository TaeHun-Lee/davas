export type DiaryComposeMedia = {
  id: string;
  title: string;
  originalTitle?: string | null;
  posterUrl?: string | null;
  meta: string;
};

function PosterPlaceholder() {
  return (
    <div className="flex h-[126px] w-[86px] shrink-0 items-end overflow-hidden rounded-[16px] bg-gradient-to-br from-[#07111f] via-[#194c85] to-[#8ba9d6] p-2 shadow-[0_12px_22px_rgba(21,38,69,0.18)]">
      <span className="text-[15px] font-black text-[#ff5a52]">인셉션</span>
    </div>
  );
}

export function SelectedMediaCard({ media }: { media: DiaryComposeMedia }) {
  return (
    <section className="card-surface flex gap-4 rounded-[24px] p-4 shadow-[0_14px_32px_rgba(31,65,114,0.09)]">
      {media.posterUrl ? (
        <img src={media.posterUrl} alt={`${media.title} 포스터`} className="h-[126px] w-[86px] shrink-0 rounded-[16px] object-cover shadow-[0_12px_22px_rgba(21,38,69,0.18)]" />
      ) : (
        <PosterPlaceholder />
      )}
      <div className="min-w-0 flex-1 py-1">
        <h2 className="truncate text-[21px] font-black leading-[28px] tracking-[-0.04em] text-[#2f6fb4]">{media.title}</h2>
        <p className="mt-1 truncate text-[13px] font-bold text-[#8996aa]">{media.originalTitle}</p>
        <p className="mt-3 text-[12px] font-extrabold text-[#728095]">{media.meta}</p>
        <span className="mt-4 inline-flex rounded-full bg-[#eef5ff] px-3 py-1.5 text-[11px] font-extrabold text-[#2f7eea]">선택한 작품</span>
      </div>
    </section>
  );
}

export const mockDiaryMedia: DiaryComposeMedia = {
  id: 'mock-inception',
  title: '인셉션',
  originalTitle: 'Inception',
  posterUrl: null,
  meta: 'SF · 스릴러 · 2010',
};
