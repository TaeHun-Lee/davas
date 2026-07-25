import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { Public } from '../auth/public.decorator';
import { CreateInviteDto, ValidateInviteDto } from './invites.dto';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Public()
  @Post('validate')
  validate(@Body() body: ValidateInviteDto) {
    return this.invites.validate(body.code);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateInviteDto) {
    return this.invites.create(request.user!.id, body);
  }

  @Get()
  async list(@Req() request: AuthenticatedRequest) {
    return { items: await this.invites.list(request.user!.id) };
  }
}
