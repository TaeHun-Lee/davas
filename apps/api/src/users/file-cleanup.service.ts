import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { IsNull, LessThan, Repository } from 'typeorm';
import { FileCleanupJobEntity } from '../database/entities';

const CLEANUP_INTERVAL_MS = 60_000;
const CLEANUP_BATCH_SIZE = 20;
const MAX_CLEANUP_ATTEMPTS = 10;

export type FileCleanupRunResult = {
  processed: number;
  completed: number;
  failed: number;
};

@Injectable()
export class FileCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FileCleanupService.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    @InjectRepository(FileCleanupJobEntity)
    private readonly jobs: Repository<FileCleanupJobEntity>,
  ) {}

  onModuleInit(): void {
    void this.runPending().catch((error) =>
      this.logger.error('file-cleanup-run-failed', error),
    );
    this.timer = setInterval(() => {
      void this.runPending().catch((error) =>
        this.logger.error('file-cleanup-run-failed', error),
      );
    }, CLEANUP_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async runPending(): Promise<FileCleanupRunResult> {
    if (this.running) return { processed: 0, completed: 0, failed: 0 };
    this.running = true;
    try {
      const pending = await this.jobs.find({
        where: {
          completedAt: IsNull(),
          attempts: LessThan(MAX_CLEANUP_ATTEMPTS),
        },
        order: { createdAt: 'ASC' },
        take: CLEANUP_BATCH_SIZE,
      });
      let completed = 0;
      let failed = 0;

      for (const job of pending) {
        try {
          await unlink(job.path);
          job.completedAt = new Date();
          job.lastError = null;
          completed += 1;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            job.completedAt = new Date();
            job.lastError = null;
            completed += 1;
          } else {
            job.attempts += 1;
            job.lastError = String(error).slice(0, 1_000);
            failed += 1;
          }
        }
        await this.jobs.save(job);
      }

      if (pending.length > 0) {
        this.logger.log('file-cleanup-run-complete', {
          processed: pending.length,
          completed,
          failed,
        });
      }
      return { processed: pending.length, completed, failed };
    } finally {
      this.running = false;
    }
  }
}
