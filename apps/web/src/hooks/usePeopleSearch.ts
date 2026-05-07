"use client";

import { useEffect, useState } from 'react';
import {
  getPersonCredits,
  searchPeople,
  type MediaSearchResult,
  type PersonSearchResult,
} from '../lib/api/media';

export type PeopleSearchStatus = 'idle' | 'searching' | 'results' | 'empty' | 'error';
export type PersonCreditsStatus = 'idle' | 'loading' | 'results' | 'empty' | 'error';

export function usePeopleSearch(query: string) {
  const [items, setItems] = useState<PersonSearchResult[]>([]);
  const [status, setStatus] = useState<PeopleSearchStatus>('idle');
  const [selectedPerson, setSelectedPerson] = useState<PersonSearchResult | null>(null);
  const [creditItems, setCreditItems] = useState<MediaSearchResult[]>([]);
  const [creditsStatus, setCreditsStatus] = useState<PersonCreditsStatus>('idle');

  useEffect(() => {
    const trimmedQuery = query.trim();
    setSelectedPerson(null);
    setCreditItems([]);
    setCreditsStatus('idle');

    if (trimmedQuery.length < 2) {
      setItems([]);
      setStatus('idle');
      return;
    }

    let isActive = true;
    setStatus('searching');
    const timeout = window.setTimeout(async () => {
      try {
        const result = await searchPeople({ query: trimmedQuery, language: 'ko-KR' });
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

  async function selectPerson(person: PersonSearchResult) {
    setSelectedPerson(person);
    setCreditItems([]);
    setCreditsStatus('loading');

    try {
      const result = await getPersonCredits(person.id, { language: 'ko-KR' });
      setCreditItems(result.items);
      setCreditsStatus(result.items.length > 0 ? 'results' : 'empty');
    } catch {
      setCreditItems([]);
      setCreditsStatus('error');
    }
  }

  function resetPersonSelection() {
    setSelectedPerson(null);
    setCreditItems([]);
    setCreditsStatus('idle');
  }

  return {
    items,
    status,
    selectedPerson,
    selectPerson,
    resetPersonSelection,
    creditItems,
    creditsStatus,
  };
}
