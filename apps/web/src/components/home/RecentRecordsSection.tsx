import { MoviePosterVisual } from './MoviePosterVisual';
import { SectionTitle } from './SectionTitle';

export type RecentRecord = {
  title: string;
  desc: string;
  date: string;
  rating: string;
  gradient: string;
};

export type RecentRecordsSectionProps = {
  records: RecentRecord[];
};

export function RecentRecordsSection({ records }: RecentRecordsSectionProps) {
  return (
    <>
      <SectionTitle title="최근 기록" />
      <section className="space-y-3">
        {records.map((record) => (
          <article key={record.title} className="card-surface flex items-center gap-3 rounded-[18px] p-3 max-[374px]:gap-2.5">
            <MoviePosterVisual gradient={record.gradient} className="h-12 w-[72px] shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-[#26334a]">{record.title}</h3>
              <p className="mt-1 truncate text-[11px] font-semibold text-[#8b96a8]">{record.desc}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold text-[#a0aabd]">{record.date}</p>
              <p className="mt-1 text-xs font-extrabold text-[#ff5050]">★ {record.rating}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
