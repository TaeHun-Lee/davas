import { DEFAULT_LANGUAGE, DEFAULT_REGION, type NowShowingSummary } from '@davas/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbClient } from '../media/tmdb.client';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import { rankForViewer, titleKey } from './personal-ranking';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { TasteHistory } from './taste-history';
import { buildTasteProfile } from './taste-profile';

export type GenrePreset = {
  id: string;
  label: string;
  description: string;
  mediaType: 'movie' | 'tv';
  genreIds: number[];
  sortBy: string;
  voteCountGte: number;
};

// The 탐색 tab's four mood cards (EXPLORE_MOODS in the web) load these by id.
const GENRE_PRESETS: GenrePreset[] = [
  {
    id: 'immersive-thriller',
    label: '몰입감 있는 스릴러',
    description: '긴장감 있는 미스터리/스릴러 작품 추천',
    mediaType: 'movie',
    genreIds: [53, 9648],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'light-comedy',
    label: '가볍게 웃고 싶어요',
    description: '부담 없이 웃을 수 있는 코미디 추천',
    mediaType: 'movie',
    genreIds: [35],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'good-cry',
    label: '실컷 울고 싶어요',
    description: '마음이 먹먹해지는 가족 드라마 추천',
    mediaType: 'movie',
    genreIds: [18, 10751],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'chills',
    label: '오싹하게 보고 싶어요',
    description: '서늘한 공포 영화 추천',
    mediaType: 'movie',
    genreIds: [27],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
];

// TMDB pages read for one list: about sixty titles, so enough are left once a person's
// watched ones are taken out and the rest are reordered for them.
const LIST_PAGES = [1, 2, 3];
// The lists are the same for everyone and change through the day, not by the minute.
const LIST_TTL_MS = 30 * 60 * 1000;

/**
 * Home's "오늘 뭐 볼까요?" and 탐색's 화제작 and mood cards: TMDB's popular titles, and the films
 * playing in Seoul and Gyeonggi theaters, reordered for the person asking (see
 * personal-ranking.ts).
 */
@Injectable()
export class RecommendationsService {
  private readonly lists = new Map<
    string,
    { expiresAt: number; value: Promise<MediaRecommendationItem[]> }
  >();

  constructor(
    private readonly tmdbClient: TmdbClient,
    private readonly tasteHistory: TasteHistory,
    private readonly showtimes: ShowtimesService,
  ) {}

  /** The service's clock; tests move it to see kept lists expire. */
  now: () => Date = () => new Date();

  async trending(accountId: string, limit?: number) {
    const items = await this.list('trending', (page) =>
      this.tmdbClient.trending({ period: 'day', page, language: DEFAULT_LANGUAGE }),
    );
    return { items: await this.forViewer(accountId, items, limit) };
  }

  async genreRecommendations(accountId: string, presetId: string, limit?: number) {
    const preset = GENRE_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      throw new NotFoundException('Recommendation genre preset not found');
    }
    const items = await this.list(`genre:${preset.id}`, (page) =>
      this.tmdbClient.discover({
        mediaType: preset.mediaType,
        page,
        language: DEFAULT_LANGUAGE,
        region: DEFAULT_REGION,
        withGenres: preset.genreIds,
        sortBy: preset.sortBy,
        voteCountGte: preset.voteCountGte,
        reason: `genre:${preset.id}`,
      }),
    );
    return {
      preset: { id: preset.id, label: preset.label, description: preset.description },
      items: await this.forViewer(accountId, items, limit),
    };
  }

  /** Films playing in Seoul and Gyeonggi this week (KOBIS), the ones I have not seen. */
  async nowShowing(accountId: string, limit?: number) {
    const [{ updatedAt, films }, visits] = await Promise.all([
      this.showtimes.nowShowing(),
      this.showtimes.theaterVisits(accountId),
    ]);
    const byKey = new Map(films.map((film) => [titleKey(film.tmdb), film]));
    const ranked = await this.forViewer(
      accountId,
      films.map((film) => ({ ...film.tmdb, reason: 'now-showing' })),
      limit,
      { keepUnreleased: true },
    );
    return {
      updatedAt,
      items: ranked.map((item) => {
        const film = byKey.get(titleKey(item))!;
        const showing: NowShowingSummary = {
          theaters: film.theaterCodes.length,
          myTheaters: film.theaterCodes.filter((code) => visits.has(code)).length,
          firstDate: film.firstDate,
        };
        return { ...item, showing };
      }),
    };
  }

  private async forViewer(
    accountId: string,
    items: readonly MediaRecommendationItem[],
    limit?: number,
    options: { keepUnreleased?: boolean } = {},
  ) {
    const now = this.now();
    const history = await this.tasteHistory.read([accountId]);
    const signals = history.signals.get(accountId) ?? [];
    const seen = new Set<string>();
    for (const contentId of [...history.watched, ...history.rejected]) {
      const title = history.titles.get(contentId);
      if (title?.externalProvider === 'TMDB') seen.add(titleKey(title));
    }
    const historyFeatures = new Map(signals.map((signal) => [signal.contentId, signal.features]));
    return rankForViewer(
      items,
      {
        accountId,
        profile: buildTasteProfile(signals, now),
        historyFeatures: [...historyFeatures.values()],
        seen,
      },
      now,
      this.limit(limit),
      options,
    );
  }

  /**
   * A TMDB list's first pages, kept for a while. A page that fails is left out; a list with a
   * missing page is not kept, and one with no page at all fails.
   */
  private list(
    key: string,
    page: (page: number) => Promise<{ items: MediaRecommendationItem[] }>,
  ): Promise<MediaRecommendationItem[]> {
    const now = this.now().getTime();
    const kept = this.lists.get(key);
    if (kept && kept.expiresAt > now) return kept.value;
    const entry = {
      expiresAt: now + LIST_TTL_MS,
      value: Promise.allSettled(LIST_PAGES.map(page)).then((results) => {
        const read = results.flatMap((result) =>
          result.status === 'fulfilled' ? [result.value.items] : [],
        );
        if (read.length < results.length) this.forget(key, entry);
        if (read.length === 0) throw (results[0] as PromiseRejectedResult).reason;
        return read.flat();
      }),
    };
    this.lists.set(key, entry);
    return entry.value;
  }

  private forget(key: string, entry: { value: Promise<MediaRecommendationItem[]> }) {
    if (this.lists.get(key)?.value === entry.value) this.lists.delete(key);
  }

  private limit(value?: number) {
    const normalized = Number(value ?? 10);
    if (!Number.isFinite(normalized)) {
      return 10;
    }
    return Math.min(Math.max(Math.trunc(normalized), 1), 20);
  }
}
