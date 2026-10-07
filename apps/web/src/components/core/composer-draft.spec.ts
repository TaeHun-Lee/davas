import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SpaceView } from '@davas/shared';
import type { MediaDetail, SelectedMedia } from '../../lib/api/media';
import type { WatchProgress } from '../../lib/api/memories';
import {
  canResumeDraft,
  continueSeries,
  draftWithDefaults,
  freshDraft,
  seriesProgressSummary,
} from './composer-draft';

const selected = (id: string) => ({ id }) as SelectedMedia;
const series = (id: string, numberOfEpisodes: number | null = 16) =>
  ({ id, mediaType: 'TV', numberOfEpisodes }) as MediaDetail;
const movie = (id: string) => ({ id, mediaType: 'MOVIE', numberOfEpisodes: null }) as MediaDetail;
const progress = (overrides: Partial<WatchProgress> = {}): WatchProgress => ({
  mediaId: 'drama',
  episodeWatched: 8,
  episodeTotal: 16,
  completed: false,
  providerName: '넷플릭스',
  sourceKind: 'OTT',
  watchedDate: '2026-10-02',
  ...overrides,
});

describe('record composer drafts', () => {
  it('resumes a draft only for the same title or one still waiting for a title', () => {
    const forMovieA = { ...freshDraft(), selected: selected('movie-a') };
    const waiting = freshDraft();
    assert.equal(canResumeDraft(null, 'movie-a'), false);
    assert.equal(canResumeDraft(forMovieA, null), true);
    assert.equal(canResumeDraft(forMovieA, 'movie-a'), true);
    assert.equal(canResumeDraft(waiting, 'drama-b'), true);
    // A draft for movie A never becomes the record for drama B.
    assert.equal(canResumeDraft(forMovieA, 'drama-b'), false);
  });

  it('starts a new record in the active space with the partner of a two-person space', () => {
    const couple = {
      id: 'space-1',
      name: '우리 둘',
      status: 'ACTIVE',
      maxMembers: 2,
      ownerAccountId: 'me',
      members: [
        { accountId: 'me', role: 'OWNER', status: 'ACTIVE', profileImageUrl: null },
        { accountId: 'partner', role: 'MEMBER', status: 'ACTIVE', profileImageUrl: null },
      ],
    } satisfies SpaceView;
    const draft = draftWithDefaults([couple], 'me');
    assert.deepEqual(draft.spaceIds, ['space-1']);
    assert.deepEqual(draft.participantAccountIds, ['partner']);
    assert.deepEqual(draftWithDefaults(null, 'me').spaceIds, []);
  });

  it('continues a series from the next episode on the same service', async () => {
    const draft = freshDraft();
    const result = await continueSeries(draft, series('drama'), async () => progress());
    assert.equal(result?.episodeWatched, 8);
    assert.deepEqual(
      [draft.sourceKind, draft.providerName, draft.episodeWatched, draft.episodeTotal],
      ['OTT', '넷플릭스', 9, 16],
    );
    assert.equal(draft.seriesPrefilledFor, 'drama');
  });

  it('keeps what the user already chose and stops at a finished series', async () => {
    const chosen = { ...freshDraft(), sourceKind: 'TV_OWNED' as const, episodeWatched: 3 };
    await continueSeries(chosen, series('drama'), async () => progress());
    assert.deepEqual([chosen.sourceKind, chosen.episodeWatched], ['TV_OWNED', 3]);

    const finished = freshDraft();
    await continueSeries(finished, series('drama'), async () => progress({ completed: true }));
    assert.equal(finished.episodeWatched, null);
  });

  it('drops episode numbers that belonged to another title', async () => {
    const draft = {
      ...freshDraft(),
      seriesPrefilledFor: 'other-drama',
      episodeWatched: 12,
      episodeTotal: 20,
    };
    await continueSeries(draft, movie('movie-c'), async () => null);
    assert.deepEqual([draft.episodeWatched, draft.episodeTotal], [null, null]);
    assert.equal(draft.seriesPrefilledFor, 'movie-c');
  });

  it('says where a series record leaves off and where the next one picks up', () => {
    assert.equal(
      seriesProgressSummary(8, 16, false),
      '전체 16화 중 8화 · 다음 기록 때 9화부터 이어서 적을 수 있어요.',
    );
    assert.equal(
      seriesProgressSummary(3, null, false),
      '3화까지 · 다음 기록 때 4화부터 이어서 적을 수 있어요.',
    );
    // The last episode, or a finished series, has no next episode to promise.
    assert.equal(seriesProgressSummary(16, 16, false), '전체 16화 중 16화');
    assert.equal(seriesProgressSummary(16, 16, true), '전체 16화를 끝까지 다 봤어요.');
    assert.equal(seriesProgressSummary(null, 16, false), null);
  });
});
