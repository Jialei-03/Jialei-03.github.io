// data/site.js
// Academic CV configuration. Edit this file to update the site without touching HTML/CSS.
// Empty optional fields are hidden or rendered as honest "not ready yet" states.

window.SITE_CONFIG = {
  meta: {
    name: "李嘉磊 / Jialei Li",
    brand: "Jialei Li",
    role: "",
    location: "",
    timezone: "Asia/Shanghai",
    tagline: {
      zh: "关注推荐系统与大语言模型,持续学习模型方法。",
      en: "Interested in recommender systems, large language models, and model methods.",
    },
    updatedAt: "2026-06",
  },

  profile: {
    chineseName: "李嘉磊",
    englishName: "Jialei Li",
    brand: "Jialei Li",
    title: "",
    location: "",
    affiliation: "",
    availability: "",
    avatarFallback: "Jialei Li",
    email: "320220941691@lzu.edu.cn",
    summary: {
      zh: "我目前关注推荐系统与大语言模型相关方向,主要学习生成式推荐。",
      en: "I am interested in recommender systems and large language models, with a current focus on generative recommendation.",
    },
    pdf: {
      status: "coming-soon",
      href: "./assets/lijialei-resume.pdf",
      label: "PDF Resume",
    },
  },

  contact: {
    email: "320220941691@lzu.edu.cn",
    github: "Jialei-03",
    twitter: "",
    linkedin: "",
    scholar: "",
    orcid: "",
    website: "",
  },

  interests: [
    { zh: "推荐系统", en: "Recommender Systems" },
    { zh: "生成式推荐", en: "Generative Recommendation" },
    { zh: "大语言模型", en: "Large Language Models" },
  ],

  news: [
    {
      date: "2026.01",
      badge: "arXiv",
      image: "./assets/unigrec-framework.png",
      text: {
        zh: "UniGRec 预印本已发布在 arXiv。",
        en: "UniGRec preprint is available on arXiv.",
      },
      link: "https://arxiv.org/abs/2601.17438",
    },
    {
      date: "2025.06",
      badge: "ISCCN 2025",
      image: "./assets/lzu-logo.png",
      text: {
        zh: "一篇论文被 ISCCN 2025 录用。",
        en: "One paper was accepted by ISCCN 2025.",
      },
    },
  ],

  education: [
    {
      school: {
        zh: "中国科学技术大学 / University of Science and Technology of China",
        en: "University of Science and Technology of China",
      },
      degree: {
        zh: "人工智能与数据科学学院, LDS 实验室",
        en: "School of Artificial Intelligence and Data Science, LDS Lab",
      },
      period: "2026 -",
      location: {
        zh: "",
        en: "",
      },
      details: {
        zh: "人工智能与数据科学学院，LDS 实验室。",
        en: "School of Artificial Intelligence and Data Science, LDS Lab.",
      },
      logo: "./assets/ustc-logo.png",
      logoAlt: "University of Science and Technology of China logo",
      url: "https://sai.ustc.edu.cn/",
    },
    {
      school: {
        zh: "兰州大学 / Lanzhou University",
        en: "Lanzhou University",
      },
      degree: {
        zh: "数据科学与大数据技术，本科",
        en: "B.Eng. in Data Science and Big Data Technology",
      },
      period: "2022.09 - 2026.06",
      location: {
        zh: "",
        en: "",
      },
      details: {
        zh: "",
        en: "",
      },
      logo: "./assets/lzu-logo.png",
      logoAlt: "Lanzhou University logo",
      url: "https://www.lzu.edu.cn/",
    },
  ],

  publications: [
    {
      title: "UniGRec: Unified Generative Recommendation with Soft Identifiers for End-to-End Optimization",
      authors:
        "Jialei Li, Yang Zhang, Yimeng Bai, Shuai Zhu, Ziqi Xue, Xiaoyan Zhao, Dingxian Wang, Frank Yang, Andrew Rabinovich, Xiangnan He",
      venue: "arXiv:2601.17438",
      year: "2026",
      status: {
        zh: "预印本",
        en: "Preprint",
      },
      link: "https://arxiv.org/abs/2601.17438",
      pdf: "https://arxiv.org/pdf/2601.17438",
      code: "https://github.com/Jialei-03/UniGRec",
      image: "./assets/unigrec-framework.png",
      imageAlt: "UniGRec framework figure",
      badge: "arXiv",
    },
    {
      title: "The Transformer Oil Temperature Prediction Method Based on the CEEMDAN-PatchTST-Transformer Hybrid Model",
      authors: "Jialei Li et al.",
      venue: "ISCCN 2025 / EI Conference",
      year: "2025.06",
      status: {
        zh: "会议论文",
        en: "Conference paper",
      },
      link: "https://doi.org/10.1145/3732945.3732960",
      pdf: "https://dl.acm.org/doi/pdf/10.1145/3732945.3732960",
      code: "",
      image: "./assets/isccn-framework.png",
      imageAlt: "CEEMDAN-PatchTST-Transformer framework figure",
      badge: "ISCCN 2025",
    },
  ],

  skills: [
    {
      group: "Research",
      items: [
        { zh: "推荐系统", en: "Recommender Systems" },
        { zh: "大语言模型", en: "Large Language Models" },
        { zh: "生成式推荐", en: "Generative Recommendation" },
        { zh: "模型方法", en: "Model Methods" },
      ],
    },
    {
      group: "Engineering",
      items: ["Python", "PyTorch", { zh: "数据结构", en: "Data Structures" }, { zh: "数据库", en: "Database Systems" }, "Git"],
    },
    {
      group: "Workflow",
      items: [
        { zh: "文献阅读", en: "Literature Review" },
        { zh: "实验记录与整理", en: "Experiment Notes" },
        { zh: "技术写作", en: "Technical Writing" },
        { zh: "统计分析", en: "Statistical Analysis" },
      ],
    },
  ],

  awards: [
    {
      title: "National Scholarship",
      year: {
        zh: "学生阶段",
        en: "Student stage",
      },
      description: {
        zh: "学生阶段获得。",
        en: "Received during student stage.",
      },
    },
    {
      title: "Gansu Province Outstanding Student",
      year: {
        zh: "学生阶段",
        en: "Student stage",
      },
      description: {
        zh: "学生阶段获得。",
        en: "Received during student stage.",
      },
    },
  ],

  featured: [],
};
