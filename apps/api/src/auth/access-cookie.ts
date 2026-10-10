import { parseJwtExpirySeconds } from './jwt-config';

/** How the session cookie is set and cleared: HttpOnly, lax, secure behind HTTPS. */
export function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
  };
}

/** The cookie lives exactly as long as the token inside it. */
export function accessCookieMaxAgeMs() {
  return parseJwtExpirySeconds(process.env.JWT_ACCESS_EXPIRES_IN) * 1000;
}
