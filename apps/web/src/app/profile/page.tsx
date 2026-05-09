import { Suspense } from 'react';
import { ProfileDashboard } from '../../components/profile/ProfileDashboard';

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileDashboard />
    </Suspense>
  );
}
