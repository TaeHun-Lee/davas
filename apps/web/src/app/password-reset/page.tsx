import { Suspense } from 'react';
import { AuthShell, ResetPasswordCard } from '../../components/auth/AuthUi';

export default function PasswordResetPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <ResetPasswordCard />
      </Suspense>
    </AuthShell>
  );
}
