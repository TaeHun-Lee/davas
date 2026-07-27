const TMDB_GENRE_LABELS_KO: Record<string, string> = {
  '12': '모험',
  '14': '판타지',
  '16': '애니메이션',
  '18': '드라마',
  '27': '공포',
  '28': '액션',
  '35': '코미디',
  '36': '역사',
  '37': '서부',
  '53': '스릴러',
  '80': '범죄',
  '99': '다큐멘터리',
  '878': 'SF',
  '9648': '미스터리',
  '10402': '음악',
  '10749': '로맨스',
  '10751': '가족',
  '10752': '전쟁',
  '10759': '액션 & 어드벤처',
  '10762': '키즈',
  '10763': '뉴스',
  '10764': '리얼리티',
  '10765': 'SF & 판타지',
  '10766': '소프',
  '10767': '토크',
  '10768': '전쟁 & 정치',
  '10770': 'TV 영화',
};

export function resolveTmdbGenreLabel(genre: string | number) {
  const key = String(genre).trim();
  return TMDB_GENRE_LABELS_KO[key] ?? key;
}

export function resolveTmdbGenreLabels(genres: Array<string | number> = []) {
  return genres.map(resolveTmdbGenreLabel).filter((genre) => genre.length > 0);
}
