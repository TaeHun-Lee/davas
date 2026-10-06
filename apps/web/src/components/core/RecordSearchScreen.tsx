'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MediaType, ViewingMethod } from '@davas/shared';
import { MediaTypeControl, SearchField, TaskShell, ViewingMethodControl } from './CoreUi';
import { RecordList } from './RecordListScreens';

export function SearchScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const scope = params.get('scope') === 'mine' ? 'mine' : 'friends';
  const [q, setQ] = useState(params.get('q') ?? '');
  const mediaType = (params.get('mediaType') as MediaType | null) || null;
  const viewingMethod = (params.get('viewingMethod') as ViewingMethod | null) || null;

  const update = (next: {
    q?: string;
    mediaType?: MediaType | null;
    viewingMethod?: ViewingMethod | null;
  }) => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set('scope', scope);
    const values = { q, mediaType, viewingMethod, ...next };
    Object.entries(values).forEach(([key, value]) =>
      value ? nextParams.set(key, value) : nextParams.delete(key),
    );
    router.replace(`/search?${nextParams}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextParams = new URLSearchParams(params.toString());
      nextParams.set('scope', scope);
      if (q) nextParams.set('q', q);
      else nextParams.delete('q');
      router.replace(`/search?${nextParams}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [q, params, router, scope]);

  return (
    <TaskShell
      title={scope === 'mine' ? '내 기록 검색' : '친구 기록 검색'}
      fallback={scope === 'mine' ? '/me' : '/'}
    >
      <SearchField
        value={q}
        onChange={setQ}
        label="기록 검색"
        placeholder={scope === 'mine' ? '작품 제목으로 내 기록 찾기' : '작품 제목 또는 친구 이름'}
      />
      <div className="mt-5">
        <span className="field-label">작품 종류</span>
        <MediaTypeControl value={mediaType} onChange={(value) => update({ mediaType: value })} />
      </div>
      <div className="mt-4">
        <span className="field-label">본 곳</span>
        <ViewingMethodControl
          includeAll
          value={viewingMethod}
          onChange={(value) => update({ viewingMethod: value })}
        />
      </div>
      <p className="page-description mb-4 mt-5">검색어와 두 필터를 모두 만족하는 기록이에요.</p>
      <RecordList
        scope={scope}
        filters={{
          q: params.get('q') ?? undefined,
          mediaType: mediaType ?? undefined,
          viewingMethod: viewingMethod ?? undefined,
        }}
      />
    </TaskShell>
  );
}
