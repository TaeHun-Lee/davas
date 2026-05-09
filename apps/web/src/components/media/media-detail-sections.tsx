import type { MediaDetail } from '../../lib/api/media';

export function DetailInfoCard({ title, children, showChevron = false }: { title: string; children: React.ReactNode; showChevron?: boolean }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]">{title}</h3>
        {showChevron ? <span className="text-[18px] font-black leading-none text-[#9aa6b8]">›</span> : null}
      </div>
      <div className="mt-2 text-[12px] font-semibold leading-[19px] text-[#5f6b7a]">{children}</div>
    </section>
  );
}

export function StillCutStrip({ media }: { media: MediaDetail }) {
  const stills = media.stillCuts?.length ? media.stillCuts : ([media.backdropUrl].filter(Boolean) as string[]);

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-black leading-[22px] tracking-[-0.025em] text-[#1f4e82]">스틸 컷</h3>
        <button type="button" className="text-[12px] font-extrabold text-[#7d889a]">더보기 &gt;</button>
      </div>
      {stills.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-2.5 max-[374px]:grid-cols-2">
          {stills.slice(0, 6).map((still, index) => (
            <img key={still} src={still} alt={`${media.title} 스틸 컷 ${index + 1}`} className="h-[92px] w-full rounded-[16px] object-cover shadow-[0_8px_18px_rgba(21,38,69,0.10)]" />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[16px] bg-white p-4 text-[12px] font-bold leading-[18px] text-[#7a8596] shadow-[0_8px_18px_rgba(21,38,69,0.07)] ring-1 ring-[#edf2f8]">
          TMDB 검색 결과에는 별도 스틸컷이 포함되지 않아요. 별도 스틸컷 API 연결 후 표시됩니다.
        </div>
      )}
    </section>
  );
}

export function BasicInfoGrid({ media }: { media: MediaDetail }) {
  const runtimeText = media.runtime ? `${media.runtime}분` : '정보 준비 중';
  const countries = media.countries?.length ? media.countries.join(', ') : media.country ?? '정보 준비 중';
  const cast = media.cast?.length ? media.cast.slice(0, 4).join(', ') : '정보 준비 중';
  const directorLabel = media.mediaType === 'TV' ? '크리에이터' : '감독';
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]">
      <h3 className="text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]">기본 정보</h3>
      <dl className="mt-3 space-y-2 text-[11px] leading-[16px]">
        <div className="flex gap-3"><dt className="w-14 shrink-0 font-extrabold text-[#2f4d73]">{directorLabel}</dt><dd className="font-semibold text-[#6e7889]">{media.director ?? '정보 준비 중'}</dd></div>
        <div className="flex gap-3"><dt className="w-14 shrink-0 font-extrabold text-[#2f4d73]">출연</dt><dd className="font-semibold text-[#6e7889]">{cast}</dd></div>
        <div className="flex gap-3"><dt className="w-14 shrink-0 font-extrabold text-[#2f4d73]">개봉일</dt><dd className="font-semibold text-[#6e7889]">{media.releaseDate ?? '정보 준비 중'}</dd></div>
        <div className="flex gap-3"><dt className="w-14 shrink-0 font-extrabold text-[#2f4d73]">러닝타임</dt><dd className="font-semibold text-[#6e7889]">{runtimeText}</dd></div>
        <div className="flex gap-3"><dt className="w-14 shrink-0 font-extrabold text-[#2f4d73]">국가</dt><dd className="font-semibold text-[#6e7889]">{countries}</dd></div>
      </dl>
    </section>
  );
}

export function MyRatingCard({ diary }: { diary?: MediaDetail['myDiary'] } = {}) {
  const currentRating = diary?.rating ?? 0;
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]">나의 별점</h3>
        <button type="button" className="rounded-full bg-[#f7f9fc] px-3 py-1 text-[10px] font-extrabold text-[#647189] shadow-[0_4px_10px_rgba(31,65,114,0.06)]">{diary ? '다이어리 수정' : '별점 수정'}</button>
      </div>
      <div className="mt-3 flex items-center gap-1 text-[18px] leading-none">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < currentRating ? 'text-[#ff5a52]' : 'text-[#d6dce6]'}>★</span>
        ))}
        <strong className="ml-2 text-[16px] font-black text-[#1f4e82]">{diary ? diary.rating.toFixed(1) : currentRating.toFixed(1)}</strong>
      </div>
      {diary ? (
        <div className="mt-3 rounded-[14px] bg-[#f6f8fc] p-3 text-[11px] font-bold leading-[16px] text-[#5f6b7a]">
          <p className="text-[12px] font-black text-[#1f4e82]">{diary.title}</p>
          <p className="mt-1 text-[10px] font-extrabold text-[#8a94a6]">감상일 {diary.watchedDate}</p>
          {diary.contentPreview ? <p className="mt-2 line-clamp-3">{diary.contentPreview}</p> : null}
        </div>
      ) : (
        <div className="mt-3 rounded-[14px] bg-[#f6f8fc] p-3 text-[11px] font-bold leading-[16px] text-[#7a8596]">
          ✎ 감상평을 남기면 나만의 다이어리에 기록할 수 있어요.
        </div>
      )}
    </section>
  );
}
