import { createHash } from 'node:crypto';
import {
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  type AuthenticatedUser,
} from '@davas/shared';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  FriendInviteEntity,
  FriendshipEntity,
  InviteCodeEntity,
  InviteUseEntity,
  UserConsentEntity,
  UserEntity,
} from '../database/entities';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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
    @Optional()
    @InjectRepository(InviteCodeEntity)
    private readonly invites?: Repository<InviteCodeEntity>,
    @Optional()
    @InjectRepository(InviteUseEntity)
    private readonly inviteUses?: Repository<InviteUseEntity>,
    @Optional()
    @InjectRepository(FriendInviteEntity)
    private readonly friendInvites?: Repository<FriendInviteEntity>,
    @Optional()
    @InjectRepository(FriendshipEntity)
    private readonly friendships?: Repository<FriendshipEntity>,
    @Optional()
    @InjectRepository(UserConsentEntity)
    private readonly consents?: Repository<UserConsentEntity>,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    this.validateSignupContract(dto);
    const inviteCode = dto.inviteCode?.trim();
    if (this.dataSource?.isInitialized) {
      return this.dataSource.transaction((manager) => this.signupInTransaction(dto, manager));
    }
    if (dto.friendInviteToken) return this.signupWithFriendInviteWithoutTransaction(dto);
    const invite = await this.loadUsableInvite(inviteCode!, this.invites);
    const result = await this.createUser(dto, this.users);
    invite.usedCount += 1;
    await this.invites?.save(invite);
    await this.inviteUses?.save(
      this.inviteUses.create({ inviteId: invite.id, userId: result.user.id }),
    );
    await this.saveConsent(result.user.id, dto, this.consents);
    return result;
  }

  async validateInvite(code: string) {
    const invite = await this.loadUsableInvite(code, this.invites);
    return {
      valid: true,
      expiresAt: invite.expiresAt.toISOString(),
      remainingUses: invite.maxUses - invite.usedCount,
    };
  }

  private async signupInTransaction(dto: SignupDto, manager: EntityManager) {
    if (dto.friendInviteToken) return this.signupWithFriendInvite(dto, manager);
    const inviteRepository = manager.getRepository(InviteCodeEntity);
    const invite = await this.loadUsableInvite(dto.inviteCode!, inviteRepository, true);
    const result = await this.createUser(dto, manager.getRepository(UserEntity));
    invite.usedCount += 1;
    await inviteRepository.save(invite);
    await manager
      .getRepository(InviteUseEntity)
      .save(
        manager
          .getRepository(InviteUseEntity)
          .create({ inviteId: invite.id, userId: result.user.id }),
      );
    await this.saveConsent(result.user.id, dto, manager.getRepository(UserConsentEntity));
    return result;
  }

  private async signupWithFriendInvite(dto: SignupDto, manager: EntityManager) {
    const inviteRepository = manager.getRepository(FriendInviteEntity);
    const tokenHash = createHash('sha256').update(dto.friendInviteToken!).digest('hex');
    const invite = await inviteRepository.findOne({
      where: { tokenHash },
      lock: { mode: 'pessimistic_write' },
    });
    this.assertUsableFriendInvite(invite);
    const result = await this.createUser(dto, manager.getRepository(UserEntity));
    const friendshipRepository = manager.getRepository(FriendshipEntity);
    const pairKey = [invite!.inviterId, result.user.id].sort().join(':');
    await friendshipRepository.save(
      friendshipRepository.create({
        pairKey,
        requesterId: invite!.inviterId,
        receiverId: result.user.id,
        status: 'ACCEPTED',
      }),
    );
    invite!.usedAt = new Date();
    invite!.usedByUserId = result.user.id;
    await inviteRepository.save(invite!);
    await this.saveConsent(result.user.id, dto, manager.getRepository(UserConsentEntity));
    return result;
  }

  private async signupWithFriendInviteWithoutTransaction(dto: SignupDto) {
    if (!this.friendInvites || !this.friendships)
      throw new BadRequestException('친구 초대 기능을 사용할 수 없습니다.');
    const tokenHash = createHash('sha256').update(dto.friendInviteToken!).digest('hex');
    const invite = await this.friendInvites.findOne({ where: { tokenHash } });
    this.assertUsableFriendInvite(invite);
    const result = await this.createUser(dto, this.users);
    await this.friendships.save(
      this.friendships.create({
        pairKey: [invite!.inviterId, result.user.id].sort().join(':'),
        requesterId: invite!.inviterId,
        receiverId: result.user.id,
        status: 'ACCEPTED',
      }),
    );
    invite!.usedAt = new Date();
    invite!.usedByUserId = result.user.id;
    await this.friendInvites.save(invite!);
    await this.saveConsent(result.user.id, dto, this.consents);
    return result;
  }

  private validateSignupContract(dto: SignupDto) {
    if (Boolean(dto.inviteCode?.trim()) === Boolean(dto.friendInviteToken?.trim()))
      throw new BadRequestException('가입 초대 코드 또는 친구 초대 링크 중 하나가 필요합니다.');
    if (
      dto.termsAccepted !== true ||
      dto.termsVersion !== CURRENT_TERMS_VERSION ||
      dto.privacyVersion !== CURRENT_PRIVACY_VERSION
    )
      throw new BadRequestException('현재 약관과 개인정보처리방침에 동의해 주세요.');
  }

  private assertUsableFriendInvite(invite: FriendInviteEntity | null) {
    if (!invite || invite.revokedAt || invite.usedAt || invite.expiresAt.getTime() <= Date.now())
      throw new ConflictException('이미 사용됐거나 만료된 친구 초대 링크입니다.');
  }

  private async saveConsent(
    userId: string,
    dto: SignupDto,
    repository?: Repository<UserConsentEntity>,
  ) {
    if (!repository) return;
    await repository.save(
      repository.create({
        userId,
        termsVersion: dto.termsVersion!,
        privacyVersion: dto.privacyVersion!,
      }),
    );
  }

  private async createUser(
    dto: SignupDto,
    repository: Repository<UserEntity>,
  ): Promise<AuthResult> {
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

  private async loadUsableInvite(
    code: string,
    repository?: Repository<InviteCodeEntity>,
    lock = false,
  ) {
    if (!repository) throw new BadRequestException('초대 코드 기능을 사용할 수 없습니다.');
    const invite = await repository.findOne({
      where: { code: code.trim().toUpperCase() },
      ...(lock ? { lock: { mode: 'pessimistic_write' as const } } : {}),
    });
    if (!invite) throw new BadRequestException('유효하지 않은 초대 코드입니다.');
    if (invite.expiresAt.getTime() <= Date.now())
      throw new BadRequestException('만료된 초대 코드입니다.');
    if (invite.usedCount >= invite.maxUses)
      throw new ConflictException('이미 모두 사용된 초대 코드입니다.');
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
      accessToken: this.jwt.sign({
        sub: safeUser.id,
        email: safeUser.email,
        nickname: safeUser.nickname,
      }),
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
