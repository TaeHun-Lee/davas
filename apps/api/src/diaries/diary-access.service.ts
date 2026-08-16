import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  DiaryEntity,
  DiaryShareEntity,
  FriendshipEntity,
  WatchShareEntity,
} from '../database/entities';
import { SpaceAccessService } from '../spaces/space-access.service';

@Injectable()
export class DiaryAccessService {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendships: Repository<FriendshipEntity>,
    @InjectRepository(DiaryShareEntity)
    private readonly shares: Repository<DiaryShareEntity>,
    @InjectRepository(WatchShareEntity)
    private readonly spaceShares: Repository<WatchShareEntity>,
    private readonly spaceAccess: SpaceAccessService,
  ) {}

  async canView(
    diary: Pick<DiaryEntity, 'id' | 'userId' | 'visibility'>,
    viewerId: string,
  ): Promise<boolean> {
    if (diary.userId === viewerId) return true;
    const sharedSpaces = await this.spaceShares.find({
      where: { diaryId: diary.id, revokedAt: IsNull() },
    });
    const spaceIds = sharedSpaces.map((share) => share.spaceId);
    if (
      spaceIds.length > 0 &&
      (await this.spaceAccess.isActiveMemberOfAny(spaceIds, viewerId))
    ) {
      return true;
    }
    if (diary.visibility === 'PRIVATE') return false;
    if (diary.visibility === 'SELECTED') {
      return Boolean(
        await this.shares.findOne({
          where: { diaryId: diary.id, userId: viewerId },
        }),
      );
    }
    if (diary.visibility === 'FRIENDS') {
      const rows = await this.friendships.find({
        where: [
          {
            requesterId: diary.userId,
            receiverId: viewerId,
            status: 'ACCEPTED',
          },
          {
            requesterId: viewerId,
            receiverId: diary.userId,
            status: 'ACCEPTED',
          },
        ],
      });
      return rows.length > 0;
    }
    return false;
  }

  async assertCanView(
    diary: Pick<DiaryEntity, 'id' | 'userId' | 'visibility'> | null,
    viewerId: string,
  ) {
    if (!diary || !(await this.canView(diary, viewerId))) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'RECORD_NOT_FOUND',
        message: '기록을 찾을 수 없어요.',
      });
    }
  }

  async assertActiveSpaceMember(spaceId: string, accountId: string) {
    return this.spaceAccess.assertActiveMember(spaceId, accountId);
  }
}
