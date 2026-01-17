# Electron 安装故障排除指南

本指南帮助你解决 Electron 和其他原生模块安装时遇到的问题。

---

## 快速解决方案

### 问题：Electron 下载失败

**错误信息**：
```
HTTPError: Response code 404 (Not Found)
electron: Running postinstall script, failed
```

**原因**：
- 网络连接问题
- 官方下载源被阻止
- 代理配置错误

**快速解决**：

#### 方案 1：使用国内镜像（推荐）

**Windows (PowerShell)**：
```powershell
# 设置 Electron 镜像
$env:ELECTRON_MIRROR = "https://cdn.npm.taobao.org/dist/electron/"
$env:ELECTRON_CUSTOM_DIR = "v"

# 重新安装
pnpm install
```

**macOS/Linux**：
```bash
# 设置 Electron 镜像
export ELECTRON_MIRROR="https://cdn.npm.taobao.org/dist/electron/"
export ELECTRON_CUSTOM_DIR="v"

# 重新安装
pnpm install
```

#### 方案 2：配置 .npmrc

创建或编辑项目根目录的 `.npmrc` 文件：

```ini
# Electron 镜像配置
electron_mirror=https://cdn.npm.taobao.org/dist/electron/
electron_custom_dir=v

# 其他原生模块镜像
canvas_binary_host_mirror=https://cdn.npm.taobao.org/dist/canvas/
better_sqlite3_binary_host_mirror=https://cdn.npm.taobao.org/dist/better-sqlite3/

# 代理设置（如果需要）
# proxy=http://proxy.example.com:8080
# https-proxy=http://proxy.example.com:8080
```

#### 方案 3：清除缓存并重新安装

```bash
# 清除 npm 缓存
pnpm store prune

# 删除 node_modules 和 lock 文件
rm -rf node_modules
rm pnpm-lock.yaml

# 重新安装
pnpm install
```

#### 方案 4：离线安装 Electron

```bash
# 方法 1：从本地文件安装
# 1. 从其他地方下载 Electron: https://github.com/electron/electron/releases
# 2. 放到本地目录，例如 ~/electron-cache/
# 3. 设置环境变量

# Windows (PowerShell)
$env:ELECTRON_CACHE = "C:\electron-cache"

# macOS/Linux
export ELECTRON_CACHE="$HOME/electron-cache"

# 重新安装
pnpm install
```

---

## 原生模块安装问题

### Canvas 模块安装失败

**错误信息**：
```
canvas: Running install script...
node-gyp rebuild failed
```

**解决方案**：

#### Windows

1. **安装 Visual Studio Build Tools**：
   ```powershell
   # 使用 Chocolatey
   choco install visualstudio2019-workload-vctools -y
   
   # 或手动下载
   # https://visualstudio.microsoft.com/downloads/
   ```

2. **设置 Python**：
   ```powershell
   # 安装 Python 3
   choco install python3 -y
   
   # 验证
   python --version
   ```

3. **重新安装**：
   ```powershell
   pnpm install
   ```

#### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 安装 Python
brew install python3

# 重新安装
pnpm install
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install build-essential python3 -y

# Fedora
sudo dnf install gcc g++ python3 -y

# Arch
sudo pacman -S base-devel python -y

# 重新安装
pnpm install
```

### Better-SQLite3 安装失败

**错误信息**：
```
better-sqlite3: Running install script...
node-gyp rebuild failed
```

**解决方案**：

与 Canvas 模块相同，需要安装编译工具。参考上面的"Canvas 模块安装失败"部分。

---

## 完整的安装步骤

### 步骤 1：准备环境

#### Windows

```powershell
# 以管理员身份运行 PowerShell

# 安装必要的工具
choco install nodejs-lts python3 visualstudio2019-workload-vctools -y

# 验证安装
node --version
npm --version
python --version
```

#### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装依赖
brew install node python3

# 验证安装
node --version
npm --version
python3 --version
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install curl build-essential python3 -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y

# 验证安装
node --version
npm --version
python3 --version
```

### 步骤 2：安装 pnpm

```bash
npm install -g pnpm

# 验证
pnpm --version
```

### 步骤 3：配置镜像（可选但推荐）

创建 `.npmrc` 文件：

