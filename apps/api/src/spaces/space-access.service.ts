import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SpaceMembershipEntity } from '../database/entities';

const spaceNotFound = () =>
  new NotFoundException({
    statusCode: 404,
    code: 'SPACE_NOT_FOUND',
    message: '공간을 찾을 수 없어요.',
  });

@Injectable()
export class SpaceAccessService {
  constructor(
    @InjectRepository(SpaceMembershipEntity)
    private readonly memberships: Repository<SpaceMembershipEntity>,
  ) {}

  async isActiveMemberOfAny(
    spaceIds: string[],
    accountId: string,
    repository = this.memberships,
  ) {
    const uniqueSpaceIds = [...new Set(spaceIds)];
    if (!uniqueSpaceIds.length) return false;
    return Boolean(
      await repository.findOne({
        where: {
          spaceId: In(uniqueSpaceIds),
          accountId,
          status: 'ACTIVE',
        },
      }),
    );
  }

  async activeMembersInSpaces(
    spaceIds: string[],
    repository = this.memberships,
  ) {
    const uniqueSpaceIds = [...new Set(spaceIds)];
    if (!uniqueSpaceIds.length) return [];
    return repository.find({
      where: { spaceId: In(uniqueSpaceIds), status: 'ACTIVE' },
    });
  }

  async assertActiveMember(
    spaceId: string,
    accountId: string,
    repository = this.memberships,
  ) {
    const membership = await repository.findOne({
      where: { spaceId, accountId, status: 'ACTIVE' },
    });
    if (!membership) throw spaceNotFound();
    return membership;
  }

  async assertActiveMembers(
    spaceId: string,
    accountIds: string[],
    repository = this.memberships,
  ) {
    return this.assertAccountsInEverySpace([spaceId], accountIds, repository);
  }

  async assertAccountsInEverySpace(
    spaceIds: string[],
    accountIds: string[],
    repository = this.memberships,
  ) {
    const uniqueSpaceIds = [...new Set(spaceIds)];
    const uniqueAccountIds = [...new Set(accountIds)];
    if (!uniqueSpaceIds.length || !uniqueAccountIds.length) return [];

    const active = await repository.find({
      where: {
        spaceId: In(uniqueSpaceIds),
        accountId: In(uniqueAccountIds),
        status: 'ACTIVE',
      },
    });
    const activePairs = new Set(
      active.map(
        (membership) => `${membership.spaceId}:${membership.accountId}`,
      ),
    );
    const missing = uniqueSpaceIds.some((spaceId) =>
      uniqueAccountIds.some(
        (accountId) => !activePairs.has(`${spaceId}:${accountId}`),
      ),
    );
    if (missing) throw spaceNotFound();
    return active;
  }
}
