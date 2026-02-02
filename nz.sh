#!/bin/bash

# =================配置区域=================
# 服务器地址
SERVER="nz.632313373.xyz:8008"
# 密钥
SECRET="NU7ukoCVGNv4hc4NDXqESCg7lLC5l4Qp"
# 是否启用 TLS (false/true)
TLS="false"
# 脚本下载地址
URL="https://raw.githubusercontent.com/nezhahq/scripts/main/agent/install.sh"
# =========================================

echo "正在下载哪吒监控 Agent 脚本..."

# 下载脚本 (-L 跟随重定向, -o 指定输出文件名)
if curl -L "$URL" -o agent.sh; then
    echo "下载成功。"
else
    echo "下载失败，请检查网络连接。"
    exit 1
fi

echo "正在赋予执行权限..."
chmod +x agent.sh

echo "正在启动安装..."
# 使用 env 传入环境变量并执行
env NZ_SERVER="$SERVER" \
    NZ_TLS="$TLS" \
    NZ_CLIENT_SECRET="$SECRET" \
    ./agent.sh

# 可选：安装完成后删除下载的脚本文件
rm -rf agent.sh
rm -rf nz.sh
history -c