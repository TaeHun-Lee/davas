import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity, WatchlistItemEntity } from '../database/entities';

/** The title sheet's "보고 싶어요" toggle: add a title to my list or take it off. */
@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(WatchlistItemEntity) private readonly items: Repository<WatchlistItemEntity>,
    @InjectRepository(MediaEntity) private readonly media: Repository<MediaEntity>,
  ) {}

  async create(userId: string, mediaId: string) {
    if (!(await this.media.findOne({ where: { id: mediaId } }))) {
      throw new NotFoundException('작품을 찾을 수 없습니다.');
    }
    if (await this.items.findOne({ where: { userId, mediaId } })) {
      throw new ConflictException('이미 보고 싶은 목록에 있는 작품입니다.');
    }
    try {
      return await this.items.save(
        this.items.create({
          userId,
          mediaId,
          priority: 'MEDIUM',
          memo: '',
          plannedWith: '',
          status: 'ACTIVE',
        }),
      );
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        throw new ConflictException('이미 보고 싶은 목록에 있는 작품입니다.');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    const row = await this.items.findOne({ where: { id, userId } });
    if (!row) throw new NotFoundException('보고 싶은 항목을 찾을 수 없습니다.');
    await this.items.delete({ id, userId });
    return { id, deleted: true };
  }
}
