import { DiaryDetailScreen } from '../../../components/diary/DiaryDetailScreen';
import { Suspense } from 'react';

type DiaryDetailPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { id } = await params!;
  return (
    <Suspense fallback={null}>
      <DiaryDetailScreen diaryId={id} />
    </Suspense>
  );
}
