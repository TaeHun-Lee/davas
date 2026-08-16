import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('space watch flow', () => {
  it('keeps required media/date, half-star ratings, source/place, and explicit sharing in the common composer', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const rating = source('components/core/WatchRatingControl.tsx');
    assert.match(composer, /mediaId: draft!\.selected\.id/);
    assert.match(composer, /watchedDate: draft!\.watchedDate/);
    assert.match(composer, /THEATER: '극장'/);
    assert.match(composer, /OTT: 'OTT'/);
    assert.match(composer, /OTHER: '기타'/);
    assert.match(composer, /placeText: draft!\.placeText\.trim\(\)/);
    assert.match(rating, /\(index \+ 1\) \/ 2/);
    assert.match(rating, /type="range"/);
    assert.match(rating, /step=\{0\.5\}/);
    assert.match(rating, /별점 슬라이더/);
    assert.match(composer, /spaceIds: draft!\.spaceIds/);
    assert.match(composer, /새 공간에 가입해도 과거 기록은 자동으로 공유되지 않아요/);
    assert.match(composer, /participantAccountIds/);
    assert.match(composer, /같은 작품을 다시 봤다면/);
  });

  it('uses real history navigation while keeping compose steps in sync with the URL', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const coreUi = source('components/core/CoreUi.tsx');
    assert.match(coreUi, /window\.history\.length > 1/);
    assert.match(coreUi, /router\.back\(\)/);
    assert.match(coreUi, /router\.replace\(fallback\)/);
    assert.match(composer, /const requestedStep = params\.get\('step'\)/);
    assert.match(composer, /requestedStep === 'write'/);
    assert.match(composer, /fallback=\{editId \? `\/records\/\$\{editId\}` : '\/'\}/);
    assert.doesNotMatch(composer, /confirmDiscard|작성 내용 버리기/);
  });

  it('shows pending confirmation, decline, and independent participant reactions', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    assert.match(detail, /PENDING: '응답 대기'/);
    assert.match(detail, /respond\('CONFIRMED'\)/);
    assert.match(detail, /respond\('DECLINED'\)/);
    assert.match(detail, /saveWatchReaction/);
    assert.match(detail, /내 반응은 작성자의 감상과 합쳐지지 않고/);
    assert.match(detail, /watchEvent\.reactions\.map/);
  });

  it('handles active timeline comparison plus empty, loading, error, and unauthorized states', () => {
    const timeline = source('components/spaces/SpaceTimeline.tsx');
    assert.match(timeline, /getSpaceTimeline/);
    assert.match(timeline, /compareSpaceReactions/);
    assert.match(timeline, /data-state="loading"/);
    assert.match(timeline, /data-state="empty"/);
    assert.match(timeline, /data-state="error"/);
    assert.match(timeline, /data-state="forbidden"/);
    assert.match(timeline, /탈퇴하거나 공간이 종료되면/);
    assert.match(timeline, /comparison\.events\.map/);
  });

  it('routes legacy diary screens through the records components', () => {
    const compose = source('components/diary/DiaryComposeScreen.tsx');
    const detail = source('components/diary/DiaryDetailScreen.tsx');
    assert.match(compose, /<RecordComposer/);
    assert.match(detail, /<RecordDetailScreen/);
  });
});
