import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WATCH_PHOTO_MAX_COUNT, type WatchPhotoView } from '@davas/shared';
import { EntityManager, In, IsNull, LessThan, Repository } from 'typeorm';
import { DiaryEntity, FileCleanupJobEntity, WatchPhotoEntity } from '../database/entities';
import { DiaryAccessService } from './diary-access.service';
import {
  processWatchPhoto,
  validateWatchPhoto,
  type UploadedPhotoFile,
} from './watch-photo-processing';
import { uploadsRoot } from '../common/uploads-root';
import { DAY_MS, HOUR_MS } from '../common/time';

export type WatchPhotoVariant = 'thumb' | 'display' | 'original';

// Photos picked in the composer but never saved with a record are dropped after a day.
const STAGED_PHOTO_TTL_MS = DAY_MS;
// Enough for one full composer (10) plus retries, without letting one account fill the disk.
const MAX_STAGED_PHOTOS = 30;
// Abandoned uploads are also swept hourly, not only on the same person's next upload.
const SWEEP_INTERVAL_MS = HOUR_MS;
const SWEEP_BATCH_SIZE = 200;

const ORIGINAL_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Where a photo's original and resized copies live on disk. */
export function watchPhotoPaths(storageKey: string, originalMimeType: string) {
  const root = join(uploadsRoot(), 'watch-photos');
  return {
    original: join(
      root,
      `${storageKey}-original.${ORIGINAL_EXTENSIONS[originalMimeType] ?? 'bin'}`,
    ),
    display: join(root, `${storageKey}-display.webp`),
    thumb: join(root, `${storageKey}-thumb.webp`),
  };
}

const apiError = (status: 400 | 404, code: string, message: string) =>
  status === 404
    ? new NotFoundException({ statusCode: status, code, message })
    : new BadRequestException({ statusCode: status, code, message });

