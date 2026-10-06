import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const contracts = readFileSync(join(process.cwd(), 'src/contracts.ts'), 'utf8');

describe('shared active response contracts', () => {
  it('describes canonical media selection separately from TMDB search results', () => {
    assert.match(contracts, /export type MediaSelectionResponse/);
    assert.match(contracts, /originalTitle: string \| null/);
    assert.match(contracts, /overview: string \| null/);
    assert.match(contracts, /shortPlot: string \| null/);
    assert.match(contracts, /genres: string\[\]/);
    assert.match(contracts, /tmdbRating: string \| null/);
    assert.match(contracts, /createdAt: string/);
    assert.match(contracts, /updatedAt: string/);
    assert.doesNotMatch(contracts, /export type MediaSelectionResponse[^;]+genreIds/s);
  });

  it('describes raw friendship mutation responses instead of list rows', () => {
    assert.match(contracts, /export type FriendshipMutationResponse/);
    assert.match(contracts, /requesterId: string/);
    assert.match(contracts, /receiverId: string/);
    assert.match(contracts, /pairKey: string/);
    assert.match(contracts, /status: FriendshipStatus/);
    assert.match(contracts, /createdAt: string/);
    assert.match(contracts, /updatedAt: string/);
  });

  it('describes successful account deletion as no content', () => {
    assert.match(contracts, /export type AccountDeletionResponse = void/);
  });
});
