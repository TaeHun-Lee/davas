import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BACKTEST_MODELS, runBacktest, type BacktestDataset } from './taste-backtest';

// Two people who always watch the next thriller together, between dramas they never pick.
function dataset(): BacktestDataset {
  const titles: BacktestDataset['titles'] = [];
  const watches: BacktestDataset['watches'] = [];
  for (let i = 0; i < 12; i += 1) {
    const day = `2025-${String(i + 1).padStart(2, '0')}-15`;
    titles.push({
      id: `thriller-${i}`,
      mediaType: 'MOVIE',
      genres: ['스릴러'],
      rating: 7,
      voteCount: 500,
      releaseDate: '2020-01-01',
      runtime: 110,
    });
    titles.push({
      id: `drama-${i}`,
      mediaType: 'MOVIE',
      genres: ['드라마'],
      rating: 7,
      voteCount: 500,
      releaseDate: '2020-01-01',
      runtime: 110,
    });
    for (const accountId of ['a', 'b'])
      watches.push({ accountId, contentId: `thriller-${i}`, watchedDate: day });
  }
  // Not out yet when anything was watched: never a candidate.
  titles.push({
    id: 'future',
    mediaType: 'MOVIE',
    genres: ['스릴러'],
    rating: 9,
    voteCount: 5000,
    releaseDate: '2030-01-01',
    runtime: 110,
  });
  // A rewatch is skipped.
  watches.push({ accountId: 'a', contentId: 'thriller-0', watchedDate: '2025-12-31' });
  return { titles, watches, ratings: [] };
}

describe('recommendation backtest', () => {
  it('replays each model over released, unwatched titles and skips rewatches', () => {
    const results = runBacktest(dataset(), { eventsPerPerson: 6 });
    assert.deepEqual(
      results.map((result) => result.model),
      [...BACKTEST_MODELS],
    );
    for (const result of results) {
      assert.equal(result.events, 11, 'the rewatch is not replayed');
      assert.ok(result.meanCandidates < 25, 'the unreleased title is never a candidate');
    }
    const byModel = Object.fromEntries(results.map((result) => [result.model, result]));
    // Taste learns the thriller habit; v1 has no ratings to learn from.
    assert.ok(byModel['taste-v2'].meanPercentile < byModel['genre-rating-v1'].meanPercentile);
    assert.ok(byModel['taste-v2'].meanUncertainty! < byModel['genre-rating-v1'].meanUncertainty!);
  });

  it('replays titles everyone watched the same day in group mode', () => {
    const [random] = runBacktest(dataset(), { eventsPerPerson: 5, group: true });
    assert.equal(random.events, 5);
  });
});
