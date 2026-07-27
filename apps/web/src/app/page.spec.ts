import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
const src = (p: string) => readFileSync(join(process.cwd(), 'src', p), 'utf8');
describe('auth and route boundary', () => {
  it('uses the simplified auth screens with safe returnTo and friend-token signup', () => {
    const code = src('components/auth/AuthUi.tsx');
    assert.match(code, /친구들과 본 작품을 기록하고 나눠보세요/);
    assert.match(code, /safeCoreReturnTo/);
    assert.match(code, /friendInviteToken/);
    assert.match(code, /termsAccepted:\s*true/);
    assert.match(code, /CURRENT_TERMS_VERSION/);
    assert.match(code, /CURRENT_PRIVACY_VERSION/);
  });
  it('does not trust a stale cookie on guest routes and performs 401 logout before login redirect', () => {
    const middleware = src('middleware.ts');
    const api = src('lib/api/core.ts');
    assert.doesNotMatch(middleware, /guestOnly|hasAccessToken[\s\S]*redirect[\s\S]*\//);
    assert.match(api, /response\.status === 401/);
    assert.match(api, /\/auth\/logout/);
    assert.match(api, /purgeSessionDrafts/);
    assert.match(api, /returnTo/);
  });
  it('publishes public versioned legal routes with an explicit deployment-blocking fixture warning', () => {
    const legal = src('content/legal/index.ts');
    assert.match(src('app/terms/page.tsx'), /LegalScreen/);
    assert.match(src('app/privacy/page.tsx'), /LegalScreen/);
    assert.match(legal, /fixture:\s*true/);
    assert.match(legal, /배포에 사용할 수 없습니다/);
  });
});
