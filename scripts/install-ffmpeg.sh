#!/bin/bash

# FFmpeg 自动安装脚本
# 支持 Windows (WSL/Git Bash)、macOS 和 Linux

set -e

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

# 检查是否已安装
check_installed() {
    if command -v ffmpeg &> /dev/null; then
        print_message "✓ FFmpeg 已安装" "$GREEN"
        ffmpeg -version | head -n 1
        return 0
    else
        return 1
    fi
}

# 检查包管理器
check_package_manager() {
    if command -v apt-get &> /dev/null; then
        echo "apt"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    elif command -v brew &> /dev/null; then
        echo "brew"
    elif command -v choco &> /dev/null; then
        echo "choco"
    elif command -v scoop &> /dev/null; then
        echo "scoop"
    else
        echo "none"
    fi
}

# 使用 apt 安装 (Ubuntu/Debian)
install_with_apt() {
    print_message "🔧 使用 apt 安装 FFmpeg..." "$CYAN"
    sudo apt-get update
    sudo apt-get install -y ffmpeg libavcodec-extra
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 使用 dnf 安装 (Fedora/RHEL)
install_with_dnf() {
    print_message "🔧 使用 dnf 安装 FFmpeg..." "$CYAN"
    sudo dnf install -y ffmpeg
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 使用 pacman 安装 (Arch)
install_with_pacman() {
    print_message "🔧 使用 pacman 安装 FFmpeg..." "$CYAN"
    sudo pacman -S --noconfirm ffmpeg
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 使用 Homebrew 安装 (macOS)
install_with_brew() {
    print_message "🔧 使用 Homebrew 安装 FFmpeg..." "$CYAN"
    
    # 检查 Homebrew 是否安装
    if ! command -v brew &> /dev/null; then
        print_message "⚠️  Homebrew 未安装，正在安装..." "$YELLOW"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    brew install ffmpeg
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 使用 Chocolatey 安装 (Windows)
install_with_choco() {
    print_message "🔧 使用 Chocolatey 安装 FFmpeg..." "$CYAN"
    choco install ffmpeg -y
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 使用 Scoop 安装 (Windows)
install_with_scoop() {
    print_message "🔧 使用 Scoop 安装 FFmpeg..." "$CYAN"
    scoop install ffmpeg
    print_message "✓ FFmpeg 安装完成" "$GREEN"
}

# 主函数
main() {
    clear
    
    print_message "\n╔════════════════════════════════════════════════════════════╗" "$BLUE"
    print_message "║        FFmpeg 自动安装脚本                                  ║" "$BLUE"
    print_message "║        AI 漫剧剧本生成器                                    ║" "$BLUE"
    print_message "╚════════════════════════════════════════════════════════════╝\n" "$BLUE"
    
    # 检查是否已安装
    if check_installed; then
        print_message "\n✨ FFmpeg 已准备就绪！\n" "$GREEN"
        return 0
    fi
    
    print_message "📦 检测操作系统和包管理器...\n" "$CYAN"
    
    local os=$(uname -s)
    local pm=$(check_package_manager)
    
    print_message "操作系统: $os" "$CYAN"
    print_message "包管理器: $pm\n" "$CYAN"
    
    case "$os" in
        Linux*)
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
                *)
                    print_message "✗ 不支持的包管理器: $pm" "$RED"
                    print_message "请参考 FFMPEG_GUIDE.md 手动安装" "$YELLOW"
                    exit 1
                    ;;
            esac
            ;;
        Darwin*)
            install_with_brew
            ;;
        MINGW*|MSYS*|CYGWIN*)
            case "$pm" in
                choco)
                    install_with_choco
                    ;;
                scoop)
                    install_with_scoop
                    ;;
                *)
                    print_message "✗ 未检测到包管理器" "$RED"
                    print_message "请安装 Chocolatey 或 Scoop，然后重新运行此脚本" "$YELLOW"
                    print_message "Chocolatey: https://chocolatey.org/install" "$CYAN"
                    print_message "Scoop: https://scoop.sh" "$CYAN"
                    exit 1
                    ;;
            esac
            ;;
        *)
            print_message "✗ 不支持的操作系统: $os" "$RED"
            print_message "请参考 FFMPEG_GUIDE.md 手动安装" "$YELLOW"
            exit 1
            ;;
    esac
    
    # 验证安装
    print_message "\n🔍 验证安装...\n" "$CYAN"
    if check_installed; then
        print_message "\n✨ FFmpeg 安装成功！\n" "$GREEN"
        print_message "你现在可以使用视频导出功能了。" "$GREEN"
        print_message "\n运行以下命令启动应用:" "$CYAN"
        print_message "  pnpm dev:electron\n" "$CYAN"
    else
        print_message "\n✗ FFmpeg 安装失败" "$RED"
        print_message "请参考 FFMPEG_GUIDE.md 手动安装" "$YELLOW"
        exit 1
    fi
}

# 运行主函数
main
