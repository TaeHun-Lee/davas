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
    // Optional photos come after the memory note, under a plain "attach photos" heading.
    assert.ok(
      composer.indexOf('<PhotoPicker uploads={photoUploads} />') >
        composer.indexOf('label="추억 메모"'),
    );
    assert.match(picker, /label = '사진 첨부 \(선택\)'/);
    assert.match(picker, /<span>\{label\}<\/span>/);
    // Adding my photos to someone's record says what it is for, not the composer's help.
    assert.match(source('components/core/MyPhotosPanel.tsx'), /label="올릴 사진"/);
    assert.doesNotMatch(picker, /데이트 사진/);
    // Optional fields all say "(선택)", and the memo hint fits a friends' space too.
    assert.doesNotMatch(picker + composer, /\(옵션\)/);
    assert.match(composer, /placeholder="그날 있었던 일을 적어 두세요/);
    // Saving waits for uploads still in flight and refuses to drop failed ones silently.
    assert.match(composer, /await photoUploads\.settle\(\)/);
    assert.match(composer, /올리지 못한 사진이 있어요/);
    assert.match(uploads, /Math\.max\(0, limit - items\.length\)/);
    assert.match(uploads, /MAX_PARALLEL_UPLOADS = 2/);
    assert.match(picker, /role="progressbar"/);
    assert.match(picker, /다시 시도/);
    // Over ten: an amber notice that counts every picked file, gone once the list changes.
    assert.match(picker, /사진은 기록 하나에 \$\{WATCH_PHOTO_MAX_COUNT\}장까지예요/);
    assert.match(picker, /result\.added \+ result\.overLimit \+ result\.unsupported/);
    assert.match(picker, /notice\.forCount === items\.length/);
    assert.match(picker, /사진 추가 \(\{limit\}장을 모두 채웠어요\)/);
    assert.match(client, /new XMLHttpRequest\(\)/);
    assert.match(client, /withCredentials = true/);
  });

  it('collects theater, series, headline, spoiler, blind, and memory-note details', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const fields = source('components/core/ComposerFields.tsx');
    assert.match(composer, /legend="상영 형식 \(선택\)"/);
    assert.match(composer, /<SeriesProgress/);
    assert.match(source('components/core/composer-draft.ts'), /media\.numberOfEpisodes/);
    assert.match(composer, /label="한줄평 \(선택\)"/);
    assert.match(composer, /label="스포일러 포함"/);
    assert.match(
      composer,
      /isBlind: shared && draft!\.participantAccountIds\.length > 0 && draft!\.isBlind/,
    );
    // Without a companion nobody can unlock a blind review, so the switch is not offered.
    assert.match(
      composer,
      /draft\.spaceIds\.length > 0 && draft\.participantAccountIds\.length > 0 \? \(/,
    );
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
    assert.match(card, /const role = blindViewerRole\(event, myAccountId\);/);
    assert.match(card, /const lockedHint = lockedReviewHint\(role\);/);
    assert.match(card, /<strong>\{row\.name\}님 리뷰가 잠겨 있어요<\/strong>/);
    assert.match(card, /aria-label="잠긴 리뷰에는 좋아요를 누를 수 없어요"/);
    assert.match(reviews, /<span>\{lockedHint\}<\/span>/);
    assert.match(card, /내 리뷰 쓰기/);
  });

  it('applies the blind and spoiler rules in the member comparison panel too', () => {
    const timeline = source('components/spaces/SpaceTimeline.tsx');
    assert.match(timeline, /if \(reaction\.locked\)/);
    assert.match(timeline, /잠긴 리뷰예요/);
    assert.match(timeline, /스포일러가 있어요 · 눌러서 보기/);
    assert.match(timeline, /reaction\.headline \? \(/);
  });

  it('opens photos in an accessible full-screen viewer with fast-loading previews', () => {
    const gallery = source('components/core/WatchPhotoGallery.tsx');
    const photo = source('components/core/WatchPhoto.tsx');
    const css = source('app/globals.css');
    assert.match(gallery, /useFocusTrap\(open, dialogRef, close\)/);
    assert.match(gallery, /aria-modal="true"/);
    assert.match(gallery, /event\.key === 'ArrowLeft'/);
    assert.match(gallery, /photo\.originalUrl \? '원본 사진 저장' : '사진 저장'/);
    assert.match(photo, /aspectRatio: `\$\{photo\.width\} \/ \$\{photo\.height\}`/);
    assert.match(photo, /photo\.placeholder/);
    assert.match(photo, /loading=\{variant === 'thumb' \? 'lazy' : 'eager'\}/);
    assert.match(css, /\.watch-photo\[data-loaded\] img/);
  });

  it('lays the photo viewer out like C안: caption, uploader, thumbnails, centred arrows', () => {
    const gallery = source('components/core/WatchPhotoGallery.tsx');
    const photo = source('components/core/WatchPhoto.tsx');
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const css = source('app/globals.css');
    assert.match(gallery, /watchedDayLabel\(watchedDate\)/);
    assert.match(gallery, /좌우로 넘겨 보세요/);
    assert.match(detail, /uploaderLabel=\{uploaderLabel\}/);
    assert.match(detail, /'내가 올림'/);
    assert.match(gallery, /className="photo-viewer-thumbs"/);
    // Swiping the strip scrolls it instead of changing the photo.
    assert.match(gallery, /closest\('\.photo-viewer-thumbs'\)/);
    // The original stays the uploader's alone and is opened per photo.
    assert.match(gallery, /photo\.originalUrl \? \(\s*<button/);
    assert.match(
      gallery,
      /loadingLabel=\{showOriginal \? '원본 사진 불러오는 중' : '선명한 사진 불러오는 중'\}/,
    );
    assert.match(photo, /aria-busy=\{loadingLabel \? loading : undefined\}/);
    assert.match(css, /\.photo-viewer \{[^}]*background: #0b1220;/);
    assert.match(css, /\.photo-viewer-arrow \{\s*position: absolute;\s*top: 50%;/);
    assert.match(css, /\.photo-viewer \.watch-photo-failed \{\s*color: #c9d3e0;/);
  });

  it('offers "나도 기록하기" only on someone else\'s record', () => {
    const card = source('components/core/CoreUi.tsx');
    assert.match(card, /\{item\.isMine \? null : \(\s*<Link href=\{`\/records\/new\?mediaId=/);
    assert.match(
      source('app/globals.css'),
      /\.card-actions > :only-child \{\s*grid-column: 1 \/ -1;/,
    );
  });

  it('keeps comments on the record for space-shared records only', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const reviews = source('components/core/WatchReviews.tsx');
    assert.match(detail, /const commentsShown = watchEvent\.visibility === 'SPACES';/);
    assert.match(detail, /\{commentsShown \? \(\s*<CommentsSection/);
    assert.match(reviews, /maxLength=\{WATCH_COMMENT_MAX_LENGTH\}/);
    assert.match(reviews, /aria-label="내 댓글 삭제"/);
    // The comment box stays pinned to the bottom, and a delete cannot be sent twice.
    assert.match(reviews, /<div className="comments-bar">/);
    assert.match(reviews, /disabled=\{removing === comment\.id\}/);
  });

  it('keeps the record steady after an action and shows the result where it can be seen', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const css = source('app/globals.css');
    // Saving a review or answering a request refreshes without swapping in the loader.
    assert.equal((detail.match(/await load\(\{ quiet: true \}\)/g) ?? []).length, 2);
    assert.match(detail, /className="action-toast"\s+data-tone="error"/);
    assert.match(css, /\.action-toast \{\s*position: fixed;/);
    assert.match(css, /\.action-toast\[data-above='comments'\]/);
    // Deleting asks in a real dialog that holds focus, keeps its own error and goes back.
    assert.match(detail, /useFocusTrap\(true, dialogRef, onCancel\)/);
    assert.match(detail, /role="dialog"\s+aria-modal="true"/);
    assert.match(detail, /setDeleteError\(/);
    assert.match(detail, /router\.replace\(fallback\)/);
  });

  it('lays the record out like C안: menu, confirmation, my review card, opened blind reviews', () => {
    const detail = source('components/core/WatchEventDetailScreen.tsx');
    const reviews = source('components/core/WatchReviews.tsx');
    const ui = source('components/core/CoreUi.tsx');
    // Edit, record again and delete sit in the header "…" menu, not at the bottom.
    assert.match(ui, /\{action \?\? <span aria-hidden="true" \/>\}/);
    assert.match(detail, /headerAction=\{\s*<RecordMenu/);
    assert.match(detail, /aria-label="기록 메뉴"/);
    assert.match(detail, /기록 수정하기/);
    assert.match(detail, /기록 삭제하기/);
    assert.doesNotMatch(detail, /이 작품 다시 감상 기록하기/);
    // A request to confirm is a banner; the participant list card is gone.
    assert.match(
      detail,
      /currentParticipant\?\.status === 'PENDING' \? \(\s*<section className="space-confirm-card/,
    );
    assert.doesNotMatch(detail, /<h2 className="section-title">함께 본 사람<\/h2>/);
    // My review is a card that opens the form in place; a timeline link can open it directly.
    assert.match(detail, /아직 내 리뷰가 없어요\./);
    assert.match(detail, /window\.location\.hash !== '#my-review'/);
    assert.match(reviews, /className="review-edit"/);
    assert.match(source('components/spaces/SpaceWatchCard.tsx'), /`\$\{detail\}#my-review`/);
    // Blind reviews say when they opened, and a blind switch names who it waits for.
    assert.match(detail, /리뷰를 남겨서 블라인드 리뷰가 열렸어요/);
    assert.match(detail, /꺼져 있으면 저장하는 즉시 \$\{companionNames\}님에게 보여요\./);
    assert.match(reviews, /블라인드로 남김/);
    assert.match(reviews, /리뷰가 열리면 좋아요를 누를 수 있어요/);
  });

  it('lays the composer out like C안, from where it goes to the photos', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const fields = source('components/core/ComposerFields.tsx');
    assert.match(composer, /title=\{editId \? '기록 수정' : '기록 남기기'\}/);
    // Where it goes is one line under the title that opens the choices.
    assert.match(composer, /className="record-compose-share"\s+aria-expanded=\{shareOpen\}/);
    const order = [
      'className="record-compose-share"',
      '본 날짜</span>',
      '어디서 봤나요?</span>',
      '함께 본 사람 (선택)',
      '별점 (선택)',
      'label="한줄평 (선택)"',
      'label="소감 (선택)"',
      'label="스포일러 포함"',
      'label="상대가 리뷰를 쓰면 공개(블라인드)"',
      'label="추억 메모"',
      '<PhotoPicker uploads={photoUploads} />',
    ].map((marker) => composer.indexOf(marker));
    assert.ok(order.every((at) => at > 0));
    assert.deepEqual(
      order,
      [...order].sort((a, b) => a - b),
    );
    // At the theater: name, then format, then seat.
    const theater = composer.slice(composer.indexOf('{theater ? ('));
    assert.ok(
      theater.indexOf('{placeField}') < theater.indexOf('legend="상영 형식 (선택)"') &&
        theater.indexOf('legend="상영 형식 (선택)"') < theater.indexOf('좌석 (선택)'),
    );
    // The blind switch says who it waits for, on and off.
    assert.match(composer, /꺼져 있으면 저장하는 즉시 \$\{companionNames\}님에게 보여요\./);
    assert.match(composer, /\$\{companionNames\}님이 이 기록에 리뷰를 남기기 전까지/);
    // A series: where the next record picks up, rate later, and a review for this episode.
    assert.match(fields, /seriesProgressSummary\(watched, total, completed\)/);
    assert.match(fields, /이번에 끝까지 다 봤어요/);
    assert.match(composer, /드라마는 다 본 뒤에 매겨도 돼요\./);
    assert.match(composer, /화까지 보고 느낀 점을 적어 보세요/);
    assert.match(composer, /\{editId \? null : \(\s*<p className="record-compose-note/);
    // Counters are reachable from their field instead of hidden from screen readers.
    assert.match(fields, /aria-describedby=\{`\$\{id\}-count`\}/);
  });

  it('saves only what the composer shows and keeps its controls reachable', () => {
    const composer = source('components/core/RecordComposer.tsx');
    const fields = source('components/core/ComposerFields.tsx');
    const css = source('app/globals.css');
    assert.match(composer, /providerName: draft!\.sourceKind === 'OTT' \?/);
    assert.match(composer, /'본 날짜를 골라 주세요'/);
    assert.match(composer, /<div className="sticky-commit-bar">/);
    assert.match(fields, /type="number"\s+inputMode="numeric"/);
    assert.match(css, /label:has\(> input\.sr-only:focus-visible\)/);
    assert.match(css, /--blue-ink: #1c5ab5;/);
  });
});
