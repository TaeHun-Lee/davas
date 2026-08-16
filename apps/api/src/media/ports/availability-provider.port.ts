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
