import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { WatchEvent, WatchReaction } from '../../lib/api/watch-events';
import {
  blindViewerRole,
  groupByline,
  groupCardSource,
  groupReactionRows,
  lockedReviewHint,
  openedTogether,
  pendingConfirmations,
  reactionRows,
  timelineCards,
  unlocksByWriting,
  waitingWatchers,
  watchCardSource,
  watchedFullDayLabel,
  watchSourceLabel,
  watchedDayLabel,
  watchSourceSummary,
  withMyParticipation,
} from './space-watch-model';

const reaction = (overrides: Partial<WatchReaction> & { accountId: string }): WatchReaction => ({
  id: `reaction-${overrides.accountId}`,
  rating: null,
  headline: null,
  review: null,
  hasSpoiler: false,
  isBlind: false,
  locked: false,
  likeCount: 0,
  likedByMe: false,
  ...overrides,
});

const event = (overrides: Partial<WatchEvent> = {}): WatchEvent => ({
  id: 'event-1',
  media: { id: 'media-1', title: '서울의 봄', mediaType: 'MOVIE', posterUrl: null },
  author: { accountId: 'minho', nickname: '민호', profileImageUrl: null },
  watchedDate: '2026-10-04',
  visibility: 'SPACES',
  spaceIds: ['space-1'],
  source: { kind: 'THEATER', providerName: null, placeText: 'CGV 용산 IMAX' },
  participants: [
    { accountId: 'me', status: 'CONFIRMED', nickname: '지우' },
    { accountId: 'minho', status: 'CONFIRMED', nickname: '민호' },
    { accountId: 'seo', status: 'DECLINED', nickname: '서준' },
  ],
  reactions: [
    reaction({
      accountId: 'minho',
      rating: 4.5,
      review: ' 결말을 알고 봐도 화가 나는 영화. ',
      likeCount: 2,
    }),
  ],
  memoryNote: null,
  photos: [],
  commentCount: 0,
  isMine: false,
  ...overrides,
});

