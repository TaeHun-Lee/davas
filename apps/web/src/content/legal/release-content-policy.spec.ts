import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';

const root = resolve(process.cwd(), '../..');

describe('unofficial self-host release content policy', () => {
  it('does not block the release gate on official-service legal content', () => {
    const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };

    const releaseGate = packageJson.scripts['verify:release'] ?? '';
    assert.doesNotMatch(releaseGate, /verify-release-content\.mjs/);
    assert.match(releaseGate, /npm run verify/);
    assert.match(releaseGate, /npm run verify:caddy/);
    assert.match(releaseGate, /npm run audit:prod/);
  });

  it('allows fixture legal pages in the user-approved unofficial self-host scope', () => {
    const legalSource = readFileSync(resolve(root, 'apps/web/src/content/legal/index.ts'), 'utf8');

    assert.match(legalSource, /fixture\s*:\s*true/);
  });
});
