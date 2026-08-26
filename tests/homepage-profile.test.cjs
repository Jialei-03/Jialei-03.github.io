const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { readFile } = require("node:fs/promises");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
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

async function newLocalPage() {
  const page = await browser.newPage();
  await page.route("**/*", (route) => {
    const requestUrl = new URL(route.request().url());
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

  assert.equal(await page.locator(".hero-eyebrow").textContent(), "智能体 · 大语言模型 · 推荐系统");
  assert.equal(
    await page.locator("#bio").textContent(),
    "我目前是中国科学技术大学人工智能与数据科学学院大数据技术与工程专业硕士生，研究方向包括智能体、大语言模型与推荐系统。",
  );
  assert.deepEqual(await page.locator("#interest-inline span").allTextContents(), ["智能体", "大语言模型", "推荐系统"]);

  await page.locator("#lang-toggle").click();
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

  await page.close();
});

test("education identifies the current master's program", async () => {
  const page = await newLocalPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  const education = await page.locator("#education-list").textContent();
  assert.match(education, /大数据技术与工程，硕士研究生/);
  assert.match(education, /LDS 实验室/);

  await page.locator("#lang-toggle").click();
  const englishEducation = await page.locator("#education-list").textContent();
  assert.match(englishEducation, /Master's Student in Big Data Technology and Engineering/);

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
  assert.deepEqual(dimensions, { width: 1280, height: 1280 });

  await page.close();
});
