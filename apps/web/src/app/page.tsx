import { Suspense } from 'react';
import { AuthenticatedLanding } from '../components/auth/AuthenticatedLanding';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <AuthenticatedLanding />
    </Suspense>
  );
}
