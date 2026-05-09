import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities';

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
