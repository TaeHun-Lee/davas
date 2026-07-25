"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createDiary, getDiary, updateDiary } from '../../lib/api/diaries';
import { getMediaDetail } from '../../lib/api/media';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { DiaryComposeHeader } from './DiaryComposeHeader';
import { DiaryContentField } from './DiaryContentField';
import { DiaryOptionRow } from './DiaryOptionRow';
import { DiarySubmitBar } from './DiarySubmitBar';
import { DiaryTitleField } from './DiaryTitleField';
import { RatingInputCard } from './RatingInputCard';
import { type DiaryComposeMedia, SelectedMediaCard } from './SelectedMediaCard';
import { WatchedDateField } from './WatchedDateField';
import { mapMediaDetailToDiaryMedia, todayIsoDate, validateDiaryCompose } from './diary-compose-utils';
import { TogetherMomentSection, type CompanionInput } from './TogetherMomentSection';
import { getFriends } from '../../lib/api/friends';

type DiaryComposeScreenProps = {
  mediaId?: string;
  diaryId?: string;
  mode?: 'create' | 'edit';
  returnTo?: string;
};

export function DiaryComposeScreen({ mediaId, diaryId, mode = 'create', returnTo }: DiaryComposeScreenProps) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<DiaryComposeMedia | null>(null);
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(mediaId || diaryId ? 'loading' : 'idle');
  const [rating, setRating] = useState(0);
  const [watchedDate, setWatchedDate] = useState(todayIsoDate());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [visibility, setVisibility] = useState<'PRIVATE' | 'FRIENDS' | 'SELECTED'>('PRIVATE');
  const [tags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [companions, setCompanions] = useState<CompanionInput[]>([]);
  const [watchedPlace, setWatchedPlace] = useState('');
  const [mood, setMood] = useState('');
  const [memoryNote, setMemoryNote] = useState('');
  const [friendOptions, setFriendOptions] = useState<Array<{ id: string; nickname: string }>>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => { getFriends().then((result) => setFriendOptions(result.friends.map((item) => item.user))).catch(() => setFriendOptions([])); }, []);

  useEffect(() => {
    if (mode === 'edit' && diaryId) {
      let cancelled = false;
      setMediaStatus('loading');

      getDiary(diaryId)
        .then((diary) => {
          if (cancelled) return;
          setSelectedMedia({
            id: diary.media.id,
            title: diary.media.title,
            originalTitle: diary.media.originalTitle,
            posterUrl: diary.media.posterUrl,
            meta: `${diary.media.releaseDate?.slice(0, 4) ?? '연도 미상'} · ${diary.media.runtime ? `${diary.media.runtime}분` : '러닝타임 준비 중'}`,
            genres: diary.media.genres,
          });
          setRating(diary.rating);
          setWatchedDate(diary.watchedDate);
          setTitle(diary.title);
          setContent(diary.content);
          setContainsSpoiler(diary.hasSpoiler);
          setVisibility(diary.visibility);
          setCompanions(diary.companions ?? []);
          setWatchedPlace(diary.watchedPlace ?? '');
          setMood(diary.mood ?? '');
          setMemoryNote(diary.memoryNote ?? '');
          setSelectedUserIds(diary.selectedUserIds ?? []);
          setMediaStatus('ready');
        })
        .catch(() => {
          if (cancelled) return;
          setSelectedMedia(null);
          setMediaStatus('error');
        });

      return () => {
        cancelled = true;
      };
    }

    if (!mediaId) {
      setSelectedMedia(null);
      setMediaStatus('idle');
      return;
    }

    let cancelled = false;
    setMediaStatus('loading');

    getMediaDetail(mediaId)
      .then((detail) => {
        if (cancelled) return;
        setSelectedMedia(mapMediaDetailToDiaryMedia(detail));
        setMediaStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setSelectedMedia(null);
        setMediaStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [mediaId, diaryId, mode, retryKey]);

  const effectiveTitle = title.trim() || selectedMedia?.title || '';
  const isValidDraft = validateDiaryCompose({
    rating,
    watchedDate,
    effectiveTitle,
    content,
  });
  const canSubmit = Boolean(selectedMedia) && isValidDraft && (visibility !== 'SELECTED' || selectedUserIds.length > 0) && !isSubmitting && mediaStatus === 'ready';

  function handleBack() {
    if (returnTo) router.push(returnTo);
    else if (window.history.length > 1) router.back();
    else router.push('/explore');
  }

  async function handleSubmit() {
    if (!canSubmit || !selectedMedia) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        mediaId: selectedMedia.id,
        mediaPosterUrl: selectedMedia.posterUrl,
        rating,
        watchedDate,
        title: effectiveTitle,
        content: content.trim(),
        visibility,
        hasSpoiler: containsSpoiler,
        tags,
        companions,
        watchedPlace,
        mood,
        memoryNote,
        selectedUserIds: visibility === 'SELECTED' ? selectedUserIds : [],
      };

      if (mode === 'edit' && diaryId) {
        await updateDiary(diaryId, payload);
      } else {
        await createDiary(payload);
      }
      router.push('/diary');
    } catch {
      setSubmitError(mode === 'edit' ? '다이어리를 수정하지 못했어요. 잠시 후 다시 시도해주세요.' : '다이어리를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main className="flex min-h-screen justify-center overflow-x-hidden bg-[#172947]/35 text-[#1f2a44] backdrop-blur-sm">
      <section data-design="diary-compose-shell" className="min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-[#f8fafd] px-5 pb-28 shadow-[0_0_40px_rgba(15,23,42,0.18)]">
        <DiaryComposeHeader onBack={handleBack} />
        <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pt-4">
        {mediaStatus === 'loading' && Boolean(mediaId || diaryId) ? <MediaDetailLoadingIndicator /> : null}
        {mediaStatus === 'idle' ? <section className="card-surface rounded-[24px] p-6 text-center"><h1 className="text-[18px] font-black text-[#23426f]">먼저 작품을 선택해주세요</h1><p className="mt-2 text-[13px] font-bold text-[#65758a]">작품이 없는 기록은 저장할 수 없어요.</p><button type="button" onClick={() => router.push('/explore?intent=record')} className="mt-5 min-h-11 rounded-[16px] bg-[#ff5a52] px-5 text-[13px] font-black text-white">작품 찾아 기록하기</button></section> : null}
        {mediaStatus === 'error' ? <section className="rounded-[20px] bg-white px-4 py-4 text-center shadow-[0_12px_28px_rgba(31,65,114,0.08)]"><p className="text-[13px] font-bold text-[#d9413a]">작품 정보를 불러오지 못했어요. 이 상태에서는 저장할 수 없습니다.</p><div className="mt-3 flex justify-center gap-2"><button type="button" onClick={() => setRetryKey((value) => value + 1)} className="min-h-11 rounded-[14px] bg-[#284778] px-4 text-[12px] font-black text-white">다시 시도</button><button type="button" onClick={() => router.push('/explore?intent=record')} className="min-h-11 rounded-[14px] bg-[#eef3f8] px-4 text-[12px] font-black text-[#284778]">다시 선택</button></div></section> : null}
        {mediaStatus !== 'idle' ? <SelectedMediaCard media={selectedMedia} isLoading={mediaStatus === 'loading' && Boolean(mediaId || diaryId)} /> : null}
        {mediaStatus === 'ready' ? <>
        <RatingInputCard value={rating} onChange={setRating} />
        <WatchedDateField value={watchedDate} onChange={setWatchedDate} />
        <DiaryTitleField value={title} fallbackTitle={selectedMedia?.title ?? ''} onChange={setTitle} />
        <DiaryContentField value={content} onChange={setContent} />
        <TogetherMomentSection companions={companions} onChangeCompanions={setCompanions} friendOptions={friendOptions} watchedPlace={watchedPlace} onChangeWatchedPlace={setWatchedPlace} mood={mood} onChangeMood={setMood} memoryNote={memoryNote} onChangeMemoryNote={setMemoryNote} />
        {visibility === 'SELECTED' ? <fieldset className="rounded-[22px] bg-white p-4 shadow-[0_10px_22px_rgba(31,65,114,0.06)]"><legend className="px-1 text-[14px] font-black text-[#23426f]">공개할 친구 선택</legend><p className="mt-1 text-[12px] font-bold text-[#65758a]">선택한 친구만 기록과 함께 본 정보를 볼 수 있어요.</p>{friendOptions.length ? <div className="mt-3 grid grid-cols-2 gap-2">{friendOptions.map((friend) => <label key={friend.id} className="flex min-h-11 items-center gap-2 rounded-[14px] bg-[#f3f7fc] px-3 text-[12px] font-black text-[#284778]"><input type="checkbox" checked={selectedUserIds.includes(friend.id)} onChange={(event) => setSelectedUserIds((current) => event.target.checked ? [...new Set([...current, friend.id])] : current.filter((id) => id !== friend.id))} />{friend.nickname}</label>)}</div> : <p className="mt-3 rounded-[14px] bg-[#fff1f0] p-3 text-[12px] font-bold text-[#a93530]">먼저 친구 요청을 수락한 친구가 필요해요.</p>}</fieldset> : null}
        {submitError ? (
          <p className="rounded-[18px] bg-white px-4 py-3 text-center text-[13px] font-bold text-[#ff5a52] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
            {submitError}
          </p>
        ) : null}
        <DiaryOptionRow
          containsSpoiler={containsSpoiler}
          onToggleSpoiler={() => setContainsSpoiler((value) => !value)}
          visibility={visibility}
          onChangeVisibility={setVisibility}
        />
        </> : null}
        </div>
      </section>
      <DiarySubmitBar disabled={!canSubmit} isSubmitting={isSubmitting} mode={mode} onSubmit={handleSubmit} />
    </main>
  );
}
