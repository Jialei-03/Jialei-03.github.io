export type Language = "en" | "zh"
export type Localized = { en: string; zh: string }
// Text with optional inline links; links starting with "#" stay on the page.
export type Rich = (string | { text: string; href: string })[]
type LocalizedRich = { en: Rich; zh: Rich }

export const profile = {
  name: { en: "Jialei Li", zh: "李嘉磊" },
  otherName: { en: "李嘉磊", zh: "Jialei Li" },
  roles: [
    { title: { en: "M.Sc. Student", zh: "硕士研究生" }, place: { en: "University of Science and Technology of China, LDS Lab", zh: "中国科学技术大学，LDS 实验室" }, href: "#education-ustc" },
  ],
  email: "lijialei.cn@gmail.com",
  github: "https://github.com/Jialei-03",
  // GitHub profile image: https://avatars.githubusercontent.com/u/184720084?v=4
  avatar: "/assets/github-avatar.webp",
  avatarSmall: "/assets/github-avatar-small.webp",
  bio: {
    en: [
      ["I am a master's student at the School of Artificial Intelligence and Data Science, ", { text: "University of Science and Technology of China", href: "https://sai.ustc.edu.cn/" }, ", in the LDS Lab. I work on AI agents and large language models: whether coding agents can clarify what clients actually want, and how research agents can keep their direction and back claims with evidence."],
      ["Before agents, I worked on generative recommendation. I also build open-source tools for research, including ", { text: "Open-Research-Agent", href: "#project-open-research-agent" }, "."],
    ],
    zh: [
      ["我是", { text: "中国科学技术大学", href: "https://sai.ustc.edu.cn/" }, "人工智能与数据科学学院 LDS 实验室的硕士生。我研究智能体与大语言模型：编码智能体能否问清客户真正的需求，科研智能体如何不偏离方向、并用证据支撑结论。"],
      ["在此之前，我从事生成式推荐研究。我也开发面向科研的开源工具，例如 ", { text: "Open-Research-Agent", href: "#project-open-research-agent" }, "。"],
    ],
  } satisfies { en: Rich[]; zh: Rich[] },
  now: {
    en: ["First author of ", { text: "SWE-Clar", href: "#project-swe-clar" }, ", a benchmark for coding agents built from real client jobs. Looking for research internships on agents and LLMs."],
    zh: ["以第一作者发布 ", { text: "SWE-Clar", href: "#project-swe-clar" }, "，一个基于真实客户项目的编码智能体评测基准。正在寻找智能体与大语言模型方向的研究实习。"],
  } satisfies LocalizedRich,
  interests: [
    { en: "AI agents", zh: "智能体" },
    { en: "Large language models", zh: "大语言模型" },
    { en: "Generative recommendation", zh: "生成式推荐" },
  ],
  updatedAt: "2026.10",
}

type School = {
  id: string
  name: Localized
  href: string
  logo: string
  degree: Localized
  period: Localized
}

export const education: School[] = [
  {
    id: "education-ustc",
    name: { en: "University of Science and Technology of China", zh: "中国科学技术大学" },
    href: "https://sai.ustc.edu.cn/",
    logo: "/assets/ustc-logo.png",
    degree: { en: "M.Sc. in Big Data Technology and Engineering, School of AI and Data Science, LDS Lab", zh: "大数据技术与工程硕士，人工智能与数据科学学院，LDS 实验室" },
    period: { en: "2026 – Present", zh: "2026 – 至今" },
  },
  {
    id: "education-lzu",
    name: { en: "Lanzhou University", zh: "兰州大学" },
    href: "https://www.lzu.edu.cn/",
    logo: "/assets/lzu-logo.png",
    degree: { en: "B.Eng. in Data Science and Big Data Technology", zh: "数据科学与大数据技术，本科" },
    period: { en: "2022.09 – 2026.06", zh: "2022.09 – 2026.06" },
  },
]

