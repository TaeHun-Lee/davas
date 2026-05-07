"use client";

import { useEffect, useState } from 'react';
import { searchMedia, type MediaSearchResult } from '../lib/api/media';

export type MediaSearchStatus = 'idle' | 'searching' | 'results' | 'empty' | 'error';

export function useMediaSearch(query: string) {
  const [items, setItems] = useState<MediaSearchResult[]>([]);
  const [status, setStatus] = useState<MediaSearchStatus>('idle');

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setItems([]);
      setStatus('idle');
      return;
    }

    let isActive = true;
    setStatus('searching');
    const timeout = window.setTimeout(async () => {
      try {
        const result = await searchMedia({ query: trimmedQuery, language: 'ko-KR' });
        if (!isActive) return;
        setItems(result.items);
        setStatus(result.items.length > 0 ? 'results' : 'empty');
      } catch {
        if (!isActive) return;
        setItems([]);
        setStatus('error');
      }
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  return { items, status };
}
