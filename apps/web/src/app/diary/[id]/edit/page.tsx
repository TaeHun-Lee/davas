import { DiaryComposeScreen } from '../../../../components/diary/DiaryComposeScreen';

type DiaryEditPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DiaryEditPage({ params }: DiaryEditPageProps) {
  const { id } = await params!;
  return <DiaryComposeScreen mode="edit" diaryId={id} />;
}
