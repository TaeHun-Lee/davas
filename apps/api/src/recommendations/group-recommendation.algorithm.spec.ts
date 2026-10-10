import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGroupBase,
  diversityRerank,
  passesHardFilters,
  qualityPrior,
  RecommendationCandidate,
  freshness,
  rankCandidate,
  relativePopularity,
  scoreParticipant,
  tagMatchesGenres,
} from './group-recommendation.algorithm';
import { buildTasteProfile } from './taste-profile';

const noTaste = buildTasteProfile([], new Date('2026-08-13T00:00:00.000Z'));

const now = new Date('2026-08-13T00:00:00.000Z');
const candidate = (overrides: Partial<RecommendationCandidate> = {}): RecommendationCandidate => ({
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
        scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) / scores.length,
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
    assert.equal(passesHardFilters(valid, request, now, new Set(), new Set()), true);
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
      assert.equal(passesHardFilters(invalid, request, now, new Set(), new Set()), false);
    }
    assert.equal(passesHardFilters(valid, request, now, new Set([valid.id]), new Set()), false);
    assert.equal(passesHardFilters(valid, request, now, new Set(), new Set([valid.id])), false);
  });

  it('treats an unknown participant as uncertain rather than disliked', () => {
    const content = candidate();
    const prediction = scoreParticipant('new-user', content, noTaste, new Map(), []);
    assert.equal(prediction.uncertainty, 1);
    assert.ok(prediction.score >= 0.5);
    assert.ok(qualityPrior(content) > 0.5);
  });

  it('ranks fresh titles a little higher and lets a single person rank on their own score', () => {
    const recent = candidate({ releaseDate: '2026-07-01' });
    const old = candidate({ id: 'content-old', releaseDate: '2001-01-01' });
    assert.ok(freshness(recent, now) > 0.9);
    assert.equal(freshness(old, now), 0);
    assert.equal(freshness(candidate({ releaseDate: '2027-01-01' }), now), 0);
    const person = [{ accountId: 'u1', score: 0.6, uncertainty: 0.2 }];
    const context = { moodTags: [], channels: [], now };
    assert.ok(
      rankCandidate(recent, person, context).finalScore >
        rankCandidate(old, person, context).finalScore,
    );
    assert.equal(rankCandidate(old, person, context).groupBase, 0.6);
  });

  it('ranks the more popular of two otherwise equal titles higher, and unknown popularity as none', () => {
    const popular = candidate({ id: 'popular', popularity: 400 });
    const quiet = candidate({ id: 'quiet', popularity: 20 });
    const unknown = candidate({ id: 'unknown' });
    assert.equal(relativePopularity(popular, 400), 1);
    assert.ok(relativePopularity(quiet, 400) < 0.6);
    assert.equal(relativePopularity(unknown, 400), 0);
    const person = [{ accountId: 'u1', score: 0.6, uncertainty: 0.2 }];
    const context = { moodTags: [], channels: [], now, mostPopular: 400 };
    assert.ok(
      rankCandidate(popular, person, context).finalScore >
        rankCandidate(quiet, person, context).finalScore,
    );
    assert.equal(rankCandidate(unknown, person, context).scoreParts.popularityBonus, 0);
  });

  it('reads the moods the web offers through the genres that carry them', () => {
    const comedy = candidate({ genres: ['코미디', '가족'] });
    const thriller = candidate({ id: 'content-b', genres: ['스릴러'] });
    assert.equal(tagMatchesGenres('웃긴', comedy.genres), true);
    assert.equal(tagMatchesGenres('웃긴', thriller.genres), false);
    // A tag that is not one of the moods is still a plain genre name.
    assert.equal(tagMatchesGenres('스릴러', thriller.genres), true);
    assert.ok(
      scoreParticipant('new-user', comedy, noTaste, new Map(), ['웃긴']).score >
        scoreParticipant('new-user', comedy, noTaste, new Map(), ['긴장감']).score,
    );
    const avoidTense = { ...request, moodTags: [], avoidTags: ['긴장감'] };
    assert.equal(passesHardFilters(thriller, avoidTense, now, new Set(), new Set()), false);
    assert.equal(passesHardFilters(comedy, avoidTense, now, new Set(), new Set()), true);
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
