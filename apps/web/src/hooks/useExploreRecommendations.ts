"use client";

import { useEffect, useState } from 'react';
import {
  getGenreRecommendationPresets,
  getGenreRecommendations,
  getTodayRecommendation,
  getTrendingRecommendations,
  type GenreRecommendationPreset,
  type MediaRecommendationItem,
} from '../lib/api/recommendations';

export type GenreRecommendationTile = GenreRecommendationPreset & {
  items: MediaRecommendationItem[];
};

type RecommendationStatus = 'idle' | 'loading' | 'ready' | 'error';

export type ExploreRecommendationsState = {
  status: RecommendationStatus;
  trendingItems: MediaRecommendationItem[];
  genreTiles: GenreRecommendationTile[];
  todayItem?: MediaRecommendationItem;
};

const initialState: ExploreRecommendationsState = {
  status: 'idle',
  trendingItems: [],
  genreTiles: [],
  todayItem: undefined,
};

export function useExploreRecommendations() {
  const [recommendations, setRecommendations] = useState<ExploreRecommendationsState>(initialState);

  useEffect(() => {
    let isActive = true;

    async function loadRecommendations() {
      setRecommendations((current) => ({ ...current, status: 'loading' }));

      try {
        const [trending, presets, today] = await Promise.all([
          getTrendingRecommendations(),
          getGenreRecommendationPresets(),
          getTodayRecommendation(),
        ]);

        const genreResponses = await Promise.all(
          presets.items.slice(0, 2).map(async (preset) => {
            const response = await getGenreRecommendations(preset.id);
            return {
              ...preset,
              items: response.items,
            } satisfies GenreRecommendationTile;
          }),
        );

        if (!isActive) {
          return;
        }

        setRecommendations({
          status: 'ready',
          trendingItems: trending.items,
          genreTiles: genreResponses,
          todayItem: today.item,
        });
      } catch {
        if (!isActive) {
          return;
        }

        setRecommendations((current) => ({ ...current, status: 'error' }));
      }
    }

    void loadRecommendations();

    return () => {
      isActive = false;
    };
  }, []);

  return recommendations;
}
