import { DiaryComposeScreen } from '../../../components/diary/DiaryComposeScreen';

type DiaryNewPageProps = {
  searchParams?: Promise<{
    mediaId?: string | string[];
    returnTo?: string | string[];
  }>;
};

export default async function DiaryNewPage({ searchParams }: DiaryNewPageProps) {
  const params = await searchParams;
  const mediaId = Array.isArray(params?.mediaId) ? params.mediaId[0] : params?.mediaId;
  const returnTo = Array.isArray(params?.returnTo) ? params.returnTo[0] : params?.returnTo;

  return <DiaryComposeScreen mediaId={mediaId} returnTo={returnTo} />;
}
