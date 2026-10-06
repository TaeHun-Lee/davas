import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applyPreselectedMedia,
  freshDraft,
  resolveCreateStep,
  restoreSavedDraft,
  savedDraftMatchesSubmission,
  type DraftSelectedMedia,
} from './record-composer-model';

const media: DraftSelectedMedia = {
  id: '90000000-0000-0000-0000-000000000001',
  mediaType: 'MOVIE',
  title: 'Runtime 검증 영화',
  posterUrl: null,
};

describe('record composer draft hydration', () => {
  it('keeps a pristine or selected-null restored create draft in the finder', () => {
    assert.equal(resolveCreateStep(freshDraft(), null), 'find');
    assert.equal(
      resolveCreateStep(
        { ...freshDraft(), viewingMethod: 'OTT', content: '작품 선택 전 메모', selected: null },
        null,
      ),
      'find',
    );
  });

  it('opens the editor only when selected media or a mediaId intent exists', () => {
    assert.equal(resolveCreateStep({ ...freshDraft(), selected: media }, null), 'write');
    assert.equal(resolveCreateStep(freshDraft(), media.id), 'write');
  });

  it('applies a media deep link even when an empty saved draft exists', async () => {
    const saved = { ...freshDraft(), content: '보존할 작성 중 내용' };
    const requested: string[] = [];

    const hydrated = await applyPreselectedMedia(saved, media.id, async (id) => {
      requested.push(id);
      return media;
    });

    assert.deepEqual(requested, [media.id]);
    assert.equal(hydrated.selected?.id, media.id);
    assert.equal(hydrated.content, saved.content);
  });

  it('leaves a saved draft unchanged without a media deep link', async () => {
    const saved = { ...freshDraft(), content: '보존할 작성 중 내용' };
    const hydrated = await applyPreselectedMedia(saved, null, async () => media);
    assert.equal(hydrated, saved);
  });

  it('preserves a valid saved draft when media deep-link hydration fails', async () => {
    const saved = { ...freshDraft(), content: '네트워크 오류에도 보존할 내용' };
    const restored = await restoreSavedDraft(JSON.stringify(saved), media.id, async () => {
      throw new Error('offline');
    });

    assert.equal(restored.draft?.content, saved.content);
    assert.equal(restored.invalidStorage, false);
    assert.equal(restored.preselectionError, true);
  });

  it('marks malformed storage separately from media hydration failures', async () => {
    const restored = await restoreSavedDraft('{broken', media.id, async () => media);

    assert.equal(restored.draft, null);
    assert.equal(restored.invalidStorage, true);
    assert.equal(restored.preselectionError, false);
  });

  it('finalizes only the exact submitted draft snapshot', () => {
    const submitted = JSON.stringify({ ...freshDraft(), content: 'submitted' });
    const newer = JSON.stringify({ ...freshDraft(), content: 'newer after remount' });

    assert.equal(savedDraftMatchesSubmission(submitted, submitted), true);
    assert.equal(savedDraftMatchesSubmission(newer, submitted), false);
    assert.equal(savedDraftMatchesSubmission(null, submitted), false);
  });
});
