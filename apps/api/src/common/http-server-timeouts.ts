export type ConfigurableHttpServer = {
  requestTimeout: number;
  headersTimeout: number;
  keepAliveTimeout: number;
  maxRequestsPerSocket: number | null;
};

export function configureHttpServerTimeouts(server: ConfigurableHttpServer): void {
  // Leave room for a 5 MiB profile image over a slow mobile link.
  server.requestTimeout = 60_000;
  server.headersTimeout = 15_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
}
