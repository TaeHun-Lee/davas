import { Injectable } from '@nestjs/common';
import {
  AvailabilityContentRef,
  AvailabilityProvider,
} from '../ports/availability-provider.port';
import { TmdbClient } from '../tmdb.client';

@Injectable()
export class TmdbAvailabilityAdapter implements AvailabilityProvider {
  constructor(private readonly client: TmdbClient) {}

  getOffers(
    contentRef: AvailabilityContentRef,
    region: string,
    observedAt: Date,
  ) {
    if (contentRef.provider !== 'TMDB') {
      throw new Error(`TMDB cannot resolve provider ${contentRef.provider}`);
    }
    return this.client.watchProviders({
      externalId: contentRef.externalId,
      mediaType: contentRef.mediaType,
      region,
      observedAt,
    });
  }

  async getReleaseState() {
    return {
      sourceProvider: 'TMDB',
      state: 'UNKNOWN' as const,
      confidence: 0,
    };
  }
}
