# Electron 桌面应用部署指南

本指南详细说明如何构建、打包和部署 AI 漫剧剧本生成器 Electron 应用。

## 项目结构

```
ai-manju-script-app/
├── electron/                    # Electron 主进程代码
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 预加载脚本（IPC 接口）
│   ├── db.ts                   # SQLite 数据库管理
│   ├── config.ts               # 配置管理
│   └── videoExporter.ts        # 视频导出模块
├── client/                      # React 前端代码
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useElectron.ts  # Electron IPC Hook
│   │   └── pages/
│   │       └── Editor.tsx      # 编辑器页面
│   └── dist/                   # 构建输出
├── electron-builder.json       # Electron Builder 配置
├── package.json                # 项目配置
└── vite.config.ts             # Vite 配置
```

## 环境配置

### 安装依赖

```bash
pnpm install
```

### 必需的系统依赖

#### Windows
- Visual Studio Build Tools（用于编译 native 模块）
- FFmpeg（用于视频生成）

#### macOS
- Xcode Command Line Tools
- FFmpeg

#### Linux
```bash
sudo apt-get install build-essential python3 ffmpeg
```

## 开发和测试

### 启动开发环境

```bash
# 终端 1：启动 Vite 开发服务器
pnpm dev

# 终端 2：启动 Electron（等待 Vite 服务器启动后）
pnpm electron-dev
```

### 调试

- 主进程日志：Electron 控制台
- 渲染进程日志：开发者工具（F12）
- SQLite 数据库：位于 `~/.config/ai-manju-script-app/projects.db`（Linux/macOS）或 `%APPDATA%\ai-manju-script-app\projects.db`（Windows）

## 构建应用

### 生产构建

```bash
# 构建前端
pnpm build

# 打包 Electron 应用
pnpm electron-build
```

### 构建输出

- **Windows**：`dist_electron/AI漫剧剧本生成器 Setup x.x.x.exe`（安装程序）和 `AI漫剧剧本生成器 x.x.x.exe`（便携版）
- **macOS**：`dist_electron/AI漫剧剧本生成器-x.x.x.dmg`（磁盘镜像）
- **Linux**：`dist_electron/ai-manju-script-app-x.x.x.AppImage`（AppImage）和 `.deb`（Debian 包）

## 功能说明

### 1. 项目管理

应用使用 SQLite 数据库存储所有项目数据。数据库位置：

- **Windows**：`%APPDATA%\ai-manju-script-app\projects.db`
- **macOS**：`~/Library/Application Support/ai-manju-script-app/projects.db`
- **Linux**：`~/.config/ai-manju-script-app/projects.db`

#### 数据库表结构

```sql
-- 项目表
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  novelContent TEXT,
  scriptContent TEXT,
  storyboardsText TEXT,
  storyboards TEXT,
  rhythmPlan TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 配置表
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分镜表
CREATE TABLE storyboards (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  number INTEGER NOT NULL,
  time TEXT,
  location TEXT,
  shotType TEXT,
  action TEXT,
  result TEXT,
  emotion TEXT,
  duration INTEGER DEFAULT 5,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);
```

### 2. 配置管理

应用支持以下配置项：

| 配置键 | 说明 | 默认值 |
|--------|------|--------|
| `output_directory` | 视频输出目录 | 用户文档目录 |
| `auto_save` | 自动保存 | `true` |
| `theme` | 应用主题 | `dark` |
| `language` | 应用语言 | `zh-CN` |

#### 配置示例

```typescript
// 获取输出目录
const outputDir = await window.electronAPI.config.get('output_directory');

// 设置输出目录
await window.electronAPI.config.set('output_directory', '/path/to/output');
```

### 3. 视频导出

应用支持根据分镜自动生成视频文件。

#### 工作流程

1. 用户选择输出目录（或使用默认目录）
2. 应用根据分镜生成 PNG 图像
3. 使用 FFmpeg 将图像序列合成为 MP4 视频
4. 视频保存到指定目录

#### 视频规格

- **分辨率**：1920x1080（Full HD）
- **格式**：MP4（H.264 编码）
- **帧率**：30 FPS
- **时长**：根据分镜时长自动计算

#### 导出示例

```typescript
const storyboards = [
  {
    id: '1',
    number: 1,
    time: '清晨',
    location: '卧室',
    shotType: '全景',
    action: '主角睁眼',
    result: '主角坐起身',
    emotion: '惊喜',
    duration: 5,
  },
  // ... 更多分镜
];

const result = await window.electronAPI.video.export(
  storyboards,
  '/path/to/output'
);

if (result.success) {
  console.log('视频已生成:', result.path);
}
```

