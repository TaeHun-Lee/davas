import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities';
import { UsersService } from './users.service';

type SavedUser = UserEntity & { id: string };

class FakeUserRepository {
  users: SavedUser[] = [];

  async findOne({ where }: { where: Partial<UserEntity>[] | Partial<UserEntity> }) {
    const conditions = Array.isArray(where) ? where : [where];
    return (
      this.users.find((user) =>
        conditions.some((condition) =>
          Object.entries(condition).every(([key, value]) => user[key as keyof SavedUser] === value),
        ),
      ) ?? null
    );
  }

  async save(user: UserEntity) {
    const existingIndex = this.users.findIndex((saved) => saved.id === (user as SavedUser).id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...user } as SavedUser;
      return this.users[existingIndex];
    }
    const saved = { ...user, id: `user-${this.users.length + 1}` } as SavedUser;
    this.users.push(saved);
    return saved;
  }
}

class FakeJwtService {
  verify(token: string) {
    if (token !== 'valid-token') throw new Error('bad token');
    return { sub: 'user-1' };
  }
}

describe('UsersService', () => {
  let users: FakeUserRepository;
  let service: UsersService;

  beforeEach(() => {
    users = new FakeUserRepository();
    users.users.push({
      id: 'user-1',
      email: 'me@example.com',
      nickname: 'before',
      passwordHash: 'hash',
      profileImageUrl: null,
      bio: null,
      preferredGenres: [],
      diaries: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    service = new UsersService(users as never, new FakeJwtService() as unknown as JwtService);
  });

  it('updates the authenticated profile without changing immutable fields', async () => {
    const result = await service.updateMe('valid-token', { nickname: ' after ', bio: ' hello ', preferredGenres: ['SF', 'Drama'] });

    assert.equal(result.nickname, 'after');
    assert.equal(result.email, 'me@example.com');
    assert.equal(result.bio, 'hello');
    assert.deepEqual(result.preferredGenres, ['SF', 'Drama']);
  });

  it('rejects duplicate nicknames when updating the profile', async () => {
    users.users.push({ ...users.users[0], id: 'user-2', email: 'other@example.com', nickname: 'taken' });

    await assert.rejects(() => service.updateMe('valid-token', { nickname: 'taken' }), ConflictException);
  });

  it('stores the authenticated profile image URL', async () => {
    const result = await service.updateProfileImage('valid-token', '/uploads/profile-images/user-1.png');

    assert.equal(result.profileImageUrl, '/uploads/profile-images/user-1.png');
  });

  it('rejects missing or invalid auth tokens', async () => {
    await assert.rejects(() => service.updateMe(undefined, { nickname: 'new' }), UnauthorizedException);
    await assert.rejects(() => service.updateProfileImage('bad-token', '/uploads/profile-images/x.png'), UnauthorizedException);
  });
});
