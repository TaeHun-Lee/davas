import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('account settings and recovery', () => {
  it('resets a forgotten password with a recovery code made in settings', () => {
    const auth = source('components/auth/AuthUi.tsx');
    const security = source('components/settings/SecuritySettings.tsx');
    const client = source('lib/api/auth.ts');
    assert.match(auth, /href="\/password-reset"/);
    assert.ok(existsSync(join(process.cwd(), 'src/app/password-reset/page.tsx')));
    assert.match(auth, /export function ResetPasswordCard\(\)/);
    assert.match(security, /createRecoveryCode\(codePassword\)/);
    assert.match(security, /이 코드는 지금 한 번만 보여요/);
    assert.match(security, /changePassword\(current, next\)/);
    // Signed-out calls must not bounce to the login page on a 401.
    assert.match(client, /'\/auth\/password\/reset',[\s\S]*?\{ auth: 'optional' \}/);
    assert.match(client, /'\/auth\/login',[\s\S]*?\{ auth: 'optional' \}/);
  });

  it('offers to bring back an account that is waiting to be deleted', () => {
    const auth = source('components/auth/AuthUi.tsx');
    const settings = source('components/settings/SettingsScreen.tsx');
    assert.match(auth, /cause\.body\.code === 'ACCOUNT_DELETION_PENDING'/);
    assert.match(auth, /await cancelAccountDeletion\(pending\.email, pending\.password\)/);
    assert.match(auth, /계정 되살리기/);
    // The copy matches the 30-day grace period instead of calling deletion irreversible.
    assert.doesNotMatch(settings, /되돌릴 수 없어요/);
    assert.match(settings, /30일 동안 삭제 대기 상태가 돼요/);
    assert.doesNotMatch(settings, /role="dialog"/);
  });

  it('lets people choose notifications and download their data', () => {
    const settings = source('components/settings/SettingsScreen.tsx');
    const notifications = source('components/settings/NotificationSettings.tsx');
    const fields = source('components/core/ComposerFields.tsx');
    assert.match(settings, /<NotificationSettings \/>/);
    assert.match(notifications, /disabled=\{item\.required \|\| busy === item\.category\}/);
    assert.match(notifications, /setItems\(before\)/);
    assert.match(fields, /disabled=\{disabled\}/);
    assert.match(settings, /saveJson\(await exportMyData\(\)/);
    assert.match(settings, /내 데이터 내려받기/);
  });
});
