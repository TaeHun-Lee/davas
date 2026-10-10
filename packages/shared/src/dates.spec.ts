import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isAfterSeoulToday, seoulToday } from './dates.js';

describe('Korean calendar dates', () => {
  it('rolls over at midnight in Korea, not at midnight UTC', () => {
    // 2026-10-06 16:30 UTC is 2026-10-07 01:30 in Seoul.
    const lateNight = new Date('2026-10-06T16:30:00Z');
    assert.equal(seoulToday(lateNight), '2026-10-07');
    assert.equal(isAfterSeoulToday('2026-10-07', lateNight), false);
    assert.equal(isAfterSeoulToday('2026-10-08', lateNight), true);
  });

  it('keeps the previous day until 15:00 UTC', () => {
    const afternoonUtc = new Date('2026-10-06T14:59:59Z');
    assert.equal(seoulToday(afternoonUtc), '2026-10-06');
    assert.equal(isAfterSeoulToday('2026-10-07', afternoonUtc), true);
  });
});
