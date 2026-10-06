import assert from 'node:assert/strict';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, it } from 'node:test';
import { UserEntity } from '../database/entities';
import { UsersService } from './users.service';

type SavedUser = UserEntity & { id: string };

class FakeUserRepository {
  users: SavedUser[] = [];
  onRemove?: (user: UserEntity) => void;

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
      this.users[existingIndex] = {
        ...this.users[existingIndex],
        ...user,
      } as SavedUser;
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

  async remove(user: UserEntity) {
    this.onRemove?.(user);
    this.users = this.users.filter((saved) => saved.id !== (user as SavedUser).id);
    return user;
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
    if (sql.includes('FROM "watch_participants"'))
      return [{ watchEventId: 'watch-1', status: 'CONFIRMED' }];
    if (sql.includes('FROM "watch_reactions"'))
      return [{ watchEventId: 'watch-1', ratingScale: 8, reviewText: 'mine' }];
    if (sql.includes('FROM "watch_sources"')) return [{ watchEventId: 'watch-1', kind: 'OTT' }];
    if (sql.includes('FROM "notification_preferences"'))
      return [{ category: 'SOCIAL', enabled: false }];
    return [];
  }

  async transaction<T>(
    work: (manager: {
      getRepository(entity: unknown): unknown;
      query(sql: string, params: unknown[]): Promise<unknown[]>;
    }) => Promise<T>,
  ) {
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

  cleanupJobs: Array<Record<string, unknown>> = [];

  getRepository() {
    return {
      save: async (input: Record<string, unknown>) => {
        this.cleanupJobs.push(input);
        return input;
      },
    };
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
      ottServices: [],
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
    service = new UsersService(users as never);
  });

  it('updates the guard-authenticated profile without changing immutable fields', async () => {
    const result = await service.updateMe('user-1', {
      nickname: ' after ',
      bio: ' hello ',
      preferredGenres: ['SF', 'Drama'],
    });

    assert.equal(result.nickname, 'after');
    assert.equal(result.email, 'me@example.com');
    assert.equal(result.bio, 'hello');
    assert.deepEqual(result.preferredGenres, ['SF', 'Drama']);
  });

  it('rejects duplicate nicknames when updating the profile', async () => {
    users.users.push({
      ...users.users[0],
      id: 'user-2',
      email: 'other@example.com',
      nickname: 'taken',
    });

    await assert.rejects(
      () => service.updateMe('user-1', { nickname: 'taken' }),
      ConflictException,
    );
  });

  it('stores and deletes the guard-authenticated profile image URL', async () => {
    const stored = await service.updateProfileImage('user-1', '/uploads/profile-images/user-1.png');

    assert.equal(stored.profileImageUrl, '/uploads/profile-images/user-1.png');

    const deleted = await service.deleteProfileImage('user-1');

    assert.equal(deleted.profileImageUrl, null);
  });

