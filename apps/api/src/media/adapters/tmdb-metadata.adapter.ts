import { Injectable } from '@nestjs/common';
import {
  CatalogSearchInput,
  CatalogTitleRef,
  MetadataProvider,
} from '../ports/metadata-provider.port';
import { TmdbClient } from '../tmdb.client';

@Injectable()
export class TmdbMetadataAdapter implements MetadataProvider {
  constructor(private readonly client: TmdbClient) {}

  search(input: CatalogSearchInput) {
    return this.client.search(input);
  }

  async getTitle(contentRef: CatalogTitleRef, locale: string) {
    if (contentRef.provider !== 'TMDB') {
      throw new Error(`TMDB cannot resolve provider ${contentRef.provider}`);
    }
    const detail = await this.client.detail({
      externalId: contentRef.externalId,
      mediaType: contentRef.mediaType,
      language: locale,
    });
    return { ...detail };
  }
}
