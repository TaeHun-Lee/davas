import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapWithConcurrency } from './concurrency';

describe('mapWithConcurrency', () => {
  it('keeps order and never runs more than the limit at once', async () => {
    let active = 0;
    let peak = 0;
    const results = await mapWithConcurrency([30, 10, 20, 5, 15], 2, async (delay, index) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, delay));
      active -= 1;
      return index * 10;
    });
    assert.deepEqual(results, [0, 10, 20, 30, 40]);
    assert.equal(peak, 2);
  });

  it('handles an empty list', async () => {
    assert.deepEqual(await mapWithConcurrency([], 4, async () => 1), []);
  });
});
