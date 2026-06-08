# 李嘉磊 / Jialei Li Academic CV

一个部署在 GitHub Pages 上的纯静态学术 CV + 个人名片页面。页面保留纸感编辑风与暗色模式,内容由 `data/site.js` 驱动,适合长期维护教育背景、研究方向、项目、论文、技能和联系方式。

## 本地预览

```bash
cd /Users/leslie/Desktop/个人主页
python3 -m http.server 8765
# 打开 http://127.0.0.1:8765
```

## 修改内容

大多数 CV 信息只需要编辑 [`data/site.js`](./data/site.js):

- `profile`: 姓名、身份、地点、摘要、PDF 简历状态
- `interests`: 研究兴趣
- `education`: 教育经历
- `projects`: 研究/工程项目
- `publications`: 论文、preprint、技术报告或项目笔记
- `skills`: 技能分组
- `awards`: 荣誉/奖项
- `contact`: Email、GitHub、LinkedIn 等链接

PDF 简历按钮目前是 `Coming soon`;如果将来要启用,把 PDF 放到 `assets/lijialei-resume.pdf`,并在 `data/site.js` 中把 `profile.pdf.status` 改成 `available`。

## 部署

仓库: https://github.com/Jialei-03/Jialei-03.github.io

上线地址: https://jialei-03.github.io/

常规更新:

```bash
git add -A
git commit -m "update academic cv"
git push
```

也可以使用:

```bash
bin/push.sh "update academic cv"
```

## 技术说明

- 纯静态: HTML + CSS + JavaScript,无构建步骤
- GitHub API 仅作为辅助:头像、公开仓库统计、置顶仓库和语言占比
- GitHub API 不可用时,静态 CV 内容仍完整可读
- 支持暗色模式、移动端单列布局、键盘导航和 `prefers-reduced-motion`

## License

MIT
