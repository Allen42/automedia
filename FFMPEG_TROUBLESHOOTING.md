# FFmpeg 故障排除和调试指南

本指南帮助你诊断和解决 FFmpeg 相关的问题。

---

## 快速诊断

### 运行检查脚本

**Node.js 版本**：
```bash
node scripts/check-ffmpeg.js
```

**Bash 版本**（推荐）：
```bash
bash scripts/check-ffmpeg.sh
```

这些脚本会自动检查：
- ✓ FFmpeg 是否安装
- ✓ FFmpeg 版本
- ✓ 常用编码器支持
- ✓ 视频生成能力

---

## 常见问题和解决方案

### 问题 1：FFmpeg 命令未找到

**错误信息**：
```
ffmpeg: command not found
Error: spawn ffmpeg ENOENT
```

**原因**：
- FFmpeg 未安装
- FFmpeg 不在 PATH 环境变量中
- FFmpeg 路径配置错误

**解决方案**：

1. **验证安装**：
   ```bash
   which ffmpeg      # macOS/Linux
   where ffmpeg      # Windows
   ffmpeg -version   # 所有系统
   ```

2. **重新安装**：
   ```bash
   # Windows (Chocolatey)
   choco uninstall ffmpeg -y
   choco install ffmpeg -y

   # macOS (Homebrew)
   brew uninstall ffmpeg
   brew install ffmpeg

   # Linux (Ubuntu)
   sudo apt-get remove ffmpeg
   sudo apt-get install ffmpeg -y
   ```

3. **手动设置路径**：
   ```bash
   # 创建 .ffmpeg-config.json
   cp .ffmpeg-config.example.json .ffmpeg-config.json
   
   # 编辑文件，设置正确的路径
   nano .ffmpeg-config.json
   ```

4. **使用自动安装脚本**：
   ```bash
   bash scripts/install-ffmpeg.sh
   ```

---

### 问题 2：缺少编码器

**错误信息**：
```
Unknown encoder 'libx264'
Encoder (codec h264) not found
```

**原因**：
- FFmpeg 编译时未启用 H.264 编码器
- 使用了精简版本的 FFmpeg

**解决方案**：

1. **检查可用编码器**：
   ```bash
   ffmpeg -encoders | grep h264
   ffmpeg -encoders | grep h265
   ```

2. **安装完整版本**：
   ```bash
   # Windows (Chocolatey)
   choco install ffmpeg -y

   # macOS (Homebrew)
   brew install ffmpeg

   # Linux (Ubuntu)
   sudo apt-get install ffmpeg libavcodec-extra -y
   ```

3. **从源代码编译**（高级）：
   ```bash
   git clone https://git.ffmpeg.org/ffmpeg.git
   cd ffmpeg
   ./configure --enable-gpl --enable-libx264 --enable-libx265
   make -j$(nproc)
   sudo make install
   ```

---

### 问题 3：权限被拒绝

**错误信息**：
```
Permission denied
EACCES: permission denied
```

**原因**：
- FFmpeg 文件没有执行权限
- 应用没有输出目录的写入权限

**解决方案**：

1. **添加执行权限**：
   ```bash
   sudo chmod +x /usr/local/bin/ffmpeg
   sudo chmod +x /usr/local/bin/ffprobe
   ```

2. **检查输出目录权限**：
   ```bash
   ls -la /path/to/output
   chmod 755 /path/to/output
   ```

3. **使用有权限的目录**：
   - Windows：使用 `C:\Users\YourUsername\Videos`
   - macOS：使用 `~/Videos` 或 `~/Desktop`
   - Linux：使用 `~/Videos` 或 `~/Desktop`

---

### 问题 4：视频生成失败

**错误信息**：
```
Error: ffmpeg exited with code 1
Conversion failed
```

**原因**：
- 输入文件格式不支持
- 输出目录不存在或无权限
- 磁盘空间不足
- 编码参数错误

**解决方案**：

1. **检查磁盘空间**：
   ```bash
   df -h              # macOS/Linux
   diskpart           # Windows
   ```

2. **验证输出目录**：
   ```bash
   mkdir -p /path/to/output
   chmod 755 /path/to/output
   ```

3. **查看详细错误**：
   ```bash
   # 启用详细日志
   export FFMPEG_DEBUG=1
   pnpm dev:electron
   ```

4. **测试基本功能**：
   ```bash
   # 生成测试视频
   ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=5 -pix_fmt yuv420p test.mp4
   ```

---

### 问题 5：性能问题

**症状**：
- 视频生成速度慢
- CPU 占用率高
- 内存占用过多

**原因**：
- 编码参数不优化
- 硬件加速未启用
- 分镜数量过多

**解决方案**：

1. **优化编码参数**：
   ```json
   {
     "ffmpeg": {
       "encoding": {
         "preset": "faster",
         "crf": 28,
         "framerate": 24
       }
     }
   }
   ```

