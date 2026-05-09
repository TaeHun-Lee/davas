import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appIconPath = join(process.cwd(), 'src/app/icon.jpg');
const originalTopBiasedFaviconSha256 = '9f4f3d65b5febc26ad0dced1f55f06e2c8c17fe6f4ef673cbeaa0b06cf76813a';

describe('Davas favicon', () => {
  it('uses a JPEG App Router favicon asset that is adjusted from the supplied image', () => {
    assert.equal(existsSync(appIconPath), true);

    const icon = readFileSync(appIconPath);
    assert.equal(icon.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert.notEqual(createHash('sha256').update(icon).digest('hex'), originalTopBiasedFaviconSha256);
  });

  it('centers the visible favicon artwork vertically on its square canvas', () => {
    const geometry = execFileSync('convert', [appIconPath, '-fuzz', '8%', '-trim', '-format', '%w %h %X %Y', 'info:'], {
      encoding: 'utf8',
    }).trim();
    const [trimmedWidth, trimmedHeight, offsetX, offsetY] = geometry.split(/\s+/).map(Number);
    const canvasSize = 1254;

    assert.equal(trimmedWidth, 622);
    assert.equal(trimmedHeight, 771);
    assert.ok(Number.isFinite(offsetX));
    const trimmedCenterY = offsetY + trimmedHeight / 2;
    const canvasCenterY = canvasSize / 2;

    assert.ok(
      Math.abs(trimmedCenterY - canvasCenterY) <= 2,
      `expected vertical artwork center ${trimmedCenterY} to be near canvas center ${canvasCenterY}`,
    );
  });
});
