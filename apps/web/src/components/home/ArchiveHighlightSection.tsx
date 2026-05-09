import { MediaHeroCarousel, type MediaHeroCarouselItem } from '../media/MediaHeroCarousel';

function ContinueWritingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.2 2.8h8.1a2 2 0 0 1 2 2v10.4H5.1a2 2 0 0 1-2-2V3.8c0-.6.4-1 1.1-1Z" stroke="white" strokeWidth="1.7" />
      <path d="M6.1 2.8v12.4M8.3 7h3.5M8.3 10.2h2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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

export function buildArchiveHeroItems(item: ArchiveHighlight): MediaHeroCarouselItem[] {
  return [
    {
      id: item.title,
      title: item.title,
      meta: item.meta,
      description: item.quote,
      eyebrow: item.eyebrow,
      imageUrl: item.posterSrc,
      imageAlt: item.posterAlt,
      imageVariant: 'poster',
    },
  ];
}

export function ArchiveHighlightSection({ item }: ArchiveHighlightSectionProps) {
  return (
    <MediaHeroCarousel
      cardLabel={<><span className="text-[#236fd7]">✣</span> For Your Archive</>}
      items={buildArchiveHeroItems(item)}
      className="mt-4 bg-[linear-gradient(145deg,#ffffff_0%,#f7fbff_48%,#eef6ff_100%)] px-4 pb-3 pt-4 ring-[#eaf0f8] max-[374px]:px-3.5"
      actions={() => [
        { label: '기록 이어쓰기', kind: 'primary', icon: <ContinueWritingIcon /> },
        { label: '상세 보기 ›', kind: 'secondary' },
      ]}
    />
  );
}
