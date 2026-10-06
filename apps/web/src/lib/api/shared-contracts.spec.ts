import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const apiRoot = join(process.cwd(), 'src/lib/api');
const source = (name: string) => readFileSync(join(apiRoot, name), 'utf8');

describe('Web shared contract boundary', () => {
  it('imports active request and response shapes from @davas/shared', () => {
    for (const file of ['core.ts', 'auth.ts', 'friends.ts', 'media.ts', 'users.ts']) {
      assert.match(source(file), /from '@davas\/shared'/, file);
    }

    const duplicateNames =
      /export type (?:ApiErrorBody|RecordCardData|RecordDetailData|RecordFilters|RecordCreatePayload|RecordUpdatePayload|MediaSearchResult|MediaSearchResponse|SelectedMedia|MediaDetail|AuthenticatedUser|MeResponse|FriendUser|FriendRow|FriendsResponse|FriendInviteState|UpdateMePayload)/;
    for (const file of ['core.ts', 'auth.ts', 'friends.ts', 'media.ts', 'users.ts']) {
      assert.doesNotMatch(source(file), duplicateNames, file);
    }
  });

  it('uses the common authenticated transport for every active API client', () => {
    for (const file of ['auth.ts', 'friends.ts', 'media.ts', 'users.ts']) {
      const text = source(file);
      assert.match(text, /coreFetch/, file);
      assert.doesNotMatch(text, /\bfetch\(/, file);
    }
  });
});
