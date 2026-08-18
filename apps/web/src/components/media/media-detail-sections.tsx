import Link from 'next/link';
import type { RecordCardData } from '../../lib/api/core';
import type { MediaDetail } from '../../lib/api/media';

export type FriendRecordsStatus = 'loading' | 'ready' | 'error';

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

export function MyRatingCard({ diaries = [], averageRating }: { diaries?: NonNullable<MediaDetail['myDiaries']>; averageRating?: MediaDetail['myAverageRating'] } = {}) {
  const hasDiaries = diaries.length > 0;
  const hasRating = averageRating != null;
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]">나의 기록</h3>
      </div>
      {hasDiaries ? (
        hasRating ? (
          <div className="mt-3 flex items-center gap-1 text-[18px] leading-none" aria-label={`나의 평균 별점 ${averageRating.toFixed(1)}점`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} aria-hidden="true" className={index < averageRating ? 'text-[#ff5a52]' : 'text-[#d6dce6]'}>★</span>
            ))}
            <strong className="ml-2 text-[16px] font-black text-[#1f4e82]">{averageRating.toFixed(1)}</strong>
          </div>
        ) : (
          <p className="mt-3 text-[12px] font-bold text-[#7a8596]">별점 없이 남긴 기록이에요.</p>
        )
      ) : null}
      {hasDiaries ? (
        <div className="mt-3 space-y-2.5">
          {diaries.map((diary) => (
            <article key={diary.id} className="relative rounded-[14px] bg-[#f6f8fc] p-3 pr-20 text-[11px] font-bold leading-[16px] text-[#5f6b7a]">
              <Link href={`/records/${diary.id}/edit`} className="absolute right-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white px-2.5 text-[11px] font-extrabold text-[#647189] shadow-[0_4px_10px_rgba(31,65,114,0.06)] ring-1 ring-[#edf2f8]">수정</Link>
              <p className="line-clamp-1 text-[12px] font-black text-[#1f4e82]">{diary.title}</p>
              <p className="mt-1 text-[10px] font-extrabold text-[#8a94a6]">감상일 {diary.watchedDate} · {diary.rating === null ? '별점 없음' : `별점 ${diary.rating.toFixed(1)}`}</p>
              {diary.contentPreview ? <p className="mt-2 line-clamp-3">{diary.contentPreview}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[14px] bg-[#f6f8fc] p-3 text-[12px] font-bold leading-[18px] text-[#7a8596]">
          아직 남긴 기록이 없어요. 감상 후 첫 기록을 남겨보세요.
        </div>
      )}
    </section>
  );
}

export function FriendRecordsCard({
  records,
  status,
  returnTo,
  hasMore,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
}: {
  records: RecordCardData[];
  status: FriendRecordsStatus;
  returnTo: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: boolean;
  onLoadMore: () => void;
}) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(31,65,114,0.07)] ring-1 ring-[#edf2f8]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-black leading-[20px] tracking-[-0.025em] text-[#1f4e82]">
            친구들의 기록
          </h3>
          <p className="mt-1 text-[11px] font-semibold leading-[17px] text-[#7a8596]">
            나에게 공개된 기록만 보여요.
          </p>
        </div>
        {status === 'ready' && records.length ? (
          <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[10px] font-extrabold text-[#2a5b8a]">
            {records.length}개 표시
          </span>
        ) : null}
      </div>

      {status === 'loading' ? (
        <div className="mt-3 space-y-2" role="status" aria-label="친구 기록 불러오는 중">
          <div className="h-[74px] animate-pulse rounded-[14px] bg-[#f1f4f9]" />
          <div className="h-[74px] animate-pulse rounded-[14px] bg-[#f1f4f9]" />
        </div>
      ) : status === 'error' ? (
        <p className="mt-3 rounded-[14px] bg-[#fff5f4] p-3 text-[11px] font-bold leading-[17px] text-[#a14a45]" role="status">
          친구 기록을 불러오지 못했어요. 작품 정보는 계속 확인할 수 있어요.
        </p>
      ) : records.length || hasMore ? (
        <div className="mt-3 space-y-2.5">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/records/${record.id}?returnTo=${encodeURIComponent(returnTo)}`}
              className="block rounded-[14px] bg-[#f6f8fc] p-3 transition hover:bg-[#eef4fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f7eea]"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f1ff] text-[11px] font-black text-[#2f7eea]">
                  {record.author.profileImageUrl ? (
                    <img src={record.author.profileImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    record.author.nickname.slice(0, 1)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[12px] font-black text-[#1f4e82]">
                    {record.author.nickname}
                  </strong>
                  <span className="mt-0.5 block truncate text-[11px] font-bold text-[#65758a]">
                    {record.recordTitle ?? record.media.title}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#ff5a52] shadow-sm">
                  {record.rating == null ? '별점 없음' : `★ ${record.rating.toFixed(1)}`}
                </span>
              </div>
              <p className="mt-2 text-[10px] font-extrabold text-[#8a94a6]">
                감상일 {record.watchedDate}
              </p>
              {record.hasSpoiler ? (
                <p className="mt-2 text-[11px] font-bold leading-[17px] text-[#7a8596]">
                  스포일러가 포함된 기록이에요. 눌러서 확인해 주세요.
                </p>
              ) : record.reviewPreview ? (
                <p className="mt-2 line-clamp-3 text-[11px] font-semibold leading-[17px] text-[#5f6b7a]">
                  {record.reviewPreview}
                </p>
              ) : null}
            </Link>
          ))}
          {loadMoreError ? (
            <p className="rounded-[12px] bg-[#fff5f4] px-3 py-2 text-center text-[10px] font-bold text-[#a14a45]" role="status">
              다음 기록을 불러오지 못했어요.
            </p>
          ) : null}
          {hasMore ? (
            <button
              type="button"
              className="min-h-11 w-full rounded-[14px] bg-[#eef6ff] px-4 text-[11px] font-black text-[#2f7eea] disabled:opacity-60"
              disabled={isLoadingMore}
              onClick={onLoadMore}
            >
              {isLoadingMore ? '불러오는 중…' : '친구 기록 더 보기'}
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 rounded-[14px] bg-[#f6f8fc] p-3 text-[11px] font-bold leading-[17px] text-[#7a8596]">
          아직 이 작품에 대해 나에게 공개된 친구 기록이 없어요.
        </p>
      )}
    </section>
  );
}
