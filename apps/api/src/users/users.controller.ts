import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
import type { Request, Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE,
  type AuthenticatedRequest,
} from '../auth/jwt-cookie-auth.guard';
import { DeleteMeDto } from './dto/delete-me.dto';
import { PROFILE_IMAGE_UPLOAD_OPTIONS } from './profile-image-upload';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';
import {
  type ProfileImageFile,
  type UpdateMeDto,
  UsersService,
} from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'public user profile endpoint is not implemented yet' };
  }

  @Patch('me')
  async updateMe(@Req() request: Request, @Body() body: UpdateMeDto) {
    return {
      user: await this.users.updateMe(
        this.readCookie(request, ACCESS_TOKEN_COOKIE),
        body,
      ),
    };
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
      user: await this.users.saveProfileImage(
        this.readCookie(request, ACCESS_TOKEN_COOKIE),
        file,
      ),
    };
  }

  @Delete('me/profile-image')
  async deleteProfileImage(@Req() request: Request) {
    return {
      user: await this.users.deleteProfileImage(
        this.readCookie(request, ACCESS_TOKEN_COOKIE),
      ),
    };
  }

  @Delete('me')
  @HttpCode(204)
  async deleteMe(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: DeleteMeDto,
  ) {
    await this.users.deleteMe(
      this.readCookie(request, ACCESS_TOKEN_COOKIE),
      body.password,
    );
    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
    });
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
