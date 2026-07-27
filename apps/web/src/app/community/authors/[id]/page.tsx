import { CommunityAuthorProfile } from '../../../../components/community/CommunityAuthorProfile';

type CommunityAuthorPageProps = {
  params?: Promise<{ id: string }>;
};

export default async function CommunityAuthorPage({ params }: CommunityAuthorPageProps) {
  const resolvedParams = await params;
  return <CommunityAuthorProfile authorId={resolvedParams?.id ?? ''} />;
}
