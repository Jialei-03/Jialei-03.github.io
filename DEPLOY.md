# Deploy · 三行命令把主页推到 GitHub Pages

主页是纯静态文件(无构建步骤),GitHub Pages 从仓库根目录发布。底下是最快的 3 步。

## 1. 在 GitHub 创建仓库

- 走 https://github.com/new
- Repository name 填 **`Jialei-03.github.io`**(必须是这个名,才会被 GitHub 识别为你的个人页)
- 公开 (Public)
- 不要 勾 "Add a README" / ".gitignore" / "license" 这些初始化选项(本地已经有)
- 点 Create repository

## 2. 推送本地代码到仓库

在本项目目录(`/Users/leslie/Desktop/个人主页`) 下执行:

```bash
cd /Users/leslie/Desktop/个人主页
git init
git add .
git commit -m "feat: personal homepage v1"
git branch -M main
git remote add origin git@github.com:Jialei-03/Jialei-03.github.io.git
git push -u origin main
git tag v1
git push origin v1
```

> 如果你用 HTTPS 而不是 SSH,把远程 URL 换成:
> `https://github.com/Jialei-03/Jialei-03.github.io.git`

## 3. 启用 GitHub Pages

- 进仓库 → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main** / **/ (root)**
- 保存后等 ~30 秒,GitHub 会给你一个公开地址:

```
https://Jialei-03.github.io
```

打开它应该看到你的个人主页。

## 后续更新

代码有变动时,重复这三行即可:

```bash
git add -A
git commit -m "<描述本次变动>"
git push
```

幻灯片上的 GitHub Actions 默认会自动重部 Pages。需要手动重部时,可以在 Pages 页面上点 "Actions" → 上一次 workflow → Re-run。

## 个性化你的主页

打开 [`data/site.js`](./data/site.js), 一个文件就能改完主页上所有静态信息:

| 字段 | 什么时候改 |
| --- | --- |
| `meta.name` / `meta.role` / `meta.location` | 修改顶部品牌与 hero 副标题 |
| `meta.tagline` | hero 下面那句主提述 |
| `now.focused / learning / building / reading` | "Now" 卡片的四项内容 |
| `contact.email / twitter / linkedin / website` | "Contact" 卡片;留空就隐藏 |
| `contact.github` | 默认 `Jialei-03`,只有你换账号才需改 |
| `featured: ["repo-a", "repo-b"]` | 想手动指定精选仓库,填仓库名字数组 |
| `updatedAt` | 页脚版本号 |

修改后 `git commit` + `git push` 即可生效。
