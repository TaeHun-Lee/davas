import { Suspense } from 'react';
import { SearchScreen } from '../../components/core/RecordScreens';
export default function SearchPage() { return <Suspense fallback={null}><SearchScreen /></Suspense>; }
