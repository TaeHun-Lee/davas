import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { InvitesService } from './invites.service';

const publicCodes = ['CHANGE-ME-BOOTSTRAP-CODE', 'REPLACE-WITH-A-ONE-TIME-CODE'];

describe('bootstrap invite upgrade safety', () => {
  it('expires historical public placeholder rows before accepting traffic', async () => {
    let criteria: unknown;
    let values: unknown;
    const repository = {
      update: async (nextCriteria: unknown, nextValues: unknown) => {
        criteria = nextCriteria;
        values = nextValues;
        return { affected: 2 };
      },
      findOne: async () => null,
      create: (value: unknown) => value,
      save: async (value: unknown) => value,
    };
    const previous = process.env.DAVAS_BOOTSTRAP_INVITE_CODE;
    delete process.env.DAVAS_BOOTSTRAP_INVITE_CODE;

    try {
      await new InvitesService(repository as never, {} as never).onModuleInit();
    } finally {
      if (previous === undefined) delete process.env.DAVAS_BOOTSTRAP_INVITE_CODE;
      else process.env.DAVAS_BOOTSTRAP_INVITE_CODE = previous;
    }

    const codeOperator = (criteria as { code?: { _value?: unknown } })?.code;
    assert.deepEqual(codeOperator?._value, publicCodes);
    assert.equal((values as { expiresAt?: Date })?.expiresAt?.getTime(), 0);
  });

  it('never seeds a public placeholder even when invoked outside production bootstrap validation', async () => {
    let saves = 0;
    const repository = {
      update: async () => ({ affected: 0 }),
      findOne: async () => null,
      create: (value: unknown) => value,
      save: async (value: unknown) => {
        saves += 1;
        return value;
      },
    };
    const previous = process.env.DAVAS_BOOTSTRAP_INVITE_CODE;
    process.env.DAVAS_BOOTSTRAP_INVITE_CODE = 'replace-with-a-one-time-code';

    try {
      await new InvitesService(repository as never, {} as never).onModuleInit();
    } finally {
      if (previous === undefined) delete process.env.DAVAS_BOOTSTRAP_INVITE_CODE;
      else process.env.DAVAS_BOOTSTRAP_INVITE_CODE = previous;
    }

    assert.equal(saves, 0);
  });
});
