import { Suspense } from 'react';
import { CommunityDashboard } from '../../components/community/CommunityDashboard';

export default function CommunityPage() {
  return (
    <Suspense fallback={null}>
      <CommunityDashboard />
    </Suspense>
  );
}
