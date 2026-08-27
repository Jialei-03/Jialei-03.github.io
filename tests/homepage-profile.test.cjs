const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { readFile } = require("node:fs/promises");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const githubProfileUrl = "https://api.github.com/users/Jialei-03";
const githubProfile = {
  login: "Jialei-03",
  id: 123456789,
  node_id: "U_kgDOB1vNFQ",
  avatar_url: "https://avatars.githubusercontent.com/u/123456789?v=4",
  gravatar_id: "",
  url: githubProfileUrl,
  html_url: "https://github.com/Jialei-03",
  followers_url: "https://api.github.com/users/Jialei-03/followers",
  following_url: "https://api.github.com/users/Jialei-03/following{/other_user}",
  gists_url: "https://api.github.com/users/Jialei-03/gists{/gist_id}",
  starred_url: "https://api.github.com/users/Jialei-03/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/Jialei-03/subscriptions",
  organizations_url: "https://api.github.com/users/Jialei-03/orgs",
  repos_url: "https://api.github.com/users/Jialei-03/repos",
  events_url: "https://api.github.com/users/Jialei-03/events{/privacy}",
  received_events_url: "https://api.github.com/users/Jialei-03/received_events",
  type: "User",
  user_view_type: "public",
  site_admin: false,
  name: "Jialei Li",
  company: null,
  blog: "https://jialei-03.github.io/",
  location: null,
  email: null,
  hireable: null,
  bio: "Researcher",
  twitter_username: null,
  notification_email: null,
  public_repos: 10,
  public_gists: 0,
  followers: 5,
  following: 3,
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2026-08-27T00:00:00Z",
};
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

let browser;
let server;
let baseUrl;

async function newLocalPage(options = {}) {
  const page = await browser.newPage();
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.href === githubProfileUrl && options.githubProfileGate) {
      await options.githubProfileGate;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(githubProfile) });
    }
    return requestUrl.origin === baseUrl ? route.continue() : route.abort();
  });
  return page;
}

before(async () => {
  server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const requestedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const filePath = path.resolve(root, requestedPath);
      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const body = await readFile(filePath);
      response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise((resolve, reject) => server?.close((error) => (error ? reject(error) : resolve())));
});

test("homepage presents the current research focus in both languages", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  assert.equal(await page.locator(".hero-eyebrow").textContent(), "AI Agents · Large Language Models · Recommender Systems");
  assert.equal(
    await page.locator("#bio").textContent(),
    "I am a master's student in Big Data Technology and Engineering at the School of Artificial Intelligence and Data Science, University of Science and Technology of China. My research interests include AI agents, large language models, and recommender systems.",
  );
  assert.deepEqual(await page.locator("#interest-inline span").allTextContents(), [
    "AI Agents",
    "Large Language Models",
    "Recommender Systems",
  ]);

  await page.locator("#lang-toggle").click();
  assert.equal(await page.locator(".hero-eyebrow").textContent(), "智能体 · 大语言模型 · 推荐系统");
  assert.equal(
    await page.locator("#bio").textContent(),
    "我目前是中国科学技术大学人工智能与数据科学学院大数据技术与工程专业硕士生，研究方向包括智能体、大语言模型与推荐系统。",
  );
  assert.deepEqual(await page.locator("#interest-inline span").allTextContents(), ["智能体", "大语言模型", "推荐系统"]);

  await page.close();
});

test("new visitors see an English identity after GitHub loading settles", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.title(), "Jialei Li · Academic Homepage");
  assert.equal(await page.locator("#profile-name").innerText(), "Jialei Li");
  assert.equal(await page.locator("#lang-toggle").textContent(), "中");
  assert.equal(await page.locator("#lang-toggle").getAttribute("aria-label"), "切换到中文");
  assert.equal(await page.locator(".skip-link").textContent(), "Skip to main content");
  assert.equal(await page.locator(".nav-brand").getAttribute("aria-label"), "Back to top");

  await page.close();
});

test("static fallback is a complete English identity without JavaScript", async () => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.title(), "Jialei Li · Academic Homepage");
  assert.equal(await page.locator("#profile-name").innerText(), "Jialei Li");
  assert.equal(await page.locator(".skip-link").textContent(), "Skip to main content");
  assert.equal(await page.locator(".nav-brand").getAttribute("aria-label"), "Back to top");

  await page.close();
});

test("a delayed successful GitHub response cannot replace the English identity", async () => {
  let releaseProfile;
  const githubProfileGate = new Promise((resolve) => {
    releaseProfile = resolve;
  });
  const page = await newLocalPage({ githubProfileGate });
  const profileResponse = page.waitForResponse(githubProfileUrl);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  await page.locator("#lang-toggle").click();
  await page.locator("#lang-toggle").click();
  releaseProfile();
  const response = await profileResponse;
  await response.finished();
  await page.waitForTimeout(25);

  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.title(), "Jialei Li · Academic Homepage");
  assert.equal(await page.locator("#profile-name").innerText(), "Jialei Li");

  await page.close();
});

test("language toggle persists a Chinese preference", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  await page.locator("#lang-toggle").click();
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
  assert.equal(await page.locator("#profile-name").innerText(), "李嘉磊 / Jialei Li");
  assert.equal(await page.locator("#lang-toggle").textContent(), "EN");
  assert.equal(await page.locator("#lang-toggle").getAttribute("aria-label"), "Switch to English");
  assert.equal(await page.locator(".skip-link").textContent(), "跳到主内容");
  assert.equal(await page.locator(".nav-brand").getAttribute("aria-label"), "返回顶部");
  assert.equal(await page.evaluate(() => localStorage.getItem("lang")), "zh");

  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
  assert.equal(await page.locator("#profile-name").innerText(), "李嘉磊 / Jialei Li");
  assert.equal(await page.locator("#lang-toggle").textContent(), "EN");
  assert.equal(await page.locator(".skip-link").textContent(), "跳到主内容");
  assert.equal(await page.locator(".nav-brand").getAttribute("aria-label"), "返回顶部");

  await page.close();
});

test("education identifies the current master's program", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  const englishEducation = await page.locator("#education-list").textContent();
  assert.match(englishEducation, /Master's Student in Big Data Technology and Engineering/);

  await page.locator("#lang-toggle").click();
  const education = await page.locator("#education-list").textContent();
  assert.match(education, /大数据技术与工程，硕士研究生/);
  assert.match(education, /LDS 实验室/);

  await page.close();
});

test("portrait loads the supplied square photo", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#avatar").evaluate((image) => (image.complete && image.naturalWidth > 0 ? undefined : image.decode()));

  const dimensions = await page.locator("#avatar").evaluate((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));
  assert.deepEqual(dimensions, { width: 1901, height: 1901 });

  await page.close();
});
