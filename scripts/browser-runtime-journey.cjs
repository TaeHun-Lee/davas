const { chromium } = require('playwright');
const { mkdir, writeFile } = require('node:fs/promises');

const WEB = process.env.DAVAS_WEB_URL || 'http://127.0.0.1:3000';
const API = process.env.DAVAS_API_URL || 'http://127.0.0.1:4000/api';
const EVIDENCE = process.env.DAVAS_EVIDENCE_DIR || '/evidence';
const INVITE = 'DAVAS-RUNTIME-2026';
const EMAIL = 'browser-runtime@example.test';
const PASSWORD = 'BrowserRuntime!2026';
const NICKNAME = '브라우저검증';
const MEDIA_ID = '90000000-0000-4000-8000-000000000001';
const RESUME = process.env.DAVAS_BROWSER_RESUME === '1';
const RESUME_RECORD_ID = process.env.DAVAS_RESUME_RECORD_ID || null;
const RESUME_AFTER_RECORD_DELETE = process.env.DAVAS_RESUME_AFTER_RECORD_DELETE === '1';

const result = {
  startedAt: new Date().toISOString(),
  mode: RESUME_AFTER_RECORD_DELETE
    ? 'resume-after-record-delete'
    : RESUME_RECORD_ID
      ? 'resume-existing-record'
      : RESUME
        ? 'resume-existing-account'
        : 'clean-signup',
  web: WEB,
  api: API,
  steps: [],
  consoleErrors: [],
  pageErrors: [],
  serverErrors: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  await mkdir(EVIDENCE, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
  const context = await browser.newContext({
    viewport: { width: 430, height: 900 },
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') result.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => result.pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 500) {
      result.serverErrors.push({ status: response.status(), url: response.url() });
    }
  });

  async function mark(name) {
    const file = `${String(result.steps.length + 1).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: `${EVIDENCE}/${file}`, fullPage: true });
    result.steps.push({ name, url: page.url(), screenshot: file });
  }

  try {
    if (RESUME) {
      await page.goto(`${WEB}/login`, { waitUntil: 'networkidle' });
      await page.getByLabel('이메일').fill(EMAIL);
      await page.locator('input[name="password"]').fill(PASSWORD);
      await page.getByRole('button', { name: '로그인', exact: true }).click();
      await page.waitForURL((url) => url.pathname === '/', { timeout: 30000 });
      await mark('resume-login-complete');
    } else {
      await page.goto(`${WEB}/signup`, { waitUntil: 'networkidle' });
      await page.getByLabel('가입 초대 코드').fill(INVITE);
      await page.getByRole('button', { name: '코드 확인' }).click();
      await page.getByRole('button', { name: '확인됨' }).waitFor();
      await page.getByLabel('닉네임 (2~20자)').fill(NICKNAME);
      await page.getByLabel('이메일').fill(EMAIL);
      await page.getByLabel('비밀번호 (8자 이상)').fill(PASSWORD);
      await page.getByLabel('비밀번호 확인').fill(PASSWORD);
      await page.locator('form input[type="checkbox"]').check();
      await page.getByRole('button', { name: '계정 만들기' }).click();
      await page.waitForURL(/\/records\/new/, { timeout: 30000 });
      await mark('signup-complete');
    }

    await page.goto(`${WEB}/`, { waitUntil: 'networkidle' });
    const expectedTabs = [
      ['친구 기록', '/'],
      ['기록하기', '/records/new'],
      ['내 기록', '/me'],
      ['친구', '/friends'],
    ];
    for (const [label, path] of expectedTabs) {
      const link = page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', {
        name: label,
        exact: true,
      });
      assert((await link.getAttribute('href')) === path, `${label} tab href mismatch`);
    }
    await mark('four-tabs');
    for (const [label, path] of expectedTabs.slice(1)) {
      await page.goto(`${WEB}/`, { waitUntil: 'networkidle' });
      await page
        .getByRole('navigation', { name: '주요 메뉴' })
        .getByRole('link', { name: label, exact: true })
        .click();
      await page.waitForURL((url) => url.pathname === path, { timeout: 20000 });
    }

    if (RESUME_AFTER_RECORD_DELETE) {
      await page.goto(`${WEB}/me`, { waitUntil: 'networkidle' });
      await page.getByText('아직 남긴 기록이 없어요.').waitFor();
      await mark('resume-record-deleted');
    } else {
      let recordUrl;
      if (RESUME_RECORD_ID) {
        recordUrl = `${WEB}/records/${encodeURIComponent(RESUME_RECORD_ID)}`;
        await page.goto(recordUrl, { waitUntil: 'networkidle' });
        await page.getByText('브라우저에서 수정한 기록입니다.').waitFor();
        await page.getByRole('heading', { name: 'Runtime 검증 영화' }).waitFor();
        await mark('resume-record-edited');
      } else {
        await page.goto(`${WEB}/records/new?mediaId=${MEDIA_ID}`, { waitUntil: 'networkidle' });
        await page.getByRole('heading', { name: 'Runtime 검증 영화' }).waitFor();
        await page.getByRole('button', { name: '영화관', exact: true }).click();
        await page.getByText('4점', { exact: true }).click();
        assert(
          await page.locator('input[name="rating"][value="4"]').isChecked(),
          '4점 rating must be selected',
        );
        await page.getByLabel('어땠나요? (선택)').fill('브라우저에서 만든 첫 기록입니다.');
        await page.getByRole('button', { name: '친구와 공유하기' }).click();
        await page.waitForURL(/\/records\/[0-9a-f-]+/, { timeout: 30000 });
        recordUrl = page.url().split('?')[0];
        await page.getByText('친구와 기록을 공유했어요.').waitFor();
        await mark('record-created');

        await page.reload({ waitUntil: 'networkidle' });
        await page.getByText('브라우저에서 만든 첫 기록입니다.').waitFor();
        await page.getByRole('heading', { name: 'Runtime 검증 영화' }).waitFor();
        await mark('record-refresh-persisted');

        await page.getByRole('link', { name: '수정', exact: true }).click();
        await page.waitForURL(/\/records\/[0-9a-f-]+\/edit/, { timeout: 20000 });
        await page.getByLabel('어땠나요? (선택)').fill('브라우저에서 수정한 기록입니다.');
        await page.getByRole('button', { name: '수정 내용 저장하기' }).click();
        await page.waitForURL((url) => /^\/records\/[0-9a-f-]+$/.test(url.pathname), {
          timeout: 30000,
        });
        await page.getByText('브라우저에서 수정한 기록입니다.').waitFor();
        await mark('record-edited');
      }

      await page.goto(`${WEB}/settings`, { waitUntil: 'networkidle' });
      const avatarPng = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64',
      );
      await page.locator('input[type="file"]').setInputFiles({
        name: 'runtime-avatar.png',
        mimeType: 'image/png',
        buffer: avatarPng,
      });
      await page.locator('img[alt="내 프로필"]').waitFor({ timeout: 30000 });
      await mark('profile-image-uploaded');

      await page.getByRole('button', { name: '로그아웃' }).click();
      await page.waitForURL(/\/login$/, { timeout: 20000 });
      await page.getByLabel('이메일').fill(EMAIL);
      await page.locator('input[name="password"]').fill(PASSWORD);
      await page.getByRole('button', { name: '로그인', exact: true }).click();
      await page.waitForURL((url) => url.pathname === '/', { timeout: 30000 });
      await page.goto(recordUrl, { waitUntil: 'networkidle' });
      await page.getByText('브라우저에서 수정한 기록입니다.').waitFor();
      await mark('login-persistence');

      await page.getByRole('button', { name: '삭제', exact: true }).click();
      const deleteDialog = page.getByRole('dialog');
      await deleteDialog.getByRole('button', { name: '기록 삭제' }).click();
      await page.waitForURL(/\/me$/, { timeout: 30000 });
      await page.getByText('아직 남긴 기록이 없어요.').waitFor();
      await mark('record-deleted');
    }

    await page.goto(`${WEB}/settings`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '계정 삭제', exact: true }).first().click();
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: '계정 삭제', exact: true }).last().click();
    await page.waitForURL(/\/login$/, { timeout: 30000 });
    const privateResponse = await context.request.get(`${API}/auth/me`);
    result.privateAfterAccountDeletion = privateResponse.status();
    assert(
      privateResponse.status() === 401,
      'private route must return 401 after account deletion',
    );
    await mark('account-deleted');

    assert(result.pageErrors.length === 0, `page errors: ${result.pageErrors.join('; ')}`);
    assert(
      result.serverErrors.length === 0,
      `server errors: ${JSON.stringify(result.serverErrors)}`,
    );
    result.status = 'passed';
  } catch (error) {
    result.status = 'failed';
    result.error = error instanceof Error ? error.stack || error.message : String(error);
    await page
      .screenshot({ path: `${EVIDENCE}/failure.png`, fullPage: true })
      .catch(() => undefined);
    throw error;
  } finally {
    result.finishedAt = new Date().toISOString();
    await writeFile(`${EVIDENCE}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
