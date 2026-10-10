import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildTasteProfile,
  favoriteFeatures,
  featureShare,
  predictTaste,
  recencyWeight,
  type TasteSignal,
} from './taste-profile';

const NOW = new Date('2026-10-10T12:00:00Z');
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
const watched = (id: string, features: string[], days = 10): TasteSignal => ({
  contentId: id,
  features,
  at: daysAgo(days),
  kind: 'WATCHED',
});
// Half the known titles are thrillers, half dramas.
const universe = featureShare([
  { features: ['스릴러'] },
  { features: ['스릴러'] },
  { features: ['드라마'] },
  { features: ['드라마'] },
]);

describe('taste profile', () => {
  it('counts a recent watch fully, one from a year and a half ago half, and never below a quarter', () => {
    assert.equal(recencyWeight(NOW, NOW), 1);
    assert.ok(Math.abs(recencyWeight(daysAgo(540), NOW) - 0.5) < 1e-9);
    assert.equal(recencyWeight(daysAgo(5000), NOW), 0.25);
  });

  it('prefers what someone watches more than the catalogue offers, and grows sure as history grows', () => {
    const fan = buildTasteProfile(
      [
        watched('t1', ['스릴러']),
        watched('t2', ['스릴러']),
        watched('t3', ['스릴러']),
        watched('d1', ['드라마']),
      ],
      NOW,
    );
    const thriller = predictTaste(fan, ['스릴러'], universe);
    const drama = predictTaste(fan, ['드라마'], universe);
    assert.ok(thriller.affinity > 0 && drama.affinity < 0);
    assert.ok(thriller.uncertainty < drama.uncertainty);

    const unknown = predictTaste(buildTasteProfile([], NOW), ['스릴러'], universe);
    assert.deepEqual(unknown, { affinity: 0, uncertainty: 1 });
  });

  it('counts a rewatch and a wish toward taste', () => {
    const rewatcher = buildTasteProfile(
      [watched('t1', ['스릴러']), watched('t1', ['스릴러'], 3), watched('d1', ['드라마'])],
      NOW,
    );
    assert.ok((rewatcher.share.get('스릴러') ?? 0) > (rewatcher.share.get('드라마') ?? 0));

    const wisher = buildTasteProfile(
      [{ contentId: 'w1', features: ['코미디'], at: daysAgo(1), kind: 'WISHED' }],
      NOW,
    );
    assert.ok((wisher.evidence.get('코미디') ?? 0) > 0);
  });

  it("reads ratings against the person's own habit", () => {
    const rate = (id: string, features: string[], rating: number): TasteSignal => ({
      contentId: id,
      features,
      at: daysAgo(1),
      kind: 'RATED',
      rating,
    });
    // Someone who gives nearly everything 4.5 stars: the one 3-star title is the outlier.
    const generous = buildTasteProfile(
      [
        rate('a', ['드라마'], 9),
        rate('b', ['드라마'], 9),
        rate('c', ['드라마'], 9),
        rate('d', ['드라마'], 9),
        rate('e', ['공포'], 6),
      ],
      NOW,
    );
    assert.ok((generous.explicit.get('공포') ?? 0) < 0);
    assert.ok((generous.explicit.get('드라마') ?? 0) > 0);
  });

  it('lets a turned-down feature pull taste down and never be a favourite', () => {
    const profile = buildTasteProfile(
      [
        watched('t1', ['스릴러']),
        watched('t2', ['스릴러']),
        watched('t3', ['스릴러']),
        { contentId: 'x', features: ['스릴러'], at: daysAgo(1), kind: 'REJECTED' },
        { contentId: 'y', features: ['스릴러'], at: daysAgo(1), kind: 'REJECTED' },
        { contentId: 'z', features: ['스릴러'], at: daysAgo(1), kind: 'REJECTED' },
      ],
      NOW,
    );
    assert.ok((profile.explicit.get('스릴러') ?? 0) < 0);
    assert.equal(favoriteFeatures(profile, universe).has('스릴러'), false);

    const fan = buildTasteProfile(
      [watched('t1', ['스릴러']), watched('t2', ['스릴러']), watched('t3', ['스릴러'])],
      NOW,
    );
    assert.equal(favoriteFeatures(fan, universe).has('스릴러'), true);
  });
});
