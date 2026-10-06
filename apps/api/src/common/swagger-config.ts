export type SwaggerEnvironment = Record<string, string | undefined>;

export function shouldEnableSwagger(environment: SwaggerEnvironment = process.env): boolean {
  if (environment.NODE_ENV === 'production') return false;
  return environment.SWAGGER_ENABLED !== 'false';
}
