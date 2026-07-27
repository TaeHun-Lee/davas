export const ROUTE_RATE_LIMITS = {
  login: {
    limit: 10,
    ttl: 5 * 60_000,
    blockDuration: 15 * 60_000,
  },
  localSearch: {
    limit: 60,
    ttl: 60_000,
    blockDuration: 60_000,
  },
  tmdbRead: {
    limit: 30,
    ttl: 60_000,
    blockDuration: 2 * 60_000,
  },
  tmdbSelection: {
    limit: 20,
    ttl: 60_000,
    blockDuration: 2 * 60_000,
  },
} as const;
