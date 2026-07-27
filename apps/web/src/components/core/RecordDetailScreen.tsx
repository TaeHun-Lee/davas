'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { safeCoreReturnTo } from '../../lib/core-routes';
import {
  CoreApiError,
  deleteRecord,
  getRecord,
  mediaTypeLabel,
  viewingMethodLabel,
  visibilityLabel,
  type RecordDetailData,
} from '../../lib/api/core';
import { AsyncState, EmptyState, Poster, TaskShell } from './CoreUi';

export function RecordDetailScreen({ id }: { id: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<RecordDetailData | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [revealed, setRevealed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getRecord(id)
      .then((value) => {
        setRecord(value);
        setStatus('ready');
      })
      .catch((error) =>
        setStatus(
          error instanceof CoreApiError && error.body.code === 'RECORD_NOT_FOUND'
            ? 'missing'
            : 'error',
        ),
      );
  }, [id]);

  if (status === 'loading') {
    return (
      <TaskShell title="기록 상세" fallback="/">
        <AsyncState kind="loading" />
      </TaskShell>
    );
  }
  if (status === 'missing') {
    return (
      <TaskShell title="기록 상세" fallback="/">
        <EmptyState
          title="기록을 찾을 수 없어요"
          description="주소가 잘못됐거나 볼 수 없는 기록이에요."
          action={
            <Link className="primary-button" href="/">
              친구 기록으로
            </Link>
          }
        />
      </TaskShell>
    );
  }
  if (status === 'error' || !record) {
    return (
      <TaskShell title="기록 상세" fallback="/">
        <AsyncState kind="error" onRetry={() => location.reload()} />
      </TaskShell>
    );
  }

  const fallback = safeCoreReturnTo(params.get('returnTo'), record.isMine ? '/me' : '/');
  return (
    <TaskShell title="기록 상세" fallback={fallback}>
      {params.get('saved') ? (
        <p
          role="status"
          className="mb-3 rounded-2xl bg-[var(--blue-soft)] p-3 text-sm font-bold text-[var(--blue)]"
        >
          {params.get('saved') === 'private'
            ? '내 기록에 저장했어요.'
            : '친구와 기록을 공유했어요.'}
        </p>
      ) : null}
      <article className="core-card p-4">
        <div className="record-author">
          <span className="avatar-small">{record.author.nickname.slice(0, 1)}</span>
          <div>
            <strong>{record.author.nickname}</strong>
            <p>{record.watchedDate.replaceAll('-', '.')}에 봤어요</p>
          </div>
        </div>
        <div className="record-media">
          <Poster url={record.media.posterUrl} title={record.media.title} />
          <div className="min-w-0 flex-1">
            <h1>{record.media.title}</h1>
            <p>
              {[record.media.originalTitle, record.media.releaseYear].filter(Boolean).join(' · ')}
            </p>
            <div className="badge-row">
              <span>{mediaTypeLabel(record.media.mediaType)}</span>
              <span>{viewingMethodLabel(record.viewingMethod)}</span>
              {record.isMine ? <span>{visibilityLabel(record.visibility)}</span> : null}
            </div>
            {record.rating !== null ? <p className="rating">★ {record.rating}</p> : null}
          </div>
        </div>
        {record.content ? (
          <section className="mt-5">
            <h2 className="section-title mb-2">리뷰</h2>
            {record.hasSpoiler && !revealed ? (
              <button className="secondary-button w-full" onClick={() => setRevealed(true)}>
                스포일러 내용 보기
              </button>
            ) : (
              <p className="whitespace-pre-wrap text-[14px] font-semibold leading-6 text-[var(--text)]">
                {record.content}
              </p>
            )}
          </section>
        ) : (
          <p className="page-description mt-5">남긴 리뷰가 없어요.</p>
        )}
      </article>
      {!record.isMine ? (
        <Link
          href={`/records/new?mediaId=${record.media.id}`}
          className="primary-button mt-4 w-full"
        >
          나도 이 작품 기록하기
        </Link>
      ) : null}
      {record.isMine ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link className="secondary-button" href={`/records/${record.id}/edit`}>
            수정
          </Link>
          <button className="danger-button" onClick={() => setConfirmDelete(true)}>
            삭제
          </button>
        </div>
      ) : null}
      {confirmDelete ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="core-card mt-4 p-5"
        >
          <h2 id="delete-title" className="section-title">
            {record.media.title} 기록을 삭제할까요?
          </h2>
          <p className="page-description">삭제한 기록은 목록과 친구 기록에서 사라져요.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="secondary-button" autoFocus onClick={() => setConfirmDelete(false)}>
              취소
            </button>
            <button
              className="danger-button"
              onClick={async () => {
                await deleteRecord(record.id);
                router.replace('/me');
              }}
            >
              기록 삭제
            </button>
          </div>
        </div>
      ) : null}
    </TaskShell>
  );
}
