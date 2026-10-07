import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { groupTimeline, timelinePage, type TimelineShare } from './timeline-groups';

function share(
  shareId: string,
  mediaId: string,
  authorId: string,
  watchedDate: string,
  sharedAt = `${watchedDate}T12:00:00Z`,
): TimelineShare {
  return {
    shareId,
    sharedAt: new Date(sharedAt),
    diaryId: `diary-${shareId}`,
    mediaId,
    authorId,
    watchedDate,
  };
}

const ids = (groups: ReturnType<typeof groupTimeline>) =>
  groups.map((group) => group.shares.map((item) => item.shareId));

describe('space timeline cards', () => {
  it('puts both people’s records of a title on one card, oldest first', () => {
    const groups = groupTimeline([
      share('b1', 'dune', 'b', '2026-05-03', '2026-05-03T07:46:00Z'),
      share('a1', 'dune', 'a', '2026-05-03', '2026-05-03T07:34:00Z'),
      share('a2', 'topgun', 'a', '2026-05-17'),
    ]);
    assert.deepEqual(ids(groups), [['a2'], ['a1', 'b1']]);
    assert.equal(groups[1].latest.shareId, 'b1');
  });

  it('starts a new card when someone records the title again', () => {
    const groups = groupTimeline([
      share('a1', 'dune', 'a', '2024-03-01'),
      share('b1', 'dune', 'b', '2024-03-01'),
      share('a2', 'dune', 'a', '2026-03-01'),
      share('b2', 'dune', 'b', '2026-03-02'),
      share('a3', 'dune', 'a', '2026-09-01'),
    ]);
    assert.deepEqual(ids(groups), [['a3'], ['a2', 'b2'], ['a1', 'b1']]);
  });

  it('joins records left on different days and moves the card up with the newer one', () => {
    const groups = groupTimeline([
      share('a1', 'dune', 'a', '2026-05-01'),
      share('x1', 'other', 'a', '2026-05-02'),
      share('b1', 'dune', 'b', '2026-05-04'),
    ]);
    assert.deepEqual(ids(groups), [['a1', 'b1'], ['x1']]);
  });

  it('pages by card and continues after the previous page’s last card', () => {
    const groups = groupTimeline([
      share('a1', 'one', 'a', '2026-01-01'),
      share('b1', 'one', 'b', '2026-01-01'),
      share('a2', 'two', 'a', '2026-02-01'),
      share('a3', 'three', 'a', '2026-03-01'),
    ]);
    const first = timelinePage(groups, null, 2);
    assert.deepEqual(ids(first.page), [['a3'], ['a2']]);
    assert.equal(first.hasMore, true);
    const last = first.page.at(-1)!.latest;
    const second = timelinePage(
      groups,
      { sharedAt: last.sharedAt.toISOString(), id: last.shareId },
      2,
    );
    assert.deepEqual(ids(second.page), [['a1', 'b1']]);
    assert.equal(second.hasMore, false);
  });

  it('breaks a tie in share time by id, the same way the cursor does', () => {
    const at = '2026-01-01T00:00:00Z';
    const groups = groupTimeline([
      share('0e11-a', 'one', 'a', '2026-01-01', at),
      share('6a3a-b', 'two', 'b', '2026-01-01', at),
    ]);
    assert.deepEqual(ids(groups), [['6a3a-b'], ['0e11-a']]);
    const rest = timelinePage(groups, { sharedAt: at, id: '6a3a-b' }, 5);
    assert.deepEqual(ids(rest.page), [['0e11-a']]);
  });
});
