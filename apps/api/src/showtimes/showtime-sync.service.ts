import { seoulToday } from '@davas/shared';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, LessThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DAY_MS, MINUTE_MS, shiftDay } from '../common/time';
import {
  KobisMovieEntity,
  KobisShowtimeEntity,
  KobisSyncRunEntity,
  KobisTheaterEntity,
  type KobisTmdbSummary,
} from '../database/entities';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import {
  KobisScheduleClient,
  screeningFormat,
  type KobisScheduleRow,
} from './kobis-schedule.client';
import { kobisBaseTitle, KobisMovieMatcher } from './kobis-movie-matcher';

// KOBIS area codes of the regions read.
const WIDE_AREAS = [
  { code: '0105001', name: '서울시' },
  { code: '0105002', name: '경기도' },
];
// Theaters open bookings three to six days ahead; a week covers that.
const SCHEDULE_DAYS = 7;
// One request at a time, a second apart: about 1,600 requests and 35 minutes a day
// (243 theaters on 2026-10-10).
const REQUEST_GAP_MS = 1000;
// This many theaters failing in a row means KOBIS is down or refusing; stop until tomorrow.
const MAX_FAILURES_IN_ROW = 15;
// 12:00 in Korea (UTC+9, no daylight saving).
const NOON_UTC_HOUR = 3;
const STARTUP_DELAY_MS = 2 * MINUTE_MS;
// Films are looked up again now and then: linked ones to refresh votes and popularity,
// unlinked ones in case TMDB has caught up.
const RECHECK_LINKED_MS = 30 * DAY_MS;
const RECHECK_UNLINKED_MS = 7 * DAY_MS;
const LINKS_PER_RUN = 400;
const LINK_GAP_MS = 300;

/** The next 12:00 in Korea after `now`. */
export function nextNoon(now: Date) {
  const next = new Date(now);
  next.setUTCHours(NOON_UTC_HOUR, 0, 0, 0);
  if (next <= now) next.setTime(next.getTime() + DAY_MS);
  return next;
}

/** The latest 12:00 in Korea at or before `now`. */
export function lastNoon(now: Date) {
  return new Date(nextNoon(now).getTime() - DAY_MS);
}

/** `KOBIS_SHOWTIME_SYNC` is on, off, or unset (on in production only). */
export function syncEnabled(setting: string | undefined, nodeEnv: string | undefined) {
  if (setting === 'on') return true;
  if (setting === 'off') return false;
  return nodeEnv === 'production';
}

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

function summary(item: MediaRecommendationItem): KobisTmdbSummary {
  return {
    externalProvider: item.externalProvider,
    externalId: item.externalId,
    mediaType: item.mediaType,
    title: item.title,
    originalTitle: item.originalTitle,
    overview: item.overview,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
    releaseDate: item.releaseDate,
    genreIds: item.genreIds,
    country: item.country,
    voteAverage: item.voteAverage,
    voteCount: item.voteCount,
    popularity: item.popularity,
  };
}

type TheaterListing = Pick<
  KobisTheaterEntity,
  'code' | 'name' | 'wideAreaCode' | 'wideAreaName' | 'basicAreaCode' | 'basicAreaName'
>;

/**
 * Reads every Seoul and Gyeonggi theater's schedule for the coming week from KOBIS once a day
 * at 12:00 KST (and at start-up when that run was missed), then links films not linked yet
 * to their TMDB titles. A theater's showtimes are replaced only once all its days were read,
 * so a failure keeps yesterday's. Runs are logged in `kobis_sync_runs`.
 */
