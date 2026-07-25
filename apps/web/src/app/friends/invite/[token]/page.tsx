import { FriendInviteScreen } from '../../../../components/friends/FriendInviteScreen';
export default async function FriendInvitePage({params}:{params:Promise<{token:string}>}){const{token}=await params;return <FriendInviteScreen token={token}/>}
