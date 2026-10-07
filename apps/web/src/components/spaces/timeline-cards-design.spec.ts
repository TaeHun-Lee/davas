import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('space timeline cards', () => {
  it('shows members’ records of one title as one card on home and the space page', () => {
    const home = source('components/core/SpaceHome.tsx');
    const timeline = source('components/spaces/SpaceTimeline.tsx');
    assert.match(home, /timeline\.cards\.map\(\(events\) => \(\s*<TimelineCard/);
    assert.match(timeline, /cards\.map\(\(events\) => \(\s*<TimelineCard/);
    assert.match(source('hooks/useSpaceTimeline.ts'), /timelineCards\(items, groups\)/);
  });

  it('names everyone who wrote and keeps each person’s like and record', () => {
    const card = source('components/spaces/SpaceWatchGroupCard.tsx');
    assert.match(card, /if \(events\.length === 1\) return <SpaceWatchCard/);
    assert.match(card, /<b>\{groupByline\(events\)\}<\/b> 기록을 남겼어요/);
    assert.match(card, /data-grouped="true"/);
    assert.match(card, /setReviewLike\(row\.eventId, row\.reactionId/);
    assert.match(card, /event\.isMine \? '내 기록' : `\$\{event\.author\.nickname/);
  });
});
