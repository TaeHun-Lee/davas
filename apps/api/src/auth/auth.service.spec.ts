import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InviteCodeEntity, InviteUseEntity, UserEntity } from '../database/entities';
import { CURRENT_PRIVACY_VERSION, CURRENT_TERMS_VERSION } from '@davas/shared';

const legal = { termsAccepted: true as const, termsVersion: CURRENT_TERMS_VERSION, privacyVersion: CURRENT_PRIVACY_VERSION };

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

class FakeInviteRepository {
  invite = { id: 'invite-1', code: 'DAVAS-TEST', maxUses: 10, usedCount: 0, expiresAt: new Date(Date.now() + 86400000) };
  async findOne({ where }: { where: { code: string } }) { return where.code === this.invite.code ? this.invite : null; }
  async save(invite: typeof this.invite) { this.invite = invite; return invite; }
  create(input: object) { return input; }
}

class FakeInviteUseRepository { rows: object[] = []; create(input: object) { return input; } async save(input: object) { this.rows.push(input); return input; } }

class SerializedDataSource {
  isInitialized = true;
  private tail = Promise.resolve();
  constructor(private readonly users: FakeUserRepository, private readonly invites: FakeInviteRepository, private readonly uses: FakeInviteUseRepository) {}
  async transaction<T>(work: (manager: { getRepository(entity: unknown): unknown }) => Promise<T>) {
    let release!: () => void;
    const previous = this.tail;
    this.tail = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    try { return await work({ getRepository: (entity) => entity === UserEntity ? this.users : entity === InviteCodeEntity ? this.invites : entity === InviteUseEntity ? this.uses : null }); }
    finally { release(); }
  }
}

describe('AuthService', () => {
  let users: FakeUserRepository;
  let service: AuthService;

  beforeEach(() => {
    users = new FakeUserRepository();
    service = new AuthService(users as never, new FakeJwtService() as never, new FakeInviteRepository() as never, new FakeInviteUseRepository() as never);
  });

  it('registers a new user with a hashed password and returns a token', async () => {
    const result = await service.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'USER@Example.com', nickname: 'cinephile', password: 'password123' });

    assert.equal(result.user.email, 'user@example.com');
    assert.equal(result.user.nickname, 'cinephile');
    assert.notEqual(users.users[0].passwordHash, 'password123');
    assert.match(result.accessToken, /^signed:/);
  });

  it('rejects duplicate email or nickname during signup', async () => {
    await service.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'user@example.com', nickname: 'cinephile', password: 'password123' });

    await assert.rejects(
      () => service.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'user@example.com', nickname: 'other', password: 'password123' }),
      ConflictException,
    );
  });

  it('logs in with valid credentials and rejects invalid passwords', async () => {
    await service.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'user@example.com', nickname: 'cinephile', password: 'password123' });

    const login = await service.login({ email: 'USER@example.com', password: 'password123' });
    assert.equal(login.user.email, 'user@example.com');
    assert.match(login.accessToken, /^signed:/);

    await assert.rejects(() => service.login({ email: 'user@example.com', password: 'wrong-password' }), UnauthorizedException);
  });

  it('blocks login and authenticated session checks while deletion is pending', async () => {
    await service.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'pending@example.com', nickname: 'pending', password: 'password123' });
    users.users[0].status = 'DELETION_PENDING';
    const token = new FakeJwtService().sign({ sub: users.users[0].id });

    await assert.rejects(
      () => service.login({ email: 'pending@example.com', password: 'password123' }),
      UnauthorizedException,
    );
    const jwt = {
      ...new FakeJwtService(),
      verify() { return { sub: users.users[0].id }; },
    };
    const sessionService = new AuthService(users as never, jwt as never, new FakeInviteRepository() as never, new FakeInviteUseRepository() as never);
    await assert.rejects(() => sessionService.findMe(token), UnauthorizedException);
  });

  it('rejects signup without a valid invite code', async () => {
    await assert.rejects(() => service.signup({ ...legal, email: 'new@example.com', nickname: 'newbie', password: 'password123' }), BadRequestException);
  });

  it('serializes concurrent use of a single-use invite', async () => {
    const inviteRepository = new FakeInviteRepository();
    inviteRepository.invite.maxUses = 1;
    const uses = new FakeInviteUseRepository();
    const transactional = new AuthService(users as never, new FakeJwtService() as never, inviteRepository as never, uses as never, undefined, undefined, undefined, new SerializedDataSource(users, inviteRepository, uses) as never);
    const results = await Promise.allSettled([
      transactional.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'one@example.com', nickname: 'one', password: 'password123' }),
      transactional.signup({ ...legal, inviteCode: 'DAVAS-TEST', email: 'two@example.com', nickname: 'two', password: 'password123' }),
    ]);
    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected' && result.reason instanceof ConflictException).length, 1);
    assert.equal(inviteRepository.invite.usedCount, 1);
    assert.equal(uses.rows.length, 1);
  });
});
