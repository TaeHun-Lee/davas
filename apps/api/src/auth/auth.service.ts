import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

export type AuthenticatedUser = {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
  preferredGenres: string[];
};

export type AuthResult = {
  accessToken: string;
  user: AuthenticatedUser;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email);
    const nickname = dto.nickname.trim();

    const existing = await this.users.findOne({ where: [{ email }, { nickname }] });
    if (existing) {
      throw new ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.save(
      this.users.create({
        email,
        nickname,
        passwordHash,
        profileImageUrl: null,
        bio: null,
        preferredGenres: [],
      }),
    );

    return this.createAuthResult(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email);
    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return this.createAuthResult(user);
  }

  async findMe(accessToken: string | undefined): Promise<AuthenticatedUser> {
    if (!accessToken) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    try {
      const payload = this.jwt.verify<{ sub: string }>(accessToken);
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }
      return this.toUserResponse(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('유효하지 않은 인증 정보입니다.');
    }
  }

  private createAuthResult(user: UserEntity): AuthResult {
    const safeUser = this.toUserResponse(user);
    return {
      accessToken: this.jwt.sign({ sub: safeUser.id, email: safeUser.email, nickname: safeUser.nickname }),
      user: safeUser,
    };
  }

  private toUserResponse(user: UserEntity): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl ?? null,
      bio: user.bio ?? null,
      preferredGenres: user.preferredGenres ?? [],
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
