import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('record experience screens', () => {
  it('lets the composer pick up to ten photos that upload before the record is saved', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const picker = source('components/core/PhotoPicker.tsx');
    const uploads = source('hooks/useWatchPhotoUploads.ts');
    const client = source('lib/api/watch-events.ts');
    assert.match(composer, /<PhotoPicker uploads=\{photoUploads\} \/>/);
    // Saving waits for uploads still in flight and refuses to drop failed ones silently.
    assert.match(composer, /await photoUploads\.settle\(\)/);
    assert.match(composer, /올리지 못한 사진이 있어요/);
    assert.match(uploads, /WATCH_PHOTO_MAX_COUNT - itemsRef\.current\.length/);
    assert.match(picker, /role="progressbar"/);
    assert.match(picker, /다시 시도/);
    assert.match(client, /new XMLHttpRequest\(\)/);
    assert.match(client, /withCredentials = true/);
  });

  it('collects theater, series, headline, spoiler, blind, and memory-note details', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const fields = source('components/core/ComposerFields.tsx');
    assert.match(composer, /legend="상영 형식 \(선택\)"/);
    assert.match(composer, /<SeriesProgress/);
    assert.match(composer, /media\.numberOfEpisodes/);
    assert.match(composer, /label="한줄평 \(선택\)"/);
    assert.match(composer, /label="스포일러 포함"/);
    assert.match(composer, /isBlind: shared && draft!\.isBlind/);
    assert.match(composer, /추억 메모/);
    assert.match(fields, /role="switch"/);
    assert.match(fields, /aria-checked=\{checked\}/);
  });

  it('shows a locked blind review without hints and blocks liking it', () => {
    const reviews = source('components/core/WatchReviews.tsx');
    const card = source('components/spaces/SpaceWatchCard.tsx');
    assert.match(reviews, /if \(reaction\.locked\)/);
    assert.match(reviews, /★ \?\.\?/);
    assert.match(reviews, /aria-label="잠긴 리뷰에는 좋아요를 누를 수 없어요"/);
    assert.match(reviews, /님이 남기면 공개돼요/);
    assert.match(reviews, /스포일러가 있어요 · 눌러서 보기/);
    assert.match(card, /리뷰가 잠겨 있어요 · 내 리뷰를 남기면 열려요/);
    assert.match(card, /내 리뷰 쓰기/);
  });

  it('opens photos in an accessible full-screen viewer with fast-loading previews', () => {
    const gallery = source('components/core/WatchPhotoGallery.tsx');
    const photo = source('components/core/WatchPhoto.tsx');
    const css = source('app/globals.css');
    assert.match(gallery, /useFocusTrap\(open, dialogRef, close\)/);
    assert.match(gallery, /aria-modal="true"/);
    assert.match(gallery, /event\.key === 'ArrowLeft'/);
    assert.match(gallery, /photo\.originalUrl \? '원본 저장' : '저장'/);
    assert.match(photo, /aspectRatio: `\$\{photo\.width\} \/ \$\{photo\.height\}`/);
    assert.match(photo, /photo\.placeholder/);
    assert.match(photo, /loading=\{variant === 'thumb' \? 'lazy' : 'eager'\}/);
    assert.match(css, /\.watch-photo\[data-loaded\] img/);
  });

  it('keeps comments on the record for space-shared records only', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const reviews = source('components/core/WatchReviews.tsx');
    assert.match(detail, /watchEvent\.visibility === 'SPACES' \? \(\s*<CommentsSection/);
    assert.match(reviews, /maxLength=\{WATCH_COMMENT_MAX_LENGTH\}/);
    assert.match(reviews, /aria-label="내 댓글 삭제"/);
  });
});
