import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from '@davas/shared';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE, readCookie } from './jwt-cookie-auth.guard';

export type OptionallyAuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

@Injectable()
export class OptionalJwtCookieAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OptionallyAuthenticatedRequest>();
    const accessToken = readCookie(request, ACCESS_TOKEN_COOKIE);
    if (!accessToken) return true;

    try {
      request.user = await this.auth.findMe(accessToken);
    } catch {
      // Public optional-auth routes remain available when a cookie is stale or invalid.
    }
    return true;
  }
}
