import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { HttpException, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';
import type { EntityManager } from 'typeorm';
import { DiaryEntity, FileCleanupJobEntity, WatchPhotoEntity } from '../database/entities';
import type { DiaryAccessService } from './diary-access.service';
import { WatchPhotosService } from './watch-photos.service';

type Row = Record<string, unknown>;

function operatorMatches(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && '_type' in expected) {
    const operator = expected as { _type: string; _value: unknown };
    if (operator._type === 'isNull') return actual === null;
    if (operator._type === 'in') return (operator._value as unknown[]).includes(actual);
    if (operator._type === 'lessThan') return (actual as Date) < (operator._value as Date);
  }
  return actual === expected;
}

function fakeRepository<T extends object>(rows: T[], create: () => T) {
  const matches = (row: T, where: Row = {}) =>
    Object.entries(where).every(([key, expected]) => operatorMatches((row as Row)[key], expected));
  let sequence = 0;
  return {
    create: (input: Partial<T>) => Object.assign(create(), input),
    find: async ({ where }: { where?: Row } = {}) => rows.filter((row) => matches(row, where)),
    findOne: async ({ where }: { where: Row }) => rows.find((row) => matches(row, where)) ?? null,
    count: async ({ where }: { where?: Row } = {}) =>
      rows.filter((row) => matches(row, where)).length,
    save: async (input: T | T[]) => {
      for (const row of Array.isArray(input) ? input : [input]) {
        const record = row as Row;
        record.id ??= `row-${++sequence}`;
        record.createdAt ??= new Date();
        if (!rows.includes(row)) rows.push(row);
      }
      return input;
    },
    delete: async (where: Row) => {
      for (const row of rows.filter((candidate) => matches(candidate, where))) {
        rows.splice(rows.indexOf(row), 1);
      }
    },
  };
}

function setup(canView: (viewerId: string) => boolean) {
  const photos: WatchPhotoEntity[] = [];
  const jobs: FileCleanupJobEntity[] = [];
  const diaries = [Object.assign(new DiaryEntity(), { id: 'diary-1', userId: 'jiwoo' })];
  const repositories = new Map<unknown, unknown>([
    [WatchPhotoEntity, fakeRepository(photos, () => new WatchPhotoEntity())],
    [FileCleanupJobEntity, fakeRepository(jobs, () => new FileCleanupJobEntity())],
    [DiaryEntity, fakeRepository(diaries, () => new DiaryEntity())],
  ]);
  const manager = {
    getRepository: (target: unknown) => repositories.get(target),
    transaction: async <R>(work: (inner: EntityManager) => Promise<R>) =>
      work(manager as never as EntityManager),
  };
  const photoRepository = Object.assign(repositories.get(WatchPhotoEntity) as object, {
    manager,
  });
  const access = {
    assertCanView: async (_diary: unknown, viewerId: string) => {
      if (!canView(viewerId)) throw new NotFoundException();
    },
  } as unknown as DiaryAccessService;
  const service = new WatchPhotosService(
    photoRepository as never,
    repositories.get(DiaryEntity) as never,
    access,
  );
  return { jobs, manager: manager as never as EntityManager, photos, service };
}

const code = (error: unknown) =>
  error instanceof HttpException && (error.getResponse() as { code?: string }).code;

describe('WatchPhotosService', () => {
  let uploads: string;
  let jpeg: Buffer;
  before(async () => {
    uploads = mkdtempSync(join(tmpdir(), 'davas-photos-'));
    process.env.UPLOADS_DIR = uploads;
    jpeg = await sharp({
      create: { width: 900, height: 600, channels: 3, background: { r: 10, g: 80, b: 160 } },
    })
      .jpeg()
      .toBuffer();
  });
  after(() => {
    delete process.env.UPLOADS_DIR;
    rmSync(uploads, { recursive: true, force: true });
  });

  const upload = () => ({ mimetype: 'image/jpeg', buffer: jpeg, size: jpeg.length });

  it('stores the original and both copies, and offers the original only to its uploader', async () => {
    const { photos, service } = setup(() => true);
    const view = await service.stage('jiwoo', upload());
    assert.equal(view.originalUrl, `/v1/watch-photos/${view.id}/original`);
    assert.deepEqual([view.width, view.height], [900, 600]);
    assert.equal(service.view(photos[0], 'minho').originalUrl, null);
    for (const variant of ['original', 'display', 'thumb'] as const) {
      const file = await service.open(view.id, variant, 'jiwoo');
      assert.ok(existsSync(file.path), variant);
    }
  });

  it('serves a record photo only to people who can see the record', async () => {
    const { manager, service } = setup((viewerId) => viewerId === 'minho');
    const view = await service.stage('jiwoo', upload());
    // Before it is attached, nobody but the uploader can open it.
    await assert.rejects(service.open(view.id, 'display', 'minho'), NotFoundException);
    await service.replaceForDiary(manager, 'diary-1', 'jiwoo', [view.id]);
    assert.equal((await service.open(view.id, 'display', 'minho')).mimeType, 'image/webp');
    await assert.rejects(service.open(view.id, 'original', 'minho'), NotFoundException);
    await assert.rejects(service.open(view.id, 'thumb', 'stranger'), NotFoundException);
  });

  it('attaches only your own staged photos, at most ten, and cleans up removed ones', async () => {
    const { jobs, manager, photos, service } = setup(() => true);
    const mine = await service.stage('jiwoo', upload());
    const theirs = await service.stage('minho', upload());
    await assert.rejects(
      service.replaceForDiary(manager, 'diary-1', 'jiwoo', [mine.id, theirs.id]),
      (error) => code(error) === 'PHOTO_NOT_FOUND',
    );
    await assert.rejects(
      service.replaceForDiary(
        manager,
        'diary-1',
        'jiwoo',
        Array.from({ length: 11 }, (_, index) => `photo-${index}`),
      ),
      (error) => code(error) === 'TOO_MANY_PHOTOS',
    );

    const second = await service.stage('jiwoo', upload());
    await service.replaceForDiary(manager, 'diary-1', 'jiwoo', [second.id, mine.id]);
    assert.deepEqual(
      photos
        .filter((photo) => photo.diaryId === 'diary-1')
        .sort((a, b) => a.position - b.position)
        .map((photo) => photo.id),
      [second.id, mine.id],
    );

    await service.replaceForDiary(manager, 'diary-1', 'jiwoo', [mine.id]);
    assert.equal(
      photos.some((photo) => photo.id === second.id),
      false,
    );
    assert.equal(jobs.filter((job) => job.kind === 'WATCH_PHOTO').length, 3);
  });
});
