import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { HOUR_MS } from '../common/time';

const PURGE_INTERVAL_MS = HOUR_MS;

/**
 * Finishes account deletions whose 30-day grace period has passed: once at start-up and then
 * every hour, so a deletion never waits much past its date. Each run is one transaction that
 * skips rows another run has locked, so overlapping runs cannot purge an account twice.
 */
@Injectable()
export class AccountDeletionPurgeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AccountDeletionPurgeService.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(private readonly users: UsersService) {}

  onModuleInit(): void {
    void this.run();
    this.timer = setInterval(() => void this.run(), PURGE_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async run(now = new Date()) {
    if (this.running) return { purged: 0 };
    this.running = true;
    try {
      const result = await this.users.purgeExpiredDeletions(now);
      if (result.purged) this.logger.log(`account-deletion-purged count=${result.purged}`);
      return result;
    } catch (error) {
      this.logger.error('account-deletion-purge-failed', error);
      return { purged: 0 };
    } finally {
      this.running = false;
    }
  }
}
