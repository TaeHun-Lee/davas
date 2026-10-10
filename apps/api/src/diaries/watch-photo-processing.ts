import { WATCH_PHOTO_MAX_BYTES } from '@davas/shared';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import sharp from 'sharp';
import {
  ALLOWED_DECLARED_MIME_TYPES,
  detectImageType,
  type ValidatedProfileImage,
} from '../users/profile-image-upload';

// Phone photos are usually 2-8MB; 15MB leaves room for large-sensor JPEGs.
export { WATCH_PHOTO_MAX_BYTES };
// About 60 megapixels. Larger inputs are refused before decoding so one photo cannot exhaust
// the Raspberry Pi's memory.
const MAX_INPUT_PIXELS = 60_000_000;

export const WATCH_PHOTO_VARIANTS = {
  thumb: { maxSide: 480, quality: 72 },
  display: { maxSide: 1600, quality: 82 },
} as const;

// Keep libvips light on a 4GB board: one worker thread, no operation cache.
sharp.concurrency(1);
sharp.cache(false);

const photoError = (code: string, message: string) =>
  new BadRequestException({ statusCode: 400, code, message });

export const WATCH_PHOTO_UPLOAD_OPTIONS: MulterOptions = {
  limits: {
    fileSize: WATCH_PHOTO_MAX_BYTES,
    files: 1,
    fields: 0,
    parts: 2,
    headerPairs: 32,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_DECLARED_MIME_TYPES.has(file.mimetype)) {
      callback(
        photoError('PHOTO_TYPE_UNSUPPORTED', 'JPEG, PNG 또는 WebP 사진만 올릴 수 있어요.'),
        false,
      );
      return;
    }
    callback(null, true);
  },
};

export type UploadedPhotoFile = { mimetype: string; buffer: Buffer; size: number };

export function validateWatchPhoto(file: UploadedPhotoFile | undefined): ValidatedProfileImage {
  if (!file) throw photoError('PHOTO_REQUIRED', '올릴 사진을 골라 주세요.');
  if (file.size > WATCH_PHOTO_MAX_BYTES) {
    throw photoError('PHOTO_TOO_LARGE', '사진은 한 장에 15MB 이하만 올릴 수 있어요.');
  }
  const detected = detectImageType(file.buffer);
  if (!detected || detected.mimeType !== file.mimetype) {
    throw photoError('PHOTO_TYPE_UNSUPPORTED', 'JPEG, PNG 또는 WebP 사진만 올릴 수 있어요.');
  }
  return detected;
}

export type ProcessedWatchPhoto = {
  thumb: Buffer;
  display: Buffer;
  width: number;
  height: number;
  placeholder: string;
};

/**
 * Makes the copies the app actually shows: a small thumbnail for lists, a screen-sized
 * display copy, and a tiny blurred preview that is inlined so something appears instantly.
 * Copies are turned upright and lose all metadata (including GPS); the original file is
 * kept as uploaded and only its uploader can download it.
 */
export async function processWatchPhoto(buffer: Buffer): Promise<ProcessedWatchPhoto> {
  try {
    const upright = sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' }).rotate();
    const resize = (maxSide: number) =>
      upright.clone().resize({
        width: maxSide,
        height: maxSide,
        fit: 'inside',
        withoutEnlargement: true,
      });
    const display = await resize(WATCH_PHOTO_VARIANTS.display.maxSide)
      .webp({ quality: WATCH_PHOTO_VARIANTS.display.quality })
      .toBuffer({ resolveWithObject: true });
    const thumb = await resize(WATCH_PHOTO_VARIANTS.thumb.maxSide)
      .webp({ quality: WATCH_PHOTO_VARIANTS.thumb.quality })
      .toBuffer();
    const tiny = await upright
      .clone()
      .resize({ width: 24, height: 24, fit: 'inside' })
      .webp({ quality: 40 })
      .toBuffer();
    return {
      display: display.data,
      width: display.info.width,
      height: display.info.height,
      thumb,
      placeholder: `data:image/webp;base64,${tiny.toString('base64')}`,
    };
  } catch {
    throw photoError(
      'PHOTO_UNREADABLE',
      '사진을 읽지 못했어요. 다른 사진을 고르거나 사진을 다시 저장한 뒤 올려 주세요.',
    );
  }
}
