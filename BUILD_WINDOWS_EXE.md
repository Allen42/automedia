# Windows EXE 构建快速指南

⚡ **快速开始**：5 分钟内生成可用的 Windows EXE

---

## 前置条件检查

在开始前，请确保你的 Windows 电脑上已安装：

- [ ] **Node.js 18+** - https://nodejs.org/ (选择 LTS 版本)
- [ ] **FFmpeg** - `choco install ffmpeg -y` (需要 Chocolatey)
- [ ] **Visual Studio Build Tools** - 用于编译原生模块

**快速检查**：打开 PowerShell 并运行：

```powershell
node --version
npm --version
ffmpeg -version
```

---

## 一键构建（推荐）

### 步骤 1：解压项目

```powershell
# 解压 ZIP 文件到你的项目目录
Expand-Archive ai-manju-script-app-source.zip -DestinationPath D:\projects\
cd D:\projects\ai-manju-script-app
```

### 步骤 2：运行安装脚本

```powershell
# 以管理员身份运行 PowerShell，然后执行：
powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1
```

这会自动：
- ✅ 安装所有依赖
- ✅ 配置 npm 镜像（加速下载）
- ✅ 验证 FFmpeg

### 步骤 3：构建 EXE

```powershell
# 构建 EXE 文件
pnpm electron-build
```

**等待 5-15 分钟**（取决于你的电脑性能）

### 步骤 4：获取 EXE

构建完成后，你会在以下目录找到 EXE 文件：

```
D:\projects\ai-manju-script-app\dist_electron\
```

**两个版本可选**：

| 文件 | 说明 | 推荐用途 |
|------|------|---------|
| `AI漫剧剧本生成器 Setup 1.0.0.exe` | 安装程序 | 分发给普通用户 |
| `AI漫剧剧本生成器 1.0.0.exe` | 便携版 | 无需安装，直接运行 |

---

## 手动构建（如果自动脚本失败）

### 步骤 1：安装依赖

```powershell
# 进入项目目录
cd D:\projects\ai-manju-script-app

# 安装 pnpm（如果未安装）
npm install -g pnpm

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com
npm config set electron_mirror https://cdn.npm.taobao.org/dist/electron/
npm config set electron_custom_dir v

# 安装项目依赖
pnpm install
```

### 步骤 2：构建前端

```powershell
pnpm build
```

### 步骤 3：编译 Electron 主进程

```powershell
pnpm build:electron
```

### 步骤 4：打包 EXE

```powershell
electron-builder --win --publish never
```

---

## 构建失败排查

### 错误 1：找不到 FFmpeg

```powershell
# 安装 FFmpeg
choco install ffmpeg -y

# 验证
ffmpeg -version

# 重新构建
pnpm electron-build
```

### 错误 2：原生模块编译失败

```powershell
# 清除缓存
pnpm store prune
rm -r node_modules

# 重新安装
pnpm install

# 重新构建
pnpm electron-build
```

### 错误 3：内存不足

```powershell
# 增加 Node 内存限制
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# 重新构建
pnpm electron-build
```

### 错误 4：找不到 electron-builder

```powershell
# 全局安装
npm install -g electron-builder

# 重新构建
pnpm electron-build
```

---

## 验证 EXE

### 测试运行

1. 双击 `AI漫剧剧本生成器 1.0.0.exe`
2. 应用应该在 2-3 秒内启动
3. 看到主界面表示成功

### 功能测试

- [ ] 主页面显示正常
- [ ] 能点击"立即开始"进入编辑器
- [ ] 编辑器界面显示正常
- [ ] 能上传小说文件
- [ ] AI 功能能正常调用

---

## 常见问题

**Q: 构建需要多长时间？**  
A: 第一次 10-15 分钟，之后 5-10 分钟。

**Q: EXE 多大？**  
A: 约 200-300 MB（包括 Electron 运行时）。

**Q: 能在其他电脑上运行吗？**  
A: 可以。EXE 是独立的，不需要额外依赖。

**Q: 如何卸载？**  
A: 使用"程序和功能"卸载，或直接删除便携版 EXE。

**Q: 如何更新？**  
A: 重新构建 EXE 并覆盖旧文件。

---

## 下一步

1. ✅ 构建成功后，你可以直接运行 EXE
2. 📦 将 EXE 分发给其他用户
3. 🔄 需要更新时，重新构建并覆盖

---

## 获取帮助

- 查看详细指南：[BUILD_EXE_GUIDE.md](./BUILD_EXE_GUIDE.md)
- 查看安装指南：[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- 查看 Electron 文档：https://www.electronjs.org/docs

---

**提示**：如果一切顺利，你应该在 15 分钟内拥有一个可用的 Windows EXE 文件！🎉
