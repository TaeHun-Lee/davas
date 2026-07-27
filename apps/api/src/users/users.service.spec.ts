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

  async remove(user: UserEntity) {
    this.onRemove?.(user);
    this.users = this.users.filter((saved) => saved.id !== (user as SavedUser).id);
    return user;
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

  it('removes the physical profile image when deleting an account', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-account-delete-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;

    try {
      users.users[0].passwordHash = await bcrypt.hash('delete-password', 4);
      await service.saveProfileImage('user-1', {
        originalname: 'account.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0xdb]),
        size: 4,
      });
      const imageDirectory = join(uploadRoot, 'profile-images');
      assert.equal((await readdir(imageDirectory)).length, 1);
      service = new UsersService(
        users as never,
        {
          isInitialized: true,
          transaction: async (work: (manager: unknown) => Promise<void>) =>
            work({
              query: async () => [],
              getRepository: () => ({
                update: async (_criteria: unknown, update: Partial<UserEntity>) => {
                  Object.assign(users.users[0], update);
                },
              }),
            }),
        } as never,
      );

      const result = await service.deleteMe('user-1', 'delete-password');

      assert.equal(result, undefined);
      assert.equal(users.users.length, 1);
      assert.equal(users.users[0].profileImageUrl, null);
      assert.ok(users.users[0].deletedAt instanceof Date);
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

  it('queues account image cleanup after the user row is removed when unlink fails', async () => {
    const uploadRoot = await mkdtemp(join(tmpdir(), 'davas-account-retry-'));
    const previousUploadsDir = process.env.UPLOADS_DIR;
    process.env.UPLOADS_DIR = uploadRoot;
    const blockedName = 'blocked-account-image';
    await mkdir(join(uploadRoot, 'profile-images', blockedName), {
      recursive: true,
    });
    users.users[0].passwordHash = await bcrypt.hash('delete-password', 4);
    users.users[0].profileImageUrl = `/uploads/profile-images/${blockedName}`;
    const events: string[] = [];
    const jobs: Array<Record<string, unknown>> = [];
    service = new UsersService(
      users as never,
      {
        isInitialized: true,
        transaction: async (work: (manager: unknown) => Promise<void>) =>
          work({
            query: async () => [],
            getRepository: () => ({
              update: async (_criteria: unknown, update: Partial<UserEntity>) => {
                events.push('account-anonymized');
                Object.assign(users.users[0], update);
              },
            }),
          }),
        getRepository: () => ({
          save: async (job: Record<string, unknown>) => {
            events.push('cleanup-queued');
            jobs.push(job);
            return job;
          },
        }),
      } as never,
    );

    try {
      const result = await service.deleteMe('user-1', 'delete-password');

      assert.equal(result, undefined);
      assert.deepEqual(events, ['account-anonymized', 'cleanup-queued']);
      assert.equal(users.users.length, 1);
      assert.equal(users.users[0].profileImageUrl, null);
      assert.ok(users.users[0].deletedAt instanceof Date);
      assert.equal(jobs.length, 1);
      assert.equal(jobs[0].path, join(uploadRoot, 'profile-images', blockedName));
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
});
