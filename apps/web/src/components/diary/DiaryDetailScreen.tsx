'use client';

import { RecordDetailScreen } from '../core/RecordScreens';

export function DiaryDetailScreen({ diaryId }: { diaryId: string }) {
  return <RecordDetailScreen id={diaryId} />;
}