@Injectable()
export class ShowtimeSyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ShowtimeSyncService.name);
  private timer?: NodeJS.Timeout;
  private startup?: NodeJS.Timeout;
  private running = false;

  /** Tests replace these. */
  now: () => Date = () => new Date();
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  createClient: () => KobisScheduleClient = () => new KobisScheduleClient();

  constructor(
    @InjectRepository(KobisTheaterEntity)
    private readonly theaters: Repository<KobisTheaterEntity>,
    @InjectRepository(KobisShowtimeEntity)
    private readonly showtimes: Repository<KobisShowtimeEntity>,
    @InjectRepository(KobisMovieEntity)
    private readonly movies: Repository<KobisMovieEntity>,
    @InjectRepository(KobisSyncRunEntity)
    private readonly runs: Repository<KobisSyncRunEntity>,
    private readonly dataSource: DataSource,
    private readonly matcher: KobisMovieMatcher,
    @Optional() private readonly config?: ConfigService,
  ) {}

  onModuleInit(): void {
    const setting = this.config?.get<string>('KOBIS_SHOWTIME_SYNC');
    if (!syncEnabled(setting, this.config?.get<string>('NODE_ENV') ?? process.env.NODE_ENV)) {
      return;
    }
    this.startup = setTimeout(() => void this.catchUp(), STARTUP_DELAY_MS);
    this.startup.unref();
    this.scheduleNext();
  }

  onModuleDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.startup) clearTimeout(this.startup);
  }

  private scheduleNext() {
    const delay = nextNoon(this.now()).getTime() - this.now().getTime();
    this.timer = setTimeout(() => {
      void this.run().finally(() => this.scheduleNext());
    }, delay);
    this.timer.unref();
  }

  /** Runs now when the latest 12:00 run never succeeded (a restart or an outage). */
  async catchUp() {
    try {
      // Only one API process runs, so a run still marked as running died with its process.
      await this.runs.update(
        { status: 'RUNNING' },
        { status: 'FAILED', finishedAt: this.now(), error: 'interrupted' },
      );
      const last = await this.runs.findOne({
        where: { status: 'SUCCEEDED' },
        order: { startedAt: 'DESC' },
      });
      if (!last || last.startedAt < lastNoon(this.now())) await this.run();
    } catch (error) {
      this.logger.error('kobis-showtime-catch-up-failed', error);
    }
  }

  async run(): Promise<KobisSyncRunEntity | null> {
    if (this.running) return null;
    this.running = true;
    const client = this.createClient();
    let run: KobisSyncRunEntity | null = null;
    try {
      run = await this.runs.save(
        this.runs.create({
          startedAt: this.now(),
          status: 'RUNNING',
          finishedAt: null,
          error: null,
        }),
      );
      const today = seoulToday(this.now());
      const days = Array.from({ length: SCHEDULE_DAYS }, (_, index) => shiftDay(today, index));
      const listings = await this.readTheaters(client);

      let failed = 0;
      let failedInRow = 0;
      let showtimes = 0;
      const titles = new Map<string, string>();
      for (const theater of listings) {
        try {
          const { rows, homepageUrl } = await this.readTheater(client, theater.code, days);
          await this.replaceShowtimes(theater.code, days, rows, homepageUrl);
          showtimes += rows.length;
          failedInRow = 0;
          for (const row of rows) titles.set(row.movieCode, row.movieTitle);
        } catch (error) {
          failed += 1;
          failedInRow += 1;
          this.logger.warn(`kobis-theater-failed code=${theater.code} ${message(error)}`);
          if (failedInRow >= MAX_FAILURES_IN_ROW) {
            throw new Error(`KOBIS stopped answering (${failedInRow} theaters in a row)`);
          }
        }
      }
      await this.showtimes.delete({ showDate: LessThan(today) });
      await this.showtimes.delete({
        showDate: MoreThanOrEqual(today),
        theaterCode: Not(In(listings.map((theater) => theater.code))),
      });
      const linked = await this.linkFilms(titles);

      Object.assign(run, {
        status: failed === listings.length ? 'FAILED' : 'SUCCEEDED',
        theaters: listings.length,
        failedTheaters: failed,
        showtimes,
        moviesMatched: linked,
        error: failed ? `${failed} theaters failed` : null,
      });
      this.logger.log(
        `kobis-showtime-sync theaters=${listings.length} failed=${failed} showtimes=${showtimes} linked=${linked} requests=${client.requests}`,
      );
    } catch (error) {
      this.logger.error('kobis-showtime-sync-failed', error);
      if (run) Object.assign(run, { status: 'FAILED', error: message(error) });
    } finally {
      this.running = false;
    }
    if (!run) return null;
    run.requests = client.requests;
    run.finishedAt = this.now();
    return this.runs.save(run);
  }

  private pause(ms = REQUEST_GAP_MS) {
    return this.sleep(ms);
  }

  private async readTheaters(client: KobisScheduleClient) {
    const found = new Map<string, TheaterListing>();
    for (const wide of WIDE_AREAS) {
      const areas = await client.basicAreas(wide.code);
      await this.pause();
      for (const area of areas) {
        const theaters = await client.theaters(wide.code, area.code);
        await this.pause();
        for (const theater of theaters) {
          found.set(theater.code, {
            code: theater.code,
            name: theater.name,
            wideAreaCode: wide.code,
            wideAreaName: wide.name,
            basicAreaCode: area.code,
            basicAreaName: area.name,
          });
        }
      }
    }
    if (!found.size) throw new Error('KOBIS listed no theaters');
    const lastSeenAt = this.now();
    await this.theaters.upsert(
      [...found.values()].map((theater) => ({ ...theater, lastSeenAt })),
      ['code'],
    );
    return [...found.values()];
  }

  /** A theater's days in order, stopping after two empty days in a row past today. */
  private async readTheater(client: KobisScheduleClient, code: string, days: string[]) {
    const rows: Array<KobisScheduleRow & { day: string }> = [];
    let homepageUrl: string | null = null;
    let emptyInRow = 0;
    for (const [index, day] of days.entries()) {
      const result = await client.schedule(code, day);
      await this.pause();
      homepageUrl ??= result.homepageUrl;
      rows.push(...result.rows.map((row) => ({ ...row, day })));
      emptyInRow = result.rows.length ? 0 : emptyInRow + 1;
      if (index >= 1 && emptyInRow >= 2) break;
    }
    return { rows, homepageUrl };
  }

  private async replaceShowtimes(
    theaterCode: string,
    days: string[],
    rows: Array<KobisScheduleRow & { day: string }>,
    homepageUrl: string | null,
  ) {
    const fetchedAt = this.now();
    await this.dataSource.transaction(async (manager) => {
      const showtimes = manager.getRepository(KobisShowtimeEntity);
      await showtimes.delete({ theaterCode, showDate: In(days) });
      if (rows.length) {
        await showtimes.insert(
          rows.map((row) => ({
            theaterCode,
            showDate: row.day,
            screenName: row.screenName.slice(0, 80),
            movieCode: row.movieCode,
            movieTitle: row.movieTitle.slice(0, 200),
            format: screeningFormat(row.screenName, row.movieTitle),
            times: row.times,
            fetchedAt,
          })),
        );
      }
      if (homepageUrl) {
        await manager.getRepository(KobisTheaterEntity).update(theaterCode, { homepageUrl });
      }
    });
  }

  /** Links films shown today or later that were never looked up, or are due again. */
  private async linkFilms(titles: Map<string, string>) {
    if (!titles.size) return 0;
    if (!this.matcher.configured) {
      this.logger.warn('kobis-api-key-missing: films stay unlinked until KOBIS_API_KEY is set');
      return 0;
    }
    const known = new Map(
      (await this.movies.find({ where: { code: In([...titles.keys()]) } })).map((movie) => [
        movie.code,
        movie,
      ]),
    );
    const now = this.now().getTime();
    const due = [...titles.keys()]
      .filter((code) => {
        const movie = known.get(code);
        if (!movie?.checkedAt) return true;
        const wait = movie.matchStatus === 'MATCHED' ? RECHECK_LINKED_MS : RECHECK_UNLINKED_MS;
        return now - movie.checkedAt.getTime() > wait;
      })
      .slice(0, LINKS_PER_RUN);

    let linked = 0;
    for (const code of due) {
      try {
        const result = await this.matcher.match(code);
        const previous = known.get(code);
        const tmdb = result?.tmdb ? summary(result.tmdb) : null;
        // A film linked before keeps its title when a later look finds nothing clearer.
        const kept = !tmdb && previous?.matchStatus === 'MATCHED' ? previous : null;
        await this.movies.save(
          this.movies.create({
            code,
            title: (result?.film.title ?? kobisBaseTitle(titles.get(code) ?? code)).slice(0, 200),
            titleEn: result?.film.titleEn?.slice(0, 200) ?? null,
            productionYear: result?.film.productionYear ?? null,
            openDate: result?.film.openDate ?? null,
            directors: result?.film.directors ?? [],
            tmdbId: tmdb?.externalId ?? kept?.tmdbId ?? null,
            tmdb: tmdb ?? kept?.tmdb ?? null,
            matchStatus: tmdb || kept ? 'MATCHED' : 'UNMATCHED',
            checkedAt: this.now(),
          }),
        );
        if (tmdb) linked += 1;
      } catch (error) {
        this.logger.warn(`kobis-film-link-failed code=${code} ${message(error)}`);
      }
      await this.pause(LINK_GAP_MS);
    }
    return linked;
  }
}
