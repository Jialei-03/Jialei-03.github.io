// data/site.js
// Academic CV configuration. Edit this file to update the site without touching HTML/CSS.
// Empty optional fields are either hidden or rendered as a clear placeholder.

window.SITE_CONFIG = {
  meta: {
    name: "李嘉磊 / Jialei Li",
    brand: "lijialei",
    role: "Student · Research Builder",
    location: "Shanghai, CN",
    timezone: "Asia/Shanghai",
    tagline:
      "关注推荐系统、检索增强与大语言模型推理,希望把研究问题、工程实现和可复现实验连接起来。",
    updatedAt: "2026-06",
  },

  profile: {
    chineseName: "李嘉磊",
    englishName: "Jialei Li",
    brand: "lijialei",
    title: "Student · Research Builder",
    location: "Shanghai, CN",
    email: "",
    summary:
      "我目前关注推荐系统、信息检索与大语言模型相关方向,尤其是如何把模型能力落到可验证、可复现、可维护的研究与工程系统中。这个页面会持续沉淀我的研究兴趣、项目、论文/产出与联系方式。",
    summaryEn:
      "I am interested in recommender systems, retrieval-augmented methods, and LLM reasoning, with a practical focus on reproducible experiments and maintainable research prototypes.",
    pdf: {
      status: "coming-soon",
      href: "./assets/lijialei-resume.pdf",
      label: "PDF Resume",
    },
  },

  contact: {
    email: "",
    github: "Jialei-03",
    twitter: "",
    linkedin: "",
    website: "",
  },

  interests: [
    "推荐系统 / Recommender Systems",
    "检索增强生成 / Retrieval-Augmented Generation",
    "大语言模型推理 / LLM Reasoning",
    "可复现实验与研究型工程 / Reproducible Research Engineering",
  ],

  education: [
    {
      school: "待补充 University / Institute",
      degree: "B.S. / M.S. / Ph.D. Candidate",
      period: "20XX - Present",
      location: "City, Country",
      details:
        "研究方向、导师、实验室或主修课程可写在这里。建议保留 1-2 句话,让读者快速理解你的学术背景。",
    },
    {
      school: "Previous Education",
      degree: "Degree / Program",
      period: "20XX - 20XX",
      location: "City, Country",
      details: "GPA、排名、荣誉课程或与研究方向相关的经历可以放在这里。",
    },
  ],

  projects: [
    {
      title: "UniGRec",
      role: "Research / Implementation",
      period: "2026",
      summary:
        "围绕统一生成式推荐与端到端优化的公开实现。这里可以补充你的具体贡献、方法亮点、实验设置和结果。",
      tags: ["Recommendation", "Generative Models", "Python"],
      link: "https://github.com/Jialei-03/UniGRec",
    },
    {
      title: "dllmrec / minionerec",
      role: "Exploratory Research Prototype",
      period: "2026",
      summary:
        "用于探索推荐系统、检索或 LLM 相关想法的研究型代码库。建议写清楚问题、方法、贡献和可复现入口。",
      tags: ["LLM", "Retrieval", "Research Prototype"],
      link: "https://github.com/Jialei-03",
    },
  ],

  publications: [
    {
      title: "Paper title placeholder: Method, Dataset, or System Name",
      authors: "Jialei Li, Co-author A, Co-author B",
      venue: "Under preparation / Preprint / Conference",
      year: "2026",
      status: "Manuscript in progress",
      link: "",
    },
    {
      title: "Technical report or project note placeholder",
      authors: "Jialei Li",
      venue: "Project note",
      year: "2026",
      status: "Draft",
      link: "",
    },
  ],

  skills: [
    {
      group: "Research",
      items: ["Recommender Systems", "Information Retrieval", "LLM Evaluation", "Experiment Design"],
    },
    {
      group: "Engineering",
      items: ["Python", "PyTorch", "JavaScript", "Git", "Static Web"],
    },
    {
      group: "Workflow",
      items: ["Literature Review", "Reproducible Pipelines", "Technical Writing", "Open-source Maintenance"],
    },
  ],

  awards: [
    {
      title: "Award / Scholarship placeholder",
      year: "20XX",
      description: "把奖学金、竞赛、优秀学生、论文奖或项目荣誉写在这里。",
    },
    {
      title: "Selected recognition placeholder",
      year: "20XX",
      description: "也可以先保留占位,等有真实信息后再替换。",
    },
  ],

  featured: [],
};
