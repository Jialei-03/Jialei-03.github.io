# Jialei-03 个人主页

一个以 GitHub 为后台的纯静态个人主页。以上架构,以下是快速介绍。

## 结构

```
.
├─ index.html          # 页面骨架，包含 hero / stats / now / work / stack / contact
├─ styles.css          # 纸感编辑风格、黑色模式、响应式布局
├─ app.js              # 读取 GitHub API 、绘制 repo / stack / contact、主题切换
├─ data/
│  └─ site.js        # 一个文件定制主页:身份、Now、联系入口
├─ assets/             # 留给你放图 / 定制资源
├─ bin/                # 一键脚本(例如 push.sh)。空目录,下面有例
├─ .nojekyll           # 告诉 GitHub Pages 不走 Jekyll,原样输出仓库文件
├─ DEPLOY.md           # 三行命令上线指南
└─ README.md
```

## 本地预览

```bash
cd /Users/leslie/Desktop/个人主页
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765
```

也可以直接双击 `index.html` 在浏览器里看(但那样 GitHub API 请求在 `file://` 协议下会被拒绝)。

## 个性化

- 改给 GitHub 看的内容（头像、简介、统计、仓库）: 你只需要在 GitHub 上修改你的 profile
- 改静态显示的内容（你是谁、现在在做什么、联系方式）: 编辑 [`data/site.js`](./data/site.js)。不用动 HTML/CSS。

## 部署到 GitHub Pages

详见 [`DEPLOY.md`](./DEPLOY.md)。总之是 3 步:

1. 在 GitHub 上创建名为 `Jialei-03.github.io` 的公开仓库（跳过初始化选项）
2. 本地一个 `git init` + `git push` 推送
3. 在仓库 Settings → Pages 里选 main / root，等 30 秒

最后会拿到 `https://Jialei-03.github.io` 这个公开地址。

## 技术说明

- 零依赖、零构建、纯静态：HTML + CSS + JS
- 动态部分只是 fetch 几个 GitHub API，所以在客户端跑,页面本身不依赖任何后端
- 主题、语言、联系信息都在本地 `data/site.js` 里，不需重新部署就能改
- `prefers-reduced-motion` 与调节动画都被依照

## License

代码以 MIT 许可发布，文本/人人为你本人。
