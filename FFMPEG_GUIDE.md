# FFmpeg 安装和配置完全指南

本指南详细说明如何在 Windows、macOS 和 Linux 上安装和配置 FFmpeg，以支持 AI 漫剧剧本生成器的视频导出功能。

---

## 目录

1. [Windows 安装](#windows-安装)
2. [macOS 安装](#macos-安装)
3. [Linux 安装](#linux-安装)
4. [验证安装](#验证安装)
5. [配置环境变量](#配置环境变量)
6. [故障排除](#故障排除)
7. [性能优化](#性能优化)

---

## Windows 安装

### 方法一：使用 Chocolatey（推荐）

**前提条件**：已安装 Chocolatey

```powershell
# 以管理员身份打开 PowerShell
choco install ffmpeg -y
```

**验证安装**：
```powershell
ffmpeg -version
```

### 方法二：使用 Scoop

**前提条件**：已安装 Scoop

```powershell
scoop install ffmpeg
```

### 方法三：手动安装

#### 步骤 1：下载 FFmpeg

1. 访问 [FFmpeg 官方网站](https://ffmpeg.org/download.html)
2. 选择 Windows 版本
3. 下载完整版本（包含所有编码器）

**推荐下载源**：
- **官方**：https://ffmpeg.org/download.html
- **BtbN 构建**：https://github.com/BtbN/FFmpeg-Builds/releases（推荐，更新频繁）
- **Zeranoe 构建**：已停止维护，不推荐

#### 步骤 2：解压文件

1. 下载 ZIP 文件后，解压到合适位置，例如：
   ```
   C:\ffmpeg\
   ```

2. 解压后的目录结构应该是：
   ```
   C:\ffmpeg\
   ├── bin\
   │   ├── ffmpeg.exe
   │   ├── ffprobe.exe
   │   └── ffplay.exe
   ├── doc\
   └── presets\
   ```

#### 步骤 3：添加到 PATH 环境变量

**使用 GUI 方法**：

1. 按 `Win + X`，选择"系统"
2. 点击"高级系统设置"
3. 点击"环境变量"按钮
4. 在"系统变量"中，找到 `Path` 并点击"编辑"
5. 点击"新建"，添加 FFmpeg 的 `bin` 目录路径：
   ```
   C:\ffmpeg\bin
   ```
6. 点击"确定"保存

**使用命令行方法**：

```powershell
# 以管理员身份打开 PowerShell
$ffmpegPath = "C:\ffmpeg\bin"
[Environment]::SetEnvironmentVariable("Path", "$env:Path;$ffmpegPath", "Machine")
```

#### 步骤 4：重启系统

关闭所有应用程序并重启电脑，以使环境变量生效。

#### 步骤 5：验证安装

```powershell
ffmpeg -version
ffprobe -version
```

---

## macOS 安装

### 方法一：使用 Homebrew（推荐）

**前提条件**：已安装 Homebrew

```bash
# 安装 FFmpeg
brew install ffmpeg

# 验证安装
ffmpeg -version
```

**安装完整版本（包含所有编码器）**：

```bash
# 卸载之前的版本（如果有）
brew uninstall ffmpeg

# 安装完整版本
brew install ffmpeg --with-options-here
```

### 方法二：使用 MacPorts

**前提条件**：已安装 MacPorts

```bash
sudo port install ffmpeg
```

### 方法三：手动安装

#### 步骤 1：下载 FFmpeg

1. 访问 [FFmpeg 官方网站](https://ffmpeg.org/download.html)
2. 选择 macOS 版本
3. 下载 Universal Binary（支持 Intel 和 Apple Silicon）

#### 步骤 2：解压并安装

```bash
# 解压下载的文件
tar -xzf ffmpeg-macos.tar.gz

# 移动到 /usr/local/bin
sudo mv ffmpeg /usr/local/bin/
sudo mv ffprobe /usr/local/bin/

# 添加执行权限
sudo chmod +x /usr/local/bin/ffmpeg
sudo chmod +x /usr/local/bin/ffprobe

# 验证安装
ffmpeg -version
```

#### 步骤 3：验证 PATH

确保 `/usr/local/bin` 在 PATH 中：

```bash
echo $PATH
```

如果没有包含 `/usr/local/bin`，添加到 shell 配置文件：

```bash
# 对于 Zsh（macOS 默认）
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 对于 Bash
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

---

## Linux 安装

### Ubuntu/Debian

**使用 apt 包管理器**：

```bash
# 更新包列表
sudo apt-get update

# 安装 FFmpeg
sudo apt-get install ffmpeg -y

# 验证安装
ffmpeg -version
```

**安装完整版本（包含所有编码器和库）**：

```bash
sudo apt-get install ffmpeg libavcodec-extra -y
```

### Fedora/RHEL/CentOS

**使用 dnf 包管理器**：

```bash
# 安装 FFmpeg
sudo dnf install ffmpeg -y

# 验证安装
ffmpeg -version
```

### Arch Linux

**使用 pacman 包管理器**：

```bash
# 安装 FFmpeg
sudo pacman -S ffmpeg

# 验证安装
ffmpeg -version
```

### 从源代码编译（高级）

如果需要最新版本或特定的编码器：

```bash
# 安装依赖
sudo apt-get install build-essential git -y

# 克隆 FFmpeg 仓库
git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg

# 进入目录
cd ffmpeg

# 配置（启用常用编码器）
./configure --enable-gpl --enable-libx264 --enable-libx265 --enable-libvpx

# 编译
make -j$(nproc)

# 安装
sudo make install

# 验证安装
ffmpeg -version
```

---

## 验证安装

### 基础验证

```bash
# 检查 FFmpeg 版本
ffmpeg -version

# 检查 FFprobe 版本
ffprobe -version

# 检查 FFplay 版本
ffplay -version
```

### 详细验证

```bash
# 列出所有支持的编码器
ffmpeg -encoders

# 列出所有支持的解码器
ffmpeg -decoders

# 列出所有支持的格式
ffmpeg -formats

# 检查特定编码器
ffmpeg -encoder h264
ffmpeg -encoder libx264
```

### 测试视频生成

创建一个测试脚本来验证视频生成功能：

```bash
#!/bin/bash

# 创建测试图像
ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=5 -pix_fmt yuv420p test_input.mp4

# 检查输出
if [ -f test_input.mp4 ]; then
    echo "✓ FFmpeg 工作正常"
    ffprobe test_input.mp4
    rm test_input.mp4
else
    echo "✗ FFmpeg 测试失败"
fi
```

---

## 配置环境变量

### Windows

#### 使用 GUI

1. 右键点击"此电脑"或"我的电脑"
2. 选择"属性"
3. 点击"高级系统设置"
4. 点击"环境变量"
5. 在"系统变量"中点击"新建"
6. 变量名：`FFMPEG_PATH`
7. 变量值：`C:\ffmpeg\bin`
8. 点击"确定"

#### 使用命令行

```powershell
# 以管理员身份运行
setx FFMPEG_PATH "C:\ffmpeg\bin"
```

### macOS/Linux

```bash
# 编辑 shell 配置文件
nano ~/.bashrc  # 或 ~/.zshrc

# 添加以下行
export FFMPEG_PATH="/usr/local/bin"
export PATH="$FFMPEG_PATH:$PATH"

# 保存并重新加载
source ~/.bashrc  # 或 source ~/.zshrc
```

### 在 Node.js 中配置

在 Electron 应用中配置 FFmpeg 路径：

```typescript
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

// 方法一：自动检测
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');
ffmpeg.setFfprobePath('/usr/local/bin/ffprobe');

// 方法二：使用环境变量
const ffmpegPath = process.env.FFMPEG_PATH || '/usr/local/bin/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

// 方法三：跨平台配置
import { execSync } from 'child_process';

function findFFmpeg() {
  try {
    const result = execSync('which ffmpeg', { encoding: 'utf-8' });
    return result.trim();
  } catch {
    // Windows 回退
    return 'C:\\ffmpeg\\bin\\ffmpeg.exe';
  }
}

const ffmpegPath = findFFmpeg();
ffmpeg.setFfmpegPath(ffmpegPath);
```

---

## 故障排除

### 问题 1：FFmpeg 命令未找到

**症状**：
```
ffmpeg: command not found
```

**解决方案**：

1. 验证安装：
   ```bash
   which ffmpeg  # macOS/Linux
   where ffmpeg  # Windows
   ```

2. 如果未找到，重新安装并添加到 PATH

3. 检查 PATH 环境变量：
   ```bash
   echo $PATH  # macOS/Linux
   echo %PATH%  # Windows
   ```

### 问题 2：缺少编码器

**症状**：
```
libx264 encoder not found
```

**解决方案**：

1. 检查可用编码器：
   ```bash
   ffmpeg -encoders | grep h264
   ```

2. 重新安装包含完整编码器的版本：
   ```bash
   # Windows (Chocolatey)
   choco uninstall ffmpeg -y
   choco install ffmpeg -y

   # macOS (Homebrew)
   brew uninstall ffmpeg
   brew install ffmpeg

   # Linux (Ubuntu)
   sudo apt-get install ffmpeg libavcodec-extra -y
   ```

### 问题 3：权限被拒绝

**症状**：
```
Permission denied
```

**解决方案**：

```bash
# macOS/Linux
sudo chmod +x /usr/local/bin/ffmpeg
sudo chmod +x /usr/local/bin/ffprobe

# 检查权限
ls -la /usr/local/bin/ffmpeg
```

### 问题 4：视频生成失败

**症状**：
```
Error: spawn ffmpeg ENOENT
```

**解决方案**：

1. 验证 FFmpeg 路径配置正确
2. 检查输出目录权限
3. 检查磁盘空间
4. 查看应用日志获取详细错误

```typescript
// 调试代码
import { execSync } from 'child_process';

try {
  const version = execSync('ffmpeg -version', { encoding: 'utf-8' });
  console.log('FFmpeg 版本:', version);
} catch (error) {
  console.error('FFmpeg 未找到:', error.message);
}
```

### 问题 5：性能低下

**症状**：
- 视频生成速度慢
- CPU 占用率高
- 内存占用过多

**解决方案**：

1. 检查 FFmpeg 版本（更新到最新）
2. 使用硬件加速（如果支持）
3. 优化编码参数

```typescript
// 使用硬件加速
ffmpeg(input)
  .outputOptions([
    '-c:v', 'h264_nvenc',  // NVIDIA GPU
    // 或
    '-c:v', 'h264_qsv',    // Intel Quick Sync
    // 或
    '-c:v', 'h264_videotoolbox',  // macOS
  ])
  .output(output)
  .run();
```

---

## 性能优化

### 编码参数优化

```typescript
import ffmpeg from 'fluent-ffmpeg';

// 快速编码（质量较低）
ffmpeg(input)
  .outputOptions([
    '-c:v', 'libx264',
    '-preset', 'ultrafast',  // ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
    '-crf', '28',            // 质量 (0-51, 越低越好)
  ])
  .output(output)
  .run();

// 平衡编码（推荐）
ffmpeg(input)
  .outputOptions([
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '23',
  ])
  .output(output)
  .run();

// 高质量编码（速度慢）
ffmpeg(input)
  .outputOptions([
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
  ])
  .output(output)
  .run();
```

### 参数说明

| 参数 | 说明 | 范围 |
|------|------|------|
| `preset` | 编码速度 | ultrafast ~ veryslow |
| `crf` | 质量 | 0-51（越低越好） |
| `b:v` | 比特率 | 例如 5000k |
| `r` | 帧率 | 例如 30 |
| `s` | 分辨率 | 例如 1920x1080 |

### 批量处理优化

```typescript
// 使用工作队列处理多个视频
import Queue from 'bull';

const videoQueue = new Queue('video-export', {
  redis: { host: 'localhost', port: 6379 }
});

videoQueue.process(5, async (job) => {
  const { storyboards, outputPath } = job.data;
  return await exportVideo(storyboards, outputPath);
});

// 添加任务
videoQueue.add({ storyboards, outputPath }, { priority: 1 });
```

---

## 常用 FFmpeg 命令

### 基础命令

```bash
# 查看文件信息
ffprobe video.mp4

# 转换格式
ffmpeg -i input.mp4 output.avi

# 调整分辨率
ffmpeg -i input.mp4 -s 1920x1080 output.mp4

# 调整帧率
ffmpeg -i input.mp4 -r 30 output.mp4

# 调整比特率
ffmpeg -i input.mp4 -b:v 5000k output.mp4

# 提取音频
ffmpeg -i input.mp4 -q:a 0 -map a output.mp3

# 添加字幕
ffmpeg -i input.mp4 -vf subtitles=subtitle.srt output.mp4
```

### 图像序列转视频

```bash
# 从图像序列生成视频
ffmpeg -framerate 30 -i image_%03d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# 从单个图像循环生成视频
ffmpeg -loop 1 -i image.png -c:v libx264 -t 10 -pix_fmt yuv420p output.mp4
```

### 视频合并

```bash
# 创建 concat.txt
file 'video1.mp4'
file 'video2.mp4'
file 'video3.mp4'

# 合并视频
ffmpeg -f concat -safe 0 -i concat.txt -c copy output.mp4
```

---

## 系统要求

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| **CPU** | 2 核心 | 4 核心+ |
| **内存** | 2 GB | 8 GB+ |
| **磁盘** | 1 GB 可用空间 | 10 GB+ |
| **网络** | 不需要 | - |

---

## 获取帮助

- **FFmpeg 官方文档**：https://ffmpeg.org/documentation.html
- **FFmpeg Wiki**：https://trac.ffmpeg.org/wiki
- **Homebrew 支持**：https://brew.sh
- **Chocolatey 支持**：https://chocolatey.org

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| 1.0 | 2024-01-16 | 初始版本 |

---

**最后更新**：2024-01-16  
**维护者**：AI 漫剧剧本生成器团队
