import { AuthShell, LoginCard } from '../../components/auth/AuthUi';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </AuthShell>
  );
}
