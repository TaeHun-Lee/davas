import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../database/entities';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

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

  async update(where: { id: string }, patch: Partial<UserEntity>) {
    const user = this.users.find((candidate) => candidate.id === where.id);
    if (user) Object.assign(user, patch);
    return { affected: user ? 1 : 0 };
  }
}

class FakeJwtService {
  verify(token: string) {
    if (token !== 'valid-token') throw new Error('bad token');
    return { sub: 'user-1' };
  }
}

class FakeLifecycleDataSource {
  isInitialized = true;
  statements: Array<{ sql: string; params: unknown[] }> = [];
  due: Array<{ id: string; profileImageUrl: string | null }> = [];
  constructor(private readonly users: FakeUserRepository) {}

  async query(sql: string, params: unknown[]) {
    this.statements.push({ sql, params });
    if (sql.includes('FROM "user_consents"')) return [{ termsVersion: 'v1' }];
    if (sql.includes('FROM "space_memberships"')) return [{ spaceId: 'space-1', role: 'MEMBER' }];
    if (sql.includes('FROM "diaries"')) return [{ id: 'watch-1', contentId: 'media-1' }];
    if (sql.includes('FROM "watch_participants"')) return [{ watchEventId: 'watch-1', status: 'CONFIRMED' }];
    if (sql.includes('FROM "watch_reactions"')) return [{ watchEventId: 'watch-1', ratingScale: 8, reviewText: 'mine' }];
    if (sql.includes('FROM "watch_sources"')) return [{ watchEventId: 'watch-1', kind: 'OTT' }];
    if (sql.includes('FROM "notification_preferences"')) return [{ category: 'SOCIAL', enabled: false }];
    return [];
  }

  async transaction<T>(work: (manager: { getRepository(entity: unknown): unknown; query(sql: string, params: unknown[]): Promise<unknown[]> }) => Promise<T>) {
    const manager = {
      getRepository: (entity: unknown) => {
        assert.equal(entity, UserEntity);
        return this.users;
      },
      query: async (sql: string, params: unknown[]) => {
        this.statements.push({ sql, params });
        if (sql.startsWith('SELECT "id", "profile_image_url"')) return this.due;
        return [];
      },
    };
    return work(manager);
  }

  getRepository() {
    return { save: async (input: unknown) => input };
  }
}

class FakeOutbox {
  calls: Array<{ manager: unknown; input: Record<string, unknown>; kind: string }> = [];
  async enqueueNotification(manager: unknown, input: Record<string, unknown>) {
    this.calls.push({ manager, input, kind: 'notification' });
    return input;
  }
  async enqueue(manager: unknown, input: Record<string, unknown>) {
    this.calls.push({ manager, input, kind: 'event' });
    return input;
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
      status: 'ACTIVE',
      deletionRequestedAt: null,
      deletionScheduledFor: null,
      anonymizedAt: null,
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

  it('stores and deletes the authenticated profile image URL', async () => {
    const stored = await service.updateProfileImage('valid-token', '/uploads/profile-images/user-1.png');

    assert.equal(stored.profileImageUrl, '/uploads/profile-images/user-1.png');

    const deleted = await service.deleteProfileImage('valid-token');

    assert.equal(deleted.profileImageUrl, null);
  });

  it('rejects missing or invalid auth tokens', async () => {
    await assert.rejects(() => service.updateMe(undefined, { nickname: 'new' }), UnauthorizedException);
    await assert.rejects(() => service.updateProfileImage('bad-token', '/uploads/profile-images/x.png'), UnauthorizedException);
  });

  it('exports only the authenticated account through explicitly scoped queries', async () => {
    const dataSource = new FakeLifecycleDataSource(users);
    const lifecycle = new UsersService(users as never, new FakeJwtService() as unknown as JwtService, dataSource as never);
    const result = await lifecycle.exportMe('valid-token', new Date('2026-08-13T00:00:00.000Z'));

    assert.equal(result.account.id, 'user-1');
    assert.equal(result.account.email, 'me@example.com');
    assert.equal('passwordHash' in result.account, false);
    assert.equal(result.reactions[0].reviewText, 'mine');
    assert.equal(dataSource.statements.length, 7);
    assert.ok(dataSource.statements.every((statement) => statement.params[0] === 'user-1'));
    await assert.rejects(() => lifecycle.exportMe('bad-token'), UnauthorizedException);
  });

  it('requests deletion with a grace period and can recover before expiry', async () => {
    users.users[0].passwordHash = await bcrypt.hash('password123', 4);
    const dataSource = new FakeLifecycleDataSource(users);
    const outbox = new FakeOutbox();
    const lifecycle = new UsersService(users as never, new FakeJwtService() as unknown as JwtService, dataSource as never, outbox as never);
    const requestedAt = new Date('2026-08-13T00:00:00.000Z');

    const pending = await lifecycle.requestDeletion('valid-token', 'password123', requestedAt);
    assert.equal(pending.status, 'DELETION_PENDING');
    assert.equal(pending.deletionScheduledFor, '2026-09-12T00:00:00.000Z');
    assert.equal(users.users[0].status, 'DELETION_PENDING');
    assert.equal(outbox.calls[0].kind, 'notification');

    const recovered = await lifecycle.cancelDeletion('ME@EXAMPLE.COM', 'password123', new Date('2026-08-20T00:00:00.000Z'));
    assert.equal(recovered.status, 'ACTIVE');
    assert.equal(users.users[0].status, 'ACTIVE');
    assert.equal(users.users[0].deletionScheduledFor, null);

    const legacyDelete = await lifecycle.deleteMe('valid-token', 'password123');
    assert.equal(legacyDelete.status, 'DELETION_PENDING');
    assert.equal(users.users[0].status, 'DELETION_PENDING');
  });

  it('anonymizes expired accounts while preserving shared watch facts', async () => {
    const dataSource = new FakeLifecycleDataSource(users);
    dataSource.due = [{ id: 'user-1', profileImageUrl: null }];
    const outbox = new FakeOutbox();
    const lifecycle = new UsersService(users as never, new FakeJwtService() as unknown as JwtService, dataSource as never, outbox as never);

    const result = await lifecycle.purgeExpiredDeletions(new Date('2026-09-13T00:00:00.000Z'));
    const sql = dataSource.statements.map((statement) => statement.sql).join('\n');
    assert.equal(result.purged, 1);
    assert.match(sql, /FOR UPDATE SKIP LOCKED/);
    assert.match(sql, /UPDATE "diaries" d SET "title" = '공동 감상 기록'/);
    assert.match(sql, /watch_event_shares/);
    assert.match(sql, /watch_participants/);
    assert.match(sql, /DELETE FROM "watch_reactions"/);
    assert.match(sql, /UPDATE "watch_sources" ws SET "place_text" = NULL/);
    assert.equal(users.users[0].status, 'DELETED');
    assert.equal(users.users[0].email, 'deleted-user-1@deleted.invalid');
    assert.equal(outbox.calls.at(-1)?.kind, 'event');
  });
});