```ini
# npm 镜像
registry=https://registry.npmmirror.com

# Electron 镜像
electron_mirror=https://cdn.npm.taobao.org/dist/electron/
electron_custom_dir=v

# Canvas 镜像
canvas_binary_host_mirror=https://cdn.npm.taobao.org/dist/canvas/

# Better-SQLite3 镜像
better_sqlite3_binary_host_mirror=https://cdn.npm.taobao.org/dist/better-sqlite3/
```

### 步骤 4：安装项目依赖

```bash
# 进入项目目录
cd ai-manju-script-app

# 安装依赖
pnpm install

# 如果失败，尝试清除缓存
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 步骤 5：验证安装

```bash
# 检查 Electron
pnpm check:ffmpeg

# 检查依赖
pnpm check

# 尝试启动开发环境
pnpm dev:electron
```

---

## 网络代理配置

### npm 代理设置

**Windows (PowerShell)**：
```powershell
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080
npm config set strict-ssl false
```

**macOS/Linux**：
```bash
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080
npm config set strict-ssl false
```

### .npmrc 代理配置

```ini
proxy=http://proxy.example.com:8080
https-proxy=http://proxy.example.com:8080
strict-ssl=false
```

### 清除代理设置

```bash
npm config delete proxy
npm config delete https-proxy
npm config delete strict-ssl
```

---

## 常见错误和解决方案

### 错误 1：EACCES: permission denied

**症状**：
```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**解决方案**：

```bash
# 修复 npm 权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# 或使用 sudo（不推荐）
sudo npm install -g pnpm
```

### 错误 2：ENOTFOUND registry.npmjs.org

**症状**：
```
ENOTFOUND registry.npmjs.org
```

**解决方案**：

```bash
# 更改 npm 源
npm config set registry https://registry.npmmirror.com

# 验证
npm config get registry
```

### 错误 3：gyp ERR! build error

**症状**：
```
gyp ERR! build error
gyp ERR! stack Error: make: *** [Release/obj.target/canvas/src/canvas.o] Error 1
```

**解决方案**：

1. 安装编译工具（参考上面的部分）
2. 清除缓存：`pnpm store prune`
3. 删除 node_modules：`rm -rf node_modules`
4. 重新安装：`pnpm install`

### 错误 4：ENOMEM: Cannot allocate memory

**症状**：
```
ENOMEM: Cannot allocate memory
```

**原因**：
- 系统内存不足
- 编译过程占用内存过多

**解决方案**：

```bash
# 增加 Node 内存限制
export NODE_OPTIONS=--max-old-space-size=4096

# 重新安装
pnpm install
```

---

## 跳过原生模块编译

如果无法编译原生模块，可以尝试跳过它们（不推荐，会影响功能）：

```bash
# 跳过 Canvas 编译
pnpm install --ignore-scripts

# 然后手动安装其他依赖
pnpm install
```

---

## 使用预编译二进制

某些包提供预编译的二进制文件，可以加快安装速度：

```bash
# 使用预编译的 Electron
pnpm add -D electron --prefer-offline

# 使用预编译的 Canvas
pnpm add canvas --prefer-offline
```

---

## 离线安装

如果网络连接不稳定，可以尝试离线安装：

```bash
# 生成离线缓存
pnpm install --offline

# 或使用本地缓存
pnpm install --prefer-offline --no-audit
```

---

## 获取帮助

### 检查日志

```bash
# 查看详细的 npm 日志
pnpm install --verbose

# 查看 npm 缓存
pnpm store status

# 清理缓存
pnpm store prune
```

### 官方资源

- **pnpm 文档**：https://pnpm.io
- **Electron 文档**：https://www.electronjs.org/docs
- **npm 文档**：https://docs.npmjs.com

### 社区支持

- **GitHub Issues**：搜索相关问题
- **Stack Overflow**：标签 `electron`、`pnpm`
- **npm 论坛**：https://npm.community

---

## 快速参考

| 问题 | 命令 |
|------|------|
| Electron 下载失败 | `export ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/` |
| 清除缓存 | `pnpm store prune && rm -rf node_modules` |
| 重新安装 | `pnpm install` |
| 查看日志 | `pnpm install --verbose` |
| 更改 npm 源 | `npm config set registry https://registry.npmmirror.com` |
| 检查配置 | `npm config list` |

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| 1.0 | 2024-01-16 | 初始版本 |

---

**最后更新**：2024-01-16  
**维护者**：AI 漫剧剧本生成器团队
