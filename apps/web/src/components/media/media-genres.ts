const TMDB_MOVIE_GENRES: Record<number, string> = {
  12: '모험',
  14: '판타지',
  16: '애니메이션',
  18: '드라마',
  27: '공포',
  28: '액션',
  35: '코미디',
  36: '역사',
  37: '서부',
  53: '스릴러',
  80: '범죄',
  99: '다큐멘터리',
  878: 'SF',
  9648: '미스터리',
  10402: '음악',
  10749: '로맨스',
  10751: '가족',
  10752: '전쟁',
  10770: 'TV 영화',
};

const TMDB_TV_GENRES: Record<number, string> = {
  16: '애니메이션',
  18: '드라마',
  35: '코미디',
  37: '서부',
  80: '범죄',
  99: '다큐멘터리',
  9648: '미스터리',
  10751: '가족',
  10759: '액션·모험',
  10762: '키즈',
  10763: '뉴스',
  10764: '리얼리티',
  10765: 'SF·판타지',
  10766: '드라마 연속극',
  10767: '토크',
  10768: '전쟁·정치',
};

export function getTmdbGenreNames({ genreIds, mediaType }: { genreIds?: Array<number | string>; mediaType: 'MOVIE' | 'TV' }) {
  const map = mediaType === 'TV' ? TMDB_TV_GENRES : TMDB_MOVIE_GENRES;
  return (genreIds ?? [])
    .map((genreId) => Number(genreId))
    .map((genreId) => map[genreId])
    .filter((genreName): genreName is string => Boolean(genreName));
}
