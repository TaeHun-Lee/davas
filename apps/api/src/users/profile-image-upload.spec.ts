import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  type ProfileImageContent,
  PROFILE_IMAGE_MAX_BYTES,
  PROFILE_IMAGE_UPLOAD_OPTIONS,
  validateProfileImageContent,
} from './profile-image-upload';

function uploadFile(
  mimetype: string,
  bytes: number[],
): ProfileImageContent {
  return {
    mimetype,
    size: bytes.length,
    buffer: Buffer.from(bytes),
  };
}

describe('profile image upload boundary', () => {
  it('bounds multipart parsing before service allocation', () => {
    assert.equal(PROFILE_IMAGE_MAX_BYTES, 5 * 1024 * 1024);
    assert.deepEqual(PROFILE_IMAGE_UPLOAD_OPTIONS.limits, {
      fileSize: PROFILE_IMAGE_MAX_BYTES,
      files: 1,
      fields: 0,
      parts: 2,
      headerPairs: 32,
    });
  });

  it('accepts matching JPEG, PNG and WebP signatures', () => {
    assert.equal(
      validateProfileImageContent(
        uploadFile('image/jpeg', [0xff, 0xd8, 0xff, 0xe0]),
      ).extension,
      'jpg',
    );
    assert.equal(
      validateProfileImageContent(
        uploadFile('image/png', [
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        ]),
      ).extension,
      'png',
    );
    assert.equal(
      validateProfileImageContent(
        uploadFile('image/webp', [
          0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
        ]),
      ).extension,
      'webp',
    );
  });

  it('rejects an oversized file even if the parser boundary is bypassed', () => {
    const file = uploadFile('image/jpeg', [0xff, 0xd8, 0xff, 0xe0]);
    file.size = PROFILE_IMAGE_MAX_BYTES + 1;

    assert.throws(() => validateProfileImageContent(file), /5MB 이하/);
  });

  it('rejects spoofed, unsupported and empty image content', () => {
    for (const file of [
      uploadFile('image/jpeg', [0x3c, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74]),
      uploadFile('image/gif', [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]),
      uploadFile('image/png', []),
    ]) {
      assert.throws(
        () => validateProfileImageContent(file),
        /유효한 JPEG, PNG 또는 WebP 이미지/,
      );
    }
  });
});
