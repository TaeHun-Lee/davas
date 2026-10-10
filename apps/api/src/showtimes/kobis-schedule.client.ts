import type { TheaterFormat } from '@davas/shared';

const BASE_URL = 'https://www.kobis.or.kr';
const SCHEDULE_PAGE = '/kobis/business/mast/thea/findTheaterSchedule.do';
const USER_AGENT = 'Davas/1.0 (personal film diary; https://davas.duckdns.org)';
const TIMEOUT_MS = 15_000;

export type KobisCode = { code: string; name: string };

export type KobisScheduleRow = {
  screenName: string;
  movieCode: string;
  movieTitle: string;
  /** "09:30" */
  times: string[];
};

export type KobisTheaterDay = { homepageUrl: string | null; rows: KobisScheduleRow[] };

type Fetcher = typeof fetch;

/** Names come HTML-escaped, sometimes twice ("KT&amp;amp;G"). */
export function decodeKobisText(value: string) {
  let text = value;
  for (;;) {
    const next = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    if (next === text) return text.trim();
    text = next;
  }
}

/** "0930,1210" → ["09:30", "12:10"]. */
export function kobisTimes(value: string) {
  return [
    ...new Set(
      value
        .split(',')
        .map((time) => time.trim())
        .filter((time) => /^\d{4}$/.test(time))
        .map((time) => `${time.slice(0, 2)}:${time.slice(2)}`),
    ),
  ].sort();
}

/** The large format a screening is in, read from its screen ("02관 (4DX)") or print ("(4D)"). */
export function screeningFormat(screenName: string, movieTitle: string): TheaterFormat | null {
  const text = `${screenName} ${movieTitle}`.toUpperCase();
  if (/IMAX|아이맥스/.test(text)) return 'IMAX';
  // Megabox's MX4D is another system, and its screen name already says so.
  if (/MX4D/.test(text)) return null;
  if (/4DX|\(4D\)/.test(text)) return 'FOUR_DX';
  if (/DOLBY|돌비/.test(text)) return 'DOLBY';
  return null;
}

/**
 * Reads KOBIS's public "상영스케줄" pages the way the page itself does: a session carrying the
 * page's CSRF token, then form posts answered with JSON. KOBIS's open API has no schedules, so
 * this is the only complete source for art-house and small theaters too. It is not a published
 * API: callers keep to one request at a time and pace them.
 */
export class KobisScheduleClient {
  private session?: { token: string; cookie: string };
  /** Requests sent so far, for the run log. */
  requests = 0;

  constructor(private readonly fetcher: Fetcher = fetch) {}

  async basicAreas(wideAreaCode: string): Promise<KobisCode[]> {
    const data = await this.post<{ basareaCdList?: Array<{ cd: string; cdNm: string }> }>(
      '/kobis/business/mast/thea/findBasareaCdList.do',
      { sWideareaCd: wideAreaCode },
    );
    return (data.basareaCdList ?? []).map((area) => ({
      code: area.cd,
      name: decodeKobisText(area.cdNm),
    }));
  }

  async theaters(wideAreaCode: string, basicAreaCode: string): Promise<KobisCode[]> {
    const data = await this.post<{ theaCdList?: Array<{ cd: string; cdNm: string }> }>(
      '/kobis/business/mast/thea/findTheaCdList.do',
      { sWideareaCd: wideAreaCode, sBasareaCd: basicAreaCode },
    );
    return (data.theaCdList ?? []).map((theater) => ({
      code: theater.cd,
      name: decodeKobisText(theater.cdNm),
    }));
  }

  /** One theater's screenings on a `YYYY-MM-DD` day. */
  async schedule(theaterCode: string, day: string): Promise<KobisTheaterDay> {
    const data = await this.post<{
      schedule?: Array<{ scrnNm?: string; movieNm?: string; movieCd?: string; showTm?: string }>;
      theater?: Array<{ homepgUrl?: string }>;
    }>('/kobis/business/mast/thea/findSchedule.do', {
      theaCd: theaterCode,
      showDt: day.replaceAll('-', ''),
    });
    const homepage = data.theater?.[0]?.homepgUrl?.trim();
    return {
      homepageUrl: homepage && /^https?:\/\//.test(homepage) ? homepage : null,
      rows: (data.schedule ?? []).flatMap((row) => {
        const times = kobisTimes(row.showTm ?? '');
        if (!row.movieCd || !row.movieNm || !times.length) return [];
        return [
          {
            screenName: decodeKobisText(row.scrnNm ?? ''),
            movieCode: row.movieCd,
            movieTitle: decodeKobisText(row.movieNm),
            times,
          },
        ];
      }),
    };
  }

  private async post<T>(path: string, body: Record<string, string>, retry = true): Promise<T> {
    const session = this.session ?? (await this.open());
    this.requests += 1;
    const response = await this.fetcher(
      `${BASE_URL}${path}?CSRFToken=${encodeURIComponent(session.token)}`,
      {
        method: 'POST',
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          Cookie: session.cookie,
        },
        body: new URLSearchParams(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    const text = await response.text();
    if (response.ok && text.trimStart().startsWith('{')) return JSON.parse(text) as T;
    // An expired session answers with a page instead of JSON: open a new one, once.
    this.session = undefined;
    if (retry) return this.post<T>(path, body, false);
    throw new Error(`KOBIS ${path} answered ${response.status} without JSON`);
  }

  private async open() {
    this.requests += 1;
    const response = await this.fetcher(`${BASE_URL}${SCHEDULE_PAGE}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const html = await response.text();
    const token = html.match(/CSRFToken=([\w-]+)/)?.[1];
    if (!response.ok || !token) throw new Error('KOBIS schedule page gave no session token');
    const cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ');
    this.session = { token, cookie };
    return this.session;
  }
}
