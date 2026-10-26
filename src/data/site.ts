export type Language = "en" | "zh"
export type Localized = { en: string; zh: string }

export const profile = {
  name: { en: "Jialei Li", zh: "李嘉磊" },
  otherName: { en: "李嘉磊", zh: "Jialei Li" },
  role: { en: "Master's student", zh: "硕士研究生" },
  affiliation: { en: "University of Science and Technology of China", zh: "中国科学技术大学" },
  lab: { en: "School of AI & Data Science\nLDS Lab", zh: "人工智能与数据科学学院\nLDS 实验室" },
  email: "lijialei.cn@gmail.com",
  github: "https://github.com/Jialei-03",
  // GitHub profile image: https://avatars.githubusercontent.com/u/184720084?v=4
  avatar: "/assets/github-avatar.webp",
  avatarSmall: "/assets/github-avatar-small.webp",
  summary: {
    en: "I am a master's student in Big Data Technology and Engineering at the School of Artificial Intelligence and Data Science, University of Science and Technology of China. I focus on AI agents and large language models, and build open-source tools for research. My previous work explores generative recommendation.",
    zh: "我目前是中国科学技术大学人工智能与数据科学学院大数据技术与工程专业硕士生，主要关注智能体与大语言模型，并开发面向科研的开源工具。此前的研究聚焦于生成式推荐。",
  },
  interests: [
    { en: "AI Agents", zh: "智能体" },
    { en: "Large Language Models", zh: "大语言模型" },
    { en: "Generative Recommendation", zh: "生成式推荐" },
  ],
  updatedAt: "2026.10",
}

type ResearchProject = {
  id: string
  name: string
  title: string
  kind: Localized
  summary: Localized
  publicationId?: string
}

// Published entries share their paper and code links with the publication list.
export const researchProjects: ResearchProject[] = [
  {
    id: "swe-clar",
    name: "SWE-Clar",
    title: "SWE-Clar: Can Coding Agents Clarify Incomplete Client Requirements and Deliver Greenfield Software?",
    kind: { en: "Benchmark", zh: "评测基准" },
    publicationId: "swe-clar",
    summary: {
      en: "A benchmark evaluating coding agents' ability to clarify incomplete client requirements and deliver software from scratch.",
      zh: "聚焦编码智能体的需求澄清与代码能力，评估其能否澄清不完整的客户需求，并从零交付软件。",
    },
  },
  {
    id: "mesa",
    name: "MESA",
    title: "MESA: Long-Horizon Agent Memory as an Emergent Society of Matter Agents",
    kind: { en: "Agent memory", zh: "智能体记忆" },
    summary: {
      en: "Long-horizon agent memory modeled as an emergent society of Matter Agents.",
      zh: "以 Matter Agents 的涌现社会为视角，探索智能体的长程记忆。",
    },
  },
]

// Description and links verified against the public repository README.
export const openResearchAgent = {
  name: "Open-Research-Agent",
  summary: {
    en: "An open-source research agent for planning experiments, checking evidence, and reading papers with source-linked guides.",
    zh: "面向科研的开源智能体，支持研究规划、实验执行、证据核验，以及带原文引用的论文导读。",
  },
  capabilities: [
    { en: "Persistent research map", zh: "持久化研究地图" },
    { en: "Evidence checks", zh: "证据核验" },
    { en: "Paper reading", zh: "论文阅读" },
  ],
  repository: "https://github.com/Jialei-03/open-research-agent",
  reader: "https://papers.dougao.online",
}

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

export const education = [
  {
    school: { en: "University of Science and Technology of China", zh: "中国科学技术大学" },
    degree: { en: "M.Sc. in Big Data Technology and Engineering", zh: "大数据技术与工程，硕士研究生" },
    details: { en: "School of Artificial Intelligence and Data Science, LDS Lab", zh: "人工智能与数据科学学院，LDS 实验室" },
    period: { en: "2026 - Present", zh: "2026 - 至今" },
    logo: "/assets/ustc-logo.png",
    href: "https://sai.ustc.edu.cn/",
  },
  {
    school: { en: "Lanzhou University", zh: "兰州大学" },
    degree: { en: "B.Eng. in Data Science and Big Data Technology", zh: "数据科学与大数据技术，本科" },
    details: { en: "", zh: "" },
    period: { en: "2022.09 - 2026.06", zh: "2022.09 - 2026.06" },
    logo: "/assets/lzu-logo.png",
    href: "https://www.lzu.edu.cn/",
  },
]
