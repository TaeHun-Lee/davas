import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity, WatchlistItemEntity } from '../database/entities';

@Injectable()
export class WatchlistService {
  constructor(@InjectRepository(WatchlistItemEntity) private readonly items: Repository<WatchlistItemEntity>, @InjectRepository(MediaEntity) private readonly media: Repository<MediaEntity>) {}
  async create(userId: string, mediaId: string) {
    if (!(await this.media.findOne({ where: { id: mediaId } }))) throw new NotFoundException('작품을 찾을 수 없습니다.');
    if (await this.items.findOne({ where: { userId, mediaId } })) throw new ConflictException('이미 보고 싶은 목록에 있는 작품입니다.');
    try { return await this.items.save(this.items.create({ userId, mediaId, priority: 'MEDIUM', memo: '', plannedWith: '', status: 'ACTIVE' })); }
    catch (error) { if ((error as { code?: string }).code === '23505') throw new ConflictException('이미 보고 싶은 목록에 있는 작품입니다.'); throw error; }
  }
  async list(userId: string, status?: 'ACTIVE' | 'WATCHED') { const rows = await this.items.find({ where: { userId, ...(status ? { status } : {}) }, relations: { media: true }, order: { createdAt: 'DESC' } }); return { items: rows.map((x) => this.view(x)) }; }
  async update(userId: string, id: string, input: Partial<Pick<WatchlistItemEntity, 'priority' | 'memo' | 'plannedWith' | 'status'>>) { const row = await this.owned(userId, id); if (input.priority) row.priority = input.priority; if (input.memo !== undefined) row.memo = input.memo.trim().slice(0, 500); if (input.plannedWith !== undefined) row.plannedWith = input.plannedWith.trim().slice(0, 120); if (input.status) row.status = input.status; return this.view(await this.items.save(row)); }
  async remove(userId: string, id: string) { await this.owned(userId, id); await this.items.delete({ id, userId }); return { id, deleted: true }; }
  async complete(userId: string, id: string) { return this.update(userId, id, { status: 'WATCHED' }); }
  private async owned(userId: string, id: string) { const row = await this.items.findOne({ where: { id, userId }, relations: { media: true } }); if (!row) throw new NotFoundException('보고 싶은 항목을 찾을 수 없습니다.'); return row; }
  private view(x: WatchlistItemEntity) { return { id: x.id, mediaId: x.mediaId, priority: x.priority, memo: x.memo, plannedWith: x.plannedWith, status: x.status, createdAt: x.createdAt.toISOString(), updatedAt: x.updatedAt.toISOString(), media: x.media ? { id: x.media.id, title: x.media.title, posterUrl: x.media.posterUrl, releaseDate: x.media.releaseDate, mediaType: x.media.mediaType } : null }; }
}
