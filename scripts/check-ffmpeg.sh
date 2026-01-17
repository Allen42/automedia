#!/bin/bash

# FFmpeg 快速检查脚本
# 用于验证 FFmpeg 是否正确安装和配置

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local message=$1
    local color=$2
    echo -e "${color}${message}${NC}"
}

# 检查命令是否存在
check_command() {
    local command=$1
    local description=$2
    
    if command -v "$command" &> /dev/null; then
        local version=$($command -version 2>&1 | head -n 1)
        print_message "✓ $description" "$GREEN"
        print_message "  $version" "$CYAN"
        return 0
    else
        print_message "✗ $description - 未找到或出错" "$RED"
        return 1
    fi
}

# 检查编码器
check_encoder() {
    local encoder=$1
    if ffmpeg -encoder "$encoder" &>/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 主函数
main() {
    clear
    
    print_message "\n╔════════════════════════════════════════════════════════════╗" "$BLUE"
    print_message "║        FFmpeg 安装和配置检查工具                            ║" "$BLUE"
    print_message "║        AI 漫剧剧本生成器                                    ║" "$BLUE"
    print_message "╚════════════════════════════════════════════════════════════╝\n" "$BLUE"
    
    # 系统信息
    print_message "📋 系统信息" "$CYAN"
    print_message "  操作系统: $(uname -s) $(uname -m)"
    print_message "  Node.js: $(node -v 2>/dev/null || echo '未安装')"
    print_message "  工作目录: $(pwd)\n"
    
    # 检查 FFmpeg 组件
    print_message "🔍 检查 FFmpeg 组件" "$CYAN"
    check_command "ffmpeg" "FFmpeg"
    FFMPEG_OK=$?
    check_command "ffprobe" "FFprobe"
    FFPROBE_OK=$?
    check_command "ffplay" "FFplay (可选)"
    print_message ""
    
    # 检查路径
    print_message "📍 FFmpeg 路径" "$CYAN"
    if command -v ffmpeg &> /dev/null; then
        local ffmpeg_path=$(command -v ffmpeg)
        print_message "  $ffmpeg_path" "$GREEN"
    else
        print_message "  未找到 FFmpeg" "$RED"
    fi
    print_message ""
    
    # 检查编码器
    if [ $FFMPEG_OK -eq 0 ]; then
        print_message "🎬 检查常用编码器" "$CYAN"
        
        local encoders=("libx264:H.264 (推荐)" "libx265:H.265/HEVC" "libvpx:VP8" "libvpx-vp9:VP9" "aac:AAC 音频" "libmp3lame:MP3 音频")
        
        for encoder_info in "${encoders[@]}"; do
            IFS=':' read -r encoder description <<< "$encoder_info"
            if check_encoder "$encoder"; then
                print_message "  ✓ $description ($encoder)" "$GREEN"
            else
                print_message "  ✗ $description ($encoder)" "$YELLOW"
            fi
        done
        print_message ""
    fi
    
    # 测试视频生成
    print_message "🧪 测试视频生成能力" "$CYAN"
    if [ $FFMPEG_OK -eq 0 ]; then
        local test_file="/tmp/test_ffmpeg_$$.mp4"
        if ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1 -pix_fmt yuv420p -y "$test_file" &>/dev/null 2>&1; then
            if [ -f "$test_file" ]; then
                print_message "  ✓ 视频生成测试成功" "$GREEN"
                local file_size=$(du -h "$test_file" | cut -f1)
                print_message "  文件大小: $file_size"
                rm -f "$test_file"
            else
                print_message "  ✗ 视频生成测试失败" "$RED"
            fi
        else
            print_message "  ✗ 视频生成测试失败" "$RED"
        fi
    fi
    print_message ""
    
    # 总结
    print_message "📊 检查总结" "$CYAN"
    if [ $FFMPEG_OK -eq 0 ] && [ $FFPROBE_OK -eq 0 ]; then
        print_message "  ✓ FFmpeg 已正确安装" "$GREEN"
        print_message "  ✓ 可以使用视频导出功能" "$GREEN"
        print_message "\n✨ 一切就绪！你可以开始使用 AI 漫剧剧本生成器了。\n" "$GREEN"
    else
        print_message "  ✗ FFmpeg 未正确安装" "$RED"
        print_message "  请参考 FFMPEG_GUIDE.md 完成安装配置" "$YELLOW"
        print_message "\n📖 快速安装命令:" "$YELLOW"
        
        case "$(uname -s)" in
            Linux*)
                print_message "  Ubuntu/Debian: sudo apt-get install ffmpeg -y" "$CYAN"
                print_message "  Fedora/RHEL: sudo dnf install ffmpeg -y" "$CYAN"
                print_message "  Arch: sudo pacman -S ffmpeg" "$CYAN"
                ;;
            Darwin*)
                print_message "  macOS (Homebrew): brew install ffmpeg" "$CYAN"
                ;;
            MINGW*|MSYS*|CYGWIN*)
                print_message "  Windows (Chocolatey): choco install ffmpeg -y" "$CYAN"
                print_message "  Windows (Scoop): scoop install ffmpeg" "$CYAN"
                ;;
        esac
        print_message ""
    fi
    
    # 环境变量
    print_message "🔧 环境变量" "$CYAN"
    if [ -z "$PATH" ]; then
        print_message "  PATH: 未设置" "$YELLOW"
    else
        print_message "  PATH: 已设置" "$CYAN"
    fi
    
    if [ -z "$FFMPEG_PATH" ]; then
        print_message "  FFMPEG_PATH: 未设置" "$CYAN"
    else
        print_message "  FFMPEG_PATH: $FFMPEG_PATH" "$CYAN"
    fi
    print_message ""
    
    # 获取帮助
    print_message "❓ 获取帮助" "$CYAN"
    print_message "  📖 详细指南: 查看项目中的 FFMPEG_GUIDE.md"
    print_message "  🌐 官方文档: https://ffmpeg.org/documentation.html"
    print_message "  💬 常见问题: 查看 FFMPEG_GUIDE.md 中的故障排除部分"
    print_message ""
}

# 运行主函数
main
