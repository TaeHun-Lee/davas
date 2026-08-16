import { Suspense } from 'react';
import { ExploreDashboard } from '../../components/explore/ExploreDashboard';

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-3xl px-4 py-8" aria-busy="true">
          <div className="h-28 animate-pulse rounded-[24px] bg-[#edf3fa]" />
        </main>
      }
    >
      <ExploreDashboard />
    </Suspense>
  );
}
