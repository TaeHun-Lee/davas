import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('photos together, title sheet, calendar, recap and search', () => {
  it('lets anyone on a record add their own photos, within the record’s ten', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const panel = source('components/core/MyPhotosPanel.tsx');
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(detail, /canReact && myAccountId \? \(\s*<MyPhotosPanel/);
    assert.match(panel, /useWatchPhotoUploads\(WATCH_PHOTO_MAX_COUNT - others\)/);
    assert.match(panel, /await setWatchEventPhotos\(/);
    // The editor only holds the author's own photos.
    assert.match(composer, /photo\.uploaderAccountId === record\.author\.accountId/);
  });

  it('shows our reactions and where to watch on the title sheet', () => {
    const modal = source('components/media/MediaDetailModal.tsx');
    const hook = source('hooks/useMediaTogether.ts');
    assert.match(modal, /<WatchableNowCard/);
    assert.match(modal, /<OurReactionsCard/);
    assert.match(
      modal,
      /together\.status === 'ready' && !together\.space \? \(\s*<FriendRecordsCard/,
    );
    assert.match(hook, /availability\.state === 'UNKNOWN' \|\| availability\.state === 'EXPIRED'/);
    assert.match(source('components/media/media-together-sections.tsx'), /TMDB\(JustWatch 제공\)/);
  });

  it('switches 모아보기 between the year with its recap card and a calendar', () => {
    const screen = source('components/spaces/MemoriesScreen.tsx');
    const card = source('components/spaces/YearRecapCard.tsx');
    assert.match(screen, /aria-label="모아보기 방식"/);
    assert.match(screen, /<SpaceCalendarView spaceId=\{space\.id\} \/>/);
    assert.match(screen, /<YearRecapCard data=\{data\} spaceName=\{spaceName\} \/>/);
    assert.match(card, /navigator\.canShare\?\.\(\{ files: \[file\] \}\)/);
    assert.match(source('components/spaces/recap-image.ts'), /canvas\.toBlob/);
  });

  it('searches my records and the space’s by more than the title', () => {
    const screen = source('components/core/RecordScreens.tsx');
    const results = source('components/core/WatchSearchResults.tsx');
    assert.match(screen, /aria-label="검색 범위"/);
    assert.match(screen, /<WatchSearchResults/);
    assert.match(screen, /제목, 함께 본 사람, 장소, 메모, 리뷰/);
    assert.match(results, /searchWatchEvents\(\{/);
    assert.match(results, /<mark>\{snippet\.hit\}<\/mark>/);
  });
});
