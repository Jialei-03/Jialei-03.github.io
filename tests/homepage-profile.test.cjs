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

// Pages default to reduced motion so state changes apply at once; the motion test opts back in.
async function newPage(options = {}) {
  const page = await browser.newPage({ reducedMotion: 'reduce', ...options });
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  await page.route('**/*', route => new URL(route.request().url()).origin === baseUrl ? route.continue() : route.abort());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  return page;
}

async function assertHealthy(page) {
  assert.deepEqual(page.errors, [], 'No client or hydration errors');
  // Scroll the whole page so every lazy image is requested, then wait for them to settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  });
  await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout: 5000 });
  assert.equal(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true, 'All images load');
}

test('the homepage lists the released SWE-Clar preprint alongside existing publications', async () => {
  const page = await newPage();
  assert.equal(await page.title(), 'Jialei Li · Academic Homepage');
  assert.equal(await page.locator('#profile-name').textContent(), 'Jialei Li');
  assert.match(await page.locator('#bio').textContent(), /master's student at the School of Artificial Intelligence and Data Science, University of Science and Technology of China, and a research intern at Upwork/);
  assert.equal(await page.locator('.paper-item').count(), 4);
  assert.equal(await page.locator('.paper-item').first().getAttribute('id'), 'publication-swe-clar');
  const swe = page.locator('#publication-swe-clar');
  assert.match(await swe.textContent(), /arXiv:2610\.31854/);
  assert.equal(await swe.getByText('Preprint', { exact: true }).count(), 1);
  assert.equal(await swe.getByText('First author', { exact: true }).count(), 1);
  assert.equal(await swe.locator('.author-list strong').textContent(), 'Jialei Li');
  assert.equal(await swe.getByRole('link', { name: 'Paper', exact: true }).getAttribute('href'), 'https://arxiv.org/abs/2610.31854');
  assert.equal(await swe.getByRole('link', { name: 'PDF', exact: true }).getAttribute('href'), 'https://arxiv.org/pdf/2610.31854');
  assert.equal(await swe.getByRole('link', { name: 'Code', exact: true }).getAttribute('href'), 'https://github.com/upwork/SWE-Clar');
  const soda = page.locator('#publication-soda');
  assert.match(await soda.textContent(), /RecSys 2026/);
  assert.match(await soda.textContent(), /Short Paper/);
  assert.match(await soda.textContent(), /Distribution-Level Contrastive Supervision/);
  assert.equal(await soda.getByRole('link', { name: 'Code', exact: true }).getAttribute('href'), 'https://github.com/freyasa/SODA');
  assert.equal(await soda.getByRole('link', { name: 'Paper', exact: true }).getAttribute('href'), 'https://doi.org/10.1145/3773078.3831770');
  assert.equal(await soda.locator('.author-list strong').textContent(), 'Jialei Li');
  await assertHealthy(page);
  await page.close();
});

test('Chinese content and the language preference survive a reload', async () => {
  const page = await newPage();
  await page.getByRole('button', { name: '切换到中文' }).click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal(await page.locator('#profile-name').textContent(), '李嘉磊');
  assert.match(await page.locator('#bio').textContent(), /中国科学技术大学人工智能与数据科学学院的硕士生，也是 Upwork 的研究实习生/);
  assert.match(await page.locator('#background-list').textContent(), /LDS 实验室/);
  assert.match(await page.locator('#publication-soda').textContent(), /短篇论文/);
  assert.equal(await page.locator('#experience-heading').textContent(), '经历与教育');
  assert.match(await page.locator('#experience-upwork').textContent(), /研究实习生.*2025\.09 – 至今/);
  assert.match(await page.locator('#research-mesa').textContent(), /Matter Agents.*长程记忆/);
  assert.equal(await page.evaluate(() => localStorage.getItem('lang')), 'zh');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.title(), '李嘉磊 · 学术主页');
  assert.equal(await page.locator('#profile-name').textContent(), '李嘉磊');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('the Upwork internship shows the company icon and links each claim to its paper', async () => {
  const page = await newPage();
  const upwork = page.locator('#experience-upwork');
  assert.equal(await upwork.getByRole('heading', { level: 3 }).textContent(), 'Upwork');
  assert.equal(await upwork.getByRole('link', { name: 'Upwork' }).getAttribute('href'), 'https://www.upwork.com/');
  assert.equal(await upwork.locator('.row-role').textContent(), 'Research Intern');
  assert.equal(await upwork.locator('.row-period').textContent(), '2025.09 – Present');
  await upwork.scrollIntoViewIfNeeded();
  const icon = upwork.locator('.row-logo img');
  assert.equal(await icon.getAttribute('src'), '/assets/upwork-logo.webp');
  await page.waitForFunction(() => document.querySelector('#experience-upwork .row-logo img').complete);
  assert.ok(await icon.evaluate(image => image.naturalWidth > 0), 'The Upwork icon loads');
  assert.deepEqual(await upwork.locator('.row-highlights a').evaluateAll(links => links.map(link => link.getAttribute('href'))), ['#publication-swe-clar', '#publication-unigrec', '#publication-soda']);
  assert.match(await upwork.textContent(), /100 greenfield software tasks from real Upwork client jobs and 512 clarification questions/);
  assert.equal(await page.locator('.profile-roles').getByRole('link', { name: /Research Intern/ }).getAttribute('href'), '#experience-upwork');
  await page.getByRole('tab', { name: /Conference/ }).click();
  await upwork.getByRole('link', { name: 'SWE-Clar' }).click();
  assert.equal(await page.locator('.paper-item').count(), 4, 'A link into the paper list restores papers hidden by the filter');
  assert.equal(new URL(page.url()).hash, '#publication-swe-clar');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('projects link to the real repository, unreleased research has no links, and the nav reaches every section', async () => {
  const page = await newPage();
  const project = page.locator('#project-open-research-agent');
  assert.equal(await project.getByRole('link', { name: 'Source code', exact: true }).getAttribute('href'), 'https://github.com/Jialei-03/open-research-agent');
  assert.equal(await project.getByRole('link', { name: 'Paper reader', exact: true }).getAttribute('href'), 'https://papers.dougao.online');
  assert.equal(await page.locator('#research-mesa').getByRole('link').count(), 0, 'Unreleased research has no invented links');
  assert.equal(await page.locator('#research-mesa-title').textContent(), 'MESA: Long-Horizon Agent Memory as an Emergent Society of Matter Agents');
  for (const [name, id] of [['News', 'news'], ['Papers', 'publications'], ['Experience', 'experience'], ['Projects', 'projects'], ['About', 'about']]) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    assert.equal(new URL(page.url()).hash, `#${id}`);
    // Sections near the end cannot scroll all the way up, so only require them to be on screen.
    const [top, height] = await page.locator(`#${id}`).evaluate(element => [element.getBoundingClientRect().top, innerHeight]);
    assert.ok(top >= 60 && top < height * .7, `${id} is visible below the header (${top}px)`);
  }
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('motion: the theme, filter and scroll reveals animate and still land in the right state', async () => {
  const page = await newPage({ reducedMotion: 'no-preference', colorScheme: 'light' });
  const pending = await page.locator('[data-reveal="pending"]').count();
  assert.ok(pending > 0, 'Content below the fold waits to be revealed');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  // Colors switch at once inside the reveal; per-element fades would make it stutter.
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation instanceof CSSTransition).length), 0);
  await page.waitForFunction(() => !document.documentElement.dataset.transition);
  await page.locator('#publications').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: /Preprints/ }).click();
  await page.waitForFunction(() => document.querySelectorAll('.paper-item').length === 2);
  const indicator = await page.evaluate(() => [document.querySelector('.tab-indicator').getBoundingClientRect().left, document.querySelector('[data-slot="tabs-trigger"][data-state="active"]').getBoundingClientRect().left]);
  await page.waitForTimeout(600);
  const settled = await page.evaluate(() => [document.querySelector('.tab-indicator').getBoundingClientRect().left, document.querySelector('[data-slot="tabs-trigger"][data-state="active"]').getBoundingClientRect().left]);
  assert.ok(Math.abs(settled[0] - settled[1]) < 1, `The tab pill settles under the active tab (${indicator} -> ${settled})`);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 50)); }
  });
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('[data-reveal="pending"]').count(), 0, 'Everything is revealed after scrolling');
  assert.equal(await page.locator('#research-mesa').evaluate(element => getComputedStyle(element).opacity), '1');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('publication filters work with both pointer and keyboard', async () => {
  const page = await newPage();
  await page.getByRole('tab', { name: /Preprints/ }).click();
  assert.equal(await page.locator('.paper-item').count(), 2);
  assert.equal(await page.locator('.paper-item').evaluateAll(papers => papers.every(paper => paper.dataset.paperType === 'preprint')), true);
  await page.getByRole('tab', { name: /Conference/ }).click();
  assert.equal(await page.locator('.paper-item').count(), 2);
  await page.getByRole('tab', { name: /All work/ }).click();
  assert.equal(await page.locator('.paper-item').count(), 4);
  await page.getByRole('tab', { name: /All work/ }).focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelectorAll('.paper-item').length === 2);
  assert.equal(await page.getByRole('tab', { name: /Conference/ }).getAttribute('aria-selected'), 'true');
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('news anchors restore SWE-Clar and SODA after their publication types are filtered out', async () => {
  const page = await newPage({ reducedMotion: 'reduce' });
  for (const item of [
    { filter: 'Conference', name: /SWE-Clar preprint is now available/, id: 'swe-clar' },
    { filter: 'Preprints', name: /SODA appears at RecSys/, id: 'soda' },
  ]) {
    await page.getByRole('tab', { name: new RegExp(item.filter) }).click();
    await page.getByRole('link', { name: item.name }).click();
    assert.equal(await page.locator('.paper-item').count(), 4);
    assert.equal(new URL(page.url()).hash, `#publication-${item.id}`);
    const top = await page.locator(`#publication-${item.id}`).evaluate(element => element.getBoundingClientRect().top);
    assert.ok(top >= 64 && top < 200, `${item.id} is visible below the sticky header (${top}px)`);
  }
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
  assert.equal(await page.locator('.paper-item').count(), 4);
  assert.equal(await page.getByRole('heading', { name: 'Open-Research-Agent', exact: true }).count(), 1);
  assert.equal(await page.getByRole('heading', { name: /^SWE-Clar:/ }).count(), 1);
  assert.match(await page.locator('#experience-upwork').textContent(), /Research Intern/);
  assert.equal(await page.locator('[data-reveal="pending"]').count(), 0, 'Nothing is hidden waiting for scripts');
  assert.equal(await page.getByRole('heading', { name: /^MESA:/ }).count(), 1);
  assert.match(await page.locator('#publication-soda').textContent(), /RecSys 2026/);
  assert.equal(await page.getByRole('link', { name: 'lijialei.cn@gmail.com' }).getAttribute('href'), 'mailto:lijialei.cn@gmail.com');
  assert.ok(await page.locator('#avatar').evaluate(image => image.complete && image.naturalWidth > 0));
  await page.close();
});

test('an unavailable portrait has a visible fallback without breaking the page', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  await page.route('**/assets/github-avatar*.webp', route => route.abort());
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.photo-fallback').textContent(), 'JL');
  assert.equal(await page.locator('.paper-item').count(), 4);
  assert.deepEqual(page.errors, []);
  await page.close();
});
