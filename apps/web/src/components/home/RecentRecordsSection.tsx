'use client';

import { useRouter } from 'next/navigation';
import { MoviePosterVisual } from './MoviePosterVisual';
import { SectionTitle } from './SectionTitle';

export type RecentRecord = {
  diaryId?: string;
  title: string;
  desc: string;
  date: string;
  rating: string;
  gradient?: string;
  posterUrl?: string | null;
};

export type RecentRecordsSectionProps = {
  records: RecentRecord[];
};

export function RecentRecordsSection({ records }: RecentRecordsSectionProps) {
  const router = useRouter();

  function openRecord(record: RecentRecord) {
    if (!record.diaryId) return;
    router.push(`/diary/${record.diaryId}/edit`);
  }

  return (
    <>
      <SectionTitle title="최근 기록" onAction={() => router.push('/diary')} />
      <section className="space-y-3">
        {records.map((record) => (
          <article key={record.diaryId ?? record.title} className="card-surface rounded-[18px] max-[374px]:gap-2.5">
            <button type="button" aria-label={`${record.title} 다이어리 수정하기`} className="flex w-full items-center gap-3 p-3 text-left max-[374px]:gap-2.5" onClick={() => openRecord(record)}>
              <MoviePosterVisual gradient={record.gradient ?? 'from-[#e9eef7] via-[#f6f8fc] to-[#dfe8f5]'} imageUrl={record.posterUrl} className="h-12 w-[72px] shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold text-[#26334a]">{record.title}</h3>
                <p className="mt-1 truncate text-[11px] font-semibold text-[#8b96a8]">{record.desc}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold text-[#a0aabd]">{record.date}</p>
                <p className="mt-1 text-xs font-extrabold text-[#ff5050]">★ {record.rating}</p>
              </div>
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
