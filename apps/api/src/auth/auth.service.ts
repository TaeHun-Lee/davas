import { createHash, randomInt } from 'node:crypto';
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
import { ChangePasswordDto, ResetPasswordDto } from './dto/password.dto';
import { SignupDto } from './dto/signup.dto';

export type AuthResult = {
  accessToken: string;
  user: AuthenticatedUser;
};

const PASSWORD_HASH_COST = 12;
const RECOVERY_CODE_HASH_COST = 10;
// No 0/O, 1/I/L: a code copied down by hand reads back the same. 31^12 is about 2^59.
const RECOVERY_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const RECOVERY_CODE_LENGTH = 12;

/** `ABCD-EFGH-JKMN`: shown once, stored only as a hash. */
export function newRecoveryCode() {
  const characters = Array.from(
    { length: RECOVERY_CODE_LENGTH },
    () => RECOVERY_CODE_ALPHABET[randomInt(RECOVERY_CODE_ALPHABET.length)],
  ).join('');
  return [0, 4, 8].map((start) => characters.slice(start, start + 4)).join('-');
}

const normalizeRecoveryCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '');

// Not 401: the web treats any 401 as a lost session and sends the person to the login page.
const passwordMismatch = () =>
  new BadRequestException({
    statusCode: 400,
    code: 'PASSWORD_MISMATCH',
    message: '지금 비밀번호가 맞지 않아요.',
  });

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

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_HASH_COST);
    const user = await repository.save(
      repository.create({
        email,
        nickname,
        passwordHash,
        profileImageUrl: null,
        bio: null,
        preferredGenres: [],
        ottServices: [],
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

    // Said only after the password matched, so it never tells a stranger an email is registered.
    if (
      user.status === 'DELETION_PENDING' &&
      user.deletionScheduledFor &&
      user.deletionScheduledFor > new Date()
    ) {
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'ACCOUNT_DELETION_PENDING',
        message: '삭제를 기다리는 계정이에요. 되살리면 기록 그대로 다시 쓸 수 있어요.',
        deletionScheduledFor: user.deletionScheduledFor.toISOString(),
      });
    }
    this.assertActive(user);

    return this.createAuthResult(user);
  }

  /** Every other device has to sign in again; this one gets a fresh sign-in. */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<AuthResult> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    this.assertActive(user);
    if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) throw passwordMismatch();
    user.passwordHash = await bcrypt.hash(dto.newPassword, PASSWORD_HASH_COST);
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await this.users.update(
      { id: user.id },
      { passwordHash: user.passwordHash, sessionVersion: user.sessionVersion },
    );
    return this.createAuthResult(user);
  }

  /** A new code replaces the old one; the plain code is returned this once and never stored. */
  async createRecoveryCode(userId: string, password: string, now = new Date()) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    this.assertActive(user);
    if (!(await bcrypt.compare(password, user.passwordHash))) throw passwordMismatch();
    const recoveryCode = newRecoveryCode();
    await this.users.update(
      { id: user.id },
      {
        recoveryCodeHash: await bcrypt.hash(
          normalizeRecoveryCode(recoveryCode),
          RECOVERY_CODE_HASH_COST,
        ),
        recoveryCodeCreatedAt: now,
      },
    );
    return { recoveryCode, createdAt: now.toISOString() };
  }

  /**
   * Sets a new password with the recovery code, which is then used up. Earlier sign-ins stop
   * working. Wrong email and wrong code get the same answer and take about the same time.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.users.findOne({ where: { email: this.normalizeEmail(dto.email) } });
    // A pending deletion may still reset; the login then offers to bring the account back.
    const usable = user?.recoveryCodeHash && user.status !== 'DELETED' && !user.anonymizedAt;
    const code = normalizeRecoveryCode(dto.recoveryCode);
    const matches = await bcrypt.compare(
      code,
      usable ? user.recoveryCodeHash! : await this.unusableRecoveryHash(),
    );
    if (!usable || !matches) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'RECOVERY_CODE_INVALID',
        message: '이메일이나 복구 코드가 맞지 않아요.',
      });
    }
    await this.users.update(
      { id: user.id },
      {
        passwordHash: await bcrypt.hash(dto.newPassword, PASSWORD_HASH_COST),
        sessionVersion: (user.sessionVersion ?? 0) + 1,
        recoveryCodeHash: null,
        recoveryCodeCreatedAt: null,
      },
    );
    return { ok: true as const };
  }

  private unusableHash?: Promise<string>;

  // Compared against when there is no code, so a miss costs as long as a real check.
  private unusableRecoveryHash() {
    this.unusableHash ??= bcrypt.hash(newRecoveryCode(), RECOVERY_CODE_HASH_COST);
    return this.unusableHash;
  }

  async findMe(accessToken: string | undefined): Promise<AuthenticatedUser> {
    if (!accessToken) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    try {
      const payload = this.jwt.verify<{ sub: string; sv?: number }>(accessToken);
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }
      this.assertActive(user);
      // Sign-ins from before a password change (version 0 for those issued before versions).
      if ((payload.sv ?? 0) !== (user.sessionVersion ?? 0)) {
        throw new UnauthorizedException('비밀번호가 바뀌어서 다시 로그인해야 해요.');
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
    this.assertActive(user);
    const safeUser = this.toUserResponse(user);
    return {
      accessToken: this.jwt.sign({
        sub: safeUser.id,
        email: safeUser.email,
        nickname: safeUser.nickname,
        sv: user.sessionVersion ?? 0,
      }),
      user: safeUser,
    };
  }

  private assertActive(user: UserEntity) {
    if (user.status && user.status !== 'ACTIVE') {
      throw new UnauthorizedException('삭제 대기 또는 삭제된 계정은 로그인할 수 없습니다.');
    }
  }

  private toUserResponse(user: UserEntity): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl ?? null,
      bio: user.bio ?? null,
      preferredGenres: user.preferredGenres ?? [],
      ottServices: user.ottServices ?? [],
      recoveryCodeCreatedAt: user.recoveryCodeCreatedAt?.toISOString() ?? null,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
