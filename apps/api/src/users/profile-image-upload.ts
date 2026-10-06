import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export type ProfileImageContent = {
  mimetype: string;
  buffer: Buffer;
  size: number;
};

const ALLOWED_DECLARED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const PROFILE_IMAGE_UPLOAD_OPTIONS: MulterOptions = {
  limits: {
    fileSize: PROFILE_IMAGE_MAX_BYTES,
    files: 1,
    fields: 0,
    parts: 2,
    headerPairs: 32,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_DECLARED_MIME_TYPES.has(file.mimetype)) {
      callback(
        new BadRequestException(
          '유효한 JPEG, PNG 또는 WebP 이미지만 업로드할 수 있습니다.',
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};

export type ValidatedProfileImage = {
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  extension: 'jpg' | 'png' | 'webp';
};

function hasPrefix(buffer: Buffer, prefix: number[]) {
  return (
    buffer.length >= prefix.length &&
    prefix.every((byte, index) => buffer[index] === byte)
  );
}

function detectProfileImage(buffer: Buffer): ValidatedProfileImage | null {
  if (hasPrefix(buffer, [0xff, 0xd8, 0xff])) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
  if (
    hasPrefix(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }
  if (
    hasPrefix(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    buffer.length >= 12 &&
    buffer.subarray(8, 12).equals(Buffer.from('WEBP'))
  ) {
    return { mimeType: 'image/webp', extension: 'webp' };
  }
  return null;
}

export function validateProfileImageContent(
  file: ProfileImageContent,
): ValidatedProfileImage {
  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    throw new BadRequestException(
      '프로필 이미지는 5MB 이하만 업로드할 수 있습니다.',
    );
  }

  const detected = detectProfileImage(file.buffer);
  if (!detected || detected.mimeType !== file.mimetype) {
    throw new BadRequestException(
      '유효한 JPEG, PNG 또는 WebP 이미지가 아닙니다.',
    );
  }
  return detected;
}
