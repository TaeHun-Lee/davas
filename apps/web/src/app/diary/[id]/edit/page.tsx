import { DiaryComposeScreen } from '../../../../components/diary/DiaryComposeScreen';
import { Suspense } from 'react';

type DiaryEditPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DiaryEditPage({ params }: DiaryEditPageProps) {
  const { id } = await params!;
  return (
    <Suspense fallback={null}>
      <DiaryComposeScreen mode="edit" diaryId={id} />
    </Suspense>
  );
}
