import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaEntity } from '../database/entities';
import { matchVisitedTheaters, ShowtimesService } from './showtimes.service';

const THEATERS = [
  {
    code: 'A',
    name: '씨네큐 신도림',
    wideAreaName: '서울시',
    basicAreaName: '구로구',
    homepageUrl: 'http://www.cineq.co.kr',
  },
  {
    code: 'B',
    name: 'CGV 영등포',
    wideAreaName: '서울시',
    basicAreaName: '영등포구',
    homepageUrl: 'http://www.cgv.co.kr',
  },
  {
    code: 'C',
    name: 'CGV 수원',
    wideAreaName: '경기도',
    basicAreaName: '수원시',
    homepageUrl: null,
  },
  {
    code: 'D',
    name: '롯데시네마 영등포',
    wideAreaName: '서울시',
    basicAreaName: '영등포구',
    homepageUrl: null,
  },
  {
    code: 'E',
    name: '씨네큐브광화문(서울)',
    wideAreaName: '서울시',
    basicAreaName: '종로구',
    homepageUrl: null,
  },
  {
    code: 'F',
    name: 'CGV 용산아이파크몰',
    wideAreaName: '서울시',
    basicAreaName: '용산구',
    homepageUrl: null,
  },
  {
    code: 'G',
    name: 'CINE de CHEF 용산아이파크몰',
    wideAreaName: '서울시',
    basicAreaName: '용산구',
    homepageUrl: null,
  },
];

describe('reading stored showtimes', () => {
  it("counts a person's records at the KOBIS theaters their place names point to", () => {
    const visits = matchVisitedTheaters(
      [
        { place: '영등포 CGV', count: 27 },
        { place: '신도림 씨네큐', count: 26 },
        { place: '영등포 롯데시네마', count: 8 },
        { place: '씨네큐브', count: 1 },
        { place: '용산 CGV', count: 5 },
        // Fits both 영등포 theaters equally: no guess.
        { place: '영등포', count: 3 },
        { place: '부산 영화의전당', count: 6 },
      ],
      THEATERS,
    );
    assert.deepEqual(Object.fromEntries(visits), { B: 27, A: 26, D: 8, E: 1, F: 5 });
  });

  it("lists where a film plays by day, the viewer's theaters first, without today's past times", async () => {
    const media = Object.assign(new MediaEntity(), {
      id: 'media-1',
      externalProvider: 'TMDB',
      externalId: '1368337',
      mediaType: 'MOVIE',
    });
    const theater = (code: string) => THEATERS.find((item) => item.code === code);
    const rows = [
      {
        theaterCode: 'C',
        showDate: '2026-10-10',
        screenName: '01관',
        format: null,
        times: ['13:00', '20:00'],
        movieCode: 'm1',
      },
      {
        theaterCode: 'B',
        showDate: '2026-10-10',
        screenName: '02관 (4DX)',
        format: 'FOUR_DX',
        times: ['11:40', '18:45'],
        movieCode: 'm1',
      },
      {
        theaterCode: 'B',
        showDate: '2026-10-10',
        screenName: '02관 (4DX)',
        format: 'FOUR_DX',
        times: ['21:00'],
        movieCode: 'm9',
      },
      {
        theaterCode: 'A',
        showDate: '2026-10-10',
        screenName: '03관',
        format: null,
        times: ['09:30'],
        movieCode: 'm1',
      },
      {
        theaterCode: 'A',
        showDate: '2026-10-11',
        screenName: '03관',
        format: null,
        times: ['09:30'],
        movieCode: 'm1',
      },
    ].map((row) => ({ ...row, theater: theater(row.theaterCode) }));
    const service = new ShowtimesService(
      { findOne: async () => media } as never,
      { find: async () => THEATERS } as never,
      {
        find: async () => rows,
        manager: {
          query: async () => [
            { place: '신도림 씨네큐', count: 26 },
            { place: '영등포 CGV', count: 27 },
          ],
        },
      } as never,
      { find: async () => [{ code: 'm1' }, { code: 'm9' }] } as never,
      { findOne: async () => ({ finishedAt: new Date('2026-10-10T03:25:00Z') }) } as never,
    );
    service.now = () => new Date('2026-10-10T05:00:00Z'); // 14:00 KST

    const result = await service.forMedia('media-1', 'u1');

    assert.equal(result.updatedAt, '2026-10-10T03:25:00.000Z');
    assert.deepEqual(
      result.dates.map((day) => ({
        date: day.date,
        theaters: day.theaters.map((item) => [
          item.name,
          item.region,
          item.visits,
          item.screenings.map((screening) => `${screening.screen} ${screening.times.join(',')}`),
        ]),
      })),
      [
        {
          date: '2026-10-10',
          // 씨네큐 신도림's only show today was at 09:30.
          theaters: [
            ['CGV 영등포', '서울', 27, ['02관 (4DX) 18:45,21:00']],
            ['CGV 수원', '경기', 0, ['01관 20:00']],
          ],
        },
        { date: '2026-10-11', theaters: [['씨네큐 신도림', '서울', 26, ['03관 09:30']]] },
      ],
    );
  });

  it('has nothing to show for a series, an unlinked film or a title not from TMDB', async () => {
    const service = new ShowtimesService(
      {
        findOne: async () =>
          Object.assign(new MediaEntity(), {
            externalProvider: 'TMDB',
            externalId: '1',
            mediaType: 'TV',
          }),
      } as never,
      {} as never,
      {} as never,
      { find: async () => [] } as never,
      { findOne: async () => null } as never,
    );
    assert.deepEqual(await service.forMedia('media-1', 'u1'), { updatedAt: null, dates: [] });
  });
});
