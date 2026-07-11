import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactionEmoji } from '@davas/shared';
import { Repository } from 'typeorm';
import { DiaryEntity, DiaryReactionEntity } from '../database/entities';
import { DiaryAccessService } from '../diaries/diary-access.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReactionsService {
  constructor(@InjectRepository(DiaryReactionEntity) private readonly reactions: Repository<DiaryReactionEntity>, @InjectRepository(DiaryEntity) private readonly diaries: Repository<DiaryEntity>, private readonly access: DiaryAccessService, private readonly notifications: NotificationsService) {}
  async list(diaryId: string, userId: string) { const diary = await this.diary(diaryId, userId); const rows = await this.reactions.find({ where: { diaryId } }); return { diaryId: diary.id, items: rows.map((x) => ({ id: x.id, emoji: x.emoji, userId: x.userId, isMine: x.userId === userId })) }; }
  async add(diaryId: string, userId: string, emoji: ReactionEmoji) { const diary = await this.diary(diaryId, userId); const existing = await this.reactions.findOne({ where: { diaryId, userId, emoji } }); if (existing) return existing; const saved = await this.reactions.save(this.reactions.create({ diaryId, userId, emoji })); await this.notifications.notifyDiaryLiked({ diaryId, recipientId: diary.userId, actorId: userId }); return saved; }
  async remove(diaryId: string, userId: string, emoji: ReactionEmoji) { await this.diary(diaryId, userId); await this.reactions.delete({ diaryId, userId, emoji }); return { diaryId, emoji, deleted: true }; }
  private async diary(id: string, viewerId: string) { const row = await this.diaries.findOne({ where: { id } }); if (!row) throw new NotFoundException('기록을 찾을 수 없습니다.'); await this.access.assertCanView(row, viewerId); return row; }
}
