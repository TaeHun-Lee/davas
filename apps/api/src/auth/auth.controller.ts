import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.signup(dto);
    this.setAccessTokenCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto);
    this.setAccessTokenCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions());
    return { ok: true };
  }

  @Post('refresh')
  refresh() {
    return { message: 'refresh endpoint is not implemented in the MVP auth flow' };
  }

  @Get('me')
  async me(@Req() request: Request) {
    return { user: await this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE)) };
  }

  private setAccessTokenCookie(response: Response, accessToken: string) {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
    };
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
