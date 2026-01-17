# 完整安装指南

欢迎使用 **AI 漫剧剧本生成器**！本指南将帮助你在 Windows、macOS 和 Linux 上快速安装和配置应用。

---

## 目录

1. [系统要求](#系统要求)
2. [快速安装](#快速安装)
3. [详细安装](#详细安装)
4. [故障排除](#故障排除)
5. [验证安装](#验证安装)

---

## 系统要求

### 最低要求

| 项目 | 要求 |
|------|------|
| **操作系统** | Windows 7+, macOS 10.13+, Linux (Ubuntu 18.04+) |
| **CPU** | 2 核心 |
| **内存** | 4 GB |
| **磁盘** | 2 GB 可用空间 |
| **网络** | 需要（用于 Gemini Pro API） |

### 推荐配置

| 项目 | 推荐 |
|------|------|
| **操作系统** | Windows 10+, macOS 11+, Linux (Ubuntu 20.04+) |
| **CPU** | 4 核心+ |
| **内存** | 8 GB+ |
| **磁盘** | 10 GB+ |
| **网络** | 高速网络（用于视频导出） |

---

## 快速安装

### Windows

**步骤 1：打开 PowerShell（管理员）**

按 `Win + X`，选择"Windows PowerShell (管理员)"

**步骤 2：运行安装脚本**

```powershell
cd D:\path\to\ai-manju-script-app
powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1
```

**步骤 3：等待安装完成**

脚本会自动安装所有依赖和配置。

### macOS

**步骤 1：打开终端**

按 `Cmd + Space`，输入 `terminal`，按 Enter

**步骤 2：进入项目目录**

```bash
cd /path/to/ai-manju-script-app
```

**步骤 3：运行安装脚本**

```bash
bash scripts/setup-macos.sh
```

**步骤 4：等待安装完成**

脚本会自动安装所有依赖和配置。

### Linux

**步骤 1：打开终端**

按 `Ctrl + Alt + T`

**步骤 2：进入项目目录**

```bash
cd /path/to/ai-manju-script-app
```

**步骤 3：运行安装脚本**

```bash
bash scripts/setup-linux.sh
```

**步骤 4：等待安装完成**

脚本会自动安装所有依赖和配置。

---

## 详细安装

如果快速安装脚本失败，请按照以下步骤手动安装。

### 步骤 1：安装系统依赖

#### Windows

1. **安装 Visual Studio Build Tools**：
   - 下载：https://visualstudio.microsoft.com/downloads/
   - 选择"Visual Studio Build Tools"
   - 勾选"C++ 生成工具"
   - 完成安装

2. **安装 Python 3**：
   - 下载：https://www.python.org/downloads/
   - 选择最新的 Python 3.x 版本
   - **重要**：勾选"Add Python to PATH"
   - 完成安装

3. **验证安装**：
   ```powershell
   python --version
   ```

#### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 验证安装
xcode-select --version
brew --version
```

#### Linux (Ubuntu/Debian)

```bash
# 更新包列表
sudo apt-get update

# 安装依赖
sudo apt-get install -y curl build-essential python3

# 验证安装
gcc --version
python3 --version
```

#### Linux (Fedora/RHEL)

```bash
# 安装依赖
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y curl python3

# 验证安装
gcc --version
python3 --version
```

#### Linux (Arch)

```bash
# 安装依赖
sudo pacman -Syu --noconfirm
sudo pacman -S --noconfirm base-devel curl python

# 验证安装
gcc --version
python --version
```

### 步骤 2：安装 Node.js 和 npm

#### Windows

1. 下载：https://nodejs.org/
2. 选择 LTS 版本
3. 运行安装程序，按默认选项安装
4. 验证：
   ```powershell
   node --version
   npm --version
   ```

#### macOS

```bash
# 使用 Homebrew
brew install node

# 验证
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# 安装 Node.js
sudo apt-get install -y nodejs

# 验证
node --version
npm --version
```

#### Linux (Fedora/RHEL)

```bash
# 安装 Node.js
sudo dnf install -y nodejs

# 验证
node --version
npm --version
```

#### Linux (Arch)

```bash
# 安装 Node.js
sudo pacman -S --noconfirm nodejs npm

# 验证
node --version
npm --version
```

### 步骤 3：安装 pnpm

```bash
# 全局安装 pnpm
npm install -g pnpm

# 验证
pnpm --version
```

### 步骤 4：配置 npm 镜像（推荐）

为了加快下载速度，建议配置国内镜像。

**方法 1：使用命令配置**

```bash
npm config set registry https://registry.npmmirror.com
npm config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
npm config set electron_custom_dir v
npm config set canvas_binary_host_mirror https://cdn.npm.taobao.org/dist/canvas/
npm config set better_sqlite3_binary_host_mirror https://cdn.npm.taobao.org/dist/better-sqlite3/
```

**方法 2：编辑 .npmrc 文件**

1. 复制配置文件：
   ```bash
   cp .npmrc.example .npmrc
   ```

2. 编辑 `.npmrc` 文件，取消注释相应的镜像配置

### 步骤 5：安装项目依赖

```bash
# 进入项目目录
cd ai-manju-script-app

# 清除旧缓存（如果需要）
pnpm store prune

# 安装依赖
pnpm install
```

**如果安装失败**，尝试以下步骤：

```bash
# 1. 删除 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml

# 2. 重新安装
pnpm install

# 3. 如果仍然失败，查看详细日志
pnpm install --verbose
```

### 步骤 6：安装 FFmpeg

详见 [FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md)

**快速安装**：

```bash
# Windows (Chocolatey)
choco install ffmpeg -y

# macOS (Homebrew)
brew install ffmpeg

# Linux (Ubuntu)
sudo apt-get install ffmpeg libavcodec-extra -y

# Linux (Fedora)
sudo dnf install ffmpeg -y

# Linux (Arch)
sudo pacman -S ffmpeg
```

### 步骤 7：验证安装

```bash
# 检查 FFmpeg
pnpm check:ffmpeg

# 检查 TypeScript
pnpm check

# 尝试启动开发环境
pnpm dev:electron
```

---

## 故障排除

### 问题 1：Electron 下载失败

**错误信息**：
```
HTTPError: Response code 404 (Not Found)
```

**解决方案**：

1. 配置国内镜像（参考上面的"步骤 4"）
2. 清除缓存：`pnpm store prune`
3. 重新安装：`pnpm install`

详见 [ELECTRON_INSTALLATION_GUIDE.md](./ELECTRON_INSTALLATION_GUIDE.md)

### 问题 2：Canvas 或 Better-SQLite3 编译失败

**错误信息**：
```
gyp ERR! build error
```

**解决方案**：

确保已安装编译工具（参考"步骤 1"）

### 问题 3：FFmpeg 未找到

**错误信息**：
```
ffmpeg: command not found
```

**解决方案**：

1. 安装 FFmpeg（参考"步骤 6"）
2. 验证安装：`ffmpeg -version`
3. 添加到 PATH（如果需要）

详见 [FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md)

### 问题 4：权限被拒绝

**错误信息**：
```
EACCES: permission denied
```

**解决方案**：

```bash
# macOS/Linux
sudo chmod +x /usr/local/bin/ffmpeg
sudo chmod +x /usr/local/bin/ffprobe

# 或使用 sudo 运行
sudo pnpm install
```

### 问题 5：内存不足

**错误信息**：
```
ENOMEM: Cannot allocate memory
```

**解决方案**：

```bash
# 增加 Node 内存限制
export NODE_OPTIONS=--max-old-space-size=4096

# 重新安装
pnpm install
```

---

## 验证安装

### 检查所有组件

```bash
# 检查 Node.js
node --version

# 检查 npm
npm --version

# 检查 pnpm
pnpm --version

# 检查 FFmpeg
ffmpeg -version

# 检查 FFprobe
ffprobe -version

# 检查项目依赖
pnpm check

# 检查 FFmpeg 配置
pnpm check:ffmpeg
```

### 运行应用

```bash
# 开发模式
pnpm dev:electron

# 构建应用
pnpm electron-build
```

---

## 下一步

安装完成后，你可以：

1. **阅读快速开始指南**：[ELECTRON_QUICKSTART.md](./ELECTRON_QUICKSTART.md)
2. **了解项目结构**：[README.md](./README.md)
3. **配置 Gemini Pro API**：[API_GUIDE.md](./API_GUIDE.md)
4. **配置 FFmpeg**：[FFMPEG_GUIDE.md](./FFMPEG_GUIDE.md)

---

## 获取帮助

### 检查日志

```bash
# 查看详细的 npm 日志
pnpm install --verbose

# 查看应用日志
cat ~/.config/ai-manju-script-app/app.log
```

### 官方资源

- **Node.js 官方网站**：https://nodejs.org/
- **pnpm 文档**：https://pnpm.io/
- **Electron 文档**：https://www.electronjs.org/docs/
- **FFmpeg 文档**：https://ffmpeg.org/documentation.html

### 社区支持

- **GitHub Issues**：搜索相关问题
- **Stack Overflow**：标签 `electron`、`node.js`
- **npm 论坛**：https://npm.community

---

## 常见问题 (FAQ)

**Q: 安装需要多长时间？**  
A: 通常 5-15 分钟，取决于网络速度和系统性能。

**Q: 可以离线安装吗？**  
A: 首次安装需要网络连接。之后可以使用 `pnpm install --offline` 进行离线安装。

**Q: 支持哪些操作系统？**  
A: Windows 7+, macOS 10.13+, Linux (Ubuntu 18.04+)

**Q: 需要多少磁盘空间？**  
A: 大约 2-3 GB（包括 node_modules）

**Q: 如何更新应用？**  
A: 运行 `git pull` 更新代码，然后 `pnpm install` 更新依赖。

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| 1.0 | 2024-01-16 | 初始版本 |

---

**最后更新**：2024-01-16  
**维护者**：AI 漫剧剧本生成器团队

**祝你使用愉快！** 🎬✨
