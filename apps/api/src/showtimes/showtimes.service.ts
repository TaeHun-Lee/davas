import { seoulToday, type MediaShowtimesResponse, type TheaterShowtimes } from '@davas/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  KobisMovieEntity,
  KobisShowtimeEntity,
  KobisSyncRunEntity,
  KobisTheaterEntity,
  MediaEntity,
  type KobisTmdbSummary,
} from '../database/entities';
import { decodeKobisText } from './kobis-schedule.client';

const words = (name: string) =>
  decodeKobisText(name)
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .split(/[\s·]+/)
    .filter(Boolean);

/**
 * Which KOBIS theaters a person's records were at. Records name places freely ("영등포 CGV",
 * "신도림 씨네큐"); a place counts for a theater when each of its words starts a word of the
 * theater's KOBIS name ("CGV 영등포", "씨네큐 신도림") and no other theater fits as well.
 */
export function matchVisitedTheaters(
  places: ReadonlyArray<{ place: string; count: number }>,
  theaters: ReadonlyArray<{ code: string; name: string }>,
) {
  const visits = new Map<string, number>();
  const named = theaters.map((theater) => ({ code: theater.code, words: words(theater.name) }));
  for (const { place, count } of places) {
    const wanted = words(place);
    if (!wanted.length) continue;
    const fits = named.filter((theater) =>
      wanted.every((word) => theater.words.some((part) => part.startsWith(word))),
    );
    if (fits.length !== 1) continue;
    visits.set(fits[0].code, (visits.get(fits[0].code) ?? 0) + count);
  }
  return visits;
}

/** "14:05" in Korea. */
function seoulClock(now: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
}

const region = (wideAreaName: string) => wideAreaName.replace(/(시|도)$/, '');

export type NowShowingFilm = {
  tmdb: KobisTmdbSummary;
  theaterCodes: string[];
  firstDate: string;
};

