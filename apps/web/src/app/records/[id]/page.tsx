import { Suspense } from 'react';
import { RecordDetailScreen } from '../../../components/core/RecordScreens';
export default async function RecordPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Suspense fallback={null}><RecordDetailScreen id={id} /></Suspense>; }
