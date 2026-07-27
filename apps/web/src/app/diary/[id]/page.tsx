import { DiaryDetailScreen } from '../../../components/diary/DiaryDetailScreen';

type DiaryDetailPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { id } = await params!;
  return <DiaryDetailScreen diaryId={id} />;
}
