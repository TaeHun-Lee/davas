import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InviteCodeEntity } from '../database/entities';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({ imports: [AuthModule, TypeOrmModule.forFeature([InviteCodeEntity])], controllers: [InvitesController], providers: [InvitesService] })
export class InvitesModule {}
