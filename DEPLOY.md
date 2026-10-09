# 发布到 GitHub Pages

仓库：`Jialei-03/Jialei-03.github.io`

网站：https://jialei-03.github.io/

## 首次切换发布方式

在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。

新版使用 Vite 构建，发布目录是 `dist/`。不能继续选择从 `main / (root)` 直接发布源码。

## 发布更新

本地先检查：

```bash
pnpm test
```

然后提交并推送：

```bash
git add -A
git commit -m "redesign academic homepage"
git push
```

也可使用已有的 `bin/push.sh "描述本次更新"`。该脚本会执行检查、提交并推送。

`.github/workflows/pages.yml` 会安装锁定依赖，构建并运行浏览器回归测试，随后把 `dist/` 发布到 Pages。无需额外配置部署密钥。可在 Actions 页面手动运行该工作流。

## 本地查看发布版本

```bash
pnpm build
pnpm preview
```

发布版本包含预渲染 HTML、本地字体、优化后的照片和独立的 404 页面。
