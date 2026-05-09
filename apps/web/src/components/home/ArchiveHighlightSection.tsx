import { MoviePosterVisual } from './MoviePosterVisual';

function ContinueWritingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.2 2.8h8.1a2 2 0 0 1 2 2v10.4H5.1a2 2 0 0 1-2-2V3.8c0-.6.4-1 1.1-1Z" stroke="white" strokeWidth="1.7" />
      <path d="M6.1 2.8v12.4M8.3 7h3.5M8.3 10.2h2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArchivePoster({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div data-design="archive-poster" className="relative h-[154px] w-[126px] shrink-0 overflow-hidden rounded-[14px] shadow-[0_12px_20px_rgba(22,43,75,0.18)] max-[374px]:h-[142px] max-[374px]:w-[112px]">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center"
          style={{ objectPosition: 'center center' }}
        />
      ) : (
        <MoviePosterVisual gradient="from-[#e9eef7] via-[#f6f8fc] to-[#dfe8f5]" className="h-full w-full rounded-[14px]" />
      )}
    </div>
  );
}

export type ArchiveHighlight = {
  posterSrc?: string | null;
  posterAlt: string;
  eyebrow: string;
  title: string;
  meta: string;
  quote: string;
};

export type ArchiveHighlightSectionProps = {
  item: ArchiveHighlight;
};

export function ArchiveHighlightSection({ item }: ArchiveHighlightSectionProps) {
  return (
    <section className="archive-gradient-card card-surface mt-4 rounded-[24px] bg-[linear-gradient(145deg,#ffffff_0%,#f7fbff_48%,#eef6ff_100%)] px-4 pb-3 pt-4 shadow-[0_14px_30px_rgba(40,83,145,0.105)] ring-[#eaf0f8] max-[374px]:px-3.5">
      <p className="mb-3 flex items-center gap-1.5 text-[13px] font-extrabold leading-[18px] text-[#236fd7]">
        <span className="text-[#236fd7]">✣</span> For Your Archive
      </p>
      <div className="flex gap-4 max-[374px]:gap-3">
        <ArchivePoster src={item.posterSrc} alt={item.posterAlt} />
        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          <div>
            <span className="inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-[11px] font-extrabold text-[#2f7eea]">{item.eyebrow}</span>
            <h1 className="mt-2.5 text-[25px] font-black leading-[29px] tracking-[-0.04em] text-[#132b55] max-[374px]:text-[22px]">{item.title}</h1>
            <p className="mt-1 text-[12px] font-bold leading-[16px] text-[#8d98a8]">{item.meta}</p>
            <p className="mt-3.5 text-[12px] font-semibold leading-[18px] text-[#788395]">{item.quote}</p>
          </div>
          <div className="archive-action-row mt-auto flex items-center gap-2 pt-3.5">
            <button className="archive-primary-action flex h-[34px] flex-[1.2] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#2f7eea] px-3 text-[11px] font-extrabold text-white shadow-[0_9px_18px_rgba(47,126,234,0.28)]">
              <ContinueWritingIcon /> 기록 이어쓰기
            </button>
            <button className="archive-secondary-action h-[34px] shrink-0 whitespace-nowrap rounded-full border border-[#e9eef6] bg-[#fbfdff] px-3.5 text-[11px] font-extrabold text-[#5e6b7b] shadow-[0_5px_12px_rgba(31,65,114,0.055)]">상세 보기 ›</button>
          </div>
        </div>
      </div>
      <div className="archive-carousel-indicator mt-3.5 flex justify-center gap-[5px]">
        <span className="h-[5px] w-[22px] rounded-full bg-[#2f7eea]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#dbe5f3]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#dbe5f3]" />
      </div>
    </section>
  );
}
