import type { SelectedMedia } from '../../lib/api/media';

export function SelectedMediaPanel({ media, isSaving }: { media: SelectedMedia | null; isSaving?: boolean }) {
  if (!media && !isSaving) {
    return null;
  }

  if (isSaving) {
    return <section className="card-surface mt-4 rounded-[20px] p-4 text-[13px] font-bold text-[#8b96a8]">선택한 작품을 저장하고 있어요...</section>;
  }

  if (!media) {
    return null;
  }

  return (
    <section className="card-surface mt-4 rounded-[22px] p-4 shadow-[0_12px_28px_rgba(31,65,114,0.09)]" data-design="selected-media-panel">
      <p className="text-[12px] font-extrabold text-[#216bd8]">상세 정보</p>
      <div className="mt-3 flex gap-3">
        {media.posterUrl ? <img src={media.posterUrl} alt={`${media.title} 포스터`} className="h-[112px] w-[76px] shrink-0 rounded-[14px] object-cover shadow-[0_10px_18px_rgba(21,38,69,0.14)]" /> : <div className="h-[112px] w-[76px] shrink-0 rounded-[14px] bg-gradient-to-br from-[#dbe7f8] to-[#9fb9df]" />}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[18px] font-black leading-[23px] tracking-[-0.035em] text-[#172947]">{media.title}</h3>
          <p className="mt-1 text-[12px] font-bold text-[#8b96a8]">{media.mediaType === 'TV' ? '드라마' : '영화'} · {media.releaseDate?.slice(0, 4) ?? '연도 미상'}</p>
          <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-[18px] text-[#747f91]">{media.overview || '작품 소개가 아직 준비되지 않았어요.'}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <a href={`/diary/new?mediaId=${media.id}`} className="flex h-[36px] flex-1 items-center justify-center rounded-full bg-[#2f7eea] text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(47,126,234,0.24)]">다이어리 쓰기</a>
        <button type="button" className="h-[36px] rounded-full border border-[#e8eef6] bg-white px-4 text-[12px] font-extrabold text-[#536179] shadow-[0_5px_12px_rgba(31,65,114,0.05)]">상세 보기</button>
      </div>
    </section>
  );
}
