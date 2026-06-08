// data/site.js
// 在这里改你的静态信息(身份、Now、联系入口)。
// 头像/简介/统计/置顶仓库/Language 占比都由 GitHub API 在浏览器里实时拉取。
//
// 用法:把字段后面的内容替换成你的即可,字段名请保持不变。
// 留空的字段(比如 twitter)会自动从页面上隐藏,不会显示空卡片。

window.SITE_CONFIG = {
  meta: {
    // 你希望别人怎么称呼你 / 你是谁
    name: "lijialei",
    role: "Student · Builder",          // 例:"PhD Student @ XX" / "Software Engineer"
    location: "Shanghai, CN",                 // 留空就不显示城市
    timezone: "Asia/Shanghai",                // footer 用,显示当前时间
    tagline: "把零散的项目慢慢沉淀成可读的作品集。",
  },

  // 4 张 Now 卡片 —— 反映最近一两个月在做/在学/在读什么
  now: {
    focused:  "把 GitHub 上零散的项目沉淀成作品集",   // 现在主攻
    learning: "推荐系统 · 检索增强 · LLM 推理",   // 正在学/补课
    building: "dllmrec · minionerec · 这个主页",  // 正在写的项目
    reading:  "一本关于 XX 的小书",                       // 正在读
  },

  // 联系入口:留空就隐藏
  contact: {
    email:    "",                              // 例:"you@domain.com"
    github:   "Jialei-03",
    twitter:  "",                              // 例:"leslie_x"
    linkedin: "",
    website:  "",                              // 例:"https://leslie.dev"
  },

  // 想强制把某几个仓库置顶到「精选仓库」,在这里写仓库名数组;
  // 留空 [] 时,自动展示 GitHub 上的 Pinned Repositories。
  featured: [],

  // 页脚版本号 / 最后更新
  updatedAt: "2026-06",
};
