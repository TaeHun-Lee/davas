import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ottServiceForProvider,
  type OttServiceKey,
  type SpaceWishItem,
  type SpaceWishList,
  type SpaceWishPick,
  type WishMood,
} from '@davas/shared';
import { In, IsNull, Repository } from 'typeorm';
import { mapWithConcurrency } from '../common/concurrency';
import { MediaEntity, SpaceWishEntity, UserEntity, WatchShareEntity } from '../database/entities';
import { AvailabilityService, type AvailabilityResponse } from '../media/availability.service';
import { SUBSCRIPTION_OFFER_TYPES } from '../media/ports/availability-provider.port';
import { NotificationsService } from '../notifications/notifications.service';
import { SpaceAccessService } from '../spaces/space-access.service';

const REGION = 'KR';
// TMDB lookups per list request. Fresh observations are cached for hours, so a list fills in
// over a few visits instead of firing one request per title every time.
const AVAILABILITY_REFRESH_BUDGET = 8;
const MAX_WISHES_PER_SPACE = 200;

// Genre names come from TMDB's Korean detail payload.
export const MOOD_GENRES: Record<WishMood, string[]> = {
  LIGHT: ['코미디', '애니메이션', '가족', '음악'],
  IMMERSIVE: ['스릴러', '미스터리', '범죄', 'SF', 'SF & 판타지', '액션', '액션 & 어드벤처'],
  TEARS: ['드라마', '로맨스'],
  CHILLS: ['공포', '미스터리', '스릴러'],
};

const notFound = (code: string, message: string) =>
  new NotFoundException({ statusCode: 404, code, message });

/**
 * A space's shared "같이 보고 싶어요" list. Each row is one member wanting one title; the
 * list groups them per title and says whether everyone wants it, whether someone already
 * watched it, and whether it streams on a service someone in the space subscribes to.
 */
@Injectable()
export class SpaceWishesService {
  constructor(
    @InjectRepository(SpaceWishEntity)
    private readonly wishes: Repository<SpaceWishEntity>,
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(WatchShareEntity)
    private readonly shares: Repository<WatchShareEntity>,
    private readonly spaceAccess: SpaceAccessService,
    private readonly availability: AvailabilityService,
    @Optional() private readonly notifications?: NotificationsService,
  ) {}

  async list(spaceId: string, viewerId: string): Promise<SpaceWishList> {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    const memberships = await this.spaceAccess.activeMembersInSpaces([spaceId]);
    const memberIds = new Set(memberships.map((membership) => membership.accountId));
    const [members, rows] = await Promise.all([
      memberIds.size ? this.users.find({ where: { id: In([...memberIds]) } }) : [],
      this.wishes.find({
        where: { spaceId },
        relations: { media: true },
        order: { createdAt: 'DESC' },
      }),
    ]);
    const nicknames = new Map(members.map((user) => [user.id, user.nickname]));
    const spaceServices = new Set(members.flatMap((user) => user.ottServices ?? []));

    // People who left the space no longer count as wanting anything here.
    const byMedia = new Map<string, SpaceWishEntity[]>();
    for (const row of rows) {
      if (!memberIds.has(row.accountId) || !row.media) continue;
      byMedia.set(row.mediaId, [...(byMedia.get(row.mediaId) ?? []), row]);
    }
    const lastRecorded = await this.lastRecordedInSpace(spaceId, [...byMedia.keys()]);

    let refreshesLeft = AVAILABILITY_REFRESH_BUDGET;
    const current = await this.availability
      .getCurrentMany([...byMedia.keys()], REGION)
      .catch(() => new Map<string, AvailabilityResponse>());
    const items = await mapWithConcurrency([...byMedia.values()], 4, async (group) => {
      const media = group[0].media!;
      const addedAt = new Date(Math.min(...group.map((wish) => wish.createdAt.getTime())));
      const recorded = lastRecorded.get(media.id);
      const availability = await this.availabilityFor(media.id, current, spaceServices, () => {
        if (refreshesLeft <= 0) return false;
        refreshesLeft -= 1;
        return true;
      });
      const item: SpaceWishItem = {
        media: {
          id: media.id,
          title: media.title,
          mediaType: media.mediaType,
          posterUrl: media.posterUrl ?? null,
          releaseYear: media.releaseDate?.slice(0, 4) ?? null,
          genres: media.genres ?? [],
        },
        wantedBy: group.map((wish) => ({
          accountId: wish.accountId,
          nickname: nicknames.get(wish.accountId),
        })),
        wantedByAll: memberIds.size > 1 && group.length >= memberIds.size,
        wantedByMe: group.some((wish) => wish.accountId === viewerId),
        watched: Boolean(recorded && recorded.getTime() >= addedAt.getTime()),
        availability,
        addedAt: addedAt.toISOString(),
      };
      return item;
    });

    items.sort(
      (left, right) =>
        Number(left.watched) - Number(right.watched) ||
        Number(right.wantedByAll) - Number(left.wantedByAll) ||
        Number(right.availability.onSpaceServices) - Number(left.availability.onSpaceServices) ||
        right.addedAt.localeCompare(left.addedAt),
    );
    return { items };
  }

  async status(spaceId: string, viewerId: string, mediaId: string) {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    const rows = await this.wishes.find({ where: { spaceId, mediaId } });
    return {
      mediaId,
      wantedByMe: rows.some((row) => row.accountId === viewerId),
      wantedCount: rows.length,
    };
  }