@Injectable()
export class WatchPhotosService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WatchPhotosService.name);
  private sweepTimer?: NodeJS.Timeout;

  constructor(
    @InjectRepository(WatchPhotoEntity)
    private readonly photos: Repository<WatchPhotoEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    private readonly access: DiaryAccessService,
  ) {}

  /** Stores a photo before its record exists; `attach` links it when the record is saved. */
  async stage(uploaderId: string, file: UploadedPhotoFile | undefined) {
    const type = validateWatchPhoto(file);
    await this.dropExpiredStaged(uploaderId);
    const staged = await this.photos.count({ where: { uploaderId, diaryId: IsNull() } });
    if (staged >= MAX_STAGED_PHOTOS) {
      throw apiError(
        400,
        'PHOTO_STAGING_FULL',
        '저장하지 않은 사진이 너무 많아요. 작성 중인 기록을 먼저 저장해 주세요.',
      );
    }
    const processed = await processWatchPhoto(file!.buffer);
    const storageKey = randomBytes(16).toString('hex');
    const paths = this.paths(storageKey, type.mimeType);
    await mkdir(this.root(), { recursive: true });
    try {
      // `wx` refuses to overwrite: a key collision must fail instead of replacing a photo.
      await writeFile(paths.original, file!.buffer, { flag: 'wx' });
      await writeFile(paths.display, processed.display, { flag: 'wx' });
      await writeFile(paths.thumb, processed.thumb, { flag: 'wx' });
      const saved = await this.photos.save(
        this.photos.create({
          diaryId: null,
          uploaderId,
          position: 0,
          storageKey,
          originalMimeType: type.mimeType,
          originalBytes: file!.size,
          width: processed.width,
          height: processed.height,
          placeholder: processed.placeholder,
          attachedAt: null,
        }),
      );
      return this.view(saved, uploaderId);
    } catch (error) {
      await Promise.all(Object.values(paths).map((path) => unlink(path).catch(() => undefined)));
      throw error;
    }
  }

  /**
   * Makes `photoIds` (in order) `accountId`'s own photos on the record. Each id must be a photo
   * of this record or one `accountId` staged; their own photos left out are removed with their
   * files. Everyone manages only their own photos: other people's stay whatever the list says.
   * The author's photos come first, then each other person's in the order they first added
   * some, ten at most in all. Returns how many photos were newly added.
   */
  async replaceForDiary(
    manager: EntityManager,
    diaryId: string,
    accountId: string,
    photoIds: string[],
    authorId = accountId,
  ) {
    const ids = [...new Set(photoIds)];
    if (ids.length > WATCH_PHOTO_MAX_COUNT) {
      throw apiError(400, 'TOO_MANY_PHOTOS', '사진은 기록 하나에 10장까지 올릴 수 있어요.');
    }
    const repo = manager.getRepository(WatchPhotoEntity);
    const current = await repo.find({ where: { diaryId } });
    const requested = ids.length ? await repo.find({ where: { id: In(ids) } }) : [];
    const usable = requested.filter(
      (photo) =>
        photo.diaryId === diaryId || (photo.diaryId === null && photo.uploaderId === accountId),
    );
    if (usable.length !== ids.length) {
      throw apiError(
        400,
        'PHOTO_NOT_FOUND',
        '올린 사진 일부를 찾을 수 없어요. 사진을 다시 올려 주세요.',
      );
    }
    const byId = new Map(usable.map((photo) => [photo.id, photo]));
    const mine = ids.map((id) => byId.get(id)!).filter((photo) => photo.uploaderId === accountId);
    const others = current.filter((photo) => photo.uploaderId !== accountId);
    if (mine.length + others.length > WATCH_PHOTO_MAX_COUNT) {
      throw apiError(
        400,
        'TOO_MANY_PHOTOS',
        `함께 올린 사진까지 기록 하나에 10장이에요. 지금은 ${Math.max(0, WATCH_PHOTO_MAX_COUNT - others.length)}장까지 올릴 수 있어요.`,
      );
    }

    const removed = current.filter(
      (photo) => photo.uploaderId === accountId && !mine.includes(photo),
    );
    if (removed.length) {
      await repo.delete({ id: In(removed.map((photo) => photo.id)) });
      await this.enqueueFileCleanup(manager, removed);
    }
    const added = mine.filter((photo) => photo.diaryId !== diaryId).length;
    const now = new Date();
    for (const photo of mine)
      Object.assign(photo, { diaryId, attachedAt: photo.attachedAt ?? now });

    const groups = new Map<string, WatchPhotoEntity[]>();
    for (const photo of [...others].sort((left, right) => left.position - right.position)) {
      groups.set(photo.uploaderId, [...(groups.get(photo.uploaderId) ?? []), photo]);
    }
    if (mine.length) groups.set(accountId, mine);
    const firstAdded = (photos: WatchPhotoEntity[]) =>
      Math.min(...photos.map((photo) => (photo.attachedAt ?? now).getTime()));
    const ordered = [...groups.entries()]
      .sort(([left, leftPhotos], [right, rightPhotos]) =>
        left === authorId
          ? -1
          : right === authorId
            ? 1
            : firstAdded(leftPhotos) - firstAdded(rightPhotos),
      )
      .flatMap(([, photos]) => photos);
    if (ordered.length) {
      await repo.save(ordered.map((photo, position) => Object.assign(photo, { position })));
    }
    return added;
  }

  async open(photoId: string, variant: WatchPhotoVariant, viewerId: string) {
    const photo = await this.photos.findOne({ where: { id: photoId } });
    const notFound = () => apiError(404, 'PHOTO_NOT_FOUND', '사진을 찾을 수 없어요.');
    if (!photo) throw notFound();
    const isUploader = photo.uploaderId === viewerId;
    // The untouched original may carry location metadata, so only its uploader gets it.
    if (variant === 'original' && !isUploader) throw notFound();
    if (!isUploader) {
      if (!photo.diaryId) throw notFound();
      const diary = await this.diaries.findOne({ where: { id: photo.diaryId } });
      await this.access.assertCanView(diary, viewerId).catch(() => {
        throw notFound();
      });
      // Someone who left the space takes their photos with them, as the record view does.
      const uploaderVisible = await this.access.isAuthorVisibleTo(
        { id: diary!.id, userId: photo.uploaderId },
        viewerId,
      );
      if (!uploaderVisible) throw notFound();
    }
    const paths = this.paths(photo.storageKey, photo.originalMimeType);
    return variant === 'original'
      ? {
          path: paths.original,
          mimeType: photo.originalMimeType,
          downloadName: `davas-${photo.id}.${ORIGINAL_EXTENSIONS[photo.originalMimeType] ?? 'jpg'}`,
        }
      : { path: paths[variant], mimeType: 'image/webp', downloadName: null };
  }

  /** Removes every photo of a record that is being deleted; files go after the commit. */
  async removeAllForDiary(manager: EntityManager, diaryId: string) {
    const repo = manager.getRepository(WatchPhotoEntity);
    const photos = await repo.find({ where: { diaryId } });
    if (!photos.length) return;
    await repo.delete({ id: In(photos.map((photo) => photo.id)) });
    await this.enqueueFileCleanup(manager, photos);
  }

  /** Staged photos older than a day that were never saved with a record, for every account. */
  async sweepExpiredStaged(now = new Date()) {
    const expired = await this.photos.find({
      where: {
        diaryId: IsNull(),
        createdAt: LessThan(new Date(now.getTime() - STAGED_PHOTO_TTL_MS)),
      },
      take: SWEEP_BATCH_SIZE,
    });
    if (!expired.length) return 0;
    await this.photos.manager.transaction(async (manager) => {
      await manager.getRepository(WatchPhotoEntity).delete({ id: In(expired.map((p) => p.id)) });
      await this.enqueueFileCleanup(manager, expired);
    });
    return expired.length;
  }

  onModuleInit() {
    const sweep = () =>
      void this.sweepExpiredStaged().catch((error) =>
        this.logger.warn(`staged photo sweep failed: ${String(error)}`),
      );
    this.sweepTimer = setInterval(sweep, SWEEP_INTERVAL_MS);
    this.sweepTimer.unref();
  }

  onModuleDestroy() {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
  }

  view(photo: WatchPhotoEntity, viewerId: string): WatchPhotoView {
    const base = `/v1/watch-photos/${photo.id}`;
    return {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      placeholder: photo.placeholder,
      thumbUrl: `${base}/thumb`,
      displayUrl: `${base}/display`,
      originalUrl: photo.uploaderId === viewerId ? `${base}/original` : null,
      uploaderAccountId: photo.uploaderId,
    };
  }

  private async dropExpiredStaged(uploaderId: string) {
    const expired = await this.photos.find({
      where: {
        uploaderId,
        diaryId: IsNull(),
        createdAt: LessThan(new Date(Date.now() - STAGED_PHOTO_TTL_MS)),
      },
    });
    if (!expired.length) return;
    await this.photos.manager.transaction(async (manager) => {
      await manager.getRepository(WatchPhotoEntity).delete({ id: In(expired.map((p) => p.id)) });
      await this.enqueueFileCleanup(manager, expired);
    });
  }

  // Files are removed by FileCleanupService after the transaction commits, so a rollback
  // never leaves a record pointing at deleted files.
  private async enqueueFileCleanup(manager: EntityManager, photos: WatchPhotoEntity[]) {
    const jobs = manager.getRepository(FileCleanupJobEntity);
    await jobs.save(
      photos.flatMap((photo) =>
        Object.values(this.paths(photo.storageKey, photo.originalMimeType)).map((path) =>
          jobs.create({ userId: photo.uploaderId, kind: 'WATCH_PHOTO', path }),
        ),
      ),
    );
  }

  private root() {
    return join(uploadsRoot(), 'watch-photos');
  }

  private paths(storageKey: string, originalMimeType: string) {
    return watchPhotoPaths(storageKey, originalMimeType);
  }
}
