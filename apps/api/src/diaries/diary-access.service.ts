import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity, DiaryShareEntity, FriendshipEntity } from '../database/entities';

@Injectable()
export class DiaryAccessService {
  constructor(
    @InjectRepository(FriendshipEntity) private readonly friendships: Repository<FriendshipEntity>,
    @InjectRepository(DiaryShareEntity) private readonly shares: Repository<DiaryShareEntity>,
  ) {}

  async canView(diary: Pick<DiaryEntity, 'id' | 'userId' | 'visibility'>, viewerId: string): Promise<boolean> {
    if (diary.userId === viewerId) return true;
    if (diary.visibility === 'PRIVATE') return false;
    if (diary.visibility === 'SELECTED') {
      return Boolean(await this.shares.findOne({ where: { diaryId: diary.id, userId: viewerId } }));
    }
    if (diary.visibility === 'FRIENDS') {
      const rows = await this.friendships.find({ where: [{ requesterId: diary.userId, receiverId: viewerId, status: 'ACCEPTED' }, { requesterId: viewerId, receiverId: diary.userId, status: 'ACCEPTED' }] });
      return rows.length > 0;
    }
    return false;
  }

  async assertCanView(diary: Pick<DiaryEntity, 'id' | 'userId' | 'visibility'> | null, viewerId: string) {
    if (!diary || !(await this.canView(diary, viewerId))) {
      throw new NotFoundException({ statusCode: 404, code: 'RECORD_NOT_FOUND', message: '기록을 찾을 수 없어요.' });
    }
  }
}
