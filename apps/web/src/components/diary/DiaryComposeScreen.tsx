"use client";

import { useState } from 'react';
import { DiaryComposeHeader } from './DiaryComposeHeader';
import { DiaryContentField } from './DiaryContentField';
import { DiaryOptionRow } from './DiaryOptionRow';
import { DiaryPhotoAttachmentSection } from './DiaryPhotoAttachmentSection';
import { DiarySubmitBar } from './DiarySubmitBar';
import { DiaryTitleField } from './DiaryTitleField';
import { RatingInputCard } from './RatingInputCard';
import { SelectedMediaCard, mockDiaryMedia } from './SelectedMediaCard';
import { WatchedDateField } from './WatchedDateField';
import { todayIsoDate } from './diary-compose-utils';

export function DiaryComposeScreen() {
  const selectedMedia = mockDiaryMedia;
  const [rating, setRating] = useState(0);
  const [watchedDate, setWatchedDate] = useState(todayIsoDate());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [tags] = useState<string[]>([]);
  const [isSubmitting] = useState(false);

  const effectiveTitle = title.trim() || selectedMedia.title;
  const canSubmit = rating > 0 && content.length <= 3000;

  function handleSubmit() {
    void {
      mediaId: selectedMedia.id,
      rating,
      watchedDate,
      title: effectiveTitle,
      content,
      containsSpoiler,
      visibility,
      tags,
    };
  }

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-5 pb-2 text-[#1f2a44]">
      <DiaryComposeHeader />
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4 pt-4">
        <SelectedMediaCard media={selectedMedia} />
        <RatingInputCard value={rating} onChange={setRating} />
        <WatchedDateField value={watchedDate} onChange={setWatchedDate} />
        <DiaryTitleField value={title} fallbackTitle={selectedMedia.title} onChange={setTitle} />
        <DiaryContentField value={content} onChange={setContent} />
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
