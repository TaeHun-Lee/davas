import { SpaceInviteScreen } from '../../../../components/spaces/SpaceInviteScreen';

export default async function SpaceInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SpaceInviteScreen token={token} />;
}
