import { Injectable } from '@nestjs/common';
import { TmdbClient } from '../media/tmdb.client';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import { KobisApiClient, type KobisFilm } from './kobis-api.client';

// The print or language a schedule adds to a title: "암살자(들)(디지털)", "오디세이(IMAX)".
const PRINT_SUFFIX =
  /\s*[([]\s*(디지털|필름|35mm|2D|3D|4D|4DX|IMAX|아이맥스|ATMOS|돌비|DOLBY|자막|더빙|우리말\s*더빙|한글\s*자막|SCREENX|스크린X|MX4D|SUPER\s*PLEX|리마스터링?|4K)[^)\]]*[)\]]\s*$/i;
// A re-release's edition, in Korean or English: "어벤져스: 엔드게임 앙코르", "더 폴: 디렉터스 컷",
// "Avengers: Endgame Encore".
const EDITION_SUFFIX =
  /\s*[:\-–]?\s*(앙코르|재개봉|리마스터링?|4K\s*리마스터링?|감독판|확장판|디렉터스\s*컷|특별판|무삭제판|encore|re-?release|4K\s*remaster(ed)?|remaster(ed)?|director'?s\s*cut|extended(\s*(edition|cut))?|special\s*edition|uncut)\s*$/i;

/** A KOBIS title without the print or the re-release edition it names. */
export function kobisBaseTitle(title: string) {
  let text = title.trim();
  for (;;) {
    const next = text.replace(PRINT_SUFFIX, '').replace(EDITION_SUFFIX, '').trim();
    if (next === text || !next) return text;
    text = next;
  }
}

/** Whether KOBIS registered the film as a re-release edition of an older one. */
export function isReissue(film: KobisFilm) {
  return [film.title, film.titleEn].some((title) =>
    Boolean(title && EDITION_SUFFIX.test(title.trim())),
  );
}

/** Letters and digits only, lower-cased: "더 폴: 디렉터스 컷" and "더폴디렉터스컷" compare equal. */
export const comparableTitle = (title: string) =>
  title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');

const yearOf = (date: string | null | undefined) => (date ? Number(date.slice(0, 4)) : null);

function filmTitles(film: KobisFilm) {
  return [
    ...new Set(
      [film.title, film.titleEn, film.originalTitle]
        .filter((title): title is string => Boolean(title?.trim()))
        .map((title) => comparableTitle(kobisBaseTitle(title)))
        .filter(Boolean),
    ),
  ];
}

/** Whether a TMDB title came out within a year of the film's production or Korean release. */
function closeInYear(film: KobisFilm, candidate: MediaRecommendationItem) {
  const years = [film.productionYear, yearOf(film.openDate)].filter(
    (year): year is number => year !== null,
  );
  const year = yearOf(candidate.releaseDate);
  if (!years.length) return true;
  return year !== null && years.some((known) => Math.abs(known - year) <= 1);
}

const candidateTitles = (candidate: MediaRecommendationItem) =>
  [candidate.title, candidate.originalTitle].map(comparableTitle).filter(Boolean);

/** TMDB titles named exactly like the film, in any year. */
export function sameNameCandidates(film: KobisFilm, candidates: MediaRecommendationItem[]) {
  const titles = filmTitles(film);
  return candidates.filter((candidate) =>
    candidateTitles(candidate).some((title) => titles.includes(title)),
  );
}

/** TMDB titles named exactly like the film and close to it in year. */
export function exactCandidates(film: KobisFilm, candidates: MediaRecommendationItem[]) {
  return sameNameCandidates(film, candidates).filter((candidate) => closeInYear(film, candidate));
}

/** TMDB titles whose name contains the film's or is contained in it, close in year. */
export function looseCandidates(film: KobisFilm, candidates: MediaRecommendationItem[]) {
  const titles = filmTitles(film).filter((title) => title.length >= 2);
  return candidates.filter(
    (candidate) =>
      candidateTitles(candidate).some((name) =>
        titles.some((title) => name.includes(title) || title.includes(name)),
      ) && closeInYear(film, candidate),
  );
}

/** A name as written, and with its words in any order ("DUCOURNAU Julia", "Julia Ducournau"). */
function nameKeys(name: string) {
  const words = name
    .normalize('NFKC')
    .toLowerCase()
    .split(/[\s,.·-]+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);
  return [words.join(''), [...words].sort().join(' ')];
}

/** Whether TMDB's director is one KOBIS names, in Korean or in English, in any word order. */
export function sameDirector(film: KobisFilm, director: string | null) {
  if (!director) return false;
  const known = new Set(film.directors.flatMap(nameKeys));
  return director.split(',').some((name) => nameKeys(name).some((key) => known.has(key)));
}

/**
 * Links a KOBIS film to its TMDB title. A single TMDB title with the same name and a year
 * within one of the film's is taken. When there are several, only near names, or none (TMDB
 * may know the film under another Korean title, found by its English one), the one whose
 * director KOBIS also names is taken. A re-release carries its own year, so for one the
 * director alone decides among titles of the same name. Anything still unclear stays
 * unlinked, so a title sheet never shows another film's showtimes.
 */
@Injectable()
export class KobisMovieMatcher {
  constructor(
    private readonly kobis: KobisApiClient,
    private readonly tmdb: TmdbClient,
  ) {}

  get configured() {
    return this.kobis.configured;
  }

  /** The film as KOBIS knows it and its TMDB title; null when KOBIS does not know the code. */
  async match(
    code: string,
  ): Promise<{ film: KobisFilm; tmdb: MediaRecommendationItem | null } | null> {
    const film = await this.kobis.film(code);
    if (!film) return null;
    const queries = [
      ...new Set(
        [film.title, film.titleEn]
          .filter((title): title is string => Boolean(title?.trim()))
          .map(kobisBaseTitle),
      ),
    ];
    const found = new Map<string, MediaRecommendationItem>();
    for (const query of queries) {
      for (const candidate of await this.tmdb.searchMovies(query)) {
        found.set(candidate.externalId, candidate);
      }
    }
    const candidates = [...found.values()];
    if (isReissue(film)) {
      return { film, tmdb: await this.byDirector(film, sameNameCandidates(film, candidates)) };
    }
    const exact = exactCandidates(film, candidates);
    if (exact.length === 1) return { film, tmdb: exact[0] };
    const unclear = exact.length ? exact : looseCandidates(film, candidates);
    const pool = unclear.length
      ? unclear
      : candidates.filter((candidate) => closeInYear(film, candidate));
    return { film, tmdb: await this.byDirector(film, pool) };
  }

  /** The one title among the first few whose director KOBIS names; null when not exactly one. */
  private async byDirector(film: KobisFilm, pool: MediaRecommendationItem[]) {
    const confirmed: MediaRecommendationItem[] = [];
    for (const candidate of pool.slice(0, 3)) {
      const detail = await this.tmdb.detail({
        externalId: candidate.externalId,
        mediaType: 'MOVIE',
      });
      if (sameDirector(film, detail.director)) confirmed.push(candidate);
    }
    return confirmed.length === 1 ? confirmed[0] : null;
  }
}
