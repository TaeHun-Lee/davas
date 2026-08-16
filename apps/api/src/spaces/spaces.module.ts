import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  SpaceEntity,
  SpaceInviteEntity,
  SpaceMembershipEntity,
} from '../database/entities';
import { OutboxModule } from '../outbox/outbox.module';
import { SpaceInvitesController } from './space-invites.controller';
import { SpaceAccessService } from './space-access.service';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
  imports: [
    AuthModule,
    OutboxModule,
    TypeOrmModule.forFeature([
      SpaceEntity,
      SpaceMembershipEntity,
      SpaceInviteEntity,
    ]),
  ],
  controllers: [SpacesController, SpaceInvitesController],
  providers: [SpaceAccessService, SpacesService],
  exports: [SpaceAccessService, SpacesService],
})
export class SpacesModule {}
