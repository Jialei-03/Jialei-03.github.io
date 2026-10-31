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
      ["I am a master's student at the School of Artificial Intelligence and Data Science, ", { text: "University of Science and Technology of China", href: "https://sai.ustc.edu.cn/" }, ", in the LDS Lab. From September 2025 to October 2026 I was a research intern at ", { text: "Upwork", href: "#experience-upwork" }, ". I work on AI agents and large language models: long-term memory for agents, whether coding agents can clarify what clients actually want, and how research agents can keep their direction over long tasks."],
      ["Before agents, I worked on generative recommendation. I also build open-source tools for research, including ", { text: "Open-Research-Agent", href: "#project-open-research-agent" }, "."],
    ],
    zh: [
      ["我是", { text: "中国科学技术大学", href: "https://sai.ustc.edu.cn/" }, "人工智能与数据科学学院 LDS 实验室的硕士生，2025 年 9 月至 2026 年 10 月在 ", { text: "Upwork", href: "#experience-upwork" }, " 担任研究实习生。我研究智能体与大语言模型：智能体的长期记忆，编码智能体能否问清客户真正的需求，以及科研智能体如何在长程任务中不偏离方向。"],
      ["在此之前，我从事生成式推荐研究。我也开发面向科研的开源工具，例如 ", { text: "Open-Research-Agent", href: "#project-open-research-agent" }, "。"],
    ],
  } satisfies { en: Rich[]; zh: Rich[] },
  now: {
    en: [{ text: "SWE-Clar", href: "#publication-swe-clar" }, " and ", { text: "MESA", href: "#publication-mesa" }, " (both co-first author) are under review at WWW 2027, and ", { text: "UniGRec", href: "#publication-unigrec" }, " at ICLR 2027. Looking for internships on agents and LLMs."],
    zh: [{ text: "SWE-Clar", href: "#publication-swe-clar" }, " 与 ", { text: "MESA", href: "#publication-mesa" }, "（均为共同一作）在投 WWW 2027，", { text: "UniGRec", href: "#publication-unigrec" }, " 在投 ICLR 2027。正在寻找智能体与大语言模型方向的实习。"],
  } satisfies LocalizedRich,
  interests: [
    { en: "AI agents", zh: "智能体" },
    { en: "Large language models", zh: "大语言模型" },
    { en: "Generative recommendation", zh: "生成式推荐" },
    { en: "Agent-driven quant research (self-study)", zh: "Agent 驱动的量化研究（自学）" },
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
  details?: Localized
  honors?: Localized
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
    details: { en: "GPA 4.18, average 91.77, ranked 1st of 37 in the major; CET-6 506", zh: "GPA 4.18，均分 91.77，专业排名 1/37；CET-6 506" },
    honors: {
      en: "National Scholarship · Merit Student of Gansu Province · MCM Honorable Mention · China Collegiate Computing Design Contest, provincial first prize · APMCM third prize",
      zh: "国家奖学金 · 甘肃省三好学生 · 美赛 H 奖 · 中国大学生计算机设计大赛省级一等奖 · 亚太杯数学建模三等奖",
    },
  },
]

type Experience = {
  id: string
  name: Localized
  href: string
  logo: string
  role: Localized
  about: Localized
  period: Localized
  // Each output points at an entry in publications, which supplies its venue and authorship.
  outputs: { paperId: string; summary: Localized }[]
}

export const experience: Experience[] = [
  {
    id: "experience-upwork",
    name: { en: "Upwork", zh: "Upwork" },
    href: "https://www.upwork.com/",
    logo: "/assets/upwork-logo.webp",
    role: { en: "Research Intern", zh: "研究实习生" },
    about: { en: "Nasdaq-listed global freelance marketplace", zh: "纳斯达克上市的全球自由职业平台" },
    period: { en: "2025.09 – 2026.10", zh: "2025.09 – 2026.10" },
    outputs: [
      { paperId: "swe-clar", summary: { en: "A benchmark built from real client jobs that tests whether coding agents clarify requirements and deliver working software.", zh: "基于真实客户项目，构建评测编码智能体需求澄清与软件交付能力的基准。" } },
      { paperId: "unigrec", summary: { en: "Differentiable soft identifiers that optimise the item tokenizer and the generative recommender end to end.", zh: "提出可微软标识符，实现物品 tokenizer 与生成式推荐模型端到端联合优化。" } },
      { paperId: "soda", summary: { en: "Distribution-level contrastive supervision that gives generative recommendation finer soft semantics.", zh: "参与提出分布级对比监督，为生成式推荐引入更细致的软语义监督。" } },
    ],
  },
]

// Description and links verified against the public repository README.
export const openResearchAgent = {
  name: "Open-Research-Agent",
  summary: {
    en: "An open-source research agent, in development: a persistent research map keeps its direction and an independent advisor reviews each round. I am now studying which parts of its own history a long-horizon agent should see at each step.",
    zh: "研发中的开源科研智能体：用持久化的研究地图约束方向，由独立的顾问审核每轮进展。目前在研究长程任务中，Agent 每一步应保留自己的哪些历史。",
  },
  repository: "https://github.com/Jialei-03/open-research-agent",
  reader: "https://papers.dougao.online",
}