  async add(spaceId: string, viewerId: string, mediaId: string) {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    const media = await this.media.findOne({ where: { id: mediaId } });
    if (!media) throw notFound('MEDIA_NOT_FOUND', '작품을 찾을 수 없어요.');
    const count = await this.wishes.count({ where: { spaceId } });
    if (count >= MAX_WISHES_PER_SPACE) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'WISHLIST_FULL',
        message: '같이 보고 싶어요 목록이 가득 찼어요. 이미 본 작품을 정리해 주세요.',
      });
    }
    const before = await this.wishes.find({ where: { spaceId, mediaId } });
    await this.wishes
      .createQueryBuilder()
      .insert()
      .values({ spaceId, mediaId, accountId: viewerId })
      .orIgnore()
      .execute();
    if (!before.some((wish) => wish.accountId === viewerId)) {
      await this.notifyIfEveryoneWants(spaceId, mediaId, viewerId);
    }
    return this.status(spaceId, viewerId, mediaId);
  }

  private async notifyIfEveryoneWants(spaceId: string, mediaId: string, actorId: string) {
    if (!this.notifications) return;
    try {
      const members = (await this.spaceAccess.activeMembersInSpaces([spaceId])).map(
        (membership) => membership.accountId,
      );
      const wanting = new Set(
        (await this.wishes.find({ where: { spaceId, mediaId } })).map((wish) => wish.accountId),
      );
      if (members.length < 2 || !members.every((accountId) => wanting.has(accountId))) return;
      for (const recipientId of members) {
        if (recipientId === actorId) continue;
        await this.notifications.notifyWishMatched({
          recipientId,
          actorId,
          mediaId,
          idempotencyKey: `WISH_MATCHED:${recipientId}:${spaceId}:${mediaId}`,
        });
      }
    } catch {
      // A missed match notification never blocks adding the title.
    }
  }

  async remove(spaceId: string, viewerId: string, mediaId: string) {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    await this.wishes.delete({ spaceId, mediaId, accountId: viewerId });
    return this.status(spaceId, viewerId, mediaId);
  }

  /**
   * "빠른 추천": the best unwatched title on the list right now. Everyone wanting it counts
   * most, then streaming on a service someone has, then fitting tonight's mood.
   */
  async pick(
    spaceId: string,
    viewerId: string,
    options: { mood?: WishMood; exclude?: string[] } = {},
  ): Promise<SpaceWishPick> {
    const { items } = await this.list(spaceId, viewerId);
    const exclude = new Set(options.exclude ?? []);
    const pool = items.filter((item) => !item.watched && !exclude.has(item.media.id));
    const moodGenres = new Set(options.mood ? MOOD_GENRES[options.mood] : []);
    const fitsMood = (item: SpaceWishItem) =>
      item.media.genres.some((genre) => moodGenres.has(genre));
    const score = (item: SpaceWishItem) =>
      (item.wantedByAll ? 4 : item.wantedBy.length) +
      (item.availability.onSpaceServices ? 3 : item.availability.state === 'AVAILABLE' ? 1 : 0) +
      (fitsMood(item) ? 2 : 0);
    const best = [...pool].sort((left, right) => score(right) - score(left))[0] ?? null;
    if (!best) return { item: null, reasons: [], remaining: 0 };

    const reasons: string[] = [];
    if (best.wantedByAll) {
      reasons.push(best.wantedBy.length === 2 ? '둘 다 보고 싶어 해요' : '모두 보고 싶어 해요');
    }
    if (best.availability.onSpaceServices) reasons.push('구독 중인 OTT에서 볼 수 있어요');
    else if (best.availability.state === 'NO_OFFERS') reasons.push('지금은 볼 수 있는 곳이 없어요');
    if (options.mood && fitsMood(best)) reasons.push('오늘 기분에 맞아요');
    return { item: best, reasons, remaining: pool.length - 1 };
  }

  /**
   * When each title was last recorded in the space. Uses the record's creation time, not the
   * share time: editing an old record (adding a photo) re-saves its share and must not mark a
   * title someone wants to rewatch as watched.
   */
  private async lastRecordedInSpace(spaceId: string, mediaIds: string[]) {
    if (!mediaIds.length) return new Map<string, Date>();
    const shares = await this.shares.find({
      where: {
        spaceId,
        revokedAt: IsNull(),
        diary: { mediaId: In(mediaIds), deletedAt: IsNull() },
      },
      relations: { diary: true },
    });
    const latest = new Map<string, Date>();
    for (const share of shares) {
      const mediaId = share.diary.mediaId;
      const recordedAt = share.diary.createdAt;
      const current = latest.get(mediaId);
      if (recordedAt && (!current || recordedAt > current)) latest.set(mediaId, recordedAt);
    }
    return latest;
  }

  private async availabilityFor(
    mediaId: string,
    known: ReadonlyMap<string, AvailabilityResponse>,
    spaceServices: ReadonlySet<string>,
    mayRefresh: () => boolean,
  ): Promise<SpaceWishItem['availability']> {
    try {
      let current: Pick<AvailabilityResponse, 'state' | 'offers'> = known.get(mediaId) ?? {
        state: 'UNKNOWN',
        offers: [],
      };
      if ((current.state === 'UNKNOWN' || current.state === 'EXPIRED') && mayRefresh()) {
        current = await this.availability.refresh(mediaId, REGION);
      }
      const services = [
        ...new Set(
          current.offers
            .filter((offer) => SUBSCRIPTION_OFFER_TYPES.has(offer.offerType))
            .map((offer) => ottServiceForProvider(offer.provider))
            .filter((key): key is OttServiceKey => key !== null),
        ),
      ];
      return {
        state:
          current.state === 'AVAILABLE' || current.state === 'NO_OFFERS'
            ? current.state
            : 'UNKNOWN',
        services,
        onSpaceServices: services.some((service) => spaceServices.has(service)),
      };
    } catch {
      return { state: 'UNKNOWN', services: [], onSpaceServices: false };
    }
  }
}
