import { BadRequestException, ConflictException, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InviteCodeEntity, InviteUseEntity, UserEntity } from '../database/entities';
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
    @Optional() @InjectRepository(InviteCodeEntity) private readonly invites?: Repository<InviteCodeEntity>,
    @Optional() @InjectRepository(InviteUseEntity) private readonly inviteUses?: Repository<InviteUseEntity>,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    const inviteCode = dto.inviteCode?.trim();
    if (!inviteCode) throw new BadRequestException('초대 코드가 필요합니다.');
    if (this.dataSource?.isInitialized) {
      return this.dataSource.transaction((manager) => this.signupInTransaction(dto, manager));
    }
    const invite = await this.loadUsableInvite(inviteCode, this.invites);
    const result = await this.createUser(dto, this.users);
    invite.usedCount += 1;
    await this.invites?.save(invite);
    await this.inviteUses?.save(this.inviteUses.create({ inviteId: invite.id, userId: result.user.id }));
    return result;
  }

  async validateInvite(code: string) {
    const invite = await this.loadUsableInvite(code, this.invites);
    return { valid: true, expiresAt: invite.expiresAt.toISOString(), remainingUses: invite.maxUses - invite.usedCount };
  }

  private async signupInTransaction(dto: SignupDto, manager: EntityManager) {
    const inviteRepository = manager.getRepository(InviteCodeEntity);
    const invite = await this.loadUsableInvite(dto.inviteCode!, inviteRepository, true);
    const result = await this.createUser(dto, manager.getRepository(UserEntity));
    invite.usedCount += 1;
    await inviteRepository.save(invite);
    await manager.getRepository(InviteUseEntity).save(manager.getRepository(InviteUseEntity).create({ inviteId: invite.id, userId: result.user.id }));
    return result;
  }

  private async createUser(dto: SignupDto, repository: Repository<UserEntity>): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email);
    const nickname = dto.nickname.trim();

    const existing = await repository.findOne({ where: [{ email }, { nickname }] });
    if (existing) {
      throw new ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await repository.save(
      repository.create({
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

  private async loadUsableInvite(code: string, repository?: Repository<InviteCodeEntity>, lock = false) {
    if (!repository) throw new BadRequestException('초대 코드 기능을 사용할 수 없습니다.');
    const invite = await repository.findOne({ where: { code: code.trim().toUpperCase() }, ...(lock ? { lock: { mode: 'pessimistic_write' as const } } : {}) });
    if (!invite) throw new BadRequestException('유효하지 않은 초대 코드입니다.');
    if (invite.expiresAt.getTime() <= Date.now()) throw new BadRequestException('만료된 초대 코드입니다.');
    if (invite.usedCount >= invite.maxUses) throw new ConflictException('이미 모두 사용된 초대 코드입니다.');
    return invite;
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