type Product = {
  id: string
  name: Localized
  summary: Localized
  status: Localized
  href: string
  source?: string
  image: Localized
  imageAlt: Localized
}

// Products that are live on the web. Screenshots: dougao.online's workbench (captured 2026.10)
// and the reader images from the ORA repository docs.
export const products: Product[] = [
  {
    id: "dougao",
    name: { en: "Dougao", zh: "豆稿" },
    summary: {
      en: "A fuse-bead pattern tool: turns a photo or an AI prompt into an editable pattern, with colour merging, bead inventory and offline-first cloud sync.",
      zh: "拼豆图纸工具：由照片或 AI 生成可编辑的拼豆图纸，支持配色合并、豆子库存管理与离线优先的云同步。",
    },
    status: { en: "Live on the web", zh: "Web 版已上线" },
    href: "https://dougao.online/",
    image: { en: "/assets/dougao-workbench.webp", zh: "/assets/dougao-workbench.webp" },
    imageAlt: { en: "Dougao workbench with ways to create a bead pattern: from a photo, a blank board, pixel art or AI", zh: "豆稿工作台：照片成图、空白画板、像素图转图纸与 AI 创作" },
  },
  {
    id: "ora-reader",
    name: { en: "ORA Paper Reader", zh: "ORA 论文阅读器" },
    summary: {
      en: "An agent-assisted paper reader: import a PDF or arXiv paper and get a guide whose every point links back to the page, with translation, notes and a library.",
      zh: "Agent 辅助的论文阅读器：导入 PDF 或 arXiv 论文，生成每一条都能溯源到原文页码的导读，支持翻译、批注与文献库管理。",
    },
    status: { en: "Live · open source", zh: "已上线 · 开源" },
    href: "https://papers.dougao.online/",
    source: "https://github.com/Jialei-03/open-research-agent",
    image: { en: "/assets/ora-reader.en.webp", zh: "/assets/ora-reader.zh.webp" },
    imageAlt: { en: "ORA paper reader with a PDF on the left and an agent guide citing page numbers on the right", zh: "ORA 论文阅读器：左侧是论文 PDF，右侧是标注页码的 Agent 导读" },
  },
]

type ResearchProject = { id: string; title: Localized; summary: Localized }

// Research in progress that has no paper yet; it moves to the publication list once submitted.
export const researchProjects: ResearchProject[] = [
  {
    id: "contract-review",
    title: { en: "Contract Review Agent", zh: "合同审查 Agent" },
    summary: {
      en: "Exploring how agents can review a contract on their own, finding and fixing the errors in it. A team project for a legal-AI competition.",
      zh: "探索用 Agent 自动审查合同、发现并修正其中错误的方案。法律 AI 竞赛的团队项目。",
    },
  },
]

export type Publication = {
  id: string
  name: string
  title: string
  // Omitted while the author list is anonymous for review.
  authors?: string[]
  authorship?: "first" | "co-first"
  venue: string
  year: string
  type: "conference" | "review"
  format: Localized
  description?: Localized
  paper?: string
  pdf?: string
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
    authorship: "co-first",
    venue: "WWW 2027",
    year: "2026",
    type: "review",
    format: { en: "Under review", zh: "在投" },
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
    id: "unigrec",
    name: "UniGRec",
    title: "UniGRec: Unified Generative Recommendation with Soft Identifiers for End-to-End Optimization",
    authors: ["Jialei Li", "Yang Zhang", "Yimeng Bai", "Shuai Zhu", "Ziqi Xue", "Xiaoyan Zhao", "Dingxian Wang", "Frank Yang", "Andrew Rabinovich", "Xiangnan He"],
    authorship: "first",
    venue: "ICLR 2027",
    year: "2026",
    type: "review",
    format: { en: "Under review", zh: "在投" },
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
    id: "mesa",
    name: "MESA",
    title: "MESA: Long-Term Agent Memory as an Emergent Society of Agents",
    authorship: "co-first",
    venue: "WWW 2027",
    year: "2026",
    type: "review",
    format: { en: "Under review", zh: "在投" },
    description: {
      en: "A long-term memory in which each matter the user pursues is owned by an agent that keeps its situation and decides whether a request concerns it; the society of agents grows from the user's history.",
      zh: "长期记忆机制：用户的每件事由一个智能体负责，维护其状态并自主判断请求是否相关；智能体社会从用户历史中涌现。",
    },
    // Figure 1 of the submission; no links while it is under double-blind review.
    image: "/assets/mesa-framework.webp",
    imageAlt: "MESA running example: a user's matters over many sessions, a memory of pieces ranked by similarity, and MESA where each matter has an owner agent",
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
    id: "isccn",
    name: "CEEMDAN-PatchTST",
    title: "The Transformer Oil Temperature Prediction Method Based on the CEEMDAN-PatchTST-Transformer Hybrid Model",
    authors: ["Jialei Li et al."],
    authorship: "first",
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