describe('space timeline card model', () => {
  it('formats the watch day and where it was watched', () => {
    assert.equal(watchedDayLabel('2026-10-04'), '10월 4일');
    assert.equal(watchedDayLabel('not-a-date'), 'not-a-date');
    assert.equal(watchSourceSummary(event()), '극장 · CGV 용산 IMAX');
    assert.equal(
      watchSourceSummary(event({ source: { kind: 'OTT', providerName: '넷플릭스' } })),
      'OTT · 넷플릭스',
    );
    assert.equal(watchSourceSummary(event({ source: null })), null);
  });

  it('lists the author first, labels the viewer, and leaves out people who declined', () => {
    const rows = reactionRows(event(), 'me');
    assert.deepEqual(
      rows.map((row) => [row.name, row.rating, row.text, row.likeCount]),
      [
        ['민호', 4.5, '결말을 알고 봐도 화가 나는 영화.', 2],
        ['나', null, null, 0],
      ],
    );
    assert.equal(rows[1].isMe, true);
  });

  it('prefers the headline and marks locked reviews and my review that is waiting to open', () => {
    const locked = reactionRows(
      event({
        reactions: [reaction({ accountId: 'minho', isBlind: true, locked: true })],
      }),
      'me',
    );
    assert.equal(locked[0].locked, true);

    const mine = reactionRows(
      event({
        author: { accountId: 'me', nickname: '지우', profileImageUrl: null },
        reactions: [
          reaction({ accountId: 'me', headline: '한 줄', review: '긴 소감', isBlind: true }),
        ],
      }),
      'me',
    );
    const me = mine.find((row) => row.isMe)!;
    assert.equal(me.text, '한 줄');
    assert.equal(me.waitingToOpen, true);
  });

  it('keeps my blind review waiting for someone still asked to confirm', () => {
    const pendingPartner = event({
      author: { accountId: 'me', nickname: '지우', profileImageUrl: null },
      isMine: true,
      participants: [
        { accountId: 'me', status: 'CONFIRMED', nickname: '지우' },
        { accountId: 'minho', status: 'PENDING', nickname: '민호' },
      ],
      reactions: [reaction({ accountId: 'me', rating: 4, isBlind: true })],
    });
    assert.deepEqual(
      waitingWatchers(pendingPartner, 'me').map((participant) => participant.accountId),
      ['minho'],
    );
    assert.equal(reactionRows(pendingPartner, 'me').find((row) => row.isMe)!.waitingToOpen, true);

    // A rating alone counts as written, and an empty reaction row does not.
    const rated = event({
      reactions: [reaction({ accountId: 'minho', rating: 3 }), reaction({ accountId: 'me' })],
    });
    assert.deepEqual(
      waitingWatchers(rated, 'minho').map((item) => item.accountId),
      ['me'],
    );
  });

  it('says what opens a locked review for whoever is looking', () => {
    const asked = event({
      participants: [
        { accountId: 'minho', status: 'CONFIRMED' },
        { accountId: 'me', status: 'PENDING' },
      ],
    });
    assert.equal(blindViewerRole(event(), 'me'), 'watcher');
    assert.equal(blindViewerRole(asked, 'me'), 'pending');
    assert.equal(blindViewerRole(event(), 'seo'), 'outsider');
    assert.equal(blindViewerRole(event(), 'someone-else'), 'outsider');
    assert.equal(lockedReviewHint('watcher'), '내 리뷰를 남기면 열려요');
    assert.match(lockedReviewHint('pending'), /함께 봤다고 확인하고/);
    assert.match(lockedReviewHint('outsider'), /모두 리뷰를 남기면/);
  });

  it('writes the card lines as on the board: when, how, how far, then where', () => {
    assert.deepEqual(
      watchCardSource(
        event({
          source: {
            kind: 'THEATER',
            providerName: null,
            placeText: 'CGV 용산',
            theaterFormat: 'IMAX',
          },
        }),
      ),
      { line: '10월 4일 · 극장 · IMAX', place: 'CGV 용산' },
    );
    assert.deepEqual(
      watchCardSource(
        event({
          source: { kind: 'OTT', providerName: '넷플릭스', episodeWatched: 8, episodeTotal: 16 },
        }),
      ),
      { line: '10월 4일 · 넷플릭스 · 8화까지', place: null },
    );
    assert.deepEqual(watchCardSource(event({ source: null })), { line: '10월 4일', place: null });
    // A standard screen adds nothing, as on the record's chips.
    assert.deepEqual(
      watchCardSource(
        event({
          source: {
            kind: 'THEATER',
            providerName: null,
            placeText: '메가박스 코엑스',
            theaterFormat: 'STANDARD',
          },
        }),
      ),
      { line: '10월 4일 · 극장', place: '메가박스 코엑스' },
    );
  });

  it("names another year's day and every way of watching in the same words", () => {
    assert.equal(watchedFullDayLabel('2025-10-06'), '2025년 10월 6일');
    assert.equal(watchedFullDayLabel('someday'), 'someday');
    assert.equal(watchSourceLabel('TV_OWNED'), 'TV·소장');
    assert.equal(watchSourceLabel('OTHER'), '기타');
  });

  it('names who my blind review waits for, and groups reviews once everyone wrote', () => {
    const waiting = reactionRows(
      event({
        author: { accountId: 'me', nickname: '지우', profileImageUrl: null },
        isMine: true,
        reactions: [reaction({ accountId: 'me', rating: 4, isBlind: true })],
      }),
      'me',
    );
    assert.equal(waiting.find((row) => row.isMe)!.waitingFor, '민호');
    assert.equal(openedTogether(waiting), false);

    const both = reactionRows(
      event({
        reactions: [
          reaction({
            accountId: 'minho',
            rating: 4.5,
            isBlind: true,
            likeCount: 2,
            likedByMe: true,
          }),
          reaction({ accountId: 'me', headline: '좋았다', review: '긴 소감' }),
        ],
      }),
      'me',
    );
    assert.equal(openedTogether(both), true);
    const minho = both.find((row) => row.accountId === 'minho')!;
    assert.deepEqual(
      [minho.reactionId, minho.likedByMe, minho.written, minho.waitingFor],
      ['reaction-minho', true, true, null],
    );
    const me = both.find((row) => row.isMe)!;
    assert.deepEqual([me.headline, me.review], ['좋았다', '긴 소감']);
  });

  it('finds records that wait for the viewer to confirm, then reflects the answer', () => {
    const waiting = event({
      participants: [
        { accountId: 'minho', status: 'CONFIRMED' },
        { accountId: 'me', status: 'PENDING' },
      ],
    });
    const mine = event({ id: 'event-2', isMine: true });
    assert.deepEqual(
      pendingConfirmations([waiting, mine], 'me').map((item) => item.id),
      ['event-1'],
    );
    const answered = withMyParticipation(waiting, 'me', 'CONFIRMED');
    assert.deepEqual(pendingConfirmations([answered], 'me'), []);
    assert.equal(answered.participants[0].status, 'CONFIRMED');
  });
});

