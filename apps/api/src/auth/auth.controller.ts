import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, RecoveryCodeDto, ResetPasswordDto } from './dto/password.dto';
import { SignupDto } from './dto/signup.dto';
import { ACCESS_TOKEN_COOKIE, type AuthenticatedRequest } from './jwt-cookie-auth.guard';
import { Public } from './public.decorator';
import { accessCookieMaxAgeMs, accessCookieOptions } from './access-cookie';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.signup(dto);
    this.setAccessTokenCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Public()
  @Throttle({ default: ROUTE_RATE_LIMITS.login })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto);
    this.setAccessTokenCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, accessCookieOptions());
    return { ok: true };
  }

  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return { user: request.user };
  }

  @Post('password')
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.changePassword(request.user.id, dto);
    this.setAccessTokenCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Post('recovery-code')
  createRecoveryCode(@Req() request: AuthenticatedRequest, @Body() dto: RecoveryCodeDto) {
    return this.auth.createRecoveryCode(request.user.id, dto.password);
  }

  // Signed out by definition: the recovery code stands in for the forgotten password.
  @Public()
  @Throttle({ default: ROUTE_RATE_LIMITS.login })
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  private setAccessTokenCookie(response: Response, accessToken: string) {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...accessCookieOptions(),
      maxAge: accessCookieMaxAgeMs(),
    });
  }
}
