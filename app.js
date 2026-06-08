// app.js
// Academic CV renderer for a static GitHub Pages site.
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const profileCfg = cfg.profile || {};
  const contactCfg = cfg.contact || {};
  const metaCfg = cfg.meta || {};
  const GITHUB_USERNAME = contactCfg.github || "Jialei-03";
  const PROFILE_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
  const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
  const PINNED_URL = `https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USERNAME}`;

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

  function valueAtPath(path) {
    let cur = cfg;
    for (const key of path.split(".")) {
      if (cur == null) return undefined;
      cur = cur[key];
    }
    return cur;
  }

  function applyBindings() {
    $$('[data-bind]').forEach((el) => {
      const value = valueAtPath(el.getAttribute("data-bind"));
      if (value == null || value === "") return;
      el.textContent = String(value);
    });

    const displayName = profileCfg.name || metaCfg.name || `${profileCfg.chineseName || "李嘉磊"} / ${profileCfg.englishName || "Jialei Li"}`;
    const title = `${displayName} · Academic CV`;
    document.title = title;

    const yearEl = $("#footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    [$("#hero-github"), $("#cta-github")].filter(Boolean).forEach((a) => {
      a.href = `https://github.com/${GITHUB_USERNAME}`;
    });

    $$("a[href*='.github.io']").forEach((a) => {
      a.href = `https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`;
    });
  }

  function renderPdfButton() {
    const btn = $("#pdf-button");
    if (!btn) return;
    const pdf = profileCfg.pdf || {};
    if (pdf.status === "available" && pdf.href) {
      const link = document.createElement("a");
      link.className = "button ghost";
      link.href = pdf.href;
      link.textContent = pdf.label || "PDF Resume";
      link.setAttribute("download", "");
      btn.replaceWith(link);
      return;
    }
    btn.textContent = `${pdf.label || "PDF Resume"} · Coming soon`;
    btn.setAttribute("aria-disabled", "true");
    btn.disabled = true;
  }

  function renderList(containerId, items, emptyText, renderItem) {
    const container = $(`#${containerId}`);
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = `<p class="empty-note">${escapeHtml(emptyText)}</p>`;
      return;
    }
    container.innerHTML = items.map(renderItem).join("");
  }

  function renderCvSections() {
    renderList(
      "interest-list",
      cfg.interests,
      "Research interests will be added here.",
      (item) => `<article class="interest-card">${escapeHtml(item)}</article>`
    );

    renderList(
      "education-list",
      cfg.education,
      "Education entries will be added here.",
      (item) => `
        <article class="timeline-item">
          <div class="timeline-meta">${escapeHtml(item.period || "")}</div>
          <div>
            <h4>${escapeHtml(item.school)}</h4>
            <p class="timeline-degree">${escapeHtml(item.degree || "")}</p>
            <p class="timeline-location">${escapeHtml(item.location || "")}</p>
            <p>${escapeHtml(item.details || "")}</p>
          </div>
        </article>
      `
    );

    renderList(
      "project-list",
      cfg.projects,
      "Research projects will be added here.",
      (item) => `
        <article class="project-entry">
          <div class="entry-main">
            <p class="entry-kicker">${escapeHtml(item.role || "Project")}${item.period ? ` · ${escapeHtml(item.period)}` : ""}</p>
            <h3>${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)} ↗</a>` : escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary || "")}</p>
          </div>
          <div class="tag-row">${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </article>
      `
    );

    renderList(
      "publication-list",
      cfg.publications,
      "Publications and writing will be added here.",
      (item) => `
        <article class="publication-item">
          <div class="publication-year">${escapeHtml(item.year || "")}</div>
          <div>
            <h3>${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)} ↗</a>` : escapeHtml(item.title)}</h3>
            <p class="authors">${escapeHtml(item.authors || "")}</p>
            <p class="venue">${escapeHtml(item.venue || "")}${item.status ? ` · ${escapeHtml(item.status)}` : ""}</p>
          </div>
        </article>
      `
    );

    renderList(
      "skill-list",
      cfg.skills,
      "Skills will be added here.",
      (group) => `
        <article class="skill-group">
          <h3>${escapeHtml(group.group)}</h3>
          <div class="skill-chip-row">${(group.items || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </article>
      `
    );

    renderList(
      "award-list",
      cfg.awards,
      "Awards and honors will be added here.",
      (item) => `
        <article class="award-item">
          <span>${escapeHtml(item.year || "")}</span>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description || "")}</p>
          </div>
        </article>
      `
    );
  }

  async function loadProfile() {
    const displayName = profileCfg.name || metaCfg.name || `${profileCfg.chineseName || "李嘉磊"} / ${profileCfg.englishName || "Jialei Li"}`;
    const profileStatus = $("#profile-status");
    try {
      const profile = await fetchJson(PROFILE_URL);
      const avatar = $("#avatar");
      if (avatar) avatar.src = profile.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`;
      const h1 = $("#profile-name");
      if (h1) h1.textContent = displayName;
      if (profileStatus) profileStatus.textContent = profile.bio ? "GitHub profile linked" : "GitHub public profile";
      $("#public-repos").textContent = formatNumber(profile.public_repos);
      $("#followers").textContent = formatNumber(profile.followers);
      $("#following").textContent = formatNumber(profile.following);
      $("#gists").textContent = formatNumber(profile.public_gists);
    } catch (err) {
      console.info("GitHub profile unavailable.", err);
      const h1 = $("#profile-name");
      if (h1) h1.textContent = displayName;
      if (profileStatus) profileStatus.textContent = "GitHub temporarily unavailable";
      ["#public-repos", "#followers", "#following", "#gists"].forEach((sel) => {
        const el = $(sel);
        if (el) el.textContent = "--";
      });
    }
  }

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
        <div class="repo-meta">${lang}${stars}${forks}${updated}</div>
      </a>
    `;
  }

  function renderRepos(repos, sourceLabel, statusText) {
    const grid = $("#repo-grid");
    const status = $("#work-status");
    if (!grid || !status) return;
    if (repos.length) {
      grid.innerHTML = repos.map(repoCardHtml).join("");
      status.textContent = statusText || `${sourceLabel} · ${repos.length} repositories`;
    } else {
      grid.innerHTML = "";
      status.textContent = "No public repositories to show yet.";
    }
  }

  function renderFallbackRepo() {
    renderRepos(
      [{
        name: `${GITHUB_USERNAME} on GitHub`,
        description: "GitHub API is temporarily unavailable; this card keeps the source profile reachable.",
        htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
        language: "GitHub",
        stars: null,
        forks: null,
        updatedAt: null,
      }],
      "GitHub profile",
      "GitHub repository data is temporarily unavailable."
    );
  }

  async function loadRepositories() {
    if (Array.isArray(cfg.featured) && cfg.featured.length) {
      try {
        const all = await fetchJson(REPOS_URL);
        const byName = new Map(all.map((r) => [r.name, r]));
        const repos = cfg.featured.map((name) => byName.get(name)).filter(Boolean).map(normalizeRestRepo);
        if (repos.length) {
          renderRepos(repos, "Featured code", `${repos.length} selected repositories from data/site.js`);
          return;
        }
      } catch (err) {
        console.info("Failed to resolve featured repos from REST.", err);
      }
    }

    try {
      const pinned = await fetchJson(PINNED_URL);
      const repos = pinned.map(normalizePinnedRepo).slice(0, 4);
      if (repos.length) {
        renderRepos(repos, "Pinned code");
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
        .slice(0, 4)
        .map(normalizeRestRepo);
      renderRepos(repos, "Public code");
    } catch (err) {
      console.info("REST repositories unavailable.", err);
      renderFallbackRepo();
    }
  }

  function renderStack(repos) {
    const grid = $("#stack-grid");
    if (!grid) return;
    const tally = new Map();
    let totalBytes = 0;
    repos.forEach((repo) => {
      if (!repo.language || repo.fork) return;
      const bytes = (repo.size || 1) * 1024;
      tally.set(repo.language, (tally.get(repo.language) || 0) + bytes);
      totalBytes += bytes;
    });
    const entries = Array.from(tally.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (!entries.length) {
      grid.style.gridTemplateColumns = "minmax(0, 1fr)";
      grid.innerHTML = `<p class="status panel-status">语言统计暂时读不到。</p>`;
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
      if (grid) {
        grid.style.gridTemplateColumns = "minmax(0, 1fr)";
        grid.innerHTML = `<p class="status panel-status">语言统计暂时读不到。</p>`;
      }
    }
  }

  function renderContact() {
    const grid = $("#contact-grid");
    if (!grid) return;
    const email = profileCfg.email || contactCfg.email;
    const items = [
      email && { label: "Email", value: email, href: `mailto:${email}` },
      contactCfg.github && { label: "GitHub", value: `@${contactCfg.github}`, href: `https://github.com/${contactCfg.github}` },
      contactCfg.twitter && { label: "Twitter", value: `@${contactCfg.twitter}`, href: `https://twitter.com/${contactCfg.twitter}` },
      contactCfg.linkedin && {
        label: "LinkedIn",
        value: contactCfg.linkedin,
        href: contactCfg.linkedin.startsWith("http") ? contactCfg.linkedin : `https://linkedin.com/in/${contactCfg.linkedin}`,
      },
      contactCfg.website && { label: "Website", value: contactCfg.website.replace(/^https?:\/\//, ""), href: contactCfg.website },
    ].filter(Boolean);

    if (email) {
      const heroEmail = $("#hero-email");
      if (heroEmail) heroEmail.href = `mailto:${email}`;
    }

    if (!items.length) {
      grid.innerHTML = `<p class="contact-empty">在 <code>data/site.js</code> 中填入 email / website 等信息后,这里会自动生成联系入口。</p>`;
      return;
    }

    grid.innerHTML = items
      .map((it) => `
        <a class="contact-card" href="${escapeHtml(it.href)}" target="_blank" rel="noreferrer">
          <span class="contact-label">${escapeHtml(it.label)}</span>
          <span class="contact-value">${escapeHtml(it.value)}</span>
          <span class="contact-arrow">↗</span>
        </a>
      `)
      .join("");
  }

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
    const targets = $$(".section, .hero, .cv-snapshot");
    targets.forEach((el) => el.classList.add("reveal"));
    window.setTimeout(() => targets.forEach((el) => el.classList.add("in")), 1500);
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    targets.forEach((el) => io.observe(el));
  }

  function setupLocalTime() {
    const el = $("#local-time");
    if (!el) return;
    const tz = metaCfg.timezone;
    const update = () => {
      try {
        el.textContent = new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz || undefined,
        }).format(new Date());
      } catch (_) {
        el.textContent = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
      }
    };
    update();
    window.setInterval(update, 30 * 1000);
  }

  function init() {
    applyBindings();
    renderPdfButton();
    renderCvSections();
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
