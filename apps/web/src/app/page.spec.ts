import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const pageSource = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');

describe('Davas auth page copy', () => {
  it('uses the requested login heading and subheading', () => {
    assert.match(pageSource, /환영합니다/);
    assert.match(pageSource, /영화와 드라마를 보고 다이어리를 작성해보세요\./);
    assert.doesNotMatch(pageSource, /다시 오신 것을 환영합니다/);
    assert.doesNotMatch(pageSource, /영화와 드라마 다이어리를\s*계속 작성하려면 로그인하세요/);
  });

  it('renders sign-up without preferred genre selection', () => {
    assert.match(pageSource, /계정을 만들어보세요/);
    assert.match(pageSource, /회원가입/);
    assert.doesNotMatch(pageSource, /선호 장르/);
    assert.doesNotMatch(pageSource, /드라마.*로맨스.*스릴러/s);
  });
});
