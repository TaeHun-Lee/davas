import { DiaryComposeScreen } from '../../../components/diary/DiaryComposeScreen';

type DiaryNewPageProps = {
  searchParams?: Promise<{
    mediaId?: string | string[];
  }>;
};

export default async function DiaryNewPage({ searchParams }: DiaryNewPageProps) {
  const params = await searchParams;
  const mediaId = Array.isArray(params?.mediaId) ? params.mediaId[0] : params?.mediaId;

  return <DiaryComposeScreen mediaId={mediaId} />;
}