describe('shared title cards', () => {
  // 주인 and 강생 each recorded the same film on the same day, with nobody else listed.
  const mine = event({
    id: 'mine',
    author: { accountId: 'me', nickname: '주인', profileImageUrl: null },
    participants: [{ accountId: 'me', status: 'CONFIRMED', nickname: '주인' }],
    reactions: [reaction({ accountId: 'me', rating: 4 })],
    isMine: true,
  });
  const theirs = event({
    id: 'theirs',
    author: { accountId: 'kang', nickname: '강생', profileImageUrl: null },
    participants: [{ accountId: 'kang', status: 'CONFIRMED', nickname: '강생' }],
    reactions: [reaction({ accountId: 'kang', rating: 4.5, headline: '또 보고 싶어요' })],
    source: { kind: 'THEATER', providerName: null, placeText: 'CGV 용산 IMAX' },
  });

  it('builds cards from the page groups, or one per record without them', () => {
    const groups = [
      { id: 'mine', mediaId: 'media-1', watchEventIds: ['mine', 'theirs'] },
      { id: 'gone', mediaId: 'media-2', watchEventIds: ['gone'] },
    ];
    assert.deepEqual(
      timelineCards([mine, theirs], groups).map((card) => card.map((item) => item.id)),
      [['mine', 'theirs']],
    );
    assert.deepEqual(
      timelineCards([mine, theirs], undefined).map((card) => card.map((item) => item.id)),
      [['mine'], ['theirs']],
    );
    // A record regrouped between two page loads shows only once.
    const twice = [...groups, { id: 'theirs', mediaId: 'media-1', watchEventIds: ['theirs'] }];
    assert.equal(timelineCards([mine, theirs], twice).length, 1);
  });

  it('names everyone who wrote, in writing order', () => {
    assert.equal(groupByline([mine, theirs]), '주인님, 강생님이');
    assert.equal(groupByline([theirs, mine]), '강생님, 주인님이');
  });

  it('shows one source line when the records agree and each one when they differ', () => {
    assert.deepEqual(groupCardSource([mine, theirs]), {
      lines: ['10월 4일 · 극장'],
      place: 'CGV 용산 IMAX',
    });
    const later = { ...theirs, watchedDate: '2026-10-06', source: null };
    assert.deepEqual(groupCardSource([mine, later]).lines, ['10월 4일 · 극장', '10월 6일']);
  });

  it('keeps one review per person, taken from their own record', () => {
    // 강생 is also listed on my record, without a review there.
    const withCompanion = {
      ...mine,
      participants: [...mine.participants, { accountId: 'kang', status: 'CONFIRMED' as const }],
    };
    const rows = groupReactionRows([withCompanion, theirs], 'me');
    assert.deepEqual(
      rows.map((row) => [row.name, row.rating, row.eventId]),
      [
        ['나', 4, 'mine'],
        ['강생', 4.5, 'theirs'],
      ],
    );
  });

  it('offers writing to open a blind review that is locked for me', () => {
    const blind = {
      ...theirs,
      participants: [
        { accountId: 'kang', status: 'CONFIRMED' as const, nickname: '강생' },
        { accountId: 'me', status: 'CONFIRMED' as const, nickname: '주인' },
      ],
      reactions: [reaction({ accountId: 'kang', isBlind: true, locked: true })],
    };
    assert.equal(unlocksByWriting(blind, 'me'), true);
    assert.equal(unlocksByWriting(mine, 'me'), false);
  });
});
