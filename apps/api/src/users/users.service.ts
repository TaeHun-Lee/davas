import { ConflictException, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FileCleanupJobEntity, UserEntity } from '../database/entities';
import { TransactionOutboxService } from '../outbox/transaction-outbox.service';
import * as bcrypt from 'bcrypt';

export type UserProfileResponse = {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
  preferredGenres: string[];
};

export type UpdateMeDto = {
  nickname?: string;
  bio?: string | null;
  preferredGenres?: string[];
};

export type ProfileImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const DELETION_GRACE_DAYS = 30;
const ALLOWED_PROFILE_IMAGE_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
    @Optional() private readonly dataSource?: DataSource,
    @Optional() private readonly outbox?: TransactionOutboxService,
  ) {}

  async updateMe(accessToken: string | undefined, dto: UpdateMeDto) {
    const user = await this.loadAuthenticatedUser(accessToken);
    const nextNickname = dto.nickname?.trim();

    if (nextNickname && nextNickname !== user.nickname) {
      const duplicate = await this.users.findOne({ where: { nickname: nextNickname } });
      if (duplicate && duplicate.id !== user.id) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
      user.nickname = nextNickname;
    }

    if (dto.bio !== undefined) {
      const nextBio = dto.bio?.trim() || null;
      user.bio = nextBio;
    }

    if (dto.preferredGenres !== undefined) {
      user.preferredGenres = dto.preferredGenres.map((genre) => genre.trim()).filter(Boolean).slice(0, 10);
    }

    return this.toUserResponse(await this.users.save(user));
  }

  async updateProfileImage(accessToken: string | undefined, imageUrl: string) {
    const user = await this.loadAuthenticatedUser(accessToken);
    user.profileImageUrl = imageUrl;
    return this.toUserResponse(await this.users.save(user));
  }

  async saveProfileImage(accessToken: string | undefined, file: ProfileImageFile | undefined) {
    if (!file) {
      throw new ConflictException('프로필 이미지 파일이 필요합니다.');
    }
    const extension = ALLOWED_PROFILE_IMAGE_TYPES.get(file.mimetype);
    if (!extension) {
      throw new ConflictException('JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.');
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      throw new ConflictException('프로필 이미지는 5MB 이하만 업로드할 수 있습니다.');
    }

    const user = await this.loadAuthenticatedUser(accessToken);
    const uploadRoot = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
    const imageDir = join(uploadRoot, 'profile-images');
    await mkdir(imageDir, { recursive: true });
    const safeOriginalExtension = ALLOWED_PROFILE_IMAGE_TYPES.get(file.mimetype) ?? extname(file.originalname).toLowerCase();
    const filename = `${user.id}-${randomUUID()}${safeOriginalExtension}`;
    await writeFile(join(imageDir, filename), file.buffer);
    user.profileImageUrl = `/uploads/profile-images/${filename}`;
    return this.toUserResponse(await this.users.save(user));
  }

  async deleteProfileImage(accessToken: string | undefined) {
    const user = await this.loadAuthenticatedUser(accessToken);
    user.profileImageUrl = null;
    return this.toUserResponse(await this.users.save(user));
  }

  async exportMe(accessToken: string | undefined, now = new Date()) {
    const user = await this.loadAuthenticatedUser(accessToken);
    if (!this.dataSource?.isInitialized) {
      throw new ConflictException('데이터 내보내기를 지금 처리할 수 없습니다.');
    }
    const query = (sql: string) => this.dataSource!.query(sql, [user.id]);
    const [consents, memberships, watchEvents, participations, reactions, watchSources, preferences] =
      await Promise.all([
        query(`SELECT "terms_version" AS "termsVersion", "privacy_version" AS "privacyVersion", "accepted_at" AS "acceptedAt" FROM "user_consents" WHERE "user_id" = $1 ORDER BY "accepted_at"`),
        query(`SELECT "space_id" AS "spaceId", "role", "status", "joined_at" AS "joinedAt", "left_at" AS "leftAt" FROM "space_memberships" WHERE "account_id" = $1 ORDER BY "joined_at"`),
        query(`SELECT "id", "media_id" AS "contentId", "title", "watched_date" AS "watchedOn", "visibility", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "diaries" WHERE "user_id" = $1 ORDER BY "created_at"`),
        query(`SELECT "diary_id" AS "watchEventId", "status", "requested_at" AS "requestedAt", "responded_at" AS "respondedAt" FROM "watch_participants" WHERE "account_id" = $1 ORDER BY "requested_at"`),
        query(`SELECT "diary_id" AS "watchEventId", "rating_scale" AS "ratingScale", "review_text" AS "reviewText", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "watch_reactions" WHERE "account_id" = $1 ORDER BY "created_at"`),
        query(`SELECT s."diary_id" AS "watchEventId", s."kind", s."provider_name" AS "providerName", s."place_text" AS "placeText" FROM "watch_sources" s INNER JOIN "diaries" d ON d."id" = s."diary_id" WHERE d."user_id" = $1 ORDER BY s."diary_id"`),
        query(`SELECT "category", "enabled", "updated_at" AS "updatedAt" FROM "notification_preferences" WHERE "user_id" = $1 ORDER BY "category"`),
      ]);
    return {
      schemaVersion: 1,
      exportedAt: now.toISOString(),
      account: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl ?? null,
        bio: user.bio ?? null,
        preferredGenres: user.preferredGenres ?? [],
        status: user.status ?? 'ACTIVE',
        createdAt: user.createdAt?.toISOString?.() ?? null,
      },
      consents,
      memberships,
      watchEvents,
      participations,
      reactions,
      watchSources,
      notificationPreferences: preferences,
    };
  }

  async requestDeletion(
    accessToken: string | undefined,
    password: string,
    now = new Date(),
  ) {
    const user = await this.loadAuthenticatedUser(accessToken);
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('비밀번호가 맞지 않아요.');
    }
    if (!this.dataSource?.isInitialized) {
      throw new ConflictException('계정 삭제를 지금 처리할 수 없습니다.');
    }
    const deletionScheduledFor = new Date(
      now.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000,
    );
    await this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(UserEntity);
      const locked = await users.findOne({
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!locked || (locked.status && locked.status !== 'ACTIVE')) {
        throw new ConflictException('이미 삭제 대기 중이거나 삭제된 계정입니다.');
      }
      locked.status = 'DELETION_PENDING';
      locked.deletionRequestedAt = now;
      locked.deletionScheduledFor = deletionScheduledFor;
      await users.save(locked);
      await this.outbox?.enqueueNotification(manager, {
        recipientId: user.id,
        notificationType: 'ACCOUNT_DELETION_SCHEDULED',
        subjectId: user.id,
        idempotencyKey: `account-deletion-requested:${user.id}:${now.toISOString()}`,
      });
    });
    return {
      status: 'DELETION_PENDING' as const,
      deletionRequestedAt: now.toISOString(),
      deletionScheduledFor: deletionScheduledFor.toISOString(),
    };
  }

  async deleteMe(accessToken: string | undefined, password: string) {
    return this.requestDeletion(accessToken, password);
  }

  async cancelDeletion(email: string, password: string, now = new Date()) {
    if (!this.dataSource?.isInitialized) {
      throw new ConflictException('계정 복구를 지금 처리할 수 없습니다.');
    }
    const normalizedEmail = email.trim().toLowerCase();
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(UserEntity);
      const user = await users.findOne({
        where: { email: normalizedEmail },
        lock: { mode: 'pessimistic_write' },
      });
      if (
        !user ||
        user.status !== 'DELETION_PENDING' ||
        !user.deletionScheduledFor ||
        user.deletionScheduledFor <= now ||
        !(await bcrypt.compare(password, user.passwordHash))
      ) {
        throw new UnauthorizedException('복구할 수 있는 계정 정보가 아닙니다.');
      }
      user.status = 'ACTIVE';
      user.deletionRequestedAt = null;
      user.deletionScheduledFor = null;
      await users.save(user);
      await this.outbox?.enqueueNotification(manager, {
        recipientId: user.id,
        notificationType: 'ACCOUNT_DELETION_CANCELLED',
        subjectId: user.id,
        idempotencyKey: `account-deletion-cancelled:${user.id}:${now.toISOString()}`,
      });
      return { status: 'ACTIVE' as const };
    });
  }

  async purgeExpiredDeletions(now = new Date()) {
    if (!this.dataSource?.isInitialized) {
      throw new ConflictException('계정 삭제를 지금 처리할 수 없습니다.');
    }
    const profiles = await this.dataSource.transaction(async (manager) => {
      const due = (await manager.query(
        `SELECT "id", "profile_image_url" AS "profileImageUrl" FROM "users" WHERE "status" = 'DELETION_PENDING' AND "deletion_scheduled_for" <= $1 ORDER BY "deletion_scheduled_for" FOR UPDATE SKIP LOCKED`,
        [now],
      )) as Array<{ id: string; profileImageUrl: string | null }>;
      for (const user of due) {
        await this.anonymizeExpiredAccount(manager, user.id, now);
        await this.outbox?.enqueue(manager, {
          eventType: 'AccountDeletionCompleted',
          aggregateType: 'Account',
          aggregateId: user.id,
          idempotencyKey: `account-deletion-completed:${user.id}`,
          payload: { accountId: user.id, completedAt: now.toISOString() },
        });
      }
      return due;
    });
    for (const profile of profiles) {
      await this.cleanupProfileImage(profile.id, profile.profileImageUrl);
    }
    return { purged: profiles.length };
  }

  private async anonymizeExpiredAccount(
    manager: EntityManager,
    userId: string,
    now: Date,
  ) {
    const sharedFact = `EXISTS (
      SELECT 1 FROM "watch_event_shares" wes
      WHERE wes."diary_id" = d."id" AND wes."revoked_at" IS NULL
    ) OR EXISTS (
      SELECT 1 FROM "watch_participants" wp
      WHERE wp."diary_id" = d."id" AND wp."account_id" <> $1 AND wp."status" = 'CONFIRMED'
    )`;
    await manager.query(
      `UPDATE "diaries" d SET "title" = '공동 감상 기록', "content" = '', "rating" = NULL, "watched_place" = NULL, "mood" = NULL, "memory_note" = NULL WHERE d."user_id" = $1 AND d."deleted_at" IS NULL AND (${sharedFact})`,
      [userId],
    );
    await manager.query(
      `UPDATE "watch_sources" ws SET "place_text" = NULL WHERE ws."diary_id" IN (SELECT d."id" FROM "diaries" d WHERE d."user_id" = $1)`,
      [userId],
    );
    await manager.query(
      `UPDATE "diaries" d SET "deleted_at" = $2 WHERE d."user_id" = $1 AND d."deleted_at" IS NULL AND NOT (${sharedFact})`,
      [userId, now],
    );
    await manager.query(
      `UPDATE "comments" SET "deleted_at" = $2 WHERE "user_id" = $1 AND "deleted_at" IS NULL`,
      [userId, now],
    );
    await manager.query(
      `UPDATE "diary_companions" SET "user_id" = NULL, "display_name" = '탈퇴한 사용자' WHERE "user_id" = $1`,
      [userId],
    );
    for (const [table, clause] of [
      ['friendships', '"requester_id" = $1 OR "receiver_id" = $1'],
      ['diary_shares', '"user_id" = $1'],
      ['diary_reactions', '"user_id" = $1'],
      ['diary_likes', '"user_id" = $1'],
      ['watch_reactions', '"account_id" = $1'],
      ['notifications', '"user_id" = $1 OR "actor_id" = $1'],
      ['notification_preferences', '"user_id" = $1'],
      ['user_follows', '"follower_id" = $1 OR "following_id" = $1'],
      ['watchlist_items', '"user_id" = $1'],
      ['media_favorites', '"user_id" = $1'],
      ['user_consents', '"user_id" = $1'],
    ] as const) {
      await manager.query(`DELETE FROM "${table}" WHERE ${clause}`, [userId]);
    }
    await manager.query(
      `UPDATE "spaces" SET "status" = 'CLOSED', "closed_at" = $2 WHERE "owner_account_id" = $1 AND "status" = 'ACTIVE'`,
      [userId, now],
    );
    await manager.query(
      `UPDATE "space_memberships" SET "status" = 'LEFT', "left_at" = $2 WHERE "account_id" = $1 AND "status" = 'ACTIVE'`,
      [userId, now],
    );
    await manager.query(
      `UPDATE "friend_invites" SET "revoked_at" = $2 WHERE "inviter_id" = $1 AND "used_at" IS NULL`,
      [userId, now],
    );
    await manager.query(
      `UPDATE "space_invites" SET "revoked_at" = $2 WHERE "inviter_account_id" = $1 AND "revoked_at" IS NULL`,
      [userId, now],
    );
    await manager.getRepository(UserEntity).update(
      { id: userId },
      {
        email: `deleted-${userId}@deleted.invalid`,
        nickname: `탈퇴한-사용자-${userId.slice(0, 8)}`,
        passwordHash: randomUUID(),
        profileImageUrl: null,
        bio: null,
        preferredGenres: [],
        status: 'DELETED',
        deletionScheduledFor: null,
        anonymizedAt: now,
        deletedAt: now,
      },
    );
  }

  private async cleanupProfileImage(userId: string, profileImageUrl: string | null) {
    if (!profileImageUrl?.startsWith('/uploads/profile-images/')) return;
    const uploadRoot = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
    const path = join(
      uploadRoot,
      'profile-images',
      profileImageUrl.split('/').at(-1)!,
    );
    try {
      await unlink(path);
    } catch (error) {
      await this.dataSource!.getRepository(FileCleanupJobEntity).save({
        userId,
        kind: 'PROFILE_IMAGE',
        path,
        attempts: 1,
        lastError: String(error),
        completedAt: null,
      });
      console.warn('profile-image-cleanup-pending', { userId });
    }
  }

  private async loadAuthenticatedUser(accessToken: string | undefined) {
    if (!accessToken) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    try {
      const payload = this.jwt.verify<{ sub: string }>(accessToken);
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }
      if (user.status && user.status !== 'ACTIVE') {
        throw new UnauthorizedException('삭제 대기 또는 삭제된 계정은 이용할 수 없습니다.');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('유효하지 않은 인증 정보입니다.');
    }
  }

  private toUserResponse(user: UserEntity): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl ?? null,
      bio: user.bio ?? null,
      preferredGenres: user.preferredGenres ?? [],
    };
  }
}
