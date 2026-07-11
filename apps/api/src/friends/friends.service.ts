import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FriendshipEntity, UserEntity } from '../database/entities';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FriendsService {
  constructor(@InjectRepository(FriendshipEntity) private readonly friendships: Repository<FriendshipEntity>, @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>, private readonly notifications: NotificationsService) {}
  async request(requesterId: string, receiverId: string) {
    if (requesterId === receiverId) throw new BadRequestException('자기 자신에게 친구 요청을 보낼 수 없습니다.');
    if (!(await this.users.findOne({ where: { id: receiverId } }))) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    const existing = await this.findPair(requesterId, receiverId);
    if (existing && existing.status !== 'REJECTED') throw new ConflictException('이미 친구이거나 처리 중인 요청이 있습니다.');
    const pairKey = [requesterId, receiverId].sort().join(':');
    if (existing) {
      existing.requesterId = requesterId;
      existing.receiverId = receiverId;
      existing.pairKey = pairKey;
      existing.status = 'PENDING';
      const saved = await this.friendships.save(existing);
      await this.notifications.notifyFriendRequested({ recipientId: receiverId, actorId: requesterId });
      return saved;
    }
    try {
      const saved = await this.friendships.save(this.friendships.create({ requesterId, receiverId, pairKey, status: 'PENDING' }));
      await this.notifications.notifyFriendRequested({ recipientId: receiverId, actorId: requesterId });
      return saved;
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new ConflictException('이미 친구이거나 처리 중인 요청이 있습니다.');
      throw error;
    }
  }
  async respond(id: string, userId: string, status: 'ACCEPTED' | 'REJECTED') {
    const row = await this.friendships.findOne({ where: { id } });
    if (!row) throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    if (row.receiverId !== userId || row.status !== 'PENDING') throw new ForbiddenException('이 요청을 처리할 권한이 없습니다.');
    row.status = status;
    const saved = await this.friendships.save(row); if (status === 'ACCEPTED') await this.notifications.notifyFriendAccepted({ recipientId: row.requesterId, actorId: userId }); return saved;
  }
  async cancel(id: string, userId: string) {
    const row = await this.friendships.findOne({ where: { id } });
    if (!row) throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    if (row.requesterId !== userId || row.status !== 'PENDING') throw new ForbiddenException('이 요청을 취소할 권한이 없습니다.');
    await this.friendships.delete({ id }); return { id, deleted: true };
  }
  async remove(id: string, userId: string) {
    const row = await this.friendships.findOne({ where: { id } });
    if (!row) throw new NotFoundException('친구 관계를 찾을 수 없습니다.');
    if (row.status !== 'ACCEPTED' || (row.requesterId !== userId && row.receiverId !== userId)) throw new ForbiddenException('친구 관계를 삭제할 권한이 없습니다.');
    await this.friendships.delete({ id }); return { id, deleted: true };
  }
  async list(userId: string) {
    const rows = await this.friendships.find({ where: [{ requesterId: userId }, { receiverId: userId }], relations: { requester: true, receiver: true }, order: { updatedAt: 'DESC' } });
    const view = rows.map((row) => ({ id: row.id, status: row.status, direction: row.requesterId === userId ? 'SENT' : 'RECEIVED', user: this.userView(row.requesterId === userId ? row.receiver : row.requester) }));
    return { friends: view.filter((x) => x.status === 'ACCEPTED'), received: view.filter((x) => x.status === 'PENDING' && x.direction === 'RECEIVED'), sent: view.filter((x) => x.status === 'PENDING' && x.direction === 'SENT') };
  }
  async search(userId: string, q: string) {
    const query = q.trim(); if (query.length < 2) return { items: [] };
    const users = await this.users.find({ where: [{ nickname: ILike(`%${query}%`) }, { email: ILike(`%${query}%`) }], take: 10 });
    return { items: users.filter((x) => x.id !== userId).map((x) => this.userView(x)) };
  }
  private findPair(a: string, b: string) { return this.friendships.findOne({ where: [{ requesterId: a, receiverId: b }, { requesterId: b, receiverId: a }] }); }
  private userView(user: UserEntity) { return { id: user.id, nickname: user.nickname, profileImageUrl: user.profileImageUrl ?? null }; }
}
