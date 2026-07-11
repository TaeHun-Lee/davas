import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { InviteCodeEntity } from '../database/entities';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InvitesService implements OnModuleInit {
  constructor(@InjectRepository(InviteCodeEntity) private readonly invites: Repository<InviteCodeEntity>, private readonly auth: AuthService) {}
  async onModuleInit() {
    const code = process.env.DAVAS_BOOTSTRAP_INVITE_CODE?.trim().toUpperCase();
    if (!code || await this.invites.findOne({ where: { code } })) return;
    await this.invites.save(this.invites.create({ code, createdById: null, maxUses: Number(process.env.DAVAS_BOOTSTRAP_INVITE_MAX_USES ?? 1), usedCount: 0, expiresAt: new Date(process.env.DAVAS_BOOTSTRAP_INVITE_EXPIRES_AT ?? Date.now() + 30 * 86400000) }));
  }
  validate(code: string) { return this.auth.validateInvite(code); }
  async create(createdById: string, input: { maxUses?: number; expiresAt?: string }) {
    const maxUses = input.maxUses ?? 1;
    if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 100) throw new BadRequestException('사용 횟수는 1~100이어야 합니다.');
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 30 * 86400000);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) throw new BadRequestException('만료 시각이 올바르지 않습니다.');
    const code = `DAVAS-${randomBytes(5).toString('hex').toUpperCase()}`;
    return this.invites.save(this.invites.create({ code, createdById, maxUses, usedCount: 0, expiresAt }));
  }
  list(createdById: string) { return this.invites.find({ where: { createdById }, order: { createdAt: 'DESC' } }); }
}
