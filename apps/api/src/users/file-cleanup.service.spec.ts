import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { Repository } from 'typeorm';
import type { FileCleanupJobEntity } from '../database/entities';
import { FileCleanupService } from './file-cleanup.service';

type CleanupJob = FileCleanupJobEntity & {
  id: string;
  path: string;
  attempts: number;
  lastError: string | null;
  completedAt: Date | null;
};

class FakeCleanupRepository {
  saved: CleanupJob[] = [];
  constructor(private readonly jobs: CleanupJob[]) {}

  async find() {
    return this.jobs;
  }

  async save(job: CleanupJob) {
    this.saved.push(job);
    return job;
  }
}

describe('FileCleanupService', () => {
  it('completes deleted files and records bounded retry state on failure', async () => {
    const root = await mkdtemp(join(tmpdir(), 'davas-cleanup-'));
    const removable = join(root, 'remove.jpg');
    const blocked = join(root, 'directory-not-file');
    await writeFile(removable, Buffer.from('synthetic'));
    await mkdir(blocked);

    const successJob = {
      id: 'job-1',
      userId: 'user-1',
      kind: 'PROFILE_IMAGE',
      path: removable,
      attempts: 0,
      lastError: null,
      completedAt: null,
      createdAt: new Date(),
    } as CleanupJob;
    const failedJob = {
      ...successJob,
      id: 'job-2',
      path: blocked,
    } as CleanupJob;
    const repository = new FakeCleanupRepository([successJob, failedJob]);
    const service = new FileCleanupService(
      repository as unknown as Repository<FileCleanupJobEntity>,
    );

    try {
      const result = await service.runPending();

      assert.deepEqual(result, { processed: 2, completed: 1, failed: 1 });
      assert(successJob.completedAt instanceof Date);
      assert.equal(successJob.lastError, null);
      assert.equal(failedJob.completedAt, null);
      assert.equal(failedJob.attempts, 1);
      assert.match(failedJob.lastError ?? '', /EISDIR|EPERM/);
      assert.equal(repository.saved.length, 2);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
