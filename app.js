// app.js
// 渲染 Jialei-03 个人主页。
// 静态内容从 data/site.js 读取;GitHub 资料从 API 实时拉取。
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || { meta: {}, now: {}, contact: {}, featured: [] };
  const GITHUB_USERNAME = (cfg.contact && cfg.contact.github) || "Jialei-03";
  const PROFILE_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
  const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
  const PINNED_URL = `https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USERNAME}`;

  // 少量语言 -> 不同色象征色（仍然只用黑白与一个温热加重）
  const languageAccent = {
    JavaScript: "#1f1d1a",
    TypeScript: "#2b2a26",
    Python: "#3a3a32",
    HTML: "#6b6657",
    CSS: "#7a7466",
    Java: "#26241f",
    Vue: "#33322b",
    React: "#1a1a1a",
    Shell: "#5a5448",
    Go: "#2c2a25",
    Rust: "#3a342a",
    C: "#26241f",
    "C++": "#2e2c26",
    "C#": "#2a2925",
    Jupyter: "#b08968",
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // -----------------------------------------------------------------------
  // 工具函数
  // -----------------------------------------------------------------------
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatNumber(value) {
    const n = Number(value) || 0;
    if (n < 1000) return String(n);
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short" });
  }

  async function fetchJson(url, timeoutMs) {
    const controller = new AbortController();
    const id = window.setTimeout(() => controller.abort(), timeoutMs || 5000);
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } finally {
      window.clearTimeout(id);
    }
  }

  // -----------------------------------------------------------------------
  // 静态绑定: <... data-bind="now.focused">
  // -----------------------------------------------------------------------
  function applyBindings() {
    $$("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind").split(".");
      let cur = cfg;
      for (const key of path) {
        if (cur == null) break;
        cur = cur[key];
      }
      if (cur == null || cur === "") return;
      el.textContent = String(cur);
    });

    // 年份
    const yearEl = $("#footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    const nowYear = $("#now-year");
    if (nowYear) nowYear.textContent = new Date().getFullYear();

    // GitHub 全局链接
    const ghLinks = [$("#hero-github"), $("#cta-github")].filter(Boolean);
    ghLinks.forEach((a) => {
      a.href = `https://github.com/${GITHUB_USERNAME}`;
    });

    // 页脚下方 source 链接 → 当前仓库
    $$('a[href*=".github.io"]').forEach((a) => {
      a.href = `https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`;
    });
  }

  // -----------------------------------------------------------------------
  // GitHub profile
  // -----------------------------------------------------------------------
  async function loadProfile() {
    try {
      const profile = await fetchJson(PROFILE_URL);
      $("#avatar").src = profile.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`;
      $("#profile-name").textContent = profile.name || profile.login || GITHUB_USERNAME;
      $("#bio").textContent = profile.bio || cfg.meta.tagline || "一个安静的个人主页，用来收纳公开项目、GitHub 资料和正在发生的创造。";
      $("#public-repos").textContent = formatNumber(profile.public_repos);
      $("#followers").textContent = formatNumber(profile.followers);
      $("#following").textContent = formatNumber(profile.following);
      $("#gists").textContent = formatNumber(profile.public_gists);
    } catch (err) {
      console.info("GitHub profile unavailable.", err);
      $("#public-repos").textContent = "--";
      $("#followers").textContent = "--";
      $("#following").textContent = "--";
      $("#gists").textContent = "--";
    }
  }

  // -----------------------------------------------------------------------
  // Featured / Pinned repos
  // -----------------------------------------------------------------------
  function normalizePinnedRepo(repo) {
    return {
      name: repo.repo,
      description: repo.description,
      htmlUrl: repo.link,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      updatedAt: null,
    };
  }

  function normalizeRestRepo(repo) {
    return {
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
    };
  }

  function repoCardHtml(repo) {
    const lang = repo.language
      ? `<span><i class="language-dot" style="background:${languageAccent[repo.language] || "#1f1d1a"}"></i>${escapeHtml(repo.language)}</span>`
      : "";
    const stars = Number.isFinite(repo.stars) ? `<span>${formatNumber(repo.stars)} stars</span>` : "";
    const forks = Number.isFinite(repo.forks) ? `<span>${formatNumber(repo.forks)} forks</span>` : "";
    const updated = repo.updatedAt ? `<span>${formatDate(repo.updatedAt)}</span>` : "";
    return `
      <a class="repo-card" href="${escapeHtml(repo.htmlUrl)}" target="_blank" rel="noreferrer">
        <div>
          <h3 class="repo-title">${escapeHtml(repo.name)}</h3>
          <p class="repo-description">${escapeHtml(repo.description || "No description yet.")}</p>
        </div>
        <div class="repo-meta">
          ${lang}
          ${stars}
          ${forks}
          ${updated}
        </div>
      </a>
    `;
  }

  function renderRepos(repos, sourceLabel, statusText) {
    const grid = $("#repo-grid");
    const status = $("#work-status");
    if (!grid || !status) return;
    grid.innerHTML = "";
    if (repos.length) {
      grid.innerHTML = repos.map(repoCardHtml).join("");
      status.textContent = statusText || `${sourceLabel} · 展示 ${repos.length} 个仓库`;
    } else {
      status.textContent = "暂时没有可展示的公开仓库。";
    }
  }

  function renderFallbackRepo() {
    renderRepos(
      [
        {
          name: `${GITHUB_USERNAME} on GitHub`,
          description:
            "GitHub API 暂时不可用时，这张卡片会保留通往个人主页的入口。刷新后会自动重试。",
          htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
          language: "GitHub",
          stars: null,
          forks: null,
          updatedAt: null,
        },
      ],
      "GitHub profile",
      "GitHub 仓库数据暂时读取失败，已保留个人主页入口。"
    );
  }

  async function loadRepositories() {
    // 如果用户在 site.js 里手动指定了 featured，先去拉这些仓库的详情
    if (Array.isArray(cfg.featured) && cfg.featured.length) {
      try {
        const all = await fetchJson(REPOS_URL);
        const byName = new Map(all.map((r) => [r.name, r]));
        const repos = cfg.featured
          .map((name) => byName.get(name))
          .filter(Boolean)
          .map(normalizeRestRepo);
        if (repos.length) {
          renderRepos(repos, "Featured", `site.js 中指定的 ${repos.length} 个仓库`);
          return;
        }
      } catch (err) {
        console.info("Failed to resolve featured repos from REST.", err);
      }
    }

    try {
      const pinned = await fetchJson(PINNED_URL);
      const repos = pinned.map(normalizePinnedRepo).slice(0, 6);
      if (repos.length) {
        renderRepos(repos, "Pinned repositories");
        return;
      }
    } catch (err) {
      console.info("Pinned repositories unavailable, falling back to REST repos.", err);
    }

    try {
      const restRepos = await fetchJson(REPOS_URL);
      const repos = restRepos
        .filter((repo) => !repo.fork && !repo.archived)
        .sort((a, b) =>
          (b.stargazers_count || 0) - (a.stargazers_count || 0) ||
          new Date(b.updated_at) - new Date(a.updated_at)
        )
        .slice(0, 6)
        .map(normalizeRestRepo);
      renderRepos(repos, "Public repositories");
    } catch (err) {
      console.info("REST repositories unavailable.", err);
      $("#work-status").textContent =
        "仓库数据暂时读取失败。你仍然可以通过顶部按钮访问 GitHub。";
      renderFallbackRepo();
    }
  }

  // -----------------------------------------------------------------------
  // Stack · 从仓库语言字段统计
  // -----------------------------------------------------------------------
  function renderStack(repos) {
    const grid = $("#stack-grid");
    if (!grid) return;
    const tally = new Map();
    let totalBytes = 0;
    repos.forEach((repo) => {
      if (!repo.language || repo.fork) return;
      const bytes = (repo.size || 1) * 1024; // 粗略以 repo.size KB 作为权重
      tally.set(repo.language, (tally.get(repo.language) || 0) + bytes);
      totalBytes += bytes;
    });
    const entries = Array.from(tally.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    if (!entries.length) {
      grid.style.gridTemplateColumns = "minmax(0, 1fr)";
      grid.innerHTML = `<p class="status" style="grid-column: 1 / -1; background: var(--paper-soft); padding: 18px 22px; color: var(--muted);">还没有足够的仓库语言数据。</p>`;
      return;
    }
    grid.style.gridTemplateColumns = "";
    const max = entries[0][1];
    grid.innerHTML = entries
      .map(([name, bytes]) => {
        const pct = totalBytes ? Math.round((bytes / totalBytes) * 100) : 0;
        const bar = max ? Math.round((bytes / max) * 100) : 0;
        return `
          <div class="stack-item">
            <span class="stack-swatch" style="background:${languageAccent[name] || "#1f1d1a"}"></span>
            <span class="stack-name">${escapeHtml(name)}</span>
            <span class="stack-bar" aria-hidden="true"><span style="--bar:${bar}%"></span></span>
            <span class="stack-pct">${pct}%</span>
          </div>
        `;
      })
      .join("");
  }

  async function loadStack() {
    try {
      const repos = await fetchJson(REPOS_URL);
      renderStack(repos);
    } catch (err) {
      console.info("Stack unavailable.", err);
      const grid = $("#stack-grid");
      if (grid) { grid.style.gridTemplateColumns = "minmax(0, 1fr)"; grid.innerHTML = `<p class="status" style="grid-column: 1 / -1; background: var(--paper-soft); padding: 18px 22px; color: var(--muted);">语言统计暂时读不到。</p>`; }
    }
  }

  // -----------------------------------------------------------------------
  // Contact · 从 site.js 动态生成
  // -----------------------------------------------------------------------
  function renderContact() {
    const grid = $("#contact-grid");
    if (!grid) return;
    const c = cfg.contact || {};
    const items = [
      c.email    && { label: "Email",    value: c.email,                href: `mailto:${c.email}` },
      c.github   && { label: "GitHub",   value: `@${c.github}`,         href: `https://github.com/${c.github}` },
      c.twitter  && { label: "Twitter",  value: `@${c.twitter}`,        href: `https://twitter.com/${c.twitter}` },
      c.linkedin && { label: "LinkedIn", value: c.linkedin,             href: c.linkedin.startsWith("http") ? c.linkedin : `https://linkedin.com/in/${c.linkedin}` },
      c.website  && { label: "Website",  value: c.website.replace(/^https?:\/\//, ""), href: c.website },
    ].filter(Boolean);

    if (!items.length) {
      grid.innerHTML = `<p class="contact-empty">在 <code>data/site.js</code> 里填上 email / twitter 等信息后,这里会自动出现联系卡片。</p>`;
      return;
    }
    grid.innerHTML = items
      .map(
        (it) => `
          <a class="contact-card" href="${escapeHtml(it.href)}" target="_blank" rel="noreferrer">
            <span class="contact-label">${escapeHtml(it.label)}</span>
            <span class="contact-value">${escapeHtml(it.value)}</span>
            <span class="contact-arrow">↗</span>
          </a>
        `
      )
      .join("");
  }

  // -----------------------------------------------------------------------
  // 主题切换 / 菜单切换 / 滑入动画 / 本地时间
  // -----------------------------------------------------------------------
  function setupTheme() {
    const root = document.documentElement;
    const stored = window.localStorage.getItem("theme");
    const initial = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.setAttribute("data-theme", initial);

    const btn = $("#theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      window.localStorage.setItem("theme", next);
    });
  }

  function setupMenu() {
    const btn = $("#menu-toggle");
    const nav = $("#topnav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.setAttribute("data-open", String(!open));
    });
    $$("a", nav).forEach((a) => {
      a.addEventListener("click", () => {
        btn.setAttribute("aria-expanded", "false");
        nav.setAttribute("data-open", "false");
      });
    });
  }

  function setupTopbarElevation() {
    const bar = $("#topbar");
    if (!bar) return;
    const onScroll = () => bar.setAttribute("data-elevated", String(window.scrollY > 4));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupReveal() {
    const targets = $$(".section, .hero, .stats");
    targets.forEach((el) => el.classList.add("reveal"));
    // 安全网：1.5s 后任何未观察到的元素都会被加上 .in，避免由于浏览器问题或初始 scroll 未触发而隐藏内容。
    const safety = window.setTimeout(() => {
      targets.forEach((el) => el.classList.add("in"));
    }, 1500);
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );
    targets.forEach((el) => io.observe(el));
    return () => window.clearTimeout(safety);
  }

  function setupLocalTime() {
    const el = $("#local-time");
    if (!el) return;
    const tz = cfg.meta && cfg.meta.timezone;
    const update = () => {
      try {
        const now = new Date();
        const fmt = new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz || undefined,
        });
        el.textContent = fmt.format(now);
      } catch (_) {
        el.textContent = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
      }
    };
    update();
    window.setInterval(update, 30 * 1000);
  }

  // -----------------------------------------------------------------------
  // 启动
  // -----------------------------------------------------------------------
  function init() {
    applyBindings();
    renderContact();
    setupTheme();
    setupMenu();
    setupTopbarElevation();
    setupReveal();
    setupLocalTime();
    loadProfile();
    loadRepositories();
    loadStack();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
