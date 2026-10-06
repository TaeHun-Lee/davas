import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { WatchEvent } from '../../lib/api/watch-events';
import {
  pendingConfirmations,
  reactionRows,
  watchedDayLabel,
  watchSourceSummary,
  withMyParticipation,
} from './space-watch-model';

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
  reactions: [{ accountId: 'minho', rating: 4.5, review: ' 결말을 알고 봐도 화가 나는 영화. ' }],
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
      rows.map((row) => [row.name, row.rating, row.review]),
      [
        ['민호', 4.5, '결말을 알고 봐도 화가 나는 영화.'],
        ['나', null, null],
      ],
    );
    assert.equal(rows[1].isMe, true);
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
