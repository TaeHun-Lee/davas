export type ConfigurableHttpServer = {
  requestTimeout: number;
  headersTimeout: number;
  keepAliveTimeout: number;
  maxRequestsPerSocket: number | null;
};

export function configureHttpServerTimeouts(server: ConfigurableHttpServer): void {
  // Time to receive a whole request. A 15 MB record photo over a weak theater or mobile link
  // (about 0.5 Mbps) takes roughly four minutes; slow-header attacks are still cut off by
  // headersTimeout below, and upload bodies are capped by multer's size limit.
  server.requestTimeout = 300_000;
  server.headersTimeout = 15_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
}
