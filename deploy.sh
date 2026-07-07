#!/bin/bash
# Brain Garden 部署脚本
# 使用方法: ./deploy.sh <服务器IP> [目标路径]
#
# 示例:
#   ./deploy.sh 123.45.67.89
#   ./deploy.sh 123.45.67.89 /var/www/game

set -e

SERVER_IP="${1}"
REMOTE_PATH="${2:-/var/www/brain-garden}"

if [ -z "$SERVER_IP" ]; then
  echo "❌ 请提供服务器 IP"
  echo "用法: ./deploy.sh <服务器IP> [目标路径]"
  exit 1
fi

echo "🔧 构建项目中..."
npm run build

echo "📦 打包构建产物..."
tar czf /tmp/brain-garden-dist.tar.gz -C dist .

echo "🚀 上传到服务器 ${SERVER_IP}:${REMOTE_PATH}"
ssh "root@${SERVER_IP}" "mkdir -p ${REMOTE_PATH}"
scp /tmp/brain-garden-dist.tar.gz "root@${SERVER_IP}:/tmp/"
ssh "root@${SERVER_IP}" "tar xzf /tmp/brain-garden-dist.tar.gz -C ${REMOTE_PATH} && rm /tmp/brain-garden-dist.tar.gz"

echo "✅ 部署完成！"
echo "🌱 访问 http://${SERVER_IP}/ 即可开始游戏"
