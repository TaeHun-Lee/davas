import { Suspense } from 'react';
import { ExploreDashboard } from '../../components/explore/ExploreDashboard';

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreDashboard />
    </Suspense>
  );
}
