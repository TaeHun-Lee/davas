import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const loginPageSource = readFileSync(new URL('./login/page.tsx', import.meta.url), 'utf8');
const signupPageSource = readFileSync(new URL('./signup/page.tsx', import.meta.url), 'utf8');
const homePageSource = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');
const authUiSource = readFileSync(new URL('../components/auth/AuthUi.tsx', import.meta.url), 'utf8');
const landingSource = readFileSync(new URL('../components/auth/AuthenticatedLanding.tsx', import.meta.url), 'utf8');
const middlewareSource = readFileSync(new URL('../middleware.ts', import.meta.url), 'utf8');

describe('Davas separated auth routes', () => {
  it('routes /login to only the login screen with requested copy', () => {
    assert.match(loginPageSource, /LoginPage/);
    assert.doesNotMatch(loginPageSource, /SignupCard/);
    assert.match(authUiSource, /환영합니다/);
    assert.match(authUiSource, /영화와 드라마를 보고 다이어리를 작성해보세요\./);
    assert.doesNotMatch(authUiSource, /다시 오신 것을 환영합니다/);
  });

  it('routes /signup to only the signup screen without preferred genres', () => {
    assert.match(signupPageSource, /SignupPage/);
    assert.doesNotMatch(signupPageSource, /LoginCard/);
    assert.match(authUiSource, /계정을 만들어보세요/);
    assert.doesNotMatch(authUiSource, /선호 장르/);
  });

  it('uses the saved Davas logo image instead of a hand-drawn inline logo', () => {
    assert.match(authUiSource, /\/images\/davas-logo\.jpg/);
    assert.doesNotMatch(authUiSource, /function DavasLogo\(\).*filmstrip/s);
  });

  it('keeps the root page as a protected temporary landing page', () => {
    assert.match(homePageSource, /AuthenticatedLanding/);
    assert.doesNotMatch(homePageSource, /redirect\('\/login'\)/);
  });

  it('protects the main page with middleware and verifies auth state on landing', () => {
    assert.match(middlewareSource, /davas_access_token/);
    assert.match(middlewareSource, /pathname === '\/'/);
    assert.match(middlewareSource, /\/login/);
    assert.match(landingSource, /\/auth\/me/);
    assert.match(landingSource, /router\.replace\('\/login'\)/);
  });

  it('submits login and signup forms to the backend with credentials', () => {
    assert.match(authUiSource, /\/auth\/login/);
    assert.match(authUiSource, /\/auth\/signup/);
    assert.match(authUiSource, /credentials: 'include'/);
    assert.match(authUiSource, /router\.push\('\/'\)/);
  });
});
