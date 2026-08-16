import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGroupBase,
  diversityRerank,
  passesHardFilters,
  qualityPrior,
  RecommendationCandidate,
  scoreParticipant,
} from './group-recommendation.algorithm';

const now = new Date('2026-08-13T00:00:00.000Z');
const candidate = (
  overrides: Partial<RecommendationCandidate> = {},
): RecommendationCandidate => ({
  id: 'content-a',
  mediaType: 'MOVIE',
  title: 'Balanced Film',
  runtime: 120,
  genres: ['Drama'],
  director: 'Director A',
  releaseDate: '2025-01-01',
  rating: 8,
  voteCount: 1000,
  availability: {
    status: 'AVAILABLE',
    observedAt: new Date('2026-08-12T00:00:00.000Z'),
    expiresAt: new Date('2026-08-14T00:00:00.000Z'),
    offers: [{ provider: 'Netflix', offerType: 'FLATRATE', confidence: 0.9 }],
  },
  ...overrides,
});
const request = {
  region: 'KR',
  services: ['netflix'],
  contentTypes: ['MOVIE'] as Array<'MOVIE' | 'TV'>,
  runtimeMin: 90,
  runtimeMax: 150,
  moodTags: ['drama'],
  avoidTags: ['horror'],
  rewatchPolicy: 'EXCLUDE' as const,
};

describe('deterministic group recommendation algorithm', () => {
  it('applies groupBase exactly for 2, 3, and 5 participants', () => {
    for (const scores of [
      [0.8, 0.6],
      [0.9, 0.7, 0.5],
      [0.9, 0.8, 0.7, 0.6, 0.5],
    ]) {
      const actual = calculateGroupBase(scores);
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const floor = Math.min(...scores);
      const deviation = Math.sqrt(
        scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) /
          scores.length,
      );
      assert.equal(
        actual.groupBase,
        Number((0.6 * floor + 0.4 * mean - 0.1 * deviation).toFixed(5)),
      );
    }
  });

  it('protects minimum satisfaction instead of allowing a high mean to dominate', () => {
    const polarized = calculateGroupBase([1, 0.1]);
    const balanced = calculateGroupBase([0.6, 0.6]);
    assert.ok(balanced.groupBase > polarized.groupBase);
    assert.equal(polarized.floor, 0.1);
  });

  it('allows zero hard-filter violations and never softens explicit rejection or rewatch exclusion', () => {
    const valid = candidate();
    assert.equal(
      passesHardFilters(valid, request, now, new Set(), new Set()),
      true,
    );
    for (const invalid of [
      candidate({ mediaType: 'TV' }),
      candidate({ runtime: 170 }),
      candidate({ runtime: null }),
      candidate({ genres: ['Horror'] }),
      candidate({ releaseDate: '2030-01-01' }),
      candidate({
        availability: {
          ...valid.availability,
          status: 'PROVIDER_FAILURE',
        },
      }),
      candidate({
        availability: {
          ...valid.availability,
          expiresAt: new Date('2026-08-12T00:00:00.000Z'),
        },
      }),
      candidate({
        availability: {
          ...valid.availability,
          offers: [{ provider: 'Wavve', offerType: 'FLATRATE', confidence: 0.9 }],
        },
      }),
    ]) {
      assert.equal(
        passesHardFilters(invalid, request, now, new Set(), new Set()),
        false,
      );
    }
    assert.equal(
      passesHardFilters(valid, request, now, new Set([valid.id]), new Set()),
      false,
    );
    assert.equal(
      passesHardFilters(valid, request, now, new Set(), new Set([valid.id])),
      false,
    );
  });

  it('treats an unknown participant as uncertain rather than disliked', () => {
    const content = candidate();
    const prediction = scoreParticipant('new-user', content, [], []);
    assert.equal(prediction.knownSignalCount, 0);
    assert.equal(prediction.uncertainty, 0.9);
    assert.ok(prediction.score >= 0.5);
    assert.ok(qualityPrior(content) > 0.5);
  });

  it('reranks similar high-score candidates to protect list diversity deterministically', () => {
    const ranked = [
      { id: 'a', score: 0.9, genres: ['Drama'] },
      { id: 'b', score: 0.89, genres: ['Drama'] },
      { id: 'c', score: 0.84, genres: ['Comedy'] },
    ].map(({ id, score, genres }) => ({
      candidate: candidate({ id, genres }),
      participantScores: [],
      groupBase: score,
      finalScore: score,
      scoreParts: {},
      channels: ['QUALITY_POPULAR'],
    }));
    const first = diversityRerank(ranked, 3);
    const second = diversityRerank(ranked, 3);
    assert.deepEqual(
      first.map((item) => item.candidate.id),
      ['a', 'c', 'b'],
    );
    assert.deepEqual(
      second.map((item) => item.candidate.id),
      first.map((item) => item.candidate.id),
    );
  });
});
