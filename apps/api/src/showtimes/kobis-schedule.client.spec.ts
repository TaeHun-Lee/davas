import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decodeKobisText,
  KobisScheduleClient,
  kobisTimes,
  screeningFormat,
} from './kobis-schedule.client';

const page = (token: string) =>
  new Response(`<script>$.post("/kobis/x.do?CSRFToken=${token}")</script>`, {
    headers: { 'Set-Cookie': `JSESSIONID=session-${token}; Path=/; HttpOnly` },
  });
const json = (body: unknown) => new Response(JSON.stringify(body));

describe('KOBIS schedule client', () => {
  it('reads names, times and formats the way the schedule page shows them', () => {
    assert.equal(decodeKobisText('KT&amp;amp;G 상상마당 Cinema '), 'KT&G 상상마당 Cinema');
    assert.deepEqual(kobisTimes('1300,0930, 0930,25'), ['09:30', '13:00']);
    assert.equal(screeningFormat('02관 (4DX)', '오디세이(4D)'), 'FOUR_DX');
    assert.equal(screeningFormat('IMAX관', '오디세이(디지털)'), 'IMAX');
    assert.equal(screeningFormat('Dolby Cinema', '오디세이'), 'DOLBY');
    assert.equal(screeningFormat('03관(Reserve)', '룩백(디지털)'), null);
    // Seen on Megabox COEX: an MX4D screen showing a "(4D)" print is not a 4DX screening.
    assert.equal(screeningFormat('MX4D관', '오디세이(4D)'), null);
  });

  it('opens a session from the page, posts with its token and cookie, and keeps usable rows', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const client = new KobisScheduleClient((async (url: string, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      if (!init?.method) return page('t1');
      return json({
        schedule: [
          {
            scrnNm: '03관(Reserve)',
            movieNm: '룩백(디지털)',
            movieCd: '20265062',
            showTm: '0930,1135',
          },
          { scrnNm: '01관', movieNm: '시간 없음', movieCd: '1', showTm: '' },
        ],
        theater: [{ homepgUrl: 'http://www.cineq.co.kr' }],
      });
    }) as never);

    const day = await client.schedule('001248', '2026-10-10');

    assert.deepEqual(day, {
      homepageUrl: 'http://www.cineq.co.kr',
      rows: [
        {
          screenName: '03관(Reserve)',
          movieCode: '20265062',
          movieTitle: '룩백(디지털)',
          times: ['09:30', '11:35'],
        },
      ],
    });
    const post = calls[1];
    assert.match(post.url, /findSchedule\.do\?CSRFToken=t1$/);
    assert.equal((post.init?.headers as Record<string, string>).Cookie, 'JSESSIONID=session-t1');
    assert.equal(String(post.init?.body), 'theaCd=001248&showDt=20261010');
    assert.equal(client.requests, 2);
  });

  it('opens a new session once when an expired one answers with a page', async () => {
    let pages = 0;
    let posts = 0;
    const client = new KobisScheduleClient((async (_url: string, init?: RequestInit) => {
      if (!init?.method) return page(`t${++pages}`);
      posts += 1;
      return posts === 1
        ? new Response('<html>expired</html>')
        : json({ theaCdList: [{ cd: '1', cdNm: '씨네큐 신도림' }] });
    }) as never);
    assert.deepEqual(await client.theaters('0105001', '010600121'), [
      { code: '1', name: '씨네큐 신도림' },
    ]);
    assert.equal(pages, 2);

    const broken = new KobisScheduleClient((async (_url: string, init?: RequestInit) =>
      init?.method ? new Response('<html></html>') : page('t')) as never);
    await assert.rejects(broken.basicAreas('0105001'), /without JSON/);
  });
});
