'use client';

import { RecordComposer } from '../core/RecordComposer';

type DiaryComposeScreenProps = {
  mediaId?: string;
  diaryId?: string;
  mode?: 'create' | 'edit';
  returnTo?: string;
};

export function DiaryComposeScreen({
  diaryId,
  mode = 'create',
}: DiaryComposeScreenProps) {
  return <RecordComposer editId={mode === 'edit' ? diaryId : undefined} />;
}