/** Reads the KOBIS showtimes the daily run stored. */
@Injectable()
export class ShowtimesService {
  /** Tests set the clock. */
  now: () => Date = () => new Date();

  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(KobisTheaterEntity)
    private readonly theaters: Repository<KobisTheaterEntity>,
    @InjectRepository(KobisShowtimeEntity)
    private readonly showtimes: Repository<KobisShowtimeEntity>,
    @InjectRepository(KobisMovieEntity)
    private readonly movies: Repository<KobisMovieEntity>,
    @InjectRepository(KobisSyncRunEntity)
    private readonly runs: Repository<KobisSyncRunEntity>,
  ) {}

  /** When the schedules were last read in full. */
  async updatedAt() {
    const last = await this.runs.findOne({
      where: { status: 'SUCCEEDED' },
      order: { startedAt: 'DESC' },
    });
    return last?.finishedAt?.toISOString() ?? null;
  }

  /** The viewer's record count at each KOBIS theater. */
  async theaterVisits(accountId: string) {
    const [places, theaters] = await Promise.all([
      this.showtimes.manager.query(
        `SELECT s.place_text AS place, count(*)::int AS count
         FROM watch_sources s
         JOIN diaries d ON d.id = s.diary_id
         WHERE d.user_id = $1 AND d.deleted_at IS NULL AND s.kind = 'THEATER' AND s.place_text IS NOT NULL
         GROUP BY s.place_text`,
        [accountId],
      ) as Promise<Array<{ place: string; count: number }>>,
      this.theaters.find({ select: { code: true, name: true } }),
    ]);
    return matchVisitedTheaters(places, theaters);
  }

  /** Where a stored film plays from today on, theaters the viewer goes to first. */
  async forMedia(mediaId: string, accountId: string): Promise<MediaShowtimesResponse> {
    const [media, updatedAt] = await Promise.all([
      this.media.findOne({ where: { id: mediaId } }),
      this.updatedAt(),
    ]);
    if (!media || media.externalProvider !== 'TMDB' || media.mediaType !== 'MOVIE') {
      return { updatedAt, dates: [] };
    }
    const films = await this.movies.find({
      where: { tmdbId: media.externalId, matchStatus: 'MATCHED' },
    });
    if (!films.length) return { updatedAt, dates: [] };

    const now = this.now();
    const today = seoulToday(now);
    const clock = seoulClock(now);
    const [rows, visits] = await Promise.all([
      this.showtimes.find({
        where: { movieCode: In(films.map((film) => film.code)), showDate: MoreThanOrEqual(today) },
        relations: { theater: true },
      }),
      this.theaterVisits(accountId),
    ]);

    const days = new Map<string, Map<string, TheaterShowtimes>>();
    for (const row of rows) {
      if (!row.theater) continue;
      const times = row.showDate === today ? row.times.filter((time) => time > clock) : row.times;
      if (!times.length) continue;
      const theaters = days.get(row.showDate) ?? new Map<string, TheaterShowtimes>();
      days.set(row.showDate, theaters);
      const theater = theaters.get(row.theaterCode) ?? {
        code: row.theaterCode,
        name: row.theater.name,
        region: region(row.theater.wideAreaName),
        area: row.theater.basicAreaName,
        homepageUrl: row.theater.homepageUrl,
        visits: visits.get(row.theaterCode) ?? 0,
        screenings: [],
      };
      theaters.set(row.theaterCode, theater);
      // A screen listed twice (another print of the same film) shows its times together.
      const screening = theater.screenings.find(
        (item) => item.screen === row.screenName && item.format === row.format,
      );
      if (screening) screening.times = [...new Set([...screening.times, ...times])].sort();
      else theater.screenings.push({ screen: row.screenName, format: row.format, times });
    }

    return {
      updatedAt,
      dates: [...days.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, theaters]) => ({
          date,
          theaters: [...theaters.values()]
            .map((theater) => ({
              ...theater,
              screenings: theater.screenings.sort((a, b) => a.times[0].localeCompare(b.times[0])),
            }))
            .sort(
              (a, b) =>
                b.visits - a.visits ||
                Number(b.region === '서울') - Number(a.region === '서울') ||
                a.name.localeCompare(b.name, 'ko'),
            ),
        })),
    };
  }

  /** Linked films playing from today on, with the theaters they play at. */
  async nowShowing(): Promise<{ updatedAt: string | null; films: NowShowingFilm[] }> {
    const today = seoulToday(this.now());
    const [updatedAt, rows] = await Promise.all([
      this.updatedAt(),
      this.showtimes.manager.query(
        `SELECT m.tmdb_id AS "tmdbId", s.theater_code AS "theaterCode", min(s.show_date)::text AS "firstDate"
         FROM kobis_showtimes s
         JOIN kobis_movies m ON m.code = s.movie_code
         WHERE m.match_status = 'MATCHED' AND m.tmdb_id IS NOT NULL AND s.show_date >= $1
         GROUP BY m.tmdb_id, s.theater_code`,
        [today],
      ) as Promise<Array<{ tmdbId: string; theaterCode: string; firstDate: string }>>,
    ]);
    if (!rows.length) return { updatedAt, films: [] };
    const linked = await this.movies.find({
      where: { tmdbId: In([...new Set(rows.map((row) => row.tmdbId))]), matchStatus: 'MATCHED' },
      order: { checkedAt: 'DESC' },
    });
    const summaries = new Map<string, KobisTmdbSummary>();
    for (const movie of linked) {
      if (movie.tmdbId && movie.tmdb && !summaries.has(movie.tmdbId)) {
        summaries.set(movie.tmdbId, movie.tmdb);
      }
    }
    const films = new Map<string, NowShowingFilm>();
    for (const row of rows) {
      const tmdb = summaries.get(row.tmdbId);
      if (!tmdb) continue;
      const film = films.get(row.tmdbId) ?? { tmdb, theaterCodes: [], firstDate: row.firstDate };
      film.theaterCodes.push(row.theaterCode);
      if (row.firstDate < film.firstDate) film.firstDate = row.firstDate;
      films.set(row.tmdbId, film);
    }
    return { updatedAt, films: [...films.values()] };
  }
}
