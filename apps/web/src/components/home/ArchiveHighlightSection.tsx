'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaHeroCarousel, type MediaHeroCarouselItem } from '../media/MediaHeroCarousel';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { getMediaDetail, type MediaDetail } from '../../lib/api/media';

export type ArchiveHighlight = {
  diaryId?: string;
  mediaId?: string;
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
      id: item.mediaId ?? item.diaryId ?? item.title,
      diaryId: item.diaryId,
      mediaId: item.mediaId,
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
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<MediaDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  async function openDetail(item: MediaHeroCarouselItem) {
    if (!item.mediaId) return;
    const mediaDetail = await getMediaDetail(item.mediaId);
    setSelectedMedia(mediaDetail);
    setIsDetailOpen(true);
  }

  return (
    <>
      <MediaHeroCarousel
        cardLabel={<><span className="text-[#236fd7]">✣</span> For Your Archive</>}
        items={buildArchiveHeroItems(item)}
        className="mt-4 bg-[linear-gradient(145deg,#ffffff_0%,#f7fbff_48%,#eef6ff_100%)] px-4 pb-3 pt-4 ring-[#eaf0f8] max-[374px]:px-3.5"
        actions={(item) => [
          ...(item.diaryId ? [{ label: '수정하기', kind: 'primary' as const, onClick: () => router.push(`/diary/${item.diaryId}/edit`) }] : []),
          ...(item.mediaId ? [{ label: '상세보기', kind: 'secondary' as const, onClick: () => void openDetail(item) }] : []),
        ]}
      />
      <MediaDetailModal media={selectedMedia} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} returnTo="/" />
    </>
  );
}