### 4. 文件操作

应用支持以下文件操作：

#### 选择目录

```typescript
const directory = await window.electronAPI.file.selectDirectory();
```

#### 保存文件

```typescript
const filePath = await window.electronAPI.file.saveFile(
  'project.json',
  JSON.stringify(projectData)
);
```

#### 打开文件夹

```typescript
await window.electronAPI.shell.openPath('/path/to/folder');
```

## IPC 通信

应用使用 Electron 的 IPC（Inter-Process Communication）进行主进程和渲染进程的通信。

### 可用的 IPC 接口

所有 IPC 接口都通过 `window.electronAPI` 暴露：

```typescript
// 项目管理
window.electronAPI.project.save(projectData)
window.electronAPI.project.load(projectId)
window.electronAPI.project.getAll()
window.electronAPI.project.delete(projectId)

// 文件操作
window.electronAPI.file.selectDirectory()
window.electronAPI.file.saveFile(filename, content)

// 视频导出
window.electronAPI.video.export(storyboards, outputPath)

// 配置管理
window.electronAPI.config.get(key)
window.electronAPI.config.set(key, value)

// 文件系统
window.electronAPI.shell.openPath(path)
```

### 使用 React Hook

应用提供了 `useElectron` Hook 简化 IPC 调用：

```typescript
import { useElectron } from '@/hooks/useElectron';

function MyComponent() {
  const electron = useElectron();

  const handleSaveProject = async () => {
    const result = await electron.project.save(projectData);
    if (result.success) {
      console.log('项目已保存');
    }
  };

  return <button onClick={handleSaveProject}>保存项目</button>;
}
```

## 安全性

### Context Isolation

应用启用了 Electron 的 Context Isolation，确保渲染进程无法直接访问 Node.js API。所有 IPC 通信都通过预加载脚本进行。

### 预加载脚本

预加载脚本（`electron/preload.ts`）定义了所有可用的 IPC 接口，并提供了类型定义。

### 最佳实践

- ✅ 所有敏感操作都在主进程中执行
- ✅ 使用 Context Isolation 隔离上下文
- ✅ 验证所有 IPC 消息参数
- ✅ 不向渲染进程暴露 Node.js API
- ✅ 定期更新 Electron 和依赖

## 故障排除

### 应用无法启动

**症状**：启动应用时出现错误

**解决方案**：
1. 检查 Node.js 版本（需要 14+）
2. 清除缓存：`pnpm clean && pnpm install`
3. 检查 FFmpeg 是否正确安装
4. 查看控制台日志获取详细错误信息

### 视频生成失败

**症状**：导出视频时出现错误

**解决方案**：
1. 确保 FFmpeg 已安装且在 PATH 中
2. 检查输出目录是否有写入权限
3. 确保磁盘空间充足
4. 查看应用日志获取详细错误信息

### 数据库错误

**症状**：项目无法保存或加载

**解决方案**：
1. 检查数据库文件是否存在和可访问
2. 确保应用有数据库目录的读写权限
3. 尝试删除数据库文件并重新启动应用
4. 检查磁盘空间是否充足

### 性能问题

**症状**：应用响应缓慢或卡顿

**解决方案**：
1. 检查系统资源使用情况
2. 减少同时打开的项目数
3. 清理临时文件和缓存
4. 更新到最新版本的 Electron

## 更新应用

### 手动更新

1. 下载最新版本的应用
2. 卸载旧版本
3. 安装新版本

### 自动更新（可选）

如需实现自动更新功能，可以集成 `electron-updater`：

```bash
pnpm add electron-updater
```

然后在主进程中配置：

```typescript
import { autoUpdater } from 'electron-updater';

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## 发布和分发

### 创建发布版本

1. 更新 `package.json` 中的版本号
2. 运行 `pnpm electron-build`
3. 生成的安装程序位于 `dist_electron/` 目录

### 分发选项

- **直接分发**：将安装程序上传到网站或云存储
- **应用商店**：提交到 Windows Store、Mac App Store 等
- **包管理器**：发布到 Homebrew（macOS）、Chocolatey（Windows）等

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 参考资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Electron Builder 文档](https://www.electron.build/)
- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [FFmpeg 官方文档](https://ffmpeg.org/documentation.html)

---

**最后更新**：2024-01-16  
**版本**：1.0.0
