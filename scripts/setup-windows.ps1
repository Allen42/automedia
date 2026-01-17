# Windows 快速安装脚本
# 使用方法: powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1

# 颜色定义
function Write-Success {
    Write-Host $args -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host $args -ForegroundColor Red
}

function Write-Warning-Custom {
    Write-Host $args -ForegroundColor Yellow
}

function Write-Info {
    Write-Host $args -ForegroundColor Cyan
}

# 检查管理员权限
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# 检查命令是否存在
function Test-Command {
    param([string]$Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# 主函数
function Main {
    Clear-Host
    
    Write-Host ""
    Write-Info "╔════════════════════════════════════════════════════════════╗"
    Write-Info "║        Windows 快速安装脚本                                ║"
    Write-Info "║        AI 漫剧剧本生成器                                    ║"
    Write-Info "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
    
    # 检查管理员权限
    Write-Info "🔍 检查权限..."
    if (-not (Test-Administrator)) {
        Write-Error-Custom "✗ 需要管理员权限"
        Write-Warning-Custom "请以管理员身份运行此脚本"
        exit 1
    }
    Write-Success "✓ 已获得管理员权限"
    Write-Host ""
    
    # 安装 Chocolatey
    Write-Info "🔍 检查 Chocolatey..."
    if (-not (Test-Command choco)) {
        Write-Warning-Custom "⚠️  Chocolatey 未安装，正在安装..."
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Success "✓ Chocolatey 安装完成"
    }
    else {
        Write-Success "✓ Chocolatey 已安装"
    }
    Write-Host ""
    
    # 安装 Node.js
    Write-Info "🔍 检查 Node.js..."
    if (-not (Test-Command node)) {
        Write-Warning-Custom "⚠️  Node.js 未安装，正在安装..."
        choco install nodejs-lts -y
        Write-Success "✓ Node.js 安装完成"
    }
    else {
        $nodeVersion = node --version
        Write-Success "✓ Node.js 已安装: $nodeVersion"
    }
    Write-Host ""
    
    # 安装 Python
    Write-Info "🔍 检查 Python..."
    if (-not (Test-Command python)) {
        Write-Warning-Custom "⚠️  Python 未安装，正在安装..."
        choco install python3 -y
        Write-Success "✓ Python 安装完成"
    }
    else {
        $pythonVersion = python --version
        Write-Success "✓ Python 已安装: $pythonVersion"
    }
    Write-Host ""
    
    # 安装 Visual Studio Build Tools
    Write-Info "🔍 检查 Visual Studio Build Tools..."
    $vsPath = "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools"
    if (-not (Test-Path $vsPath)) {
        Write-Warning-Custom "⚠️  Visual Studio Build Tools 未安装，正在安装..."
        choco install visualstudio2019-workload-vctools -y
        Write-Success "✓ Visual Studio Build Tools 安装完成"
    }
    else {
        Write-Success "✓ Visual Studio Build Tools 已安装"
    }
    Write-Host ""
    
    # 安装 pnpm
    Write-Info "🔍 检查 pnpm..."
    if (-not (Test-Command pnpm)) {
        Write-Warning-Custom "⚠️  pnpm 未安装，正在安装..."
        npm install -g pnpm
        Write-Success "✓ pnpm 安装完成"
    }
    else {
        $pnpmVersion = pnpm --version
        Write-Success "✓ pnpm 已安装: $pnpmVersion"
    }
    Write-Host ""
    
    # 配置 npm 镜像
    Write-Info "🔍 配置 npm 镜像..."
    Write-Warning-Custom "⚠️  正在配置国内镜像以加快下载速度..."
    
    npm config set registry https://registry.npmmirror.com
    npm config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
    npm config set electron_custom_dir v
    npm config set canvas_binary_host_mirror https://cdn.npm.taobao.org/dist/canvas/
    npm config set better_sqlite3_binary_host_mirror https://cdn.npm.taobao.org/dist/better-sqlite3/
    
    Write-Success "✓ npm 镜像配置完成"
    Write-Host ""
    
    # 安装项目依赖
    Write-Info "📦 安装项目依赖..."
    Write-Warning-Custom "⚠️  这可能需要几分钟，请耐心等待..."
    Write-Host ""
    
    pnpm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ 项目依赖安装完成"
    }
    else {
        Write-Error-Custom "✗ 项目依赖安装失败"
        Write-Warning-Custom "请查看上面的错误信息并尝试以下步骤:"
        Write-Host "1. 清除缓存: pnpm store prune"
        Write-Host "2. 删除 node_modules: rm -r node_modules"
        Write-Host "3. 重新安装: pnpm install"
        exit 1
    }
    Write-Host ""
    
    # 验证安装
    Write-Info "🔍 验证安装..."
    pnpm check:ffmpeg
    Write-Host ""
    
    # 完成
    Write-Success "✨ 安装完成！"
    Write-Host ""
    Write-Info "🚀 快速开始:"
    Write-Host "  开发模式: pnpm dev:electron"
    Write-Host "  构建应用: pnpm electron-build"
    Write-Host ""
    Write-Info "📖 更多信息:"
    Write-Host "  查看 README.md 了解项目概述"
    Write-Host "  查看 ELECTRON_QUICKSTART.md 了解 Electron 快速开始"
    Write-Host "  查看 FFMPEG_GUIDE.md 了解 FFmpeg 配置"
    Write-Host ""
}

# 运行主函数
Main
