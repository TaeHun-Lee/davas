import {
  ConflictException,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DataSource, Repository } from 'typeorm';
import {
  FileCleanupJobEntity,
  UserEntity,
} from '../database/entities';
import { validateProfileImageContent } from './profile-image-upload';

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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async updateMe(accessToken: string | undefined, dto: UpdateMeDto) {
    const user = await this.loadAuthenticatedUser(accessToken);
    const nextNickname = dto.nickname?.trim();

    if (nextNickname && nextNickname !== user.nickname) {
      const duplicate = await this.users.findOne({
        where: { nickname: nextNickname },
      });
      if (duplicate && duplicate.id !== user.id) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
      user.nickname = nextNickname;
    }

    if (dto.bio !== undefined) {
      user.bio = dto.bio?.trim() || null;
    }

    if (dto.preferredGenres !== undefined) {
      user.preferredGenres = dto.preferredGenres
        .map((genre) => genre.trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    return this.toUserResponse(await this.users.save(user));
  }

  async updateProfileImage(
    accessToken: string | undefined,
    imageUrl: string,
  ) {
    const user = await this.loadAuthenticatedUser(accessToken);
    user.profileImageUrl = imageUrl;
    return this.toUserResponse(await this.users.save(user));
  }

  async saveProfileImage(
    accessToken: string | undefined,
    file: ProfileImageFile | undefined,
  ) {
    if (!file) {
      throw new ConflictException('프로필 이미지 파일이 필요합니다.');
    }
    const validated = validateProfileImageContent(file);

    const user = await this.loadAuthenticatedUser(accessToken);
    const uploadRoot = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
    const imageDirectory = join(uploadRoot, 'profile-images');
    await mkdir(imageDirectory, { recursive: true });
    const filename = `${user.id}-${randomUUID()}.${validated.extension}`;
    await writeFile(join(imageDirectory, filename), file.buffer);
    user.profileImageUrl = `/uploads/profile-images/${filename}`;
    return this.toUserResponse(await this.users.save(user));
  }

  async deleteProfileImage(accessToken: string | undefined) {
    const user = await this.loadAuthenticatedUser(accessToken);
    user.profileImageUrl = null;
    return this.toUserResponse(await this.users.save(user));
  }

  async deleteMe(accessToken: string | undefined, password: string) {
    const user = await this.loadAuthenticatedUser(accessToken);
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('비밀번호가 맞지 않아요.');
    }
    if (!this.dataSource?.isInitialized) {
      throw new ConflictException('계정 삭제를 지금 처리할 수 없습니다.');
    }
    const profileImageUrl = user.profileImageUrl;
    await this.dataSource.transaction(async (manager) => {
      const now = new Date();
      await manager.query(
        `UPDATE "diaries" SET "deleted_at" = $1 WHERE "user_id" = $2 AND "deleted_at" IS NULL`,
        [now, user.id],
      );
      await manager.query(
        `UPDATE "comments" SET "deleted_at" = $1 WHERE "user_id" = $2 AND "deleted_at" IS NULL`,
        [now, user.id],
      );
      await manager.query(
        `UPDATE "diary_companions" SET "user_id" = NULL, "display_name" = '탈퇴한 사용자' WHERE "user_id" = $1`,
        [user.id],
      );
      for (const [table, clause] of [
        [
          'friendships',
          '"requester_id" = $1 OR "receiver_id" = $1',
        ],
        ['diary_shares', '"user_id" = $1'],
        ['diary_reactions', '"user_id" = $1'],
        ['diary_likes', '"user_id" = $1'],
        [
          'notifications',
          '"user_id" = $1 OR "actor_id" = $1',
        ],
        [
          'user_follows',
          '"follower_id" = $1 OR "following_id" = $1',
        ],
        ['watchlist_items', '"user_id" = $1'],
        ['media_favorites', '"user_id" = $1'],
      ] as const) {
        await manager.query(`DELETE FROM "${table}" WHERE ${clause}`, [user.id]);
      }
      await manager.query(
        `UPDATE "friend_invites" SET "revoked_at" = $1 WHERE "inviter_id" = $2 AND "used_at" IS NULL`,
        [now, user.id],
      );
      await manager.getRepository(UserEntity).update(
        { id: user.id },
        {
          email: `deleted-${user.id}@deleted.invalid`,
          nickname: `탈퇴한-사용자-${user.id.slice(0, 8)}`,
          profileImageUrl: null,
          bio: null,
          preferredGenres: [],
          deletedAt: now,
        },
      );
    });
    if (profileImageUrl?.startsWith('/uploads/profile-images/')) {
      const uploadRoot = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');
      const path = join(
        uploadRoot,
        'profile-images',
        profileImageUrl.split('/').at(-1)!,
      );
      try {
        await unlink(path);
      } catch (error) {
        await this.dataSource
          .getRepository(FileCleanupJobEntity)
          .save({
            userId: user.id,
            kind: 'PROFILE_IMAGE',
            path,
            attempts: 1,
            lastError: String(error),
            completedAt: null,
          });
        console.warn('profile-image-cleanup-pending', { userId: user.id });
      }
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
