import Image from 'next/image';
import Link from 'next/link';
import type { RecordCardData } from '../../lib/api/core';
import { mediaTypeLabel, viewingMethodLabel, visibilityLabel } from '../../lib/api/core';

export type RecordCardVariant = 'feed' | 'mine';

export function Poster({ url, title }: { url: string | null; title: string }) {
  return url ? (
    <Image
      unoptimized
      src={url}
      alt={`${title} 포스터`}
      width={82}
      height={123}
      className="poster"
    />
  ) : (
    <div className="poster poster-empty" role="img" aria-label={`${title} 포스터 없음`}>
      {title.slice(0, 1)}
    </div>
  );
}

function RecordCardContents({
  item,
  variant,
}: {
  item: RecordCardData;
  variant: RecordCardVariant;
}) {
  const mine = variant === 'mine';
  return (
    <>
      {mine ? (
        <p className="text-xs font-semibold text-[var(--muted)]">
          {item.watchedDate.replaceAll('-', '.')}에 봤어요
        </p>
      ) : (
        <div className="record-author">
          <span className="avatar-small">{item.author.nickname.slice(0, 1)}</span>
          <div>
            <strong>
              {item.author.nickname}
              {item.isMine ? ' · 내 기록' : ''}
            </strong>
            <p>{item.watchedDate.replaceAll('-', '.')}에 봤어요</p>
          </div>
        </div>
      )}
      <div className="record-media">
        <Poster url={item.media.posterUrl} title={item.media.title} />
        <div className="min-w-0 flex-1">
          <h3>{item.media.title}</h3>
          <p>{[item.media.originalTitle, item.media.releaseYear].filter(Boolean).join(' · ')}</p>
          <div className="badge-row">
            <span>{mediaTypeLabel(item.media.mediaType)}</span>
            <span>{viewingMethodLabel(item.viewingMethod)}</span>
            {mine || item.isMine ? <span>{visibilityLabel(item.visibility)}</span> : null}
          </div>
          {item.rating !== null ? <p className="rating">★ {item.rating}</p> : null}
        </div>
      </div>
      {item.hasSpoiler ? (
        <p className="spoiler-preview">
          스포일러가 있는 리뷰예요. 상세에서 내용을 확인할 수 있어요.
        </p>
      ) : item.reviewPreview ? (
        <p className="review-preview">{item.reviewPreview}</p>
      ) : null}
    </>
  );
}

export function RecordCard({
  item,
  variant,
  returnTo,
}: {
  item: RecordCardData;
  variant: RecordCardVariant;
  returnTo?: string;
}) {
  const detail = `/records/${item.id}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;

  if (variant === 'mine') {
    return (
      <Link
        href={detail}
        className="core-card record-card block"
        aria-label={`${item.media.title} 기록 상세 보기`}
      >
        <RecordCardContents item={item} variant={variant} />
      </Link>
    );
  }

  return (
    <article className="core-card record-card">
      <RecordCardContents item={item} variant={variant} />
      <div className="card-actions">
        <Link href={detail}>자세히 보기</Link>
        <Link href={`/records/new?mediaId=${item.media.id}`}>나도 기록하기</Link>
      </div>
    </article>
  );
}
