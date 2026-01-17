# Windows EXE 构建指南

本指南将帮助你在 Windows 上构建可直接使用的 EXE 文件。

---

## 前置要求

在构建 EXE 前，请确保已完成以下步骤：

### 1. 环境准备

**已配置的项目包含**：
- ✅ Gemini Pro API Key（已内置）
- ✅ 所有源代码和依赖配置
- ✅ Electron 打包配置
- ✅ 构建脚本

**你需要安装**：
- Node.js 18+ LTS
- pnpm
- FFmpeg（用于视频生成）
- Visual Studio Build Tools（用于编译原生模块）

### 2. 快速安装依赖

打开 PowerShell（管理员）并运行：

```powershell
# 进入项目目录
cd D:\path\to\ai-manju-script-app

# 运行自动安装脚本
powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1
```

如果脚本失败，请参考 [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)。

---

## 构建 EXE

### 方法 1：一键构建（推荐）

```powershell
# 进入项目目录
cd D:\path\to\ai-manju-script-app

# 构建 EXE
pnpm electron-build
```

**预期输出**：
```
✓ Electron Builder 完成
✓ 生成文件：
  - dist_electron/AI漫剧剧本生成器 Setup 1.0.0.exe (安装版)
  - dist_electron/AI漫剧剧本生成器 1.0.0.exe (便携版)
```

### 方法 2：分步构建

如果一键构建失败，可以分步执行：

```powershell
# 步骤 1：构建前端
pnpm build

# 步骤 2：编译 Electron 主进程
pnpm build:electron

# 步骤 3：打包 EXE
electron-builder --win --publish never
```

---

## 构建输出

构建完成后，你会在 `dist_electron` 目录找到：

### 生成的文件

| 文件名 | 类型 | 说明 |
|--------|------|------|
| **AI漫剧剧本生成器 Setup 1.0.0.exe** | 安装程序 | 用户友好的安装向导 |
| **AI漫剧剧本生成器 1.0.0.exe** | 便携版 | 无需安装，直接运行 |
| **AI漫剧剧本生成器 1.0.0.exe.blockmap** | 更新文件 | 用于增量更新 |

### 推荐分发

- **给普通用户**：使用 `AI漫剧剧本生成器 Setup 1.0.0.exe`（安装程序）
- **给高级用户**：使用 `AI漫剧剧本生成器 1.0.0.exe`（便携版）

---

## 构建故障排除

### 问题 1：构建失败 - 找不到 FFmpeg

**错误信息**：
```
Error: FFmpeg not found
```

**解决方案**：

```powershell
# 安装 FFmpeg
choco install ffmpeg -y

# 验证安装
ffmpeg -version

# 重新构建
pnpm electron-build
```

### 问题 2：构建失败 - 原生模块编译错误

**错误信息**：
```
gyp ERR! build error
```

**解决方案**：

1. 确保已安装 Visual Studio Build Tools
2. 清除缓存：
   ```powershell
   pnpm store prune
   rm -r node_modules
   pnpm install
   ```
3. 重新构建：
   ```powershell
   pnpm electron-build
   ```

### 问题 3：构建失败 - 内存不足

**错误信息**：
```
ENOMEM: Cannot allocate memory
```

**解决方案**：

```powershell
# 增加 Node 内存限制
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# 重新构建
pnpm electron-build
```

### 问题 4：构建成功但 EXE 无法运行

**症状**：EXE 启动后立即崩溃

**解决方案**：

1. 检查 API Key 是否正确配置
2. 检查 FFmpeg 是否已安装
3. 查看应用日志：
   ```
   %APPDATA%\AI漫剧剧本生成器\logs\app.log
   ```

---

## 构建配置详解

### electron-builder.json

项目已配置的构建参数：

```json
{
  "appId": "com.example.ai-manju-script-app",
  "productName": "AI漫剧剧本生成器",
  "win": {
    "target": [
      { "target": "nsis", "arch": ["x64"] },    // 安装程序
      { "target": "portable", "arch": ["x64"] } // 便携版
    ]
  },
  "nsis": {
    "oneClick": false,                          // 不使用一键安装
    "allowToChangeInstallationDirectory": true, // 允许自定义安装目录
    "createDesktopShortcut": true,              // 创建桌面快捷方式
    "createStartMenuShortcut": true             // 创建开始菜单快捷方式
  }
}
```

### 自定义构建

如果需要修改构建配置，编辑 `electron-builder.json`：

```json
{
  "nsis": {
    "installerIcon": "assets/icon.ico",         // 安装程序图标
    "uninstallerIcon": "assets/uninstall.ico",  // 卸载程序图标
    "installerHeaderIcon": "assets/header.ico"  // 安装向导图标
  }
}
```

---

## 优化构建

### 减小 EXE 体积

1. **启用代码分割**：
   ```powershell
   # 在 vite.config.ts 中配置
   build: {
     rollupOptions: {
       output: {
         manualChunks: { ... }
       }
     }
   }
   ```

2. **移除不必要的依赖**：
   ```powershell
   pnpm remove <package-name>
   ```

3. **使用 asar 打包**：
   ```json
   {
     "asar": true,
     "asarUnpack": ["node_modules/better-sqlite3/**/*"]
   }
   ```

### 加快构建速度

1. **使用 SSD**：确保项目在 SSD 上
2. **增加内存**：
   ```powershell
   $env:NODE_OPTIONS = "--max-old-space-size=8192"
   ```
3. **并行构建**：
   ```powershell
   pnpm electron-build --parallel
   ```

---

## 发布和更新

### 自动更新配置

编辑 `electron-builder.json` 启用自动更新：

```json
{
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "ai-manju-script-app"
  }
}
```

### 手动发布

1. 将 EXE 上传到你的服务器
2. 用户下载并运行
3. 应用会自动检查更新

---

## 验证 EXE

### 测试清单

- [ ] EXE 能正常启动
- [ ] 界面显示正常
- [ ] Gemini API 能正常调用
- [ ] 小说转剧本功能正常
- [ ] 分镜拆解功能正常
- [ ] 节奏规划功能正常
- [ ] 视频导出功能正常
- [ ] 项目保存/加载功能正常

### 调试 EXE

如果 EXE 出现问题，可以在开发者模式下运行：

```powershell
# 启用开发者工具
$env:DEBUG = "electron-app:*"

# 运行 EXE
.\dist_electron\"AI漫剧剧本生成器 1.0.0.exe"

# 按 F12 打开开发者工具
```

---

## 常见问题

**Q: 构建需要多长时间？**  
A: 通常 5-15 分钟，取决于系统性能。

**Q: EXE 多大？**  
A: 约 200-300 MB（包括 Electron 运行时）。

**Q: 可以在其他电脑上运行吗？**  
A: 可以。EXE 是独立的，不需要额外依赖。

**Q: 如何卸载应用？**  
A: 使用 Windows 控制面板的"程序和功能"卸载，或直接删除便携版 EXE。

**Q: 如何更新应用？**  
A: 重新构建 EXE 并覆盖旧文件，或配置自动更新。

---

## 下一步

1. **分发应用**：将 EXE 发送给用户
2. **收集反馈**：监听用户反馈并改进
3. **发布更新**：修复 bug 并发布新版本

---

## 获取帮助

- **Electron 文档**：https://www.electronjs.org/docs
- **electron-builder 文档**：https://www.electron.build
- **GitHub Issues**：搜索相关问题

---

**最后更新**：2024-01-16  
**维护者**：AI 漫剧剧本生成器团队
