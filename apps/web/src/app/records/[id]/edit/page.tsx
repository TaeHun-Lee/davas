import { Suspense } from 'react';
import { RecordComposer } from '../../../../components/core/RecordComposer';
export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Suspense fallback={null}><RecordComposer editId={id} /></Suspense>; }
