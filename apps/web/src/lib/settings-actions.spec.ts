import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { completeLogout } from './settings-actions';

describe('settings logout completion', () => {
  it('purges local drafts and navigates when the API logout fails', async () => {
    const effects: string[] = [];

    await completeLogout({
      requestLogout: async () => {
        effects.push('request');
        throw new Error('logout unavailable');
      },
      purgeDrafts: () => effects.push('purge'),
      navigateToLogin: () => effects.push('navigate'),
    });

    assert.deepEqual(effects, ['request', 'purge', 'navigate']);
  });

  it('purges local drafts and navigates after API logout succeeds', async () => {
    const effects: string[] = [];

    await completeLogout({
      requestLogout: async () => {
        effects.push('request');
      },
      purgeDrafts: () => effects.push('purge'),
      navigateToLogin: () => effects.push('navigate'),
    });

    assert.deepEqual(effects, ['request', 'purge', 'navigate']);
  });

  it('does not preserve authenticated settings UI for a logout retry', () => {
    const settings = readFileSync(
      join(process.cwd(), 'src/components/settings/SettingsScreen.tsx'),
      'utf8',
    );
    assert.doesNotMatch(settings, /logoutError|로그아웃하지 못했어요|다시 시도/);
    assert.match(settings, /completeLogout/);
  });
});
