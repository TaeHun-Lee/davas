import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ACCESS_TOKEN_COOKIE, type AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { Public } from '../auth/public.decorator';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { CancelDeletionDto } from './dto/cancel-deletion.dto';
import { DeleteMeDto } from './dto/delete-me.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { PROFILE_IMAGE_UPLOAD_OPTIONS } from './profile-image-upload';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';
import { type ProfileImageFile, UsersService } from './users.service';
import { accessCookieOptions } from '../auth/access-cookie';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch('me')
  async updateMe(@Req() request: AuthenticatedRequest, @Body() body: UpdateMeDto) {
    return { user: await this.users.updateMe(request.user.id, body) };
  }

  @Post('me/profile-image')
  @Throttle({
    default: { limit: 5, ttl: 60_000, blockDuration: 60_000 },
  })
  @UseInterceptors(
    UploadConcurrencyInterceptor,
    FileInterceptor('file', PROFILE_IMAGE_UPLOAD_OPTIONS),
  )
  async uploadProfileImage(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file?: ProfileImageFile,
  ) {
    return {
      user: await this.users.saveProfileImage(request.user.id, file),
    };
  }

  @Delete('me/profile-image')
  async deleteProfileImage(@Req() request: AuthenticatedRequest) {
    return {
      user: await this.users.deleteProfileImage(request.user.id),
    };
  }

  @Get('me/export')
  exportMe(@Req() request: AuthenticatedRequest) {
    return this.users.exportMe(request.user.id);
  }

  // A deletion-pending account has no usable session, so recovery re-checks the password.
  @Post('me/deletion/cancel')
  @Public()
  @Throttle({ default: ROUTE_RATE_LIMITS.login })
  cancelDeletion(@Body() body: CancelDeletionDto) {
    return this.users.cancelDeletion(body.email, body.password);
  }

  @Delete('me')
  @HttpCode(204)
  async deleteMe(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() body: DeleteMeDto,
  ) {
    await this.users.deleteMe(request.user.id, body.password);
    this.clearAccessCookie(response);
  }

  private clearAccessCookie(response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, accessCookieOptions());
  }
}
