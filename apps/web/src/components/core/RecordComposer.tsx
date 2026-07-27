'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { MediaType } from '@davas/shared';
import { getMe } from '../../lib/api/auth';
import { getMediaDetail, selectMedia, type MediaSearchResult } from '../../lib/api/media';
import {
  CoreApiError,
  createRecord,
  getRecord,
  updateRecord,
  type RecordWritePayload,
} from '../../lib/api/core';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import { AsyncState, TaskShell } from './CoreUi';
import { RecordEditorView } from './RecordEditorView';
import { RecordFinderView } from './RecordFinderView';
import {
  applyPreselectedMedia,
  draftFromRecord,
  draftStorageKey,
  freshDraft,
  resolveCreateStep,
  restoreSavedDraft,
  savedDraftMatchesSubmission,
  type RecordDraft,
} from './record-composer-model';

export function RecordComposer({ editId }: { editId?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [userId, setUserId] = useState('');
  const [draft, setDraft] = useState<RecordDraft | null>(null);
  const [step, setStep] = useState<'find' | 'write'>(
    editId || params.get('mediaId') ? 'write' : 'find',
  );
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rewatchId, setRewatchId] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const viewingRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const searchType = mediaType === 'MOVIE' ? 'movie' : mediaType === 'TV' ? 'tv' : 'multi';
  const results = useMediaSearch(query, searchType);
  const key = userId ? draftStorageKey(userId, editId) : '';

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setDraft(null);
    setError('');
    void (async () => {
      try {
        const user = await getMe();
        if (!active) return;
        setUserId(user.id);
        const storageKey = draftStorageKey(user.id, editId);
        const preselectedMediaId = editId ? null : params.get('mediaId');
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          const restored = await restoreSavedDraft(saved, preselectedMediaId, getMediaDetail);
          if (!active) return;
          if (restored.invalidStorage) {
            sessionStorage.removeItem(storageKey);
          } else if (restored.draft) {
            setDraft(restored.draft);
            setStep(
              resolveCreateStep(
                restored.draft,
                restored.preselectionError ? null : preselectedMediaId,
              ),
            );
            if (restored.preselectionError) {
              setError('선택한 작품을 불러오지 못했어요. 작성 중인 내용은 보존했어요.');
            }
            return;
          }
        }
        if (editId) {
          const record = await getRecord(editId);
          if (!active) return;
          setDraft(draftFromRecord(record));
          return;
        }
        const hydrated = await applyPreselectedMedia(
          freshDraft(),
          preselectedMediaId,
          getMediaDetail,
        );
        if (!active) return;
        setDraft(hydrated);
        setStep(resolveCreateStep(hydrated, preselectedMediaId));
      } catch {
        if (active) setError('작성 화면을 준비하지 못했어요.');
      }
    })();
    return () => {
      active = false;
    };
  }, [editId, params]);

  useEffect(() => {
    if (key && draft) sessionStorage.setItem(key, JSON.stringify(draft));
  }, [key, draft]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (draft?.selected || draft?.content) event.preventDefault();
    };
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [draft]);

  if (!draft) {
    return (
      <TaskShell
        title={editId ? '기록 수정' : '기록 작성'}
        fallback={editId ? `/records/${editId}` : '/records/new'}
      >
        {error ? <p className="form-error">{error}</p> : <AsyncState kind="loading" />}
      </TaskShell>
    );
  }

  const currentDraft = draft;

  async function choose(item: MediaSearchResult) {
    if (!currentDraft.viewingMethod) {
      setError('먼저 실제로 본 곳을 선택해 주세요.');
      viewingRef.current?.querySelector('button')?.focus();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const selected = await selectMedia(item);
      setDraft((value) => value && { ...value, selected });
      setStep('write');
      router.push('/records/new?step=write');
    } catch {
      setError('작품을 선택하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  async function save(allowDuplicate = false) {
    if (busy) return;
    if (!currentDraft.selected || !currentDraft.viewingMethod) {
      setError('작품과 본 곳을 선택해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    const submittedDraft = JSON.stringify(currentDraft);
    sessionStorage.setItem(key, submittedDraft);
    const payload: RecordWritePayload = {
      mediaId: currentDraft.selected.id,
      viewingMethod: currentDraft.viewingMethod,
      watchedDate: currentDraft.watchedDate,
      rating: currentDraft.rating,
      content: currentDraft.content.trim(),
      hasSpoiler: Boolean(currentDraft.content.trim()) && currentDraft.hasSpoiler,
      visibility: currentDraft.visibility === 'PRIVATE' ? 'PRIVATE' : 'FRIENDS',
      clientRequestId: currentDraft.clientRequestId,
      allowDuplicate,
    };
    try {
      const result = editId
        ? await updateRecord(editId, {
            ...payload,
            visibility: currentDraft.visibility === 'SELECTED' ? undefined : payload.visibility,
          })
        : await createRecord(payload);
      if (
        !mountedRef.current ||
        !savedDraftMatchesSubmission(sessionStorage.getItem(key), submittedDraft)
      )
        return;
      sessionStorage.removeItem(key);
      router.replace(
        `/records/${result.diary.id}?returnTo=${encodeURIComponent('/me')}&saved=${currentDraft.visibility === 'PRIVATE' ? 'private' : 'friends'}`,
      );
    } catch (cause) {
      if (
        !mountedRef.current ||
        !savedDraftMatchesSubmission(sessionStorage.getItem(key), submittedDraft)
      )
        return;
      if (cause instanceof CoreApiError && cause.body.code === 'POSSIBLE_REWATCH') {
        const existing = cause.body.details?.existingRecord as { id?: string } | undefined;
        setRewatchId(existing?.id ?? null);
        setError('같은 작품을 같은 날 같은 곳에서 본 기록이 있어요.');
      } else {
        setError(cause instanceof Error ? cause.message : '기록을 저장하지 못했어요.');
      }
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }

  function changeMedia() {
    if (busy) return;
    setStep('find');
    setDraft({ ...currentDraft, selected: null });
    router.replace('/records/new');
  }

  function discard() {
    if (busy) return;
    sessionStorage.removeItem(key);
    if (editId) {
      router.push(`/records/${editId}`);
      return;
    }
    setDraft(freshDraft());
    setStep('find');
    router.replace('/records/new');
  }

  if (step === 'find' && !editId) {
    return (
      <RecordFinderView
        draft={currentDraft}
        query={query}
        mediaType={mediaType}
        error={error}
        busy={busy}
        results={results}
        viewingRef={viewingRef}
        onDraftChange={(value) => {
          setDraft(value);
          setError('');
        }}
        onQueryChange={setQuery}
        onMediaTypeChange={setMediaType}
        onChoose={(item) => void choose(item)}
      />
    );
  }

  return (
    <RecordEditorView
      editId={editId}
      draft={draft}
      error={error}
      busy={busy}
      rewatchId={rewatchId}
      confirmDiscard={confirmDiscard}
      viewingRef={viewingRef}
      onDraftChange={(value) => {
        if (busy) return;
        setDraft(value);
      }}
      onChangeMedia={changeMedia}
      onSave={(allowDuplicate) => void save(allowDuplicate)}
      onOpenExisting={(id) => router.push(`/records/${id}`)}
      onRequestDiscard={() => {
        if (busy) return;
        setConfirmDiscard(true);
      }}
      onCancelDiscard={() => setConfirmDiscard(false)}
      onConfirmDiscard={discard}
    />
  );
}