// SWE-Clar is an Upwork project: its tasks come from real Upwork client jobs and the code is
// released under github.com/upwork.
export const sweClar = {
  name: "SWE-Clar",
  organization: { name: "Upwork", href: "https://github.com/upwork", logo: "/assets/upwork-logo.webp" },
  kind: { en: "Upwork project", zh: "Upwork 项目" },
  summary: {
    en: "A benchmark of 100 greenfield software tasks from real Upwork client jobs and 512 clarification questions, testing whether coding agents clarify requirements before they build. Nine frontier models evaluated.",
    zh: "基于真实 Upwork 客户项目的 100 个新建软件任务与 512 个需求澄清问题，检验编码智能体能否在动手前问清需求，并评测了 9 个前沿模型。",
  },
  code: "https://github.com/upwork/SWE-Clar",
  publicationId: "swe-clar",
}

// Description and links verified against the public repository README.
export const openResearchAgent = {
  name: "Open-Research-Agent",
  summary: {
    en: "An open-source research agent that keeps its direction: a persistent research map, an independent advisor, and conclusions that must cite real logs or paper sentences.",
    zh: "一个不偏航的开源科研智能体：持久化的研究地图、独立的顾问，结论必须引用真实的日志或论文原句。",
  },
  repository: "https://github.com/Jialei-03/open-research-agent",
  reader: "https://papers.dougao.online",
}

type ResearchProject = { id: string; title: string; summary: Localized }

// Unreleased research; it gains paper and code links once it moves to the publication list.
export const researchProjects: ResearchProject[] = [
  {
    id: "mesa",
    title: "MESA: Long-Horizon Agent Memory as an Emergent Society of Matter Agents",
    summary: {
      en: "Long-horizon agent memory modeled as an emergent society of Matter Agents.",
      zh: "以 Matter Agents 的涌现社会为视角，探索智能体的长程记忆。",
    },
  },
]

export type Publication = {
  id: string
  name: string
  title: string
  authors: string[]
  venue: string
  year: string
  type: "conference" | "preprint"
  format: Localized
  description?: Localized
  paper: string
  pdf: string
  code?: string
  image: string
  imageAlt: string
}

