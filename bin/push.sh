#!/usr/bin/env bash
# 一键推送主页到 GitHub Pages。
# 使用前请确保:
#   1) 已在 GitHub 创建 Jialei-03.github.io 仓库
#   2) 本机已配置 git 与 SSH key，或你愿意输出远程凭证

set -euo pipefail

MSG="${1:-update personal homepage}"
cd "$(dirname "$0")/.."

if [ ! -d .git ]; then
  echo ">> git init"
  git init
  git branch -M main
  git remote add origin "git@github.com:Jialei-03/Jialei-03.github.io.git"
fi

git add -A
if git diff --cached --quiet; then
  echo ">> 没有变动,什么也不用推"
  exit 0
fi

git commit -m "$MSG"
git push -u origin main
echo ""
echo "✅ 主页已推送。几分钟后可以访问: https://Jialei-03.github.io"
