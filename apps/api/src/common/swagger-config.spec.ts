import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { shouldEnableSwagger } from './swagger-config';

describe('Swagger runtime exposure', () => {
  it('enables docs during development by default', () => {
    assert.equal(shouldEnableSwagger({ NODE_ENV: 'development' }), true);
  });

  it('disables docs in production even when explicitly requested', () => {
    assert.equal(shouldEnableSwagger({ NODE_ENV: 'production', SWAGGER_ENABLED: 'true' }), false);
  });

  it('allows developers to disable docs locally', () => {
    assert.equal(shouldEnableSwagger({ NODE_ENV: 'development', SWAGGER_ENABLED: 'false' }), false);
  });
});
