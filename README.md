# Jialei Li / 李嘉磊

个人主页，用于展示研究、实习经历与开源项目。使用 React、TypeScript、Vite、Tailwind CSS v4，以及通过官方 CLI 安装的 shadcn/ui Radix Nova 组件。

## 本地开发

需要 Node.js 22.12+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

开发地址由终端输出，默认是 http://127.0.0.1:5173。

## 更新内容

统一编辑 `src/data/site.ts`：

- `profile`：姓名、侧栏身份（`roles`）、联系方式、简介（`bio`）、"近况"（`now`）与研究兴趣。简介等文字支持行内链接：写成 `{ text, href }`，`#` 开头的链接会在页面内跳转
- `education`：教育经历，学校徽标放在白色方块里
- `sweClar`：SWE-Clar 项目卡片（Upwork 项目，带 Upwork 图标），论文入口复用 `publications` 中的同名条目
- `openResearchAgent`：Open-Research-Agent 的介绍与源码 / 在线论文阅读入口
- `researchProjects`：尚未公开的在研课题（目前是 MESA），不提供链接；公开后移入 `publications`
- `publications`：论文、作者、会议类型、配图及论文/PDF/代码链接
- `news`：中英文动态

界面文本在 `src/App.tsx` 与 `src/components/`，动效工具在 `src/lib/motion.ts`，设计变量与响应式布局在 `src/index.css`。shadcn/ui 组件源代码位于 `src/components/ui/`，配置为 `components.json`。

`public/assets/` 中的图片用于发布。`assets/` 保留素材源文件，便于后续调整。头像取自 [Jialei-03 的 GitHub 账号](https://github.com/Jialei-03)，Upwork 图标取自其官方 GitHub 组织 [upwork](https://github.com/upwork) 的头像，使用 256px / 460px 的响应式 WebP，浏览器图标也由该头像生成。更换头像源文件 `assets/github-avatar.jpg` 后运行 `pnpm optimize:assets`，即可重新生成发布版本。论文配图也做了压缩。

SODA 按 [arXiv 最新版](https://arxiv.org/abs/2603.00700) 和[官方仓库](https://github.com/freyasa/SODA)列为 RecSys 2026 Short Paper，使用正式标题 **Distribution-Level Contrastive Supervision for Generative Recommendation**。SODA 配图取自论文 Figure 1（CC BY），来源已写入数据文件。

SWE-Clar 按 [arXiv:2610.31854](https://arxiv.org/abs/2610.31854) 列为第一作者预印本，代码与数据入口为[官方仓库](https://github.com/upwork/SWE-Clar)。配图取自论文 Figure 2（CC BY 4.0），发布图片由原始 SVG 转为 WebP。

## 构建和检查

```bash
pnpm build
pnpm preview
```

构建输出为 `dist/`，会预渲染个人资料、论文和动态，搜索引擎及关闭 JavaScript 的浏览器都能读取主要内容。网站运行时不需要 GitHub API 或远程字体服务。

浏览器回归测试覆盖 SWE-Clar 项目与 Upwork 图标、动效完成后的最终状态、语言与主题偏好、论文筛选、键盘操作、动态定位、320px 至 1440px 的响应式布局、无 JavaScript 浏览和图片失败状态：

```bash
pnpm exec playwright install chromium
pnpm test
```

## 设计与组件

学术主页布局：左侧固定头像、姓名、身份与联系方式，右侧依次是简介与近况、动态、论文、项目、教育经历。白底、墨色文字，只用一种蓝色标示链接；字体使用系统字体（苹方 / SF），无需加载网络字体。

动效集中在几处，并在系统开启"减少动态效果"时全部关闭：

- 页面加载：头像由模糊渐清，随后姓名、身份与正文依次浮现
- 滚动：首屏以下的论文、项目和教育经历在进入视野时依次滑入；关闭 JavaScript 或打印时内容直接可见
- 切换深浅色：新主题以切换按钮为圆心扩散（View Transitions API，不支持的浏览器直接切换）
- 筛选论文：论文平滑移动到新位置，选中标签的底色随之滑动；导航栏下划线跟随当前章节滑动
- 细节：头像随鼠标轻微倾斜，链接下划线从左侧展开，论文配图悬停时轻微浮起

深浅色使用相同语义变量，支持系统主题与手动切换。组件通过 [shadcn/ui](https://ui.shadcn.com/) 的官方 CLI 安装并定制。

## 发布

发布流程已迁移到 GitHub Actions，详见 `DEPLOY.md`。原来的“直接发布仓库根目录”方式不适用于当前源码。

## License

MIT
