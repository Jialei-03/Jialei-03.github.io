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
    en: "I am a master's student in Big Data Technology and Engineering at the School of Artificial Intelligence and Data Science, University of Science and Technology of China. My research interests include AI agents, large language models, and recommender systems.",
    zh: "我目前是中国科学技术大学人工智能与数据科学学院大数据技术与工程专业硕士生，研究方向包括智能体、大语言模型与推荐系统。",
  },
  interests: [
    { en: "AI Agents", zh: "智能体" },
    { en: "Large Language Models", zh: "大语言模型" },
    { en: "Recommender Systems", zh: "推荐系统" },
  ],
  updatedAt: "2026.10",
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
    paper: "https://doi.org/10.1145/3732945.3732960",
    pdf: "https://dl.acm.org/doi/pdf/10.1145/3732945.3732960",
    image: "/assets/isccn-framework.webp",
    imageAlt: "CEEMDAN-PatchTST-Transformer oil temperature prediction framework",
  },
]

export const news = [
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
