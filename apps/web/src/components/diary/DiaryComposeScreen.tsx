"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createDiary } from '../../lib/api/diaries';
import { getMediaDetail } from '../../lib/api/media';
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
};

export function DiaryComposeScreen({ mediaId }: DiaryComposeScreenProps) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<DiaryComposeMedia>(mockDiaryMedia);
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(mediaId ? 'loading' : 'idle');
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
  }, [mediaId]);

  const effectiveTitle = title.trim() || selectedMedia.title;
  const isValidDraft = validateDiaryCompose({
    rating,
    watchedDate,
    effectiveTitle,
    content,
  });
  const canSubmit = isValidDraft && !isSubmitting && mediaStatus !== 'loading' && mediaStatus !== 'error';

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createDiary({
        mediaId: selectedMedia.id,
        rating,
        watchedDate,
        title: effectiveTitle,
        content: content.trim(),
        visibility,
        hasSpoiler: containsSpoiler,
        tags,
      });
      router.push('/diary');
    } catch {
      setSubmitError('다이어리를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-5 pb-2 text-[#1f2a44]">
      <DiaryComposeHeader />
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pt-4">
        {mediaStatus === 'loading' ? (
          <p className="rounded-[20px] bg-white px-4 py-3 text-center text-[13px] font-bold text-[#728095] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
            작품 정보를 불러오고 있어요...
          </p>
        ) : null}
        {mediaStatus === 'error' ? (
          <p className="rounded-[20px] bg-white px-4 py-3 text-center text-[13px] font-bold text-[#ff5a52] shadow-[0_12px_28px_rgba(31,65,114,0.08)]">
            작품 정보를 불러오지 못했어요. 다시 선택해주세요.
          </p>
        ) : null}
        <SelectedMediaCard media={selectedMedia} />
        <RatingInputCard value={rating} onChange={setRating} />
        <WatchedDateField value={watchedDate} onChange={setWatchedDate} />
        <DiaryTitleField value={title} fallbackTitle={selectedMedia.title} onChange={setTitle} />
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
      <DiarySubmitBar disabled={!canSubmit} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </main>
  );
}
