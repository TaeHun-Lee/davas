import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) =>
  readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('media detail confirmation', () => {
  it('shows my records and only accessible friend-feed records for the media', () => {
    const modal = source('components/media/MediaDetailModal.tsx');
    const sections = source('components/media/media-detail-sections.tsx');
    const coreApi = source('lib/api/core.ts');

    assert.match(modal, /listRecords\('friends', \{ mediaId: media\.id, limit: 12 \}\)/);
    assert.match(modal, /filter\(\(record\) => !record\.isMine\)/);
    assert.match(modal, /cursor: friendRecordsCursor/);
    assert.match(modal, /new Map\(/);
    assert.match(modal, /<MyRatingCard/);
    assert.match(modal, /<FriendRecordsCard/);
    assert.ok(modal.indexOf('<BasicInfoGrid') < modal.indexOf('<MyRatingCard'));
    assert.match(modal, /recordLabel = '이 작품 기록하기'/);
    assert.match(sections, /아직 남긴 기록이 없어요/);
    assert.doesNotMatch(sections, /averageRating \?\? 0/);
    assert.match(sections, /나에게 공개된 기록만 보여요/);
    assert.match(sections, /record\.recordTitle \?\? record\.media\.title/);
    assert.match(sections, /친구 기록 더 보기/);
    assert.match(coreApi, /mediaId\?: string/);
  });
});
