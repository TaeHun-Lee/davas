import type { MediaType } from '@davas/shared';

export const AVAILABILITY_PROVIDER = Symbol('AVAILABILITY_PROVIDER');

export type AvailabilityContentRef = {
  provider: string;
  externalId: string;
  mediaType: MediaType;
};

export type ProviderOffer = {
  provider: string;
  offerType: 'STREAM' | 'RENT' | 'BUY' | 'FREE' | 'ADS';
  confidence: number;
};

/** Offers a subscription (or a free or ad-supported plan) covers; renting or buying does not count. */
export const SUBSCRIPTION_OFFER_TYPES: ReadonlySet<string> = new Set<ProviderOffer['offerType']>([
  'STREAM',
  'FREE',
  'ADS',
]);

export type ProviderAvailabilityLookup = {
  sourceProvider: string;
  status: 'AVAILABLE' | 'NO_OFFERS';
  offers: ProviderOffer[];
  confidence: number;
};

export type ProviderReleaseState = {
  sourceProvider: string;
  state: 'RELEASED' | 'UPCOMING' | 'UNKNOWN';
  confidence: number;
};

export interface AvailabilityProvider {
  getOffers(
    contentRef: AvailabilityContentRef,
    region: string,
    observedAt: Date,
  ): Promise<ProviderAvailabilityLookup>;
  getReleaseState(
    contentRef: AvailabilityContentRef,
    region: string,
    observedAt: Date,
  ): Promise<ProviderReleaseState>;
}
