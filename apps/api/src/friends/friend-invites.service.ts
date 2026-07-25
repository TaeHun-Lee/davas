import { createHash, randomBytes } from 'node:crypto';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FriendInviteEntity, FriendshipEntity } from '../database/entities';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const error = (statusCode: number, code: string, message: string) => new HttpException({ statusCode, code, message }, statusCode);

@Injectable()
export class FriendInvitesService {
  constructor(
    @InjectRepository(FriendInviteEntity) private readonly invites: Repository<FriendInviteEntity>,
    @InjectRepository(FriendshipEntity) private readonly friendships: Repository<FriendshipEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(inviterId: string) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.invites.save(this.invites.create({ tokenHash: hashToken(token), inviterId, expiresAt, usedAt: null, usedByUserId: null, revokedAt: null }));
    return { token, expiresAt: expiresAt.toISOString() };
  }

  async inspect(token: string, viewerId?: string) {
    const invite = await this.invites.findOne({ where: { tokenHash: hashToken(token) }, relations: { inviter: true } });
    if (!invite || invite.revokedAt || invite.usedAt || invite.expiresAt.getTime() <= Date.now()) return { status: 'EXPIRED' as const };
    if (viewerId === invite.inviterId) return { status: 'SELF' as const, inviter: this.inviter(invite) };
    if (viewerId && await this.findPair(invite.inviterId, viewerId)) return { status: 'ALREADY_FRIENDS' as const, inviter: this.inviter(invite) };
    return { status: 'VALID' as const, inviter: this.inviter(invite), expiresAt: invite.expiresAt.toISOString() };
  }

  async accept(token: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const inviteRepository = manager.getRepository(FriendInviteEntity);
      const invite = await inviteRepository.findOne({ where: { tokenHash: hashToken(token) }, relations: { inviter: true }, lock: { mode: 'pessimistic_write' } });
      if (!invite || invite.revokedAt || invite.usedAt || invite.expiresAt.getTime() <= Date.now()) throw error(410, 'FRIEND_INVITE_EXPIRED', '초대 링크가 만료됐어요.');
      if (invite.inviterId === userId) throw error(400, 'FRIEND_INVITE_SELF', '내 초대 링크는 수락할 수 없어요.');
      const friendshipRepository = manager.getRepository(FriendshipEntity);
      const pairKey = [invite.inviterId, userId].sort().join(':');
      const existing = await friendshipRepository.findOne({ where: { pairKey } });
      if (existing?.status === 'ACCEPTED') throw new ConflictException({ statusCode: 409, code: 'ALREADY_FRIENDS', message: '이미 친구예요.' });
      if (existing) {
        existing.requesterId = invite.inviterId;
        existing.receiverId = userId;
        existing.status = 'ACCEPTED';
        await friendshipRepository.save(existing);
      } else {
        await friendshipRepository.save(friendshipRepository.create({ pairKey, requesterId: invite.inviterId, receiverId: userId, status: 'ACCEPTED' }));
      }
      invite.usedAt = new Date();
      invite.usedByUserId = userId;
      await inviteRepository.save(invite);
      return { connected: true, inviter: this.inviter(invite) };
    });
  }

  private findPair(a: string, b: string) { return this.friendships.findOne({ where: { pairKey: [a, b].sort().join(':') } }); }
  private inviter(invite: FriendInviteEntity) { return { id: invite.inviterId, nickname: invite.inviter?.nickname ?? '친구', profileImageUrl: invite.inviter?.profileImageUrl ?? null }; }
}
