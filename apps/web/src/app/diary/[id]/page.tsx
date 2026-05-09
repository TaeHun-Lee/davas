import { CommunityDiaryDetail } from '../../../components/community/CommunityDiaryDetail';

type DiaryDetailPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DiaryDetailPage({ params }: DiaryDetailPageProps) {
  const { id } = await params!;
  return <CommunityDiaryDetail diaryId={id} />;
}
