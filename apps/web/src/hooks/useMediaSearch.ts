"use client";

import { useEffect, useState } from 'react';
import { searchMedia, type MediaSearchResult } from '../lib/api/media';

export type MediaSearchStatus = 'idle' | 'searching' | 'results' | 'empty' | 'error';

export function useMediaSearch(query: string, type: 'movie' | 'tv' | 'multi' = 'multi') {
  const [items, setItems] = useState<MediaSearchResult[]>([]);
  const [status, setStatus] = useState<MediaSearchStatus>('idle');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        const result = await searchMedia({ query: trimmedQuery, type, page: 1, language: 'ko-KR' });
        if (!isActive) return;
        setItems(result.items);
        setPage(result.page); setTotalPages(result.totalPages);
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
  }, [query, type]);

  async function loadMore() {
    const trimmedQuery = query.trim(); if (trimmedQuery.length < 2 || page >= totalPages) return;
    setStatus('searching');
    try { const result = await searchMedia({ query: trimmedQuery, type, page: page + 1, language: 'ko-KR' }); setItems((current) => [...current, ...result.items]); setPage(result.page); setTotalPages(result.totalPages); setStatus(result.items.length ? 'results' : 'empty'); } catch { setStatus('error'); }
  }

  return { items, status, page, totalPages, hasMore: page < totalPages, loadMore };
}
