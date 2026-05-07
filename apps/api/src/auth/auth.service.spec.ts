import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../database/entities';

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

  create(data: Partial<UserEntity>) {
    return data as UserEntity;
  }

  async save(user: UserEntity) {
    const saved = { ...user, id: `user-${this.users.length + 1}` } as SavedUser;
    this.users.push(saved);
    return saved;
  }
}

class FakeJwtService {
  sign(payload: object) {
    return `signed:${JSON.stringify(payload)}`;
  }
}

describe('AuthService', () => {
  let users: FakeUserRepository;
  let service: AuthService;

  beforeEach(() => {
    users = new FakeUserRepository();
    service = new AuthService(users as never, new FakeJwtService() as never);
  });

  it('registers a new user with a hashed password and returns a token', async () => {
    const result = await service.signup({ email: 'USER@Example.com', nickname: 'cinephile', password: 'password123' });

    assert.equal(result.user.email, 'user@example.com');
    assert.equal(result.user.nickname, 'cinephile');
    assert.notEqual(users.users[0].passwordHash, 'password123');
    assert.match(result.accessToken, /^signed:/);
  });

  it('rejects duplicate email or nickname during signup', async () => {
    await service.signup({ email: 'user@example.com', nickname: 'cinephile', password: 'password123' });

    await assert.rejects(
      () => service.signup({ email: 'user@example.com', nickname: 'other', password: 'password123' }),
      ConflictException,
    );
  });

  it('logs in with valid credentials and rejects invalid passwords', async () => {
    await service.signup({ email: 'user@example.com', nickname: 'cinephile', password: 'password123' });

    const login = await service.login({ email: 'USER@example.com', password: 'password123' });
    assert.equal(login.user.email, 'user@example.com');
    assert.match(login.accessToken, /^signed:/);

    await assert.rejects(() => service.login({ email: 'user@example.com', password: 'wrong-password' }), UnauthorizedException);
  });
});