2. **启用硬件加速**：
   ```bash
   # NVIDIA GPU
   ffmpeg -encoder h264_nvenc

   # Intel Quick Sync
   ffmpeg -encoder h264_qsv

   # macOS
   ffmpeg -encoder h264_videotoolbox
   ```

3. **减少分镜数量**：
   - 合并相似的分镜
   - 减少每个分镜的时长

---

### 问题 6：音频问题

**错误信息**：
```
No audio encoder found
Audio codec not supported
```

**原因**：
- 缺少音频编码器
- 音频格式不支持

**解决方案**：

1. **检查音频编码器**：
   ```bash
   ffmpeg -encoders | grep aac
   ffmpeg -encoders | grep mp3
   ```

2. **安装音频编码器**：
   ```bash
   # Linux (Ubuntu)
   sudo apt-get install libmp3-lame0 libfdk-aac2 -y
   ```

---

## 调试技巧

### 启用详细日志

**在 Electron 应用中**：

```typescript
import ffmpeg from 'fluent-ffmpeg';

// 启用详细日志
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');

ffmpeg(input)
  .on('start', (commandLine) => {
    console.log('FFmpeg 命令:', commandLine);
  })
  .on('progress', (progress) => {
    console.log('进度:', progress);
  })
  .on('error', (error) => {
    console.error('错误:', error);
  })
  .on('end', () => {
    console.log('完成');
  })
  .output(output)
  .run();
```

### 测试命令

```bash
# 列出所有编码器
ffmpeg -encoders

# 列出所有解码器
ffmpeg -decoders

# 列出所有格式
ffmpeg -formats

# 获取文件信息
ffprobe -show_format -show_streams input.mp4

# 生成测试视频
ffmpeg -f lavfi -i color=c=red:s=1920x1080:d=5 -pix_fmt yuv420p test.mp4

# 测试编码速度
ffmpeg -f lavfi -i testsrc=size=1920x1080:duration=10 -c:v libx264 -preset fast -f null -
```

### 环境变量调试

```bash
# 显示所有环境变量
env | grep -i ffmpeg
env | grep -i path

# 设置调试级别
export FFREPORT=file=ffmpeg-debug.log:level=debug
ffmpeg -i input.mp4 output.mp4
```

---

## 性能基准测试

### 测试视频生成速度

```bash
#!/bin/bash

echo "FFmpeg 性能测试"
echo "==============="

# 测试 1920x1080 @ 30fps
echo "测试 1: 1920x1080 @ 30fps"
time ffmpeg -f lavfi -i color=c=blue:s=1920x1080:d=10 \
  -c:v libx264 -preset medium -crf 23 -r 30 \
  -pix_fmt yuv420p -y test1.mp4

# 测试 1280x720 @ 24fps
echo "测试 2: 1280x720 @ 24fps"
time ffmpeg -f lavfi -i color=c=green:s=1280x720:d=10 \
  -c:v libx264 -preset fast -crf 28 -r 24 \
  -pix_fmt yuv420p -y test2.mp4

# 清理
rm test1.mp4 test2.mp4
```

---

## 获取帮助

### 官方资源

- **FFmpeg 官方文档**：https://ffmpeg.org/documentation.html
- **FFmpeg Wiki**：https://trac.ffmpeg.org/wiki
- **FFmpeg 论坛**：https://ffmpeg.org/pipermail/ffmpeg-user/

### 社区支持

- **Stack Overflow**：标签 `ffmpeg`
- **GitHub Issues**：搜索相关问题
- **Reddit**：r/ffmpeg

### 本地支持

- 查看应用日志：`~/.config/ai-manju-script-app/`
- 运行检查脚本：`bash scripts/check-ffmpeg.sh`
- 查看完整指南：`FFMPEG_GUIDE.md`

---

## 高级配置

### 自定义 FFmpeg 配置

创建 `.ffmpeg-config.json`：

```json
{
  "ffmpeg": {
    "path": "/usr/local/bin/ffmpeg",
    "ffprobe": "/usr/local/bin/ffprobe",
    "timeout": 600000,
    "encoding": {
      "preset": "fast",
      "crf": 25,
      "framerate": 24,
      "resolution": "1280x720",
      "pixelFormat": "yuv420p"
    },
    "advanced": {
      "threads": 8,
      "bufsize": "2000k",
      "maxrate": "6000k"
    }
  },
  "logging": {
    "enabled": true,
    "level": "debug",
    "file": "./logs/ffmpeg.log"
  }
}
```

### 使用硬件加速

```json
{
  "ffmpeg": {
    "encoding": {
      "hwaccel": "cuda",
      "hwaccel_device": "0"
    }
  }
}
```

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| 1.0 | 2024-01-16 | 初始版本 |

---

**最后更新**：2024-01-16  
**维护者**：AI 漫剧剧本生成器团队
