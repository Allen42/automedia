# Electron 桌面应用快速开始

## 项目已升级为 Electron 桌面应用！

你的 AI 漫剧剧本生成器现在已经升级为完整的 Electron 桌面应用，支持：

✅ **SQLite 本地数据库** - 所有项目数据保存到本地  
✅ **视频导出功能** - 根据分镜自动生成 MP4 视频  
✅ **灵活的保存配置** - 支持自定义输出目录  
✅ **完整的文件系统访问** - 读写本地文件  
✅ **跨平台支持** - Windows、macOS、Linux  

## 快速开始（5 分钟）

### 1. 安装依赖

```bash
cd ai-manju-script-app
pnpm install
```

### 2. 开发模式

**方式一：使用开发脚本（推荐）**

```bash
pnpm dev:electron
```

这个命令会同时启动 Vite 开发服务器和 Electron 应用。

**方式二：手动启动**

```bash
# 终端 1：启动 Vite 开发服务器
pnpm dev

# 终端 2：启动 Electron（等待 Vite 启动后）
pnpm electron-dev
```

### 3. 构建生产版本

```bash
# 构建前端和 Electron 应用
pnpm electron-build
```

生成的安装程序位于 `dist_electron/` 目录。

## 项目结构

```
ai-manju-script-app/
├── electron/                    # Electron 主进程代码
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 预加载脚本（IPC 接口）
│   ├── db.ts                   # SQLite 数据库
│   ├── config.ts               # 配置管理
│   └── videoExporter.ts        # 视频导出
├── client/                      # React 前端
│   └── src/
│       ├── hooks/
│       │   └── useElectron.ts  # Electron IPC Hook
│       └── pages/
│           └── Editor.tsx      # 编辑器页面
├── electron-builder.json       # 打包配置
└── package.json
```

## 核心功能

### 1. 项目管理（SQLite）

所有项目数据自动保存到本地 SQLite 数据库：

```typescript
import { useElectron } from '@/hooks/useElectron';

function MyComponent() {
  const electron = useElectron();

  // 保存项目
  const handleSave = async () => {
    const result = await electron.project.save({
      id: 'project-1',
      name: '我的项目',
      novelContent: '小说内容...',
      scriptContent: '剧本内容...',
      storyboards: [],
      rhythmPlan: '',
    });
    console.log(result.success ? '保存成功' : '保存失败');
  };

  // 加载项目
  const handleLoad = async () => {
    const result = await electron.project.load('project-1');
    if (result.success) {
      console.log('项目数据:', result.data);
    }
  };

  // 获取所有项目
  const handleGetAll = async () => {
    const result = await electron.project.getAll();
    console.log('所有项目:', result.data);
  };

  return (
    <div>
      <button onClick={handleSave}>保存</button>
      <button onClick={handleLoad}>加载</button>
      <button onClick={handleGetAll}>获取所有</button>
    </div>
  );
}
```

### 2. 视频导出

根据分镜自动生成视频文件：

```typescript
const electron = useElectron();

// 选择输出目录
const outputDir = await electron.file.selectDirectory();

if (outputDir) {
  // 导出视频
  const result = await electron.video.export(storyboards, outputDir);
  
  if (result.success) {
    console.log('视频已生成:', result.path);
    // 打开输出文件夹
    await electron.shell.openPath(outputDir);
  }
}
```

### 3. 配置管理

保存和读取应用配置：

```typescript
// 获取输出目录配置
const outputDir = await electron.config.get('output_directory');

// 设置输出目录
await electron.config.set('output_directory', '/path/to/output');

// 其他配置
await electron.config.set('auto_save', true);
await electron.config.set('theme', 'dark');
```

### 4. 文件操作

```typescript
// 选择目录
const directory = await electron.file.selectDirectory();

// 保存文件
const filePath = await electron.file.saveFile(
  'export.json',
  JSON.stringify(data)
);

// 打开文件夹
await electron.shell.openPath('/path/to/folder');
```

## 数据库位置

SQLite 数据库自动保存到以下位置：

| 操作系统 | 数据库路径 |
|---------|-----------|
| Windows | `%APPDATA%\ai-manju-script-app\projects.db` |
| macOS | `~/Library/Application Support/ai-manju-script-app/projects.db` |
| Linux | `~/.config/ai-manju-script-app/projects.db` |

## 系统要求

### 开发环境

- Node.js 14+
- pnpm 8+
- FFmpeg（用于视频生成）

### 运行时

- Windows 7+
- macOS 10.13+
- Linux（Ubuntu 18.04+）

## 安装 FFmpeg

### Windows

```bash
# 使用 Chocolatey
choco install ffmpeg

# 或从官网下载
# https://ffmpeg.org/download.html
```

### macOS

```bash
# 使用 Homebrew
brew install ffmpeg
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch
sudo pacman -S ffmpeg
```

## 常见问题

### Q: 如何在开发时调试应用？

A: 使用 `pnpm dev:electron` 启动应用，然后：
- 主进程日志：Electron 控制台
- 渲染进程日志：按 F12 打开开发者工具

### Q: 如何修改应用名称和图标？

A: 编辑 `electron-builder.json` 文件：
```json
{
  "appId": "com.example.my-app",
  "productName": "我的应用名称",
  "win": {
    "icon": "path/to/icon.ico"
  },
  "mac": {
    "icon": "path/to/icon.icns"
  }
}
```

### Q: 视频生成失败怎么办？

A: 
1. 确保 FFmpeg 已安装：`ffmpeg -version`
2. 检查输出目录是否有写入权限
3. 查看应用日志获取详细错误信息

### Q: 如何打包为不同平台的应用？

A: 
```bash
# 打包为 Windows
pnpm electron-build -- --win

# 打包为 macOS
pnpm electron-build -- --mac

# 打包为 Linux
pnpm electron-build -- --linux
```

### Q: 数据库文件可以备份吗？

A: 可以。直接复制数据库文件即可：
```bash
# 备份
cp ~/.config/ai-manju-script-app/projects.db ~/backup/projects.db

# 恢复
cp ~/backup/projects.db ~/.config/ai-manju-script-app/projects.db
```

## 下一步

1. **阅读完整指南**：查看 [ELECTRON_GUIDE.md](ELECTRON_GUIDE.md)
2. **API 集成**：查看 [API_GUIDE.md](API_GUIDE.md)
3. **项目文档**：查看 [README.md](README.md)

## 获取帮助

- 查看应用日志：`~/.config/ai-manju-script-app/`（Linux/macOS）或 `%APPDATA%\ai-manju-script-app\`（Windows）
- 检查 FFmpeg 安装：`ffmpeg -version`
- 查看 Electron 文档：https://www.electronjs.org/docs

---

祝你使用愉快！🎬✨