  it('keeps at most one profile image file across replace and delete', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-profile-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;
    const file = {
      originalname: 'avatar.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xdb]),
      size: 4,
    };

    try {
      const first = await service.saveProfileImage('user-1', file);
      const imageDirectory = join(uploadRoot, 'profile-images');
      assert.equal((await readdir(imageDirectory)).length, 1);

      const second = await service.saveProfileImage('user-1', file);
      assert.notEqual(second.profileImageUrl, first.profileImageUrl);
      assert.equal((await readdir(imageDirectory)).length, 1);

      await service.deleteProfileImage('user-1');
      assert.equal((await readdir(imageDirectory)).length, 0);
    } finally {
      if (previousUploadsDir === undefined) {
        delete process.env.UPLOADS_DIR;
      } else {
        process.env.UPLOADS_DIR = previousUploadsDir;
      }
      await rm(uploadRoot, { recursive: true, force: true });
    }
  });

  it('removes the physical profile image when an expired account is purged', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-account-delete-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;

    try {
      const saved = await service.saveProfileImage('user-1', {
        originalname: 'account.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0xdb]),
        size: 4,
      });
      const imageDirectory = join(uploadRoot, 'profile-images');
      assert.equal((await readdir(imageDirectory)).length, 1);

      const dataSource = new FakeLifecycleDataSource(users);
      dataSource.due = [{ id: 'user-1', profileImageUrl: saved.profileImageUrl }];
      const lifecycle = new UsersService(users as never, dataSource as never);

      const result = await lifecycle.purgeExpiredDeletions(new Date('2026-09-13T00:00:00.000Z'));

      assert.equal(result.purged, 1);
      assert.equal(users.users[0].profileImageUrl, null);
      assert.ok(users.users[0].deletedAt instanceof Date);
      assert.equal((await readdir(imageDirectory)).length, 0);
      assert.equal(dataSource.cleanupJobs.length, 0);
    } finally {
      if (previousUploadsDir === undefined) {
        delete process.env.UPLOADS_DIR;
      } else {
        process.env.UPLOADS_DIR = previousUploadsDir;
      }
      await rm(uploadRoot, { recursive: true, force: true });
    }
  });

  it('queues account image cleanup after anonymization when unlink fails', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-account-retry-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;
    const blockedName = 'blocked-account-image';
    await mkdir(join(uploadRoot, 'profile-images', blockedName), {
      recursive: true,
    });
    const dataSource = new FakeLifecycleDataSource(users);
    dataSource.due = [{ id: 'user-1', profileImageUrl: `/uploads/profile-images/${blockedName}` }];
    const lifecycle = new UsersService(users as never, dataSource as never);

    try {
      await lifecycle.purgeExpiredDeletions(new Date('2026-09-13T00:00:00.000Z'));

      assert.equal(users.users[0].status, 'DELETED');
      assert.equal(dataSource.cleanupJobs.length, 1);
      assert.equal(dataSource.cleanupJobs[0].path, join(uploadRoot, 'profile-images', blockedName));
      assert.equal(dataSource.cleanupJobs[0].kind, 'PROFILE_IMAGE');
      assert.equal(dataSource.cleanupJobs[0].attempts, 1);
      assert.equal(dataSource.cleanupJobs[0].completedAt, null);
    } finally {
      if (previousUploadsDir === undefined) {
        delete process.env.UPLOADS_DIR;
      } else {
        process.env.UPLOADS_DIR = previousUploadsDir;
      }
      await rm(uploadRoot, { recursive: true, force: true });
    }
  });

  it('persists a cleanup job when a profile image cannot be unlinked', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-cleanup-job-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;
    const blockedName = 'blocked-path';
    await mkdir(join(uploadRoot, 'profile-images', blockedName), {
      recursive: true,
    });
    users.users[0].profileImageUrl = `/uploads/profile-images/${blockedName}`;
    const jobs: Array<Record<string, unknown>> = [];
    service = new UsersService(
      users as never,
      {
        isInitialized: true,
        getRepository: () => ({
          save: async (job: Record<string, unknown>) => {
            jobs.push(job);
            return job;
          },
        }),
      } as never,
    );

    try {
      const deleted = await service.deleteProfileImage('user-1');

      assert.equal(deleted.profileImageUrl, null);
      assert.equal(jobs.length, 1);
      assert.equal(jobs[0].kind, 'PROFILE_IMAGE');
      assert.equal(jobs[0].attempts, 1);
      assert.equal(jobs[0].completedAt, null);
    } finally {
      if (previousUploadsDir === undefined) {
        delete process.env.UPLOADS_DIR;
      } else {
        process.env.UPLOADS_DIR = previousUploadsDir;
      }
      await rm(uploadRoot, { recursive: true, force: true });
    }
  });

  it('rejects user identifiers that no longer exist', async () => {
    await assert.rejects(
      () => service.updateMe('missing-user', { nickname: 'new' }),
      UnauthorizedException,
    );
    await assert.rejects(
      () => service.updateProfileImage('missing-user', '/uploads/profile-images/x.png'),
      UnauthorizedException,
    );
  });

  it('rejects deletion-pending accounts even with a previously valid principal', async () => {
    users.users[0].status = 'DELETION_PENDING';

    await assert.rejects(
      () => service.updateMe('user-1', { nickname: 'new' }),
      UnauthorizedException,
    );
  });

  it('exports only the authenticated account through explicitly scoped queries', async () => {
    const dataSource = new FakeLifecycleDataSource(users);
    const lifecycle = new UsersService(users as never, dataSource as never);
    const result = await lifecycle.exportMe('user-1', new Date('2026-08-13T00:00:00.000Z'));

    assert.equal(result.account.id, 'user-1');
    assert.equal(result.account.email, 'me@example.com');
    assert.equal('passwordHash' in result.account, false);
    assert.equal(result.reactions[0].reviewText, 'mine');
    // Photos and wishes are personal data too.
    assert.deepEqual(result.photos, []);
    assert.deepEqual(result.wishes, []);
    assert.ok(dataSource.statements.some((statement) => statement.sql.includes('"is_blind"')));
    assert.equal(dataSource.statements.length, 9);
    assert.ok(dataSource.statements.every((statement) => statement.params[0] === 'user-1'));
    await assert.rejects(() => lifecycle.exportMe('missing-user'), UnauthorizedException);
  });

  it('requests deletion with a grace period and can recover before expiry', async () => {
    users.users[0].passwordHash = await bcrypt.hash('password123', 4);
    const dataSource = new FakeLifecycleDataSource(users);
    const outbox = new FakeOutbox();
    const lifecycle = new UsersService(users as never, dataSource as never, outbox as never);
    const requestedAt = new Date('2026-08-13T00:00:00.000Z');

    const pending = await lifecycle.requestDeletion('user-1', 'password123', requestedAt);
    assert.equal(pending.status, 'DELETION_PENDING');
    assert.equal(pending.deletionScheduledFor, '2026-09-12T00:00:00.000Z');
    assert.equal(users.users[0].status, 'DELETION_PENDING');
    assert.equal(outbox.calls[0].kind, 'notification');

    const recovered = await lifecycle.cancelDeletion(
      'ME@EXAMPLE.COM',
      'password123',
      new Date('2026-08-20T00:00:00.000Z'),
    );
    assert.equal(recovered.status, 'ACTIVE');
    assert.equal(users.users[0].status, 'ACTIVE');
    assert.equal(users.users[0].deletionScheduledFor, null);

    const legacyDelete = await lifecycle.deleteMe('user-1', 'password123');
    assert.equal(legacyDelete.status, 'DELETION_PENDING');
    assert.equal(users.users[0].status, 'DELETION_PENDING');
  });

  it('anonymizes expired accounts while preserving shared watch facts', async () => {
    const dataSource = new FakeLifecycleDataSource(users);
    dataSource.due = [{ id: 'user-1', profileImageUrl: null }];
    const outbox = new FakeOutbox();
    const lifecycle = new UsersService(users as never, dataSource as never, outbox as never);

    const result = await lifecycle.purgeExpiredDeletions(new Date('2026-09-13T00:00:00.000Z'));
    const sql = dataSource.statements.map((statement) => statement.sql).join('\n');
    assert.equal(result.purged, 1);
    assert.match(sql, /FOR UPDATE SKIP LOCKED/);
    assert.match(sql, /UPDATE "diaries" d SET "title" = '공동 감상 기록'/);
    assert.match(sql, /watch_event_shares/);
    assert.match(sql, /watch_participants/);
    assert.match(sql, /DELETE FROM "watch_reactions"/);
    assert.match(sql, /DELETE FROM "watch_review_likes"/);
    assert.match(sql, /DELETE FROM "space_wishes"/);
    assert.match(sql, /DELETE FROM "watch_photos" WHERE "uploader_id" = \$1 RETURNING/);
    assert.match(sql, /UPDATE "watch_sources" ws SET "place_text" = NULL, "seat_text" = NULL/);
    assert.equal(users.users[0].status, 'DELETED');
    assert.equal(users.users[0].email, 'deleted-user-1@deleted.invalid');
    assert.equal(outbox.calls.at(-1)?.kind, 'event');
  });
});
