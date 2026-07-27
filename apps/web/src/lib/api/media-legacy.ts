import type { MediaSearchResult } from '@davas/shared';

export type PersonSearchResult = {
  id: string;
  name: string;
  profileUrl: string | null;
  knownForDepartment: string | null;
  knownFor: MediaSearchResult[];
};

export type PersonSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: PersonSearchResult[];
};

export type PersonCreditsResponse = {
  personId: string;
  items: MediaSearchResult[];
};

function disabledPersonDiscovery(): never {
  throw new Error('Person discovery is disabled in the Davas core runtime.');
}

export async function searchPeople(input: {
  query: string;
  page?: number;
  language?: string;
}): Promise<PersonSearchResponse> {
  void input;
  return disabledPersonDiscovery();
}

export async function getPersonCredits(
  personId: string,
  options: { language?: string } = {},
): Promise<PersonCreditsResponse> {
  void personId;
  void options;
  return disabledPersonDiscovery();
}
