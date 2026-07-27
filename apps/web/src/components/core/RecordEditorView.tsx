'use client';

import type { RefObject } from 'react';
import { Poster, TaskShell, ViewingMethodControl } from './CoreUi';
import { today, type RecordDraft } from './record-composer-model';

export function RecordEditorView({
  editId,
  draft,
  error,
  busy,
  rewatchId,
  confirmDiscard,
  viewingRef,
  onDraftChange,
  onChangeMedia,
  onSave,
  onOpenExisting,
  onRequestDiscard,
  onCancelDiscard,
  onConfirmDiscard,
}: {
  editId?: string;
  draft: RecordDraft;
  error: string;
  busy: boolean;
  rewatchId: string | null;
  confirmDiscard: boolean;
  viewingRef: RefObject<HTMLDivElement | null>;
  onDraftChange: (draft: RecordDraft) => void;
  onChangeMedia: () => void;
  onSave: (allowDuplicate?: boolean) => void;
  onOpenExisting: (id: string) => void;
  onRequestDiscard: () => void;
  onCancelDiscard: () => void;
  onConfirmDiscard: () => void;
}) {
  return (
    <TaskShell
      title={editId ? '기록 수정' : '기록 작성'}
      fallback={editId ? `/records/${editId}` : '/records/new'}
      onBack={onRequestDiscard}
      backDisabled={busy}
    >
      <fieldset className="contents" disabled={busy} aria-busy={busy}>
        <section className="core-card p-4">
          <div className="flex gap-3">
            <Poster
              url={draft.selected?.posterUrl ?? null}
              title={draft.selected?.title ?? '선택 작품'}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-black text-[var(--heading)]">
                {draft.selected?.title ?? '작품을 선택해 주세요'}
              </h1>
              <p className="page-description">
                {draft.selected?.mediaType === 'TV' ? '드라마' : '영화'}
              </p>
              {!editId ? (
                <button className="secondary-button mt-3" onClick={onChangeMedia}>
                  작품 바꾸기
                </button>
              ) : null}
            </div>
          </div>
        </section>
        <div className="mt-5" ref={viewingRef}>
          <span className="field-label">본 곳 *</span>
          <ViewingMethodControl
            value={draft.viewingMethod}
            onChange={(value) => onDraftChange({ ...draft, viewingMethod: value })}
          />
          {draft.viewingMethod === null && editId ? (
            <p className="form-error mt-2">
              이전 기록에는 본 곳이 없어요. 수정하려면 선택해 주세요.
            </p>
          ) : null}
        </div>
        <label className="mt-5 block">
          <span className="field-label">본 날짜 *</span>
          <input
            className="date-input"
            type="date"
            max={today()}
            value={draft.watchedDate}
            onChange={(event) => onDraftChange({ ...draft, watchedDate: event.target.value })}
          />
        </label>
        <fieldset className="mt-5">
          <legend className="field-label">별점 (선택)</legend>
          <div className="segmented" role="radiogroup" aria-label="별점">
            {[null, 1, 2, 3, 4, 5].map((rating) => (
              <label
                key={rating ?? 'none'}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-bold has-[:checked]:bg-[var(--blue-soft)] has-[:checked]:text-[var(--blue)]"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="rating"
                  value={rating ?? ''}
                  checked={draft.rating === rating}
                  onChange={() => onDraftChange({ ...draft, rating })}
                />
                {rating === null ? '안 남김' : `${rating}점`}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block">
          <span className="field-label">어땠나요? (선택)</span>
          <textarea
            className="text-area"
            maxLength={500}
            value={draft.content}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                content: event.target.value,
                hasSpoiler: event.target.value ? draft.hasSpoiler : false,
              })
            }
          />
          <span className="mt-1 block text-right text-xs font-semibold text-[var(--muted)]">
            {draft.content.length}/500
          </span>
        </label>
        {draft.content.trim() ? (
          <label className="mt-3 flex min-h-11 items-center gap-3 text-sm font-bold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--blue)]"
              checked={draft.hasSpoiler}
              onChange={(event) => onDraftChange({ ...draft, hasSpoiler: event.target.checked })}
            />
            스포일러가 있어요
          </label>
        ) : null}
        <label className="mt-3 flex min-h-11 items-center justify-between gap-3 text-sm font-bold">
          <span>
            친구에게 보여주기
            <small className="block text-xs font-semibold text-[var(--muted)]">
              끄면 나만 볼 수 있어요.
            </small>
          </span>
          <input
            type="checkbox"
            className="h-6 w-6 accent-[var(--blue)]"
            checked={draft.visibility !== 'PRIVATE'}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                visibility: event.target.checked ? 'FRIENDS' : 'PRIVATE',
              })
            }
          />
        </label>
        {draft.visibility === 'SELECTED' ? (
          <div className="form-error mt-2">
            <p>
              일부 친구 공개(이전 방식) 기록이에요. 명시적으로 바꾸기 전까지 기존 대상을 유지해요.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onDraftChange({ ...draft, visibility: 'FRIENDS' })}
              >
                친구 전체로 변경
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => onDraftChange({ ...draft, visibility: 'PRIVATE' })}
              >
                나만 보기로 변경
              </button>
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="form-error mt-4" role="alert">
            {error}
          </p>
        ) : null}
        {rewatchId ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="secondary-button" onClick={() => onOpenExisting(rewatchId)}>
              기존 기록 보기
            </button>
            <button className="commit-button" disabled={busy} onClick={() => onSave(true)}>
              새 기록으로 저장
            </button>
          </div>
        ) : (
          <button
            className="commit-button sticky-commit mt-5"
            disabled={busy || !draft.selected || !draft.viewingMethod}
            onClick={() => onSave()}
          >
            {busy
              ? '저장 중…'
              : editId
                ? '수정 내용 저장하기'
                : draft.visibility === 'PRIVATE'
                  ? '나만 저장하기'
                  : '친구와 공유하기'}
          </button>
        )}
        {confirmDiscard ? (
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-title"
            className="core-card mt-4 p-5"
          >
            <h2 id="discard-title" className="section-title">
              작성 중인 내용을 버릴까요?
            </h2>
            <p className="page-description">버리면 이 기기의 현재 draft가 삭제돼요.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                autoFocus
                className="secondary-button"
                onClick={onCancelDiscard}
              >
                계속 작성
              </button>
              <button type="button" className="danger-button" onClick={onConfirmDiscard}>
                작성 내용 버리기
              </button>
            </div>
          </section>
        ) : null}
      </fieldset>
    </TaskShell>
  );
}
