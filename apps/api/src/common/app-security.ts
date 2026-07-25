import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  type INestApplication,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import helmet from 'helmet';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const DEVELOPMENT_ORIGIN = 'http://localhost:3000';

export type SecurityEnvironment = Record<string, string | undefined>;

export function resolveAllowedOrigins(
  environment: SecurityEnvironment = process.env,
  nodeEnvironment = environment.NODE_ENV ?? 'development',
): string[] {
  const configured = environment.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!configured?.length) {
    if (nodeEnvironment === 'production') {
      throw new Error('CORS_ORIGINS is required in production.');
    }
    return [DEVELOPMENT_ORIGIN];
  }

  const origins = configured.map((origin) => {
    if (origin === '*') {
      throw new Error('CORS wildcard is forbidden when credentials are enabled.');
    }
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error(`CORS origin must be an exact HTTP(S) origin: ${origin}`);
    }
    return parsed.origin;
  });

  return [...new Set(origins)];
}

export function validateProductionConfiguration(
  environment: SecurityEnvironment = process.env,
): void {
  if (environment.NODE_ENV !== 'production') return;

  const issues: string[] = [];
  try {
    resolveAllowedOrigins(environment, 'production');
  } catch (error) {
    issues.push(String(error));
  }

  const jwtSecret = environment.JWT_SECRET ?? '';
  if (jwtSecret.length < 32 || jwtSecret === 'dev-secret-change-me') {
    issues.push('JWT_SECRET must contain at least 32 non-default characters.');
  }
  if (!environment.DATABASE_URL?.trim()) {
    issues.push('DATABASE_URL is required in production.');
  }
  if (environment.COOKIE_SECURE !== 'true') {
    issues.push('COOKIE_SECURE must be true in production.');
  }

  if (issues.length > 0) {
    throw new Error(`Invalid production configuration: ${issues.join(' ')}`);
  }
}

export function configureHttpSecurity(
  app: INestApplication,
  environment: SecurityEnvironment = process.env,
): void {
  validateProductionConfiguration(environment);
  const allowedOrigins = resolveAllowedOrigins(environment);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Content-Type'],
    maxAge: 600,
  });
}

@Injectable()
export class OriginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(request.method.toUpperCase())) return true;

    const origin = request.headers.origin;
    if (!origin) return true;
    const allowed = resolveAllowedOrigins();
    if (!allowed.includes(origin)) {
      throw new ForbiddenException('허용되지 않은 요청 출처입니다.');
    }
    return true;
  }
}
