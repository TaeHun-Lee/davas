import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const src = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('single settings screen', () => {
  it('redirects legacy profile and exposes only profile account legal and deletion actions', () => {
    assert.match(src('app/profile/page.tsx'), /redirect\('\/settings'\)/);
    const code = src('components/settings/SettingsScreen.tsx');
    for (const term of [
      '사진 선택',
      '닉네임',
      '로그아웃',
      '이용약관',
      '개인정보처리방침',
      '계정 삭제',
    ]) {
      assert.match(code, new RegExp(term));
    }
    assert.doesNotMatch(code, /통계|장르 취향|알림 설정|공개 프로필/);
  });

  it('purges session drafts on logout and deletion', () => {
    const settings = src('components/settings/SettingsScreen.tsx');
    const actions = src('lib/settings-actions.ts');

    assert.match(settings, /purgeDrafts:\s*purgeSessionDrafts/);
    assert.match(settings, /await deleteMe\(password\);\s*purgeSessionDrafts\(\)/);
    assert.match(actions, /purgeDrafts\(\)/);
  });
});
