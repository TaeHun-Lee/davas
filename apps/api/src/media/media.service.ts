import { Injectable } from '@nestjs/common';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { TmdbClient } from './tmdb.client';

@Injectable()
export class MediaService {
  constructor(private readonly tmdbClient: TmdbClient) {}

  async search(query: MediaSearchQueryDto) {
    const normalizedQuery = (query.query ?? query.q ?? '').trim();
    return this.tmdbClient.search({
      query: normalizedQuery,
      type: query.type ?? 'multi',
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
      region: query.region ?? 'KR',
    });
  }
}
