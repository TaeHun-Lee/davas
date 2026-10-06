import { AuthShell, SignupCard } from '../../components/auth/AuthUi';
import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <SignupCard />
      </Suspense>
    </AuthShell>
  );
}
