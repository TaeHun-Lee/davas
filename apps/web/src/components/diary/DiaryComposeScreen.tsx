"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createDiary, getDiary, updateDiary } from '../../lib/api/diaries';
import { getMediaDetail } from '../../lib/api/media';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { DiaryComposeHeader } from './DiaryComposeHeader';
import { DiaryContentField } from './DiaryContentField';
import { DiaryOptionRow } from './DiaryOptionRow';
import { DiaryPhotoAttachmentSection } from './DiaryPhotoAttachmentSection';
import { DiarySubmitBar } from './DiarySubmitBar';
import { DiaryTitleField } from './DiaryTitleField';
import { RatingInputCard } from './RatingInputCard';
import { type DiaryComposeMedia, SelectedMediaCard, mockDiaryMedia } from './SelectedMediaCard';
import { WatchedDateField } from './WatchedDateField';
import { mapMediaDetailToDiaryMedia, todayIsoDate, validateDiaryCompose } from './diary-compose-utils';

type DiaryComposeScreenProps = {
  mediaId?: string;
  diaryId?: string;
  mode?: 'create' | 'edit';
  returnTo?: string;
};

export function DiaryComposeScreen({ mediaId, diaryId, mode = 'create', returnTo }: DiaryComposeScreenProps) {
  const router = useRouter();
  const initialSelectedMedia = mediaId || diaryId ? null : mockDiaryMedia;
  const [selectedMedia, setSelectedMedia] = useState<DiaryComposeMedia | null>(initialSelectedMedia);
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(mediaId || diaryId ? 'loading' : 'idle');
  const [rating, setRating] = useState(0);
  const [watchedDate, setWatchedDate] = useState(todayIsoDate());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [tags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      setSelectedMedia(mockDiaryMedia);
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
        setSelectedMedia(mockDiaryMedia);
        setMediaStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [mediaId, diaryId, mode]);

  const effectiveTitle = title.trim() || selectedMedia?.title || '';
  const isValidDraft = validateDiaryCompose({
    rating,
    watchedDate,
    effectiveTitle,
    content,
  });
  const canSubmit = isValidDraft && !isSubmitting && mediaStatus !== 'loading' && mediaStatus !== 'error';

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
        {mediaStatus === 'error' ? (
          <p className="rounded-[20px] bg-white px-4 py-3 text-center text-[13px] font-bold text-[#ff5a52] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
            작품 정보를 불러오지 못했어요. 다시 선택해주세요.
          </p>
        ) : null}
        <SelectedMediaCard media={selectedMedia} isLoading={mediaStatus === 'loading' && Boolean(mediaId || diaryId)} />
        <RatingInputCard value={rating} onChange={setRating} />
        <WatchedDateField value={watchedDate} onChange={setWatchedDate} />
        <DiaryTitleField value={title} fallbackTitle={selectedMedia?.title ?? ''} onChange={setTitle} />
        <DiaryContentField value={content} onChange={setContent} />
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
          tags={tags}
        />
        <DiaryPhotoAttachmentSection />
        </div>
      </section>
      <DiarySubmitBar disabled={!canSubmit} isSubmitting={isSubmitting} mode={mode} onSubmit={handleSubmit} />
    </main>
  );
}
