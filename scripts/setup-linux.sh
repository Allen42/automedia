#!/bin/bash

# Linux 快速安装脚本
# 使用方法: bash scripts/setup-linux.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 打印带颜色的消息
print_message() {
    local message=$1
    local color=$2
    echo -e "${color}${message}${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" &> /dev/null
}

# 检查包管理器
detect_package_manager() {
    if command_exists apt-get; then
        echo "apt"
    elif command_exists dnf; then
        echo "dnf"
    elif command_exists pacman; then
        echo "pacman"
    elif command_exists yum; then
        echo "yum"
    else
        echo "unknown"
    fi
}

# 使用 apt 安装
install_with_apt() {
    print_message "📦 使用 apt 安装依赖..." "$CYAN"
    sudo apt-get update
    sudo apt-get install -y curl build-essential python3
    
    # 安装 Node.js
    if ! command_exists node; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
}

# 使用 dnf 安装
install_with_dnf() {
    print_message "📦 使用 dnf 安装依赖..." "$CYAN"
    sudo dnf groupinstall -y "Development Tools"
    sudo dnf install -y curl python3
    
    # 安装 Node.js
    if ! command_exists node; then
        sudo dnf install -y nodejs
    fi
}

# 使用 pacman 安装
install_with_pacman() {
    print_message "📦 使用 pacman 安装依赖..." "$CYAN"
    sudo pacman -Syu --noconfirm
    sudo pacman -S --noconfirm base-devel curl python
    
    # 安装 Node.js
    if ! command_exists node; then
        sudo pacman -S --noconfirm nodejs npm
    fi
}

# 主函数
main() {
    clear
    
    print_message "\n╔════════════════════════════════════════════════════════════╗" "$BLUE"
    print_message "║        Linux 快速安装脚本                                  ║" "$BLUE"
    print_message "║        AI 漫剧剧本生成器                                    ║" "$BLUE"
    print_message "╚════════════════════════════════════════════════════════════╝\n" "$BLUE"
    
    # 检测包管理器
    print_message "🔍 检测包管理器..." "$CYAN"
    local pm=$(detect_package_manager)
    
    if [ "$pm" = "unknown" ]; then
        print_message "✗ 无法检测到支持的包管理器" "$RED"
        print_message "支持的包管理器: apt, dnf, pacman, yum" "$YELLOW"
        exit 1
    fi
    
    print_message "✓ 检测到: $pm" "$GREEN"
    echo ""
    
    # 检查 Node.js
    print_message "🔍 检查 Node.js..." "$CYAN"
    if ! command_exists node; then
        print_message "⚠️  Node.js 未安装，正在安装依赖..." "$YELLOW"
        
        case "$pm" in
            apt)
                install_with_apt
                ;;
            dnf)
                install_with_dnf
                ;;
            pacman)
                install_with_pacman
                ;;
            yum)
                sudo yum groupinstall -y "Development Tools"
                sudo yum install -y curl python3
                ;;
        esac
        
        print_message "✓ 依赖安装完成" "$GREEN"
    else
        local node_version=$(node --version)
        print_message "✓ Node.js 已安装: $node_version" "$GREEN"
    fi
    echo ""
    
    # 检查 Python
    print_message "🔍 检查 Python..." "$CYAN"
    if ! command_exists python3; then
        print_message "⚠️  Python 未安装，正在安装..." "$YELLOW"
        case "$pm" in
            apt)
                sudo apt-get install -y python3
                ;;
            dnf)
                sudo dnf install -y python3
                ;;
            pacman)
                sudo pacman -S --noconfirm python
                ;;
            yum)
                sudo yum install -y python3
                ;;
        esac
        print_message "✓ Python 安装完成" "$GREEN"
    else
        local python_version=$(python3 --version)
        print_message "✓ Python 已安装: $python_version" "$GREEN"
    fi
    echo ""
    
    # 检查 pnpm
    print_message "🔍 检查 pnpm..." "$CYAN"
    if ! command_exists pnpm; then
        print_message "⚠️  pnpm 未安装，正在安装..." "$YELLOW"
        npm install -g pnpm
        print_message "✓ pnpm 安装完成" "$GREEN"
    else
        local pnpm_version=$(pnpm --version)
        print_message "✓ pnpm 已安装: $pnpm_version" "$GREEN"
    fi
    echo ""
    
    # 配置 npm 镜像
    print_message "🔍 配置 npm 镜像..." "$CYAN"
    print_message "⚠️  正在配置国内镜像以加快下载速度..." "$YELLOW"
    
    npm config set registry https://registry.npmmirror.com
    npm config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
    npm config set electron_custom_dir v
    npm config set canvas_binary_host_mirror https://cdn.npm.taobao.org/dist/canvas/
    npm config set better_sqlite3_binary_host_mirror https://cdn.npm.taobao.org/dist/better-sqlite3/
    
    print_message "✓ npm 镜像配置完成" "$GREEN"
    echo ""
    
    # 安装项目依赖
    print_message "📦 安装项目依赖..." "$CYAN"
    print_message "⚠️  这可能需要几分钟，请耐心等待..." "$YELLOW"
    echo ""
    
    pnpm install
    
    if [ $? -eq 0 ]; then
        print_message "✓ 项目依赖安装完成" "$GREEN"
    else
        print_message "✗ 项目依赖安装失败" "$RED"
        print_message "请查看上面的错误信息并尝试以下步骤:" "$YELLOW"
        echo "1. 清除缓存: pnpm store prune"
        echo "2. 删除 node_modules: rm -rf node_modules"
        echo "3. 重新安装: pnpm install"
        exit 1
    fi
    echo ""
    
    # 验证安装
    print_message "🔍 验证安装..." "$CYAN"
    bash scripts/check-ffmpeg.sh
    echo ""
    
    # 完成
    print_message "✨ 安装完成！" "$GREEN"
    echo ""
    print_message "🚀 快速开始:" "$CYAN"
    echo "  开发模式: pnpm dev:electron"
    echo "  构建应用: pnpm electron-build"
    echo ""
    print_message "📖 更多信息:" "$CYAN"
    echo "  查看 README.md 了解项目概述"
    echo "  查看 ELECTRON_QUICKSTART.md 了解 Electron 快速开始"
    echo "  查看 FFMPEG_GUIDE.md 了解 FFmpeg 配置"
    echo ""
}

# 运行主函数
main
