import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import {
  processWatchPhoto,
  validateWatchPhoto,
  WATCH_PHOTO_MAX_BYTES,
} from './watch-photo-processing';

async function jpeg(width: number, height: number, orientation?: number) {
  const image = sharp({
    create: { width, height, channels: 3, background: { r: 200, g: 60, b: 50 } },
  }).jpeg();
  return orientation ? image.withMetadata({ orientation }).toBuffer() : image.toBuffer();
}

describe('watch photo processing', () => {
  it('accepts real images only and enforces the size limit', async () => {
    const buffer = await jpeg(40, 30);
    assert.equal(
      validateWatchPhoto({ mimetype: 'image/jpeg', buffer, size: buffer.length }).extension,
      'jpg',
    );
    assert.throws(() => validateWatchPhoto(undefined), /올릴 사진/);
    assert.throws(
      () => validateWatchPhoto({ mimetype: 'image/png', buffer, size: buffer.length }),
      /JPEG, PNG 또는 WebP/,
    );
    assert.throws(
      () =>
        validateWatchPhoto({
          mimetype: 'image/jpeg',
          buffer,
          size: WATCH_PHOTO_MAX_BYTES + 1,
        }),
      /15MB/,
    );
  });

  it('makes upright, metadata-free WebP copies no larger than their limits', async () => {
    // Orientation 6 means the camera was rotated: a 3000x2000 sensor image shows as 2000x3000.
    const processed = await processWatchPhoto(await jpeg(3000, 2000, 6));
    assert.equal(processed.width, 1067);
    assert.equal(processed.height, 1600);
    const display = await sharp(processed.display).metadata();
    const thumb = await sharp(processed.thumb).metadata();
    assert.equal(display.format, 'webp');
    assert.equal(display.exif, undefined);
    assert.equal(display.orientation, undefined);
    assert.ok(Math.max(thumb.width!, thumb.height!) <= 480);
    assert.match(processed.placeholder, /^data:image\/webp;base64,/);
  });

  it('never enlarges small photos and rejects undecodable data', async () => {
    const processed = await processWatchPhoto(await jpeg(320, 200));
    assert.deepEqual([processed.width, processed.height], [320, 200]);
    await assert.rejects(processWatchPhoto(Buffer.from([0xff, 0xd8, 0xff, 0x00])), /읽지 못했어요/);
  });
});
