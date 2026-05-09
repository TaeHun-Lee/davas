import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const appIconPath = join(process.cwd(), 'src/app/icon.jpg');
const suppliedFaviconSha256 = '9f4f3d65b5febc26ad0dced1f55f06e2c8c17fe6f4ef673cbeaa0b06cf76813a';

describe('Davas favicon', () => {
  it('uses the supplied Davas image as the App Router favicon asset', () => {
    assert.equal(existsSync(appIconPath), true);

    const icon = readFileSync(appIconPath);
    assert.equal(icon.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert.equal(createHash('sha256').update(icon).digest('hex'), suppliedFaviconSha256);
  });
});