export const publications: Publication[] = [
  {
    id: "swe-clar",
    name: "SWE-Clar",
    title: "SWE-Clar: Can Coding Agents Clarify Incomplete Client Requirements and Deliver Greenfield Software?",
    authors: ["Jialei Li", "Dingxian Wang", "Xiaoyan Zhao", "Yimeng Bai", "Xuanyi Zhu", "Yang Zhang", "Chao Yin", "Wentao Shi", "Ganesh Prabhu", "Karthik Gomadam Rajagopal", "Brett Levert", "Darvin Yi", "Andrew Rabinovich", "Zhao Chen"],
    venue: "arXiv:2610.31854",
    year: "2026",
    type: "preprint",
    format: { en: "Preprint", zh: "预印本" },
    description: {
      en: "100 greenfield software tasks grounded in real client commissions and 512 requirement questions for evaluating clarification and independent software delivery.",
      zh: "基于真实项目构建 100 个新建软件任务与 512 个需求问题，评估需求澄清和独立软件交付能力。",
    },
    paper: "https://arxiv.org/abs/2610.31854",
    pdf: "https://arxiv.org/pdf/2610.31854",
    code: "https://github.com/upwork/SWE-Clar",
    // Figure 2 from https://arxiv.org/html/2610.31854v1 (CC BY 4.0).
    image: "/assets/swe-clar-framework.webp",
    imageAlt: "SWE-Clar benchmark workflow with requirement clarification and independent implementation and clarification evaluation branches",
  },
  {
    id: "soda",
    name: "SODA",
    title: "Distribution-Level Contrastive Supervision for Generative Recommendation",
    authors: ["Ziqi Xue", "Dingxian Wang", "Yimeng Bai", "Shuai Zhu", "Jialei Li", "Xiaoyan Zhao", "Frank Yang", "Andrew Rabinovich", "Yang Zhang", "Pablo N. Mendes"],
    venue: "RecSys 2026",
    year: "2026",
    type: "conference",
    format: { en: "Short Paper", zh: "短篇论文" },
    description: {
      en: "Soft semantic supervision for generative recommendation, through distribution-level alignment.",
      zh: "通过分布级对齐，为生成式推荐引入更细致的软语义监督。",
    },
    paper: "https://doi.org/10.1145/3773078.3831770",
    pdf: "https://arxiv.org/pdf/2603.00700",
    code: "https://github.com/freyasa/SODA",
    // Figure 1 from https://arxiv.org/html/2603.00700v2 (CC BY).
    image: "/assets/soda-framework.svg",
    imageAlt: "Overview of the SODA distribution-level contrastive supervision framework",
  },
  {
    id: "unigrec",
    name: "UniGRec",
    title: "UniGRec: Unified Generative Recommendation with Soft Identifiers for End-to-End Optimization",
    authors: ["Jialei Li", "Yang Zhang", "Yimeng Bai", "Shuai Zhu", "Ziqi Xue", "Xiaoyan Zhao", "Dingxian Wang", "Frank Yang", "Andrew Rabinovich", "Xiangnan He"],
    venue: "arXiv:2601.17438",
    year: "2026",
    type: "preprint",
    format: { en: "Preprint", zh: "预印本" },
    description: {
      en: "Unifies soft identifiers and generative recommendation for end-to-end optimization.",
      zh: "统一软标识符与生成式推荐，实现端到端优化。",
    },
    paper: "https://arxiv.org/abs/2601.17438",
    pdf: "https://arxiv.org/pdf/2601.17438",
    code: "https://github.com/Jialei-03/UniGRec",
    image: "/assets/unigrec-framework.webp",
    imageAlt: "UniGRec unified generative recommendation framework",
  },
  {
    id: "isccn",
    name: "CEEMDAN-PatchTST",
    title: "The Transformer Oil Temperature Prediction Method Based on the CEEMDAN-PatchTST-Transformer Hybrid Model",
    authors: ["Jialei Li et al."],
    venue: "ISCCN 2025",
    year: "2025",
    type: "conference",
    format: { en: "Conference Paper", zh: "会议论文" },
    description: {
      en: "Combines CEEMDAN, PatchTST, and Transformer for transformer oil temperature prediction.",
      zh: "结合 CEEMDAN、PatchTST 与 Transformer 进行变压器油温预测。",
    },
    paper: "https://doi.org/10.1145/3732945.3732960",
    pdf: "https://dl.acm.org/doi/pdf/10.1145/3732945.3732960",
    image: "/assets/isccn-framework.webp",
    imageAlt: "CEEMDAN-PatchTST-Transformer oil temperature prediction framework",
  },
]

export const news = [
  {
    date: "2026.10",
    text: { en: "SWE-Clar preprint is now available on arXiv, with code and data released.", zh: "SWE-Clar 预印本已发布于 arXiv，代码与数据同步开源。" },
    href: "#publication-swe-clar",
  },
  {
    date: "2026.09",
    text: { en: "SODA appears at RecSys 2026 as a short paper.", zh: "SODA 以 Short Paper 形式发表于 RecSys 2026。" },
    href: "#publication-soda",
  },
  {
    date: "2026.01",
    text: { en: "UniGRec preprint is now available on arXiv.", zh: "UniGRec 预印本已发布于 arXiv。" },
    href: "https://arxiv.org/abs/2601.17438",
  },
  {
    date: "2025.06",
    text: { en: "One paper accepted at ISCCN 2025.", zh: "一篇论文被 ISCCN 2025 录用。" },
    href: "https://doi.org/10.1145/3732945.3732960",
  },
]
