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
  todayItems: MediaRecommendationItem[];
};

const initialState: ExploreRecommendationsState = {
  status: 'idle',
  trendingItems: [],
  genreTiles: [],
  todayItems: [],
};

export function pickRandomGenrePresets(presets: GenreRecommendationPreset[], count = 2) {
  return [...presets]
    .map((preset) => ({ preset, score: Math.random() }))
    .sort((left, right) => left.score - right.score)
    .slice(0, count)
    .map(({ preset }) => preset);
}

export function useExploreRecommendations() {
  const [recommendations, setRecommendations] = useState<ExploreRecommendationsState>(initialState);

  useEffect(() => {
    let isActive = true;

    async function loadRecommendations() {
      setRecommendations((current) => ({ ...current, status: 'loading' }));

      try {
        const [trending, presets, today] = await Promise.all([
          getTrendingRecommendations({ limit: 20 }),
          getGenreRecommendationPresets(),
          getTodayRecommendation({ limit: 3 }),
        ]);

        const randomPresets = pickRandomGenrePresets(presets.items, 2);
        const genreResponses = await Promise.all(
          randomPresets.map(async (preset) => {
            const response = await getGenreRecommendations(preset.id, { limit: 4 });
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
          todayItems: today.items,
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
