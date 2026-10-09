const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const { readFile } = require('node:fs/promises');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../dist');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
let browser, server, baseUrl;

before(async () => {
  server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = path.resolve(root, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));
      if (!file.startsWith(`${root}${path.sep}`)) return response.writeHead(403).end();
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(body);
    } catch { response.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

async function newPage(options = {}) {
  const page = await browser.newPage(options);
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  await page.route('**/*', route => new URL(route.request().url()).origin === baseUrl ? route.continue() : route.abort());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  return page;
}

async function assertHealthy(page) {
  assert.deepEqual(page.errors, [], 'No client or hydration errors');
  assert.equal(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true, 'All visible images load');
}

test('the new homepage has an English identity and the current RecSys publication', async () => {
  const page = await newPage();
  assert.equal(await page.title(), 'Jialei Li | 李嘉磊');
  assert.equal(await page.locator('#profile-name').textContent(), 'Jialei Li');
  assert.match(await page.locator('#bio').textContent(), /master's student in Big Data Technology and Engineering/);
  assert.equal(await page.locator('.paper-item').count(), 3);
  const soda = page.locator('#publication-soda');
  assert.match(await soda.textContent(), /RecSys 2026/);
  assert.match(await soda.textContent(), /Short Paper/);
  assert.match(await soda.textContent(), /Distribution-Level Contrastive Supervision/);
  assert.equal(await soda.getByRole('link', { name: 'Code', exact: true }).getAttribute('href'), 'https://github.com/freyasa/SODA');
  assert.equal(await soda.getByRole('link', { name: 'Paper', exact: true }).getAttribute('href'), 'https://doi.org/10.1145/3773078.3831770');
  assert.equal(await soda.locator('.author-list strong').textContent(), 'Jialei Li');
  await page.locator('#education').scrollIntoViewIfNeeded();
  await assertHealthy(page);
  await page.close();
});

test('Chinese content and the language preference survive a reload', async () => {
  const page = await newPage();
  await page.getByRole('button', { name: '切换到中文' }).click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal(await page.locator('#profile-name').textContent(), '李嘉磊');
  assert.match(await page.locator('#bio').textContent(), /大数据技术与工程专业硕士生/);
  assert.match(await page.locator('#education-list').textContent(), /LDS 实验室/);
  assert.match(await page.locator('#publication-soda').textContent(), /短篇论文/);
  assert.equal(await page.evaluate(() => localStorage.getItem('lang')), 'zh');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Jialei Li | 李嘉磊');
  assert.equal(await page.locator('#profile-name').textContent(), '李嘉磊');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('publication filters work with both pointer and keyboard', async () => {
  const page = await newPage();
  await page.getByRole('tab', { name: 'Preprints' }).click();
  assert.equal(await page.locator('.paper-item').count(), 1);
  assert.equal(await page.locator('.paper-item').getAttribute('data-paper-type'), 'preprint');
  await page.getByRole('tab', { name: 'Conference' }).click();
  assert.equal(await page.locator('.paper-item').count(), 2);
  await page.getByRole('tab', { name: 'All work' }).click();
  assert.equal(await page.locator('.paper-item').count(), 3);
  await page.getByRole('tab', { name: 'All work' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelectorAll('.paper-item').length === 2);
  assert.equal(await page.getByRole('tab', { name: 'Conference' }).getAttribute('aria-selected'), 'true');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('the SODA news anchor restores a filtered-out publication', async () => {
  const page = await newPage({ reducedMotion: 'reduce' });
  await page.getByRole('tab', { name: 'Preprints' }).click();
  await page.getByRole('link', { name: /SODA appears at RecSys/ }).click();
  assert.equal(await page.locator('.paper-item').count(), 3);
  assert.equal(new URL(page.url()).hash, '#publication-soda');
  const top = await page.locator('#publication-soda').evaluate(element => element.getBoundingClientRect().top);
  assert.ok(top >= 64 && top < 200, `SODA is visible below the sticky header (${top}px)`);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('theme follows the system and manual selection persists', async () => {
  const page = await newPage({ colorScheme: 'dark' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('both languages fit mobile, tablet and desktop without horizontal scrolling', async () => {
  const page = await newPage();
  for (const language of ['en', 'zh']) {
    if (language === 'zh') await page.getByRole('button', { name: '切换到中文' }).click();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
      assert.ok(layout.width <= layout.viewport, `${language} at ${width}px overflows by ${layout.width - layout.viewport}px`);
    }
  }
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('the pre-rendered page includes identity, papers and contact without JavaScript', async () => {
  const page = await newPage({ javaScriptEnabled: false });
  assert.equal(await page.locator('#profile-name').textContent(), 'Jialei Li');
  assert.equal(await page.locator('.paper-item').count(), 3);
  assert.match(await page.locator('#publication-soda').textContent(), /RecSys 2026/);
  assert.equal(await page.getByRole('link', { name: 'Email me' }).getAttribute('href'), 'mailto:lijialei.cn@gmail.com');
  assert.ok(await page.locator('#avatar').evaluate(image => image.complete && image.naturalWidth > 0));
  await page.close();
});

test('an unavailable portrait has a visible fallback without breaking the page', async () => {
  const page = await browser.newPage();
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  await page.route('**/assets/github-avatar*.webp', route => route.abort());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.photo-fallback').textContent(), 'JL');
  assert.equal(await page.locator('.paper-item').count(), 3);
  assert.deepEqual(page.errors, []);
  await page.close();
});
