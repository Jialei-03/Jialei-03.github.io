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
  let currentLang = window.localStorage.getItem("lang") === "en" ? "en" : "zh";

  const i18n = {
    zh: {
      nav: { about: "关于", education: "教育经历", publications: "论文", contact: "联系" },
      links: { email: "邮箱" },
      profile: {
        eyebrow: "推荐系统 · 大语言模型",
        motto: "无限进步。",
      },
      labels: { focus: "方向", affiliation: "单位", profile: "主页", staticProfile: "静态主页", interestsInline: "研究兴趣" },
      sections: {
        interests: "研究兴趣",
        news: "动态",
        education: "教育经历",
        publications: "论文与产出",
        awards: "奖项",
        skills: "技能",
        contact: "联系",
      },
      empty: {
        interests: "研究兴趣会在这里更新。",
        news: "近期动态会在这里更新。",
        education: "教育经历会在这里更新。",
        publications: "论文和产出会在这里更新。",
        awards: "奖项会在这里更新。",
        skills: "技能会在这里更新。",
        contact: "在 data/site.js 中填入联系方式后,这里会自动生成联系入口。",
      },
      contactLabels: { Email: "邮箱", GitHub: "GitHub", Twitter: "Twitter", LinkedIn: "LinkedIn", Scholar: "Google Scholar", ORCID: "ORCID", Website: "网站" },
      footer: { updated: "更新于" },
      pdfPending: "PDF 简历会在当前版本准备好后补充。",
      titleSuffix: "学术主页",
      langButton: "EN",
      langAria: "Switch to English",
      githubLinked: "GitHub 主页",
      githubStatic: "静态主页",
      paper: "论文",
      pdf: "PDF",
      code: "代码",
      unavailable: "暂无公开 PDF",
    },
    en: {
      nav: { about: "About", education: "Education", publications: "Publications", contact: "Contact" },
      links: { email: "Email" },
      profile: {
        eyebrow: "Recommender Systems · Large Language Models",
        motto: "Always improving.",
      },
      labels: { focus: "Focus", affiliation: "Affiliation", profile: "Profile", staticProfile: "Static profile", interestsInline: "Interests" },
      sections: {
        interests: "Research Interests",
        news: "News",
        education: "Education",
        publications: "Selected Publications",
        awards: "Awards",
        skills: "Skills",
        contact: "Contact",
      },
      empty: {
        interests: "Research interests will be added here.",
        news: "News will be added here.",
        education: "Education details will be added here.",
        publications: "Publications and writing will be added here.",
        awards: "Awards will be added here.",
        skills: "Skills will be added here.",
        contact: "Add contact links in data/site.js to render them here.",
      },
      contactLabels: { Email: "Email", GitHub: "GitHub", Twitter: "Twitter", LinkedIn: "LinkedIn", Scholar: "Google Scholar", ORCID: "ORCID", Website: "Website" },
      footer: { updated: "Last updated" },
      pdfPending: "PDF Resume will be added when a current version is ready.",
      titleSuffix: "Academic Homepage",
      langButton: "中",
      langAria: "切换到中文",
      githubLinked: "GitHub profile",
      githubStatic: "Static profile",
      paper: "Paper",
      pdf: "PDF",
      code: "Code",
      unavailable: "PDF unavailable",
    },
  };

  function isPresent(value) {
    return value != null && String(localize(value)).trim() !== "";
  }

  function localize(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if ("zh" in value || "en" in value) return value[currentLang] || value.zh || value.en || "";
    }
    return value == null ? "" : value;
  }

  function textAt(path) {
    return path.split(".").reduce((cur, key) => (cur == null ? cur : cur[key]), i18n[currentLang]) || "";
  }

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

  function cleanUrl(value) {
    return String(value || "").replace(/\s+/g, "").trim();
  }

  function isPlaceholderText(value) {
    return /placeholder|待补充|20XX|City, Country|Previous Education/i.test(String(value || ""));
  }

  function isPlaceholderEntry(item) {
    if (!item || typeof item !== "object") return false;
    return Object.values(item).some(isPlaceholderText);
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
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    document.documentElement.setAttribute("data-lang", currentLang);

    $$('[data-bind]').forEach((el) => {
      const value = valueAtPath(el.getAttribute("data-bind"));
      if (value == null || value === "") return;
      el.textContent = String(localize(value));
    });

    $$("[data-i18n]").forEach((el) => {
      el.textContent = textAt(el.getAttribute("data-i18n"));
    });

    $$("[data-optional]").forEach((el) => {
      const value = valueAtPath(el.getAttribute("data-optional"));
      el.hidden = !isPresent(value);
    });

    const displayName = profileCfg.name || metaCfg.name || `${profileCfg.chineseName || "李嘉磊"} / ${profileCfg.englishName || "Jialei Li"}`;
    const title = `${displayName} · ${textAt("titleSuffix")}`;
    document.title = title;

    $$("a[href*='.github.io']").forEach((a) => {
      a.href = `https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`;
    });

    const langBtn = $("#lang-toggle");
    if (langBtn) {
      langBtn.textContent = textAt("langButton");
      langBtn.setAttribute("aria-label", textAt("langAria"));
      langBtn.setAttribute("title", textAt("langAria"));
    }
  }

  function renderPdfButton() {
    const status = $("#pdf-status");
    if (!status) return;
    const pdf = profileCfg.pdf || {};
    if (pdf.status === "available" && pdf.href) {
      const link = document.createElement("a");
      link.className = "button ghost";
      link.href = pdf.href;
      link.textContent = pdf.label || "PDF Resume";
      link.setAttribute("download", "");
      status.replaceWith(link);
      return;
    }
    status.textContent = textAt("pdfPending");
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

  function renderNews() {
    renderList(
      "news-list",
      cfg.news,
      textAt("empty.news"),
      (item) => `
        <li>
          ${item.image ? `<img class="news-thumb" src="${escapeHtml(item.image)}" alt="" />` : ""}
          <time class="date-tag">${escapeHtml(item.date || "")}</time>
          <span>
            ${item.badge ? `<strong>${escapeHtml(item.badge)}</strong> · ` : ""}
            ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${escapeHtml(localize(item.text))}</a>` : escapeHtml(localize(item.text))}
          </span>
        </li>
      `
    );
  }

  const iconMap = {
    email: '<span class="link-icon icon-email" aria-hidden="true"></span>',
    github: '<span class="link-icon icon-github" aria-hidden="true"></span>',
    paper: '<span class="link-icon icon-paper" aria-hidden="true"></span>',
    pdf: '<span class="link-icon icon-pdf" aria-hidden="true"></span>',
    code: '<span class="link-icon icon-code" aria-hidden="true"></span>',
  };

  function iconForLink(label, href) {
    const value = `${label || ""} ${href || ""}`.toLowerCase();
    if (value.includes("pdf")) return iconMap.pdf;
    if (value.includes("github") || value.includes("code")) return iconMap.github;
    if (value.includes("paper") || value.includes("论文") || value.includes("doi.org") || value.includes("dl.acm.org")) return iconMap.paper;
    if (value.includes("arxiv")) return iconMap.paper;
    if (value.includes("mailto") || value.includes("email") || value.includes("邮箱")) return iconMap.email;
    return iconMap.code;
  }

  function linkButton(label, href, extraClass) {
    if (!href) return "";
    return `<a class="btn ${extraClass || ""}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${iconForLink(label, href)}<span>${escapeHtml(label)}</span></a>`;
  }

  function renderCvSections() {
    const educationItems = (cfg.education || []).filter((item) => !isPlaceholderEntry(item));
    const publicationItems = (cfg.publications || []).filter((item) => !isPlaceholderEntry(item));
    const awardItems = (cfg.awards || []).filter((item) => !isPlaceholderEntry(item));
    const inlineInterest = $("#interest-inline");
    if (inlineInterest) {
      inlineInterest.innerHTML = (cfg.interests || [])
        .map(localize)
        .filter(Boolean)
        .map((item) => `<span class="item">${escapeHtml(item)}</span>`)
        .join(" ");
    }

    renderList(
      "interest-list",
      cfg.interests,
      textAt("empty.interests"),
      (item) => `<article class="interest-card">${escapeHtml(localize(item))}</article>`
    );

    renderNews();

    renderList(
      "education-list",
      educationItems,
      textAt("empty.education"),
      (item) => `
        <article class="experience-item">
          <div class="logo-box">
            ${item.logo ? `<img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.logoAlt || localize(item.school))}" />` : `<span class="logo-text">${escapeHtml(String(localize(item.school)).slice(0, 4))}</span>`}
          </div>
          <div class="exp-details">
            <h4 class="exp-title">${escapeHtml(localize(item.school))}</h4>
            <p class="timeline-degree">${escapeHtml(localize(item.degree))}</p>
            ${isPresent(item.location) ? `<p class="timeline-location">${escapeHtml(localize(item.location))}</p>` : ""}
            ${isPresent(item.details) ? `<p>${escapeHtml(localize(item.details))}</p>` : ""}
          </div>
          <div class="exp-date">${escapeHtml(item.period || "")}</div>
        </article>
      `
    );

    renderList(
      "publication-list",
      publicationItems,
      textAt("empty.publications"),
      (item) => `
        <article class="paper-item${item.image ? "" : " paper-item--text"}">
          ${item.image ? `
          <div class="paper-img-container">
            <img class="paper-img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.title)}" />
          </div>
          ` : ""}
          <div class="paper-info">
            ${item.badge ? `<span class="conf-badge badge-default">${escapeHtml(item.badge)}</span>` : ""}
            ${item.link ? `<a class="paper-title" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>` : `<h3 class="paper-title">${escapeHtml(item.title)}</h3>`}
            <div class="author-list">${escapeHtml(item.authors || "")}</div>
            <div class="venue">${escapeHtml(item.venue || "")}${item.year ? ` · ${escapeHtml(item.year)}` : ""}${item.status ? ` · ${escapeHtml(localize(item.status))}` : ""}</div>
            <div class="btn-group">
              ${linkButton(textAt("paper"), item.link)}
              ${item.pdf ? linkButton(textAt("pdf"), item.pdf) : `<span class="btn btn-disabled">${escapeHtml(textAt("unavailable"))}</span>`}
              ${linkButton(textAt("code"), item.code)}
            </div>
          </div>
        </article>
      `
    );

    renderList(
      "skill-list",
      cfg.skills,
      textAt("empty.skills"),
      (group) => `
        <article class="skill-group">
          <h3>${escapeHtml(group.group)}</h3>
          <div class="skill-chip-row">${(group.items || []).map((item) => `<span>${escapeHtml(localize(item))}</span>`).join("")}</div>
        </article>
      `
    );

    renderList(
      "award-list",
      awardItems,
      textAt("empty.awards"),
      (item) => `
        <article class="award-item">
          <span>${escapeHtml(localize(item.year))}</span>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(localize(item.description))}</p>
          </div>
        </article>
      `
    );
  }

  async function loadProfile() {
    const displayName = profileCfg.name || metaCfg.name || `${profileCfg.chineseName || "李嘉磊"} / ${profileCfg.englishName || "Jialei Li"}`;
    const profileStatus = $("#profile-status");
    const snapshot = $("#github-snapshot");
    try {
      const profile = await fetchJson(PROFILE_URL);
      const avatar = $("#avatar");
      if (avatar && profileCfg.avatarUrl) avatar.src = profileCfg.avatarUrl;
      const h1 = $("#profile-name");
      if (h1) h1.textContent = displayName;
      if (profileStatus) profileStatus.textContent = profile.bio ? textAt("githubLinked") : textAt("githubStatic");
      if (snapshot) snapshot.setAttribute("data-status", "ready");
      $("#public-repos").textContent = formatNumber(profile.public_repos);
      $("#followers").textContent = formatNumber(profile.followers);
      $("#following").textContent = formatNumber(profile.following);
      $("#gists").textContent = formatNumber(profile.public_gists);
    } catch (err) {
      console.info("GitHub profile unavailable.", err);
      const h1 = $("#profile-name");
      if (h1) h1.textContent = displayName;
      if (profileStatus) profileStatus.textContent = textAt("githubStatic");
      if (snapshot) {
        snapshot.setAttribute("data-status", "unavailable");
        snapshot.innerHTML = `
          <article class="snapshot-unavailable">
            <span>GitHub data unavailable</span>
            <p>Static CV content remains available below.</p>
          </article>
        `;
      }
    }
  }

  function normalizePinnedRepo(repo) {
    return {
      name: repo.repo,
      description: repo.description,
      htmlUrl: cleanUrl(repo.link),
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
      htmlUrl: cleanUrl(repo.html_url),
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
    if (!$("#repo-grid") || !$("#work-status")) return;
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
    if (!$("#stack-grid")) return;
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
      contactCfg.scholar && {
        label: "Scholar",
        value: "Google Scholar",
        href: contactCfg.scholar,
      },
      contactCfg.orcid && {
        label: "ORCID",
        value: contactCfg.orcid.replace(/^https?:\/\/orcid\.org\//, ""),
        href: contactCfg.orcid.startsWith("http") ? contactCfg.orcid : `https://orcid.org/${contactCfg.orcid}`,
      },
      contactCfg.website && { label: "Website", value: contactCfg.website.replace(/^https?:\/\//, ""), href: contactCfg.website },
    ].filter(Boolean);

    if (!items.length) {
      grid.innerHTML = `<p class="contact-empty">${escapeHtml(textAt("empty.contact"))}</p>`;
      return;
    }

    grid.innerHTML = items
      .map((it) => `
        <a class="contact-card" href="${escapeHtml(it.href)}" target="_blank" rel="noreferrer">
          <span class="contact-label">${escapeHtml(textAt(`contactLabels.${it.label}`) || it.label)}</span>
          <span class="contact-value">${escapeHtml(it.value)}</span>
          <span class="contact-arrow">↗</span>
        </a>
      `)
      .join("");
  }

  function setupAvatarFallback() {
    const avatar = $("#avatar");
    const fallback = $("#avatar-fallback");
    if (!avatar || !fallback) return;
    const displayName = profileCfg.avatarFallback || profileCfg.englishName || metaCfg.name || GITHUB_USERNAME;
    fallback.textContent = displayName;
    const showFallback = () => {
      avatar.hidden = true;
      fallback.hidden = false;
      fallback.classList.remove("is-hidden");
    };
    const showAvatar = () => {
      if (avatar.naturalWidth === 0) return;
      avatar.hidden = false;
      fallback.hidden = true;
      fallback.classList.add("is-hidden");
    };
    avatar.hidden = true;
    fallback.hidden = false;
    avatar.addEventListener("load", showAvatar);
    avatar.addEventListener("error", showFallback);
    if (avatar.complete && avatar.naturalWidth > 0) showAvatar();
    if (avatar.complete && avatar.naturalWidth === 0) showFallback();
  }

  function renderPageContent() {
    applyBindings();
    renderPdfButton();
    renderCvSections();
    renderContact();
    const profileStatus = $("#profile-status");
    if (profileStatus) profileStatus.textContent = textAt("githubStatic");
  }

  function setupLanguage() {
    const btn = $("#lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      window.localStorage.setItem("lang", currentLang);
      renderPageContent();
    });
  }

  function setupTopbarElevation() {
    const bar = $("#topbar");
    if (!bar) return;
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progress.style.width = `${pct}%`;
        bar.classList.toggle("is-scrolled", window.scrollY > 8);
        bar.setAttribute("data-elevated", String(window.scrollY > 8));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupReveal() {
    const targets = $$("section:not(.hero), .section-sep, .news-list li, .experience-item, .paper-item");
    targets.forEach((el, index) => {
      el.classList.add("reveal");
      if (el.matches(".news-list li, .experience-item, .paper-item")) {
        el.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 0.07}s`);
      }
    });
    window.setTimeout(() => targets.forEach((el) => el.classList.add("in")), 600);
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
    }, { rootMargin: "0px 0px -48px 0px", threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }

  function setupPortraitParallax() {
    const portrait = $(".hero .portrait");
    if (!portrait || !window.matchMedia("(pointer: fine)").matches) return;
    const img = $("img", portrait);
    if (!img) return;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const tick = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      img.style.transform = `translate(${currentX * 4}px, ${currentY * 4}px)`;
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    portrait.addEventListener("mousemove", (e) => {
      const rect = portrait.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!raf) raf = window.requestAnimationFrame(tick);
    });
    portrait.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = window.requestAnimationFrame(tick);
    });
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
    renderPageContent();
    setupAvatarFallback();
    setupLanguage();
    setupTopbarElevation();
    setupReveal();
    setupPortraitParallax();
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
