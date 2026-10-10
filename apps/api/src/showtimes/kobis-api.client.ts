import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const BASE_URL = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest';
const TIMEOUT_MS = 10_000;

export type KobisFilm = {
  code: string;
  title: string;
  titleEn: string | null;
  originalTitle: string | null;
  productionYear: number | null;
  /** `YYYY-MM-DD` */
  openDate: string | null;
  /** Korean and English names, as KOBIS lists them. */
  directors: string[];
};

type Fetcher = typeof fetch;

type MovieInfo = {
  movieCd?: string;
  movieNm?: string;
  movieNmEn?: string;
  movieNmOg?: string;
  prdtYear?: string;
  openDt?: string;
  directors?: Array<{ peopleNm?: string; peopleNmEn?: string }>;
};

/**
 * KOFIC's open API (영화관입장권통합전산망 오픈API), keyed by `KOBIS_API_KEY`: a film's Korean
 * release date, titles, year and directors, used to link a KOBIS film to its TMDB title. Its
 * terms ask that results be shown on their own with the source named; Davas only uses them to
 * link titles.
 */
@Injectable()
export class KobisApiClient {
  private readonly key?: string;
  /** Tests replace it. */
  fetcher: Fetcher = fetch;

  constructor(@Optional() config?: ConfigService) {
    this.key = config?.get<string>('KOBIS_API_KEY')?.trim() || undefined;
  }

  get configured() {
    return Boolean(this.key);
  }

  async film(code: string): Promise<KobisFilm | null> {
    if (!this.key) return null;
    const url = new URL(`${BASE_URL}/movie/searchMovieInfo.json`);
    url.searchParams.set('key', this.key);
    url.searchParams.set('movieCd', code);
    const response = await this.fetcher(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`KOBIS movie info answered ${response.status}`);
    const body = (await response.json()) as {
      movieInfoResult?: { movieInfo?: MovieInfo };
      faultInfo?: { message?: string };
    };
    if (body.faultInfo) throw new Error(`KOBIS movie info: ${body.faultInfo.message ?? 'fault'}`);
    const info = body.movieInfoResult?.movieInfo;
    if (!info?.movieCd || !info.movieNm) return null;
    const year = Number(info.prdtYear);
    const open = info.openDt?.match(/^(\d{4})(\d{2})(\d{2})$/);
    return {
      code: info.movieCd,
      title: info.movieNm.trim(),
      titleEn: info.movieNmEn?.trim() || null,
      originalTitle: info.movieNmOg?.trim() || null,
      productionYear: Number.isInteger(year) && year > 1880 ? year : null,
      openDate: open ? `${open[1]}-${open[2]}-${open[3]}` : null,
      directors: (info.directors ?? []).flatMap((director) =>
        [director.peopleNm, director.peopleNmEn].flatMap((name) =>
          name?.trim() ? [name.trim()] : [],
        ),
      ),
    };
  }
}
