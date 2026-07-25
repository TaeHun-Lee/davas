import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type AuthenticatedUser } from './auth.service';

export const ACCESS_TOKEN_COOKIE = 'davas_access_token';

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key === name) return part.slice(separator + 1).trim();
  }
  return undefined;
}

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = readCookie(request, ACCESS_TOKEN_COOKIE);
    if (!accessToken) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    const user = await this.auth.findMe(accessToken);
    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    request.user = user;
    return true;
  }
}
