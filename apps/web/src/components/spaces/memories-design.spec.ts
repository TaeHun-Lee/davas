import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('memories, drama progress, and the notification center', () => {
  it('serves memories and notifications as protected routes', () => {
    const middleware = source('middleware.ts');
    const routes = source('lib/core-routes.ts');
    assert.match(source('app/spaces/memories/page.tsx'), /<MemoriesScreen \/>/);
    assert.match(source('app/notifications/page.tsx'), /<NotificationsScreen \/>/);
    for (const path of ['/spaces/memories', '/notifications']) {
      assert.ok(middleware.includes(`pathname === '${path}'`), path);
      assert.ok(routes.includes(`'${path}'`), path);
    }
  });

  it('shows the year, genres, theater vs OTT, this day in past years, and series in progress', () => {
    const screen = source('components/spaces/MemoriesScreen.tsx');
    assert.match(screen, /aria-label="연도 고르기"/);
    assert.match(screen, /disabled=\{year >= thisYear\}/);
    assert.match(screen, /자주 본 장르/);
    assert.match(screen, /극장 vs OTT/);
    assert.match(screen, /\{item\.yearsAgo\}년 전 오늘/);
    assert.match(screen, /보고 있는 드라마/);
    assert.match(screen, /이어서 기록하기/);
    assert.match(source('components/spaces/SpacesScreen.tsx'), /href="\/spaces\/memories"/);
  });

  it('continues a series from the latest record when a new one starts', () => {
    const composer = source('components/core/RecordComposer.tsx');
    assert.match(composer, /async function continueSeries/);
    assert.match(composer, /getWatchProgress\(media\.id\)/);
    assert.match(composer, /progress\.episodeWatched \+ 1/);
    assert.match(composer, /다음 화부터 이어서 적었어요/);
  });

  it('lists notifications with unread state and marks them read when opened or all at once', () => {
    const screen = source('components/notifications/NotificationsScreen.tsx');
    assert.match(screen, /markNotificationRead\(item\.id\)/);
    assert.match(screen, /markAllNotificationsRead\(\)/);
    assert.match(screen, /data-unread=\{!item\.readAt \|\| undefined\}/);
    assert.match(screen, /읽지 않음, /);
  });
});
