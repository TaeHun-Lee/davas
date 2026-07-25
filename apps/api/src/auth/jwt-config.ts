const UNIT_SECONDS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
} as const;

const MAX_JWT_EXPIRY_SECONDS = 365 * 24 * 60 * 60;

export function parseJwtExpirySeconds(value: string | undefined): number {
  const candidate = value ?? '7d';
  const match = /^(\d+)([smhd])$/.exec(candidate);
  if (!match) {
    throw new Error(
      'JWT_ACCESS_EXPIRES_IN must be an integer followed by s, m, h, or d.',
    );
  }

  const amount = Number(match[1]);
  const unit = match[2] as keyof typeof UNIT_SECONDS;
  const seconds = amount * UNIT_SECONDS[unit];
  if (!Number.isSafeInteger(seconds) || seconds < 1 || seconds > MAX_JWT_EXPIRY_SECONDS) {
    throw new Error(
      'JWT_ACCESS_EXPIRES_IN must be between 1 second and 365 days.',
    );
  }

  return seconds;
}
