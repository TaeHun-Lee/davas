import { Injectable } from '@nestjs/common';

type DiaryDashboardItem = {
  id: string;
  mediaId: string;
  mediaTitle: string;
  diaryTitle: string;
  watchedDate: string;
  rating: number;
  contentPreview: string;
  posterUrl?: string | null;
  posterGradient: string;
  genreNames: string[];
  isBookmarked?: boolean;
};

const recentItems: DiaryDashboardItem[] = [
  {
    id: 'diary-1',
    mediaId: 'mock-interstellar',
    mediaTitle: '인터스텔라',
    diaryTitle: '우리는 답을 찾을 것이다',
    watchedDate: '2026.05.18',
    rating: 4.8,
    contentPreview: '다시 봐도 압도적인 우주와 가족의 감정선이 긴 여운을 남겼다. 기록을 이어 쓰고 싶은 작품.',
    posterUrl: '/images/mock/interstellar-poster.jpg',
    posterGradient: 'from-[#1c355d] via-[#4977a5] to-[#dde7ee]',
    genreNames: ['SF', '드라마'],
    isBookmarked: true,
  },
  {
    id: 'diary-2',
    mediaId: 'mock-inception',
    mediaTitle: '인셉션',
    diaryTitle: '꿈의 층위를 따라간 밤',
    watchedDate: '2026.05.12',
    rating: 4.5,
    contentPreview: '복잡한 구조보다 인물들이 붙잡고 있는 후회와 선택이 더 크게 느껴졌다.',
    posterGradient: 'from-[#172033] via-[#315a80] to-[#8fb8d8]',
    genreNames: ['SF', '스릴러'],
  },
  {
    id: 'diary-3',
    mediaId: 'mock-shawshank',
    mediaTitle: '쇼생크 탈출',
    diaryTitle: '희망은 좋은 것',
    watchedDate: '2026.05.03',
    rating: 4.9,
    contentPreview: '익숙한 명작이지만 볼 때마다 다른 장면이 마음에 남는다. 오늘은 마지막 바다 장면.',
    posterGradient: 'from-[#46342d] via-[#8d7058] to-[#ead2a9]',
    genreNames: ['드라마'],
    isBookmarked: true,
  },
];

function buildGenreRatios(items: DiaryDashboardItem[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const genre of item.genreNames) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0) || 1;
  const iconKinds = ['sf', 'drama', 'thriller', 'action', 'etc'] as const;
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count], index) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100),
      iconKind: iconKinds[index] ?? 'etc',
    }));
}

@Injectable()
export class DiariesDashboardService {
  getDashboard() {
    const averageRating = recentItems.reduce((sum, item) => sum + item.rating, 0) / recentItems.length;
    const genreRatios = buildGenreRatios(recentItems);

    return {
      summary: {
        totalCount: recentItems.length,
        monthlyCount: recentItems.length,
        averageRating: Number(averageRating.toFixed(2)),
        topGenre: genreRatios[0] ? { name: genreRatios[0].genre, count: genreRatios[0].count } : null,
      },
      calendar: {
        year: 2026,
        month: 5,
        selectedDay: 18,
        markers: [
          { day: 3, count: 1 },
          { day: 12, count: 1 },
          { day: 18, count: 1 },
        ],
      },
      genreRatios,
      recentItems,
    };
  }
}
