import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AccountDeletionPurgeService } from './account-deletion-purge.service';

describe('AccountDeletionPurgeService', () => {
  it('purges due accounts, survives a failed run and never runs twice at once', async () => {
    const calls: Date[] = [];
    let release!: () => void;
    let fail = false;
    const users = {
      async purgeExpiredDeletions(now: Date) {
        calls.push(now);
        if (fail) throw new Error('database unavailable');
        await new Promise<void>((resolve) => (release = resolve));
        return { purged: 2 };
      },
    };
    const job = new AccountDeletionPurgeService(users as never);

    const first = job.run(new Date('2026-10-07T00:00:00Z'));
    assert.deepEqual(await job.run(), { purged: 0 });
    release();
    assert.deepEqual(await first, { purged: 2 });
    assert.equal(calls.length, 1);

    fail = true;
    assert.deepEqual(await job.run(), { purged: 0 });
    assert.equal(calls.length, 2);
  });
});
