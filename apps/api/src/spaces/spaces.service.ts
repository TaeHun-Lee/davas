import { createHash, randomBytes } from 'node:crypto';
import type { SpaceInviteInspection, SpaceView } from '@davas/shared';
import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  SpaceEntity,
  SpaceInviteEntity,
  SpaceMembershipEntity,
} from '../database/entities';
import { TransactionOutboxService } from '../outbox/transaction-outbox.service';
import { SpaceAccessService } from './space-access.service';
import { CreateSpaceDto, CreateSpaceInviteDto } from './spaces.dto';

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
const response = (statusCode: number, code: string, message: string) => ({
  statusCode,
  code,
  message,
});

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(SpaceEntity)
    private readonly spaces: Repository<SpaceEntity>,
    @InjectRepository(SpaceMembershipEntity)
    private readonly memberships: Repository<SpaceMembershipEntity>,
    @InjectRepository(SpaceInviteEntity)
    private readonly invites: Repository<SpaceInviteEntity>,
    private readonly access: SpaceAccessService,
    private readonly outbox: TransactionOutboxService,
    private readonly dataSource: DataSource,
  ) {}

  async create(accountId: string, dto: CreateSpaceDto) {
    return this.dataSource.transaction(async (manager) => {
      const spaces = manager.getRepository(SpaceEntity);
      const memberships = manager.getRepository(SpaceMembershipEntity);
      const space = await spaces.save(
        spaces.create({
          name: dto.name.trim(),
          status: 'ACTIVE',
          maxMembers: dto.maxMembers ?? 5,
          ownerAccountId: accountId,
          closedAt: null,
        }),
      );
      const membership = await memberships.save(
        memberships.create({
          spaceId: space.id,
          accountId,
          role: 'OWNER',
          status: 'ACTIVE',
          joinedAt: new Date(),
          leftAt: null,
        }),
      );
      return this.spaceView(space, [membership]);
    });
  }

  async list(accountId: string): Promise<{ items: SpaceView[] }> {
    const memberships = await this.memberships.find({
      where: { accountId, status: 'ACTIVE' },
      order: { joinedAt: 'DESC' },
    });
    const items = [];
    for (const membership of memberships) {
      const space = await this.spaces.findOne({
        where: { id: membership.spaceId, status: 'ACTIVE' },
        relations: { memberships: { account: true } },
      });
      if (space) {
        items.push(
          this.spaceView(
            space,
            (space.memberships ?? []).filter(
              (candidate) => candidate.status === 'ACTIVE',
            ),
          ),
        );
      }
    }
    return { items };
  }

  async get(spaceId: string, accountId: string) {
    await this.access.assertActiveMember(spaceId, accountId);
    const space = await this.spaces.findOne({
      where: { id: spaceId, status: 'ACTIVE' },
      relations: { memberships: { account: true } },
    });
    if (!space) throw this.notFound();
    return this.spaceView(
      space,
      (space.memberships ?? []).filter(
        (membership) => membership.status === 'ACTIVE',
      ),
    );
  }

  async createInvite(
    spaceId: string,
    accountId: string,
    dto: CreateSpaceInviteDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      await this.ownerMembershipOrNotFound(manager, spaceId, accountId);
      const token = randomBytes(32).toString('base64url');
      const expiresAt = new Date(
        Date.now() + (dto.expiresInHours ?? 168) * 60 * 60 * 1000,
      );
      const invites = manager.getRepository(SpaceInviteEntity);
      const invite = await invites.save(
        invites.create({
          spaceId,
          inviterAccountId: accountId,
          tokenHash: hashToken(token),
          expiresAt,
          usedAt: null,
          usedByAccountId: null,
          revokedAt: null,
        }),
      );
      await this.outbox.enqueue(manager, {
        eventType: 'SpaceInviteIssued',
        aggregateType: 'Space',
        aggregateId: spaceId,
        idempotencyKey: `space-invite-issued:${invite.id}`,
        payload: {
          spaceId,
          inviteId: invite.id,
          inviterAccountId: accountId,
          expiresAt: expiresAt.toISOString(),
        },
      });
      return { id: invite.id, token, expiresAt: expiresAt.toISOString() };
    });
  }

  async inspectInvite(
    token: string,
    viewerAccountId?: string,
  ): Promise<SpaceInviteInspection> {
    const invite = await this.invites.findOne({
      where: { tokenHash: hashToken(token) },
      relations: { space: true, inviter: true },
    });
    if (!invite) return { status: 'INVALID' as const };
    if (invite.revokedAt) return { status: 'CANCELLED' as const };
    if (invite.usedAt) return { status: 'USED' as const };
    if (invite.expiresAt.getTime() <= Date.now())
      return { status: 'EXPIRED' as const };
    if (!invite.space || invite.space.status !== 'ACTIVE')
      return { status: 'CLOSED' as const };
    if (viewerAccountId) {
      const membership = await this.memberships.findOne({
        where: {
          spaceId: invite.spaceId,
          accountId: viewerAccountId,
          status: 'ACTIVE',
        },
      });
      if (membership) return { status: 'ALREADY_MEMBER' as const };
    }
    return {
      status: 'VALID' as const,
      space: { id: invite.space.id, name: invite.space.name },
      inviter: {
        id: invite.inviterAccountId,
        nickname: invite.inviter?.nickname ?? '구성원',
        profileImageUrl: invite.inviter?.profileImageUrl ?? null,
      },
      expiresAt: invite.expiresAt.toISOString(),
    };
  }

  async acceptInvite(token: string, accountId: string) {
    return this.dataSource.transaction(async (manager) => {
      const invites = manager.getRepository(SpaceInviteEntity);
      const tokenHash = hashToken(token);
      const candidate = await invites.findOne({ where: { tokenHash } });
      this.assertUsableInvite(candidate);

      const spaces = manager.getRepository(SpaceEntity);
      const space = await spaces.findOne({
        where: { id: candidate!.spaceId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!space || space.status !== 'ACTIVE') {
        throw new GoneException(
          response(410, 'SPACE_CLOSED', '종료된 공간이에요.'),
        );
      }
      const invite = await invites.findOne({
        where: { tokenHash },
        lock: { mode: 'pessimistic_write' },
      });
      this.assertUsableInvite(invite);

      const memberships = manager.getRepository(SpaceMembershipEntity);
      const existing = await memberships.findOne({
        where: { spaceId: space.id, accountId },
      });
      if (existing?.status === 'ACTIVE') {
        throw new ConflictException(
          response(409, 'ALREADY_SPACE_MEMBER', '이미 참여 중인 공간이에요.'),
        );
      }

      const activeMemberCount = await memberships.count({
        where: { spaceId: space.id, status: 'ACTIVE' },
      });
      if (activeMemberCount >= space.maxMembers || activeMemberCount >= 5) {
        throw new ConflictException(
          response(409, 'SPACE_FULL', '공간 정원이 가득 찼어요.'),
        );
      }

      const joinedAt = new Date();
      const membership = existing
        ? Object.assign(existing, {
            role: 'MEMBER' as const,
            status: 'ACTIVE' as const,
            joinedAt,
            leftAt: null,
          })
        : memberships.create({
            spaceId: space.id,
            accountId,
            role: 'MEMBER',
            status: 'ACTIVE',
            joinedAt,
            leftAt: null,
          });
      await memberships.save(membership);
      invite!.usedAt = joinedAt;
      invite!.usedByAccountId = accountId;
      await invites.save(invite!);
      await this.outbox.enqueue(manager, {
        eventType: 'SpaceInviteAccepted',
        aggregateType: 'Space',
        aggregateId: space.id,
        idempotencyKey: `space-invite-accepted:${invite!.id}`,
        payload: {
          spaceId: space.id,
          inviteId: invite!.id,
          inviterAccountId: invite!.inviterAccountId,
          memberAccountId: accountId,
          acceptedAt: joinedAt.toISOString(),
        },
      });
      return { joined: true, spaceId: space.id, membershipId: membership.id };
    });
  }

  async cancelInvite(spaceId: string, inviteId: string, accountId: string) {
    return this.dataSource.transaction(async (manager) => {
      await this.ownerMembershipOrNotFound(manager, spaceId, accountId);
      const invites = manager.getRepository(SpaceInviteEntity);
      const invite = await invites.findOne({
        where: { id: inviteId, spaceId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!invite) throw this.notFound();
      if (invite.usedAt) {
        throw new ConflictException(
          response(409, 'SPACE_INVITE_USED', '이미 사용된 초대예요.'),
        );
      }
      if (!invite.revokedAt) {
        invite.revokedAt = new Date();
        await invites.save(invite);
      }
      return { id: invite.id, status: 'CANCELLED' as const };
    });
  }

  async transferOwnership(
    spaceId: string,
    accountId: string,
    newOwnerAccountId: string,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const space = await this.lockActiveSpace(manager, spaceId);
      const membershipRepository = manager.getRepository(SpaceMembershipEntity);
      const currentOwner = await this.access.assertActiveMember(
        spaceId,
        accountId,
        membershipRepository,
      );
      if (space.ownerAccountId !== accountId || currentOwner.role !== 'OWNER') {
        throw new ForbiddenException(
          response(
            403,
            'SPACE_OWNER_REQUIRED',
            '공간 소유자만 소유권을 이전할 수 있어요.',
          ),
        );
      }
      if (newOwnerAccountId === accountId)
        return this.spaceView(space, [currentOwner]);
      const newOwner = await membershipRepository.findOne({
        where: { spaceId, accountId: newOwnerAccountId, status: 'ACTIVE' },
        lock: { mode: 'pessimistic_write' },
      });
      if (!newOwner) throw this.notFound();

      currentOwner.role = 'MEMBER';
      await membershipRepository.save(currentOwner);
      newOwner.role = 'OWNER';
      await membershipRepository.save(newOwner);
      space.ownerAccountId = newOwnerAccountId;
      await manager.getRepository(SpaceEntity).save(space);
      return this.spaceView(space, [currentOwner, newOwner]);
    });
  }

  async leave(spaceId: string, accountId: string) {
    return this.dataSource.transaction(async (manager) => {
      const space = await this.lockActiveSpace(manager, spaceId);
      const membership = await this.access.assertActiveMember(
        spaceId,
        accountId,
        manager.getRepository(SpaceMembershipEntity),
      );
      if (space.ownerAccountId === accountId || membership.role === 'OWNER') {
        throw new ConflictException(
          response(
            409,
            'LAST_SPACE_OWNER',
            '소유권을 이전하거나 공간을 종료한 뒤 탈퇴해 주세요.',
          ),
        );
      }
      membership.status = 'LEFT';
      membership.leftAt = new Date();
      await manager.getRepository(SpaceMembershipEntity).save(membership);
      return { left: true, spaceId };
    });
  }

  async close(spaceId: string, accountId: string) {
    return this.dataSource.transaction(async (manager) => {
      const space = await this.lockActiveSpace(manager, spaceId);
      await this.ownerMembershipOrNotFound(manager, spaceId, accountId, space);
      const now = new Date();
      space.status = 'CLOSED';
      space.closedAt = now;
      await manager.getRepository(SpaceEntity).save(space);

      const memberships = await manager
        .getRepository(SpaceMembershipEntity)
        .find({ where: { spaceId, status: 'ACTIVE' } });
      for (const membership of memberships) {
        membership.status = 'LEFT';
        membership.leftAt = now;
      }
      if (memberships.length)
        await manager.getRepository(SpaceMembershipEntity).save(memberships);

      const invites = await manager
        .getRepository(SpaceInviteEntity)
        .find({ where: { spaceId } });
      const usableInvites = invites.filter(
        (invite) => !invite.usedAt && !invite.revokedAt,
      );
      for (const invite of usableInvites) invite.revokedAt = now;
      if (usableInvites.length)
        await manager.getRepository(SpaceInviteEntity).save(usableInvites);
      return { closed: true, spaceId, closedAt: now.toISOString() };
    });
  }

  private async lockActiveSpace(manager: EntityManager, spaceId: string) {
    const space = await manager.getRepository(SpaceEntity).findOne({
      where: { id: spaceId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!space || space.status !== 'ACTIVE') throw this.notFound();
    return space;
  }

  private async ownerMembershipOrNotFound(
    manager: EntityManager,
    spaceId: string,
    accountId: string,
    lockedSpace?: SpaceEntity,
  ) {
    const space = lockedSpace ?? (await this.lockActiveSpace(manager, spaceId));
    const membership = await this.access.assertActiveMember(
      spaceId,
      accountId,
      manager.getRepository(SpaceMembershipEntity),
    );
    if (space.ownerAccountId !== accountId || membership.role !== 'OWNER') {
      throw new ForbiddenException(
        response(403, 'SPACE_OWNER_REQUIRED', '공간 소유자 권한이 필요해요.'),
      );
    }
    return membership;
  }

  private assertUsableInvite(invite: SpaceInviteEntity | null) {
    if (!invite)
      throw new NotFoundException(
        response(404, 'SPACE_INVITE_NOT_FOUND', '초대를 찾을 수 없어요.'),
      );
    if (invite.revokedAt) {
      throw new GoneException(
        response(410, 'SPACE_INVITE_CANCELLED', '취소된 초대예요.'),
      );
    }
    if (invite.usedAt) {
      throw new ConflictException(
        response(409, 'SPACE_INVITE_USED', '이미 사용된 초대예요.'),
      );
    }
    if (invite.expiresAt.getTime() <= Date.now()) {
      throw new GoneException(
        response(410, 'SPACE_INVITE_EXPIRED', '만료된 초대예요.'),
      );
    }
  }

  private notFound() {
    return new NotFoundException(
      response(404, 'SPACE_NOT_FOUND', '공간을 찾을 수 없어요.'),
    );
  }

  private spaceView(
    space: SpaceEntity,
    memberships: SpaceMembershipEntity[],
  ): SpaceView {
    return {
      id: space.id,
      name: space.name,
      status: space.status,
      maxMembers: space.maxMembers,
      ownerAccountId: space.ownerAccountId,
      members: memberships.map((membership) => ({
        accountId: membership.accountId,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt?.toISOString(),
        nickname: membership.account?.nickname,
        profileImageUrl: membership.account?.profileImageUrl ?? null,
      })),
      createdAt: space.createdAt?.toISOString(),
    };
  }
}
