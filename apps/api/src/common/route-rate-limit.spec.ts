import assert from 'node:assert/strict';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { after, before, describe, it } from 'node:test';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { MediaController } from '../media/media.controller';
import { MediaSelectionService } from '../media/media-selection.service';
import { MediaService } from '../media/media.service';

const auth = {
  login: async () => ({
    accessToken: 'token',
    user: { id: 'user-1', email: 'u@example.com', nickname: 'user' },
  }),
};
const media = {
  search: async () => ({ items: [] }),
  searchPeople: async () => ({ items: [] }),
  findPersonCredits: async () => ({ items: [] }),
  findDetail: async () => ({ id: 'media-1' }),
};

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 1_000, blockDuration: 1_000 }]),
  ],
  controllers: [AuthController, MediaController],
  providers: [
    { provide: AuthService, useValue: auth },
    { provide: MediaService, useValue: media },
    { provide: MediaSelectionService, useValue: { select: async () => ({}) } },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
class RateLimitContractModule {}

describe('route-specific rate limits', () => {
  let app: Awaited<ReturnType<typeof NestFactory.create>>;
  let baseUrl: string;

  before(async () => {
    app = await NestFactory.create(RateLimitContractModule, { logger: false });
    Object.assign(app.get(AuthController), { auth });
    Object.assign(app.get(MediaController), {
      mediaService: media,
      mediaSelectionService: { select: async () => ({}) },
    });
    const server = await app.listen(0, '127.0.0.1');
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('missing port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await app.close();
  });

  it('limits repeated login attempts independently from the global budget', async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'u@example.com', password: 'password' }),
      });
    }

    assert.equal(response?.status, 429);
  });

  it('limits repeated TMDB search requests independently from the global budget', async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 31; attempt += 1) {
      response = await fetch(`${baseUrl}/media/search?q=interstellar`);
    }

    assert.equal(response?.status, 429);
  });
});
