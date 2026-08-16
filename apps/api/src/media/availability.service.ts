import {
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AvailabilityObservationEntity,
  AvailabilityObservationStatus,
  ExternalContentRefEntity,
  MediaEntity,
} from '../database/entities';
import {
  AVAILABILITY_PROVIDER,
  AvailabilityProvider,
  ProviderAvailabilityLookup,
} from './ports/availability-provider.port';

export const AVAILABILITY_CACHE_OPTIONS = Symbol('AVAILABILITY_CACHE_OPTIONS');
export const DEFAULT_AVAILABILITY_TTL_MS = 6 * 60 * 60 * 1000;

export type AvailabilityCacheOptions = {
  ttlMs?: number;
  now?: () => Date;
};

export type AvailabilityState =
  | 'AVAILABLE'
  | 'NO_OFFERS'
  | 'PROVIDER_FAILURE'
  | 'EXPIRED'
  | 'UNMAPPED'
  | 'UNKNOWN';

export type AvailabilityResponse = {
  contentId: string;
  region: string;
  availability: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  state: AvailabilityState;
  observedAt: string | null;
  expiresAt: string | null;
  sourceProvider: string | null;
  confidence: number;
  offers: Array<{ provider: string; offerType: string; confidence: number }>;
};

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    @InjectRepository(ExternalContentRefEntity)
    private readonly externalRefRepository: Repository<ExternalContentRefEntity>,
    @InjectRepository(AvailabilityObservationEntity)
    private readonly observationRepository: Repository<AvailabilityObservationEntity>,
    @Inject(AVAILABILITY_PROVIDER)
    private readonly provider: AvailabilityProvider,
    @Optional()
    @Inject(AVAILABILITY_CACHE_OPTIONS)
    private readonly options: AvailabilityCacheOptions = {},
  ) {}

  async getCurrent(
    contentId: string,
    requestedRegion = 'KR',
  ): Promise<AvailabilityResponse> {
    const region = this.normalizeRegion(requestedRegion);
    await this.requireContent(contentId);
    const contentRef = await this.findContentRef(contentId);
    if (!contentRef) {
      return this.emptyResponse(contentId, region, 'UNMAPPED');
    }

    const observations = await this.observationRepository.find({
      where: { contentId, region },
      order: { observedAt: 'DESC', provider: 'ASC', offerType: 'ASC' },
      take: 50,
    });
    if (observations.length === 0) {
      return this.emptyResponse(contentId, region, 'UNKNOWN');
    }

    const latestObservedAt = observations[0].observedAt.getTime();
    const latest = observations.filter(
      (observation) => observation.observedAt.getTime() === latestObservedAt,
    );
    return this.toResponse(contentId, region, latest);
  }

  async refresh(
    contentId: string,
    requestedRegion = 'KR',
  ): Promise<AvailabilityResponse> {
    const region = this.normalizeRegion(requestedRegion);
    const content = await this.requireContent(contentId);
    const contentRef = await this.findContentRef(contentId);
    const observedAt = this.now();
    const expiresAt = new Date(observedAt.getTime() + this.ttlMs());

    if (!contentRef) {
      const observation = await this.saveStatusObservation({
        contentId,
        region,
        sourceProvider: 'NONE',
        status: 'UNMAPPED',
        observedAt,
        expiresAt,
      });
      return this.toResponse(contentId, region, [observation]);
    }

    try {
      const lookup = await this.provider.getOffers(
        {
          provider: contentRef.provider,
          externalId: contentRef.externalId,
          mediaType: content.mediaType,
        },
        region,
        observedAt,
      );
      const observations = await this.saveLookup(
        contentId,
        region,
        observedAt,
        expiresAt,
        lookup,
      );
      return this.toResponse(contentId, region, observations);
    } catch {
      const observation = await this.saveStatusObservation({
        contentId,
        region,
        sourceProvider: contentRef.provider,
        status: 'PROVIDER_FAILURE',
        observedAt,
        expiresAt,
      });
      return this.toResponse(contentId, region, [observation]);
    }
  }

  private async requireContent(contentId: string) {
    const content = await this.mediaRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new NotFoundException('Media not found');
    }
    return content;
  }

  private findContentRef(contentId: string) {
    return this.externalRefRepository.findOne({
      where: { contentId, provider: 'TMDB' },
    });
  }

  private async saveLookup(
    contentId: string,
    region: string,
    observedAt: Date,
    expiresAt: Date,
    lookup: ProviderAvailabilityLookup,
  ) {
    if (lookup.status === 'NO_OFFERS' || lookup.offers.length === 0) {
      return [
        await this.saveStatusObservation({
          contentId,
          region,
          sourceProvider: lookup.sourceProvider,
          status: 'NO_OFFERS',
          observedAt,
          expiresAt,
          confidence: lookup.confidence,
        }),
      ];
    }

    const uniqueOffers = new Map(
      lookup.offers.map((offer) => [
        `${offer.provider}:${offer.offerType}`,
        offer,
      ]),
    );
    const entities = [...uniqueOffers.values()].map((offer) =>
      this.observationRepository.create({
        contentId,
        region,
        sourceProvider: lookup.sourceProvider,
        provider: offer.provider,
        offerType: offer.offerType,
        status: 'AVAILABLE',
        observedAt,
        expiresAt,
        confidence: String(offer.confidence),
      }),
    );
    return this.observationRepository.save(entities);
  }

  private saveStatusObservation(input: {
    contentId: string;
    region: string;
    sourceProvider: string;
    status: Exclude<AvailabilityObservationStatus, 'AVAILABLE'>;
    observedAt: Date;
    expiresAt: Date;
    confidence?: number;
  }) {
    return this.observationRepository.save(
      this.observationRepository.create({
        ...input,
        provider: input.status === 'NO_OFFERS' ? 'NONE' : input.sourceProvider,
        offerType: 'NONE',
        confidence: String(input.confidence ?? 0),
      }),
    );
  }

  private toResponse(
    contentId: string,
    region: string,
    observations: AvailabilityObservationEntity[],
  ): AvailabilityResponse {
    const first = observations[0];
    if (!first) {
      return this.emptyResponse(contentId, region, 'UNKNOWN');
    }
    if (first.expiresAt.getTime() <= this.now().getTime()) {
      return {
        ...this.emptyResponse(contentId, region, 'EXPIRED'),
        observedAt: first.observedAt.toISOString(),
        expiresAt: first.expiresAt.toISOString(),
        sourceProvider: first.sourceProvider,
      };
    }

    const state = first.status as AvailabilityState;
    const available = state === 'AVAILABLE';
    return {
      contentId,
      region,
      availability: this.availabilityForState(state),
      state,
      observedAt: first.observedAt.toISOString(),
      expiresAt: first.expiresAt.toISOString(),
      sourceProvider: first.sourceProvider,
      confidence: Math.max(
        ...observations.map((item) => Number(item.confidence)),
      ),
      offers: available
        ? observations.map((item) => ({
            provider: item.provider,
            offerType: item.offerType,
            confidence: Number(item.confidence),
          }))
        : [],
    };
  }

  private emptyResponse(
    contentId: string,
    region: string,
    state: AvailabilityState,
  ): AvailabilityResponse {
    return {
      contentId,
      region,
      availability: this.availabilityForState(state),
      state,
      observedAt: null,
      expiresAt: null,
      sourceProvider: null,
      confidence: 0,
      offers: [],
    };
  }

  private normalizeRegion(region: string) {
    return region.trim().toUpperCase();
  }

  private availabilityForState(state: AvailabilityState) {
    if (state === 'AVAILABLE') {
      return 'AVAILABLE' as const;
    }
    if (state === 'NO_OFFERS') {
      return 'UNAVAILABLE' as const;
    }
    return 'UNKNOWN' as const;
  }

  private ttlMs() {
    return this.options.ttlMs ?? DEFAULT_AVAILABILITY_TTL_MS;
  }

  private now() {
    return this.options.now?.() ?? new Date();
  }
}
