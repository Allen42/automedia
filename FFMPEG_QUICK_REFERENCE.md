# FFmpeg 快速参考卡片

快速查找 FFmpeg 安装命令和常用操作。

---

## 快速安装

### Windows

```powershell
# Chocolatey (推荐)
choco install ffmpeg -y

# Scoop
scoop install ffmpeg

# 验证
ffmpeg -version
```

### macOS

```bash
# Homebrew (推荐)
brew install ffmpeg

# 验证
ffmpeg -version
```

### Linux - Ubuntu/Debian

```bash
# 基础版本
sudo apt-get update
sudo apt-get install ffmpeg -y

# 完整版本 (包含所有编码器)
sudo apt-get install ffmpeg libavcodec-extra -y

# 验证
ffmpeg -version
```

### Linux - Fedora/RHEL

```bash
sudo dnf install ffmpeg -y
ffmpeg -version
```

### Linux - Arch

```bash
sudo pacman -S ffmpeg
ffmpeg -version
```

---

## 快速检查

```bash
# 检查 FFmpeg 版本
ffmpeg -version

# 检查 FFprobe 版本
ffprobe -version

# 列出所有编码器
ffmpeg -encoders

# 检查特定编码器
ffmpeg -encoder h264
ffmpeg -encoder libx264

# 获取文件信息
ffprobe input.mp4
```

---

## 项目中的检查脚本

```bash
# Node.js 版本
node scripts/check-ffmpeg.js

# Bash 版本 (推荐)
bash scripts/check-ffmpeg.sh

# 自动安装
bash scripts/install-ffmpeg.sh

# npm 脚本
pnpm check:ffmpeg
pnpm install:ffmpeg
```

---

## 常用命令

### 视频转换

```bash
# 转换格式
ffmpeg -i input.mp4 output.avi

# 调整分辨率
ffmpeg -i input.mp4 -s 1920x1080 output.mp4

# 调整帧率
ffmpeg -i input.mp4 -r 30 output.mp4

# 调整比特率
ffmpeg -i input.mp4 -b:v 5000k output.mp4
```

### 图像序列转视频

```bash
# 从图像序列生成视频
ffmpeg -framerate 30 -i image_%03d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# 从单个图像循环生成视频
ffmpeg -loop 1 -i image.png -c:v libx264 -t 10 -pix_fmt yuv420p output.mp4
```

### 生成测试视频

```bash
# 蓝色背景，1920x1080，30fps，5秒
ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=5 -pix_fmt yuv420p test.mp4

# 彩色条纹，1920x1080，30fps，10秒
ffmpeg -f lavfi -i testsrc=size=1920x1080:duration=10 -pix_fmt yuv420p test.mp4
```

---

## 编码参数

### 预设 (Preset)

| 预设 | 速度 | 质量 | 使用场景 |
|------|------|------|---------|
| ultrafast | 最快 | 最低 | 实时流媒体 |
| superfast | 很快 | 低 | 快速预览 |
| veryfast | 快 | 中低 | 快速导出 |
| faster | 中快 | 中 | 平衡 |
| fast | 中 | 中 | 平衡 |
| **medium** | 中 | 中高 | **推荐** |
| slow | 慢 | 高 | 高质量 |
| slower | 很慢 | 很高 | 最高质量 |
| veryslow | 最慢 | 最高 | 存档 |

### CRF (质量)

| CRF | 质量 | 使用场景 |
|-----|------|---------|
| 0-12 | 无损/极高 | 存档、专业 |
| 13-18 | 高 | 高质量导出 |
| 19-23 | 中高 | **推荐** |
| 24-28 | 中 | 快速导出 |
| 29-51 | 低 | 预览、流媒体 |

### 完整编码命令

```bash
# 快速编码
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 28 output.mp4

# 平衡编码 (推荐)
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 output.mp4

# 高质量编码
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 18 output.mp4
```

---

## 环境变量

### 设置 FFmpeg 路径

**Windows (PowerShell)**：
```powershell
$env:FFMPEG_PATH = "C:\ffmpeg\bin"
```

**macOS/Linux**：
```bash
export FFMPEG_PATH="/usr/local/bin"
export PATH="$FFMPEG_PATH:$PATH"
```

### 查看环境变量

```bash
echo $PATH          # macOS/Linux
echo %PATH%         # Windows
echo $FFMPEG_PATH   # macOS/Linux
echo %FFMPEG_PATH%  # Windows
```

---

## 故障排除

### FFmpeg 未找到

```bash
# 检查是否安装
which ffmpeg        # macOS/Linux
where ffmpeg        # Windows

# 重新安装
# 参考上面的"快速安装"部分
```

### 缺少编码器

```bash
# 检查编码器
ffmpeg -encoders | grep h264

# 安装完整版本
# 参考上面的"快速安装"部分
```

### 权限被拒绝

```bash
# 添加执行权限
sudo chmod +x /usr/local/bin/ffmpeg
sudo chmod +x /usr/local/bin/ffprobe
```

### 视频生成失败

```bash
# 测试基本功能
ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1 -pix_fmt yuv420p test.mp4

# 检查输出目录
mkdir -p ~/Videos
chmod 755 ~/Videos
```

---

## 性能优化

### 快速编码

```json
{
  "preset": "ultrafast",
  "crf": 28,
  "framerate": 24,
  "resolution": "1280x720"
}
```

### 平衡编码 (推荐)

```json
{
  "preset": "medium",
  "crf": 23,
  "framerate": 30,
  "resolution": "1920x1080"
}
```

### 高质量编码

```json
{
  "preset": "slow",
  "crf": 18,
  "framerate": 30,
  "resolution": "1920x1080"
}
```

---

## 有用的链接

| 资源 | 链接 |
|------|------|
| 官方网站 | https://ffmpeg.org |
| 文档 | https://ffmpeg.org/documentation.html |
| Wiki | https://trac.ffmpeg.org/wiki |
| 下载 | https://ffmpeg.org/download.html |
| Homebrew | https://brew.sh |
| Chocolatey | https://chocolatey.org |

---

## 完整指南

详细信息请参考：
- **FFMPEG_GUIDE.md** - 完整安装和配置指南
- **FFMPEG_TROUBLESHOOTING.md** - 故障排除和调试指南

---

**最后更新**：2024-01-16
