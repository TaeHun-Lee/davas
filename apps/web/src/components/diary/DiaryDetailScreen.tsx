'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { deleteDiary, getDiary, type EditableDiary } from '../../lib/api/diaries';
import { CommunityCommentsSection } from '../community/CommunityCommentsSection';
import { AppShell } from '../layout/AppShell';
import { DiaryReactions } from './DiaryReactions';

type DetailStatus = 'loading' | 'ready' | 'unauthorized' | 'not-found' | 'forbidden' | 'deleted' | 'error';

export function DiaryDetailScreen({ diaryId }: { diaryId: string }) {
  const router = useRouter();
  const [diary, setDiary] = useState<EditableDiary | null>(null);
  const [status, setStatus] = useState<DetailStatus>('loading');
  const [retryKey, setRetryKey] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeDelete = useCallback(() => setDeleteOpen(false), []);
  useFocusTrap(deleteOpen, dialogRef, closeDelete);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    getDiary(diaryId).then((value) => { if (active) { setDiary(value); setStatus('ready'); } }).catch((error) => {
      if (!active) return;
      setStatus(error?.status === 401 ? 'unauthorized' : error?.status === 403 ? 'forbidden' : error?.status === 404 ? 'not-found' : error?.status === 410 ? 'deleted' : 'error');
    });
    return () => { active = false; };
  }, [diaryId, retryKey]);

  async function remove() {
    if (!diary || deleting) return;
    setDeleting(true);
    try { await deleteDiary(diary.id); router.replace('/diary'); router.refresh(); }
    catch { setDeleting(false); setDeleteOpen(false); setStatus('error'); }
  }

  if (status === 'loading') return <AppShell><div className="h-96 animate-pulse rounded-[28px] bg-white motion-reduce:animate-none" aria-label="기록을 불러오는 중" /></AppShell>;
  if (status !== 'ready' || !diary) {
    const message = status === 'unauthorized' ? '로그인이 다시 필요해요' : status === 'forbidden' ? '이 기록을 볼 권한이 없어요' : status === 'deleted' ? '삭제된 기록이에요' : status === 'not-found' ? '존재하지 않는 기록이에요' : '기록을 불러오지 못했어요';
    return <AppShell><section className="rounded-[24px] bg-white p-8 text-center"><h1 className="text-[18px] font-black text-[#23426f]">{message}</h1>{status === 'error' ? <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="mt-5 min-h-11 rounded-[16px] bg-[#fff0ee] px-5 text-[13px] font-black text-[#a93530]">다시 시도</button> : null}<Link href={status === 'unauthorized' ? '/login' : '/diary'} className="mt-3 inline-flex min-h-11 items-center rounded-[16px] bg-[#284778] px-5 text-[13px] font-black text-white">{status === 'unauthorized' ? '로그인' : '내 기록으로 돌아가기'}</Link></section></AppShell>;
  }

  const visibilityLabel = diary.visibility === 'PRIVATE' ? '나만 보기' : diary.visibility === 'FRIENDS' ? '친구 공개' : '선택한 친구';
  return <AppShell><article className="pb-8"><Link href={diary.ownerMode ? '/diary' : '/feed'} className="inline-flex min-h-11 items-center rounded-full px-3 text-[13px] font-black text-[#216bd8]">← {diary.ownerMode ? '내 기록' : '친구 피드'}</Link><section className="rounded-[28px] bg-white p-5 shadow-[0_16px_36px_rgba(31,42,68,0.08)]"><div className="flex gap-4">{diary.media.posterUrl ? <img src={diary.media.posterUrl} alt="" className="h-[150px] w-[100px] shrink-0 rounded-[18px] object-cover" /> : null}<div className="min-w-0"><p className="text-[12px] font-black text-[#216bd8]">{diary.ownerMode ? '나의 기록' : `${diary.author?.nickname ?? '친구'}의 기록`}</p><h1 className="mt-2 break-words text-[22px] font-black text-[#23426f]">{diary.media.title}</h1><p className="mt-2 text-[13px] font-bold text-[#65758a]">{diary.watchedDate} · 별 {diary.rating.toFixed(1)}</p><p className="mt-2 text-[12px] font-black text-[#52677e]">{visibilityLabel}</p></div></div><h2 className="mt-5 text-[18px] font-black text-[#1f2a44]">{diary.title}</h2><p className="mt-3 whitespace-pre-wrap break-words text-[14px] font-medium leading-7 text-[#46556d]">{diary.content || '작성한 본문이 없어요.'}</p>{(diary.companions?.length || diary.watchedPlace || diary.mood || diary.memoryNote) ? <section className="mt-5 rounded-[20px] bg-[#f3f7fc] p-4"><h2 className="text-[15px] font-black text-[#23426f]">함께 본 시간</h2>{diary.companions?.length ? <p className="mt-2 text-[13px] font-bold text-[#52677e]">함께: {diary.companions.map((item) => item.displayName).join(', ')}</p> : null}{diary.watchedPlace ? <p className="mt-2 text-[13px] font-bold text-[#52677e]">장소: {diary.watchedPlace}</p> : null}{diary.mood ? <p className="mt-2 text-[13px] font-bold text-[#52677e]">분위기: {diary.mood}</p> : null}{diary.memoryNote ? <p className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-6 text-[#46556d]">{diary.memoryNote}</p> : null}</section> : null}{diary.ownerMode ? <div className="mt-6 flex gap-2"><Link href={`/diary/${diary.id}/edit`} className="flex min-h-11 flex-1 items-center justify-center rounded-[16px] bg-[#284778] text-[13px] font-black text-white">수정</Link><button type="button" onClick={() => setDeleteOpen(true)} className="min-h-11 flex-1 rounded-[16px] bg-[#fff1f0] text-[13px] font-black text-[#a93530]">삭제</button></div> : null}</section><DiaryReactions diaryId={diary.id} /><CommunityCommentsSection diaryId={diary.id} />{deleteOpen ? <div className="fixed inset-0 z-[90] grid place-items-center bg-[#172947]/45 p-5" role="dialog" aria-modal="true" aria-labelledby="delete-title" ref={dialogRef}><section className="w-full max-w-[360px] rounded-[24px] bg-white p-5"><h2 id="delete-title" className="text-[18px] font-black text-[#23426f]">‘{diary.media.title}’ 기록을 삭제할까요?</h2><p className="mt-2 text-[13px] font-bold leading-6 text-[#65758a]">목록에서는 즉시 사라지며 서버에는 복구와 감사 목적의 삭제 표시만 남아요.</p><div className="mt-5 flex gap-2"><button type="button" onClick={closeDelete} className="min-h-11 flex-1 rounded-[15px] bg-[#eef3f8] font-black text-[#52677e]">취소</button><button type="button" disabled={deleting} onClick={remove} className="min-h-11 flex-1 rounded-[15px] bg-[#a93530] font-black text-white">{deleting ? '삭제 중' : '삭제'}</button></div></section></div> : null}</article></AppShell>;
}
