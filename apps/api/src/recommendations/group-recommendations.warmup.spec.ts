import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaEntity } from '../database/entities';
import { GroupRecommendationsService } from './group-recommendations.service';

type Operator = { _type: string; _value: unknown };
const values = (where: Record<string, unknown>, key: string) =>
  ((where[key] as Operator | undefined)?._value as unknown[] | undefined) ?? [];

function setup(options: { storedTitles: number; freshIds?: string[] }) {
  const stored = Array.from({ length: options.storedTitles }, (_, index) =>
    Object.assign(new MediaEntity(), {
      id: `stored-${index}`,
      mediaType: 'MOVIE' as const,
      releaseDate: index === 0 ? '2999-01-01' : '2024-01-01',
      tmdbVoteCount: 1000 - index,
    }),
  );
  const imported: string[] = [];
  const refreshed: string[] = [];
  const media = {
    count: async () => stored.length,
    find: async ({ where }: { where: Record<string, unknown> }) =>
      stored.filter((item) => values(where, 'mediaType').includes(item.mediaType)),
  };
  const observations = {
    find: async ({ where }: { where: Record<string, unknown> }) =>
      (options.freshIds ?? [])
        .filter((id) => values(where, 'contentId').includes(id))
        .map((contentId) => ({ contentId })),
  };
  const tmdb = {
    trending: async () => ({
      items: [
        { externalId: '1', mediaType: 'MOVIE' },
        { externalId: '2', mediaType: 'TV' },
        { externalId: '3', mediaType: 'MOVIE' },
      ],
    }),
  };
  const mediaSelection = {
    select: async (selection: { externalId: string }) => {
      if (selection.externalId === '3') throw new Error('TMDB hiccup');
      imported.push(selection.externalId);
    },
  };
  const availability = {
    refresh: async (contentId: string) => {
      refreshed.push(contentId);
    },
  };
  const service = new GroupRecommendationsService(
    {} as never,
    {} as never,
    {} as never,
    media as never,
    observations as never,
    {} as never,
    {} as never,
    {} as never,
    availability as never,
    {} as never,
    {} as never,
    mediaSelection as never,
    tmdb as never,
  );
  const warm = (contentTypes: Array<'MOVIE' | 'TV'> = ['MOVIE']) =>
    (
      service as unknown as {
        warmCandidatePool: (request: { contentTypes: string[]; region: string }) => Promise<void>;
      }
    ).warmCandidatePool({ contentTypes, region: 'KR' });
  return { imported, refreshed, warm };
}

describe('group recommendation candidate warm-up', () => {
  it('imports trending titles of the requested types when few titles are stored', async () => {
    const { imported, warm } = setup({ storedTitles: 3 });
    await warm();
    // The TV title is skipped and a failed import does not stop the rest.
    assert.deepEqual(imported, ['1']);
  });

  it('leaves a large pool alone and refreshes only stale, released titles within budget', async () => {
    const { imported, refreshed, warm } = setup({
      storedTitles: 80,
      freshIds: ['stored-1', 'stored-2'],
    });
    await warm();
    assert.deepEqual(imported, []);
    assert.equal(refreshed.length, 24);
    assert.ok(!refreshed.includes('stored-0'), 'unreleased title skipped');
    assert.ok(!refreshed.includes('stored-1') && !refreshed.includes('stored-2'));
  });
});
