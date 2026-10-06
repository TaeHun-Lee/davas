export type ConfigurableHttpServer = {
  requestTimeout: number;
  headersTimeout: number;
  keepAliveTimeout: number;
  maxRequestsPerSocket: number | null;
};

export function configureHttpServerTimeouts(
  server: ConfigurableHttpServer,
): void {
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
}
