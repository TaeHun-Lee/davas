import { Suspense } from 'react';
import { DiaryDashboard } from '../../components/diary/DiaryDashboard';

export default function DiaryPage() {
  return (
    <Suspense fallback={null}>
      <DiaryDashboard />
    </Suspense>
  );
}
