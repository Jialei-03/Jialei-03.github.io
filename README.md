# Jialei Li / 李嘉磊

个人学术主页。使用 React、TypeScript、Vite、Tailwind CSS v4，以及通过官方 CLI 安装的 shadcn/ui Radix Nova 组件。

## 本地开发

需要 Node.js 22.12+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

开发地址由终端输出，默认是 http://127.0.0.1:5173。

## 更新内容

统一编辑 `src/data/site.ts`：

- `profile`：姓名、联系方式、简介和研究方向
- `publications`：论文、作者、会议类型、配图及论文/PDF/代码链接
- `news`：中英文动态
- `education`：教育经历

界面文本在 `src/App.tsx`，设计变量与响应式布局在 `src/index.css`。shadcn/ui 组件源代码位于 `src/components/ui/`，配置为 `components.json`。

`public/assets/` 中的图片用于发布。`assets/` 保留素材源文件，便于后续调整。头像取自 [Jialei-03 的 GitHub 账号](https://github.com/Jialei-03)，使用 256px / 460px 的响应式 WebP，浏览器图标也由该头像生成。更换头像源文件 `assets/github-avatar.jpg` 后运行 `pnpm optimize:assets`，即可重新生成发布版本。论文配图也做了压缩。

SODA 按 [arXiv 最新版](https://arxiv.org/abs/2603.00700) 和[官方仓库](https://github.com/freyasa/SODA)列为 RecSys 2026 Short Paper，使用正式标题 **Distribution-Level Contrastive Supervision for Generative Recommendation**。SODA 配图取自论文 Figure 1（CC BY），来源已写入数据文件。

## 构建和检查

```bash
pnpm build
pnpm preview
```

构建输出为 `dist/`，会预渲染个人资料、论文和动态，搜索引擎及关闭 JavaScript 的浏览器都能读取主要内容。网站运行时不需要 GitHub API 或远程字体服务。

浏览器回归测试覆盖语言与主题偏好、论文筛选、键盘操作、动态定位、320px 至 1440px 的响应式布局、无 JavaScript 浏览和图片失败状态：

```bash
pnpm exec playwright install chromium
pnpm test
```

## 设计与组件

以清晰的字体层级、侧栏个人资料和研究内容为主。深浅色使用相同语义变量，支持系统主题、手动切换及减少动态效果的偏好。

组件通过 [shadcn/ui](https://ui.shadcn.com/) 的官方 CLI 安装并定制；[awesome-shadcn-ui](https://github.com/birobirobiro/awesome-shadcn-ui) 用于检索社区组件方案。它是资源目录，项目无需安装整份目录或未使用的组件库。

## 发布

发布流程已迁移到 GitHub Actions，详见 `DEPLOY.md`。原来的“直接发布仓库根目录”方式不适用于当前源码。

## License

MIT
