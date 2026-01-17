#!/usr/bin/env node

/**
 * FFmpeg 快速检查脚本
 * 用于验证 FFmpeg 是否正确安装和配置
 */

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, description) {
  try {
    const result = execSync(`${command} -version`, { encoding: 'utf-8' });
    const version = result.split('\n')[0];
    log(`✓ ${description}`, 'green');
    log(`  ${version}`, 'cyan');
    return true;
  } catch (error) {
    log(`✗ ${description} - 未找到或出错`, 'red');
    return false;
  }
}

function checkEncoder(encoder) {
  try {
    const result = execSync(`ffmpeg -encoder ${encoder} 2>&1`, { encoding: 'utf-8' });
    if (result.includes('Unknown encoder')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function checkPath() {
  try {
    const result = execSync('which ffmpeg', { encoding: 'utf-8' });
    return result.trim();
  } catch {
    try {
      const result = execSync('where ffmpeg', { encoding: 'utf-8' });
      return result.trim();
    } catch {
      return null;
    }
  }
}

function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║        FFmpeg 安装和配置检查工具                            ║', 'blue');
  log('║        AI 漫剧剧本生成器                                    ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝\n', 'blue');

  // 系统信息
  log('📋 系统信息', 'cyan');
  log(`  操作系统: ${os.platform()} ${os.arch()}`);
  log(`  Node.js: ${process.version}`);
  log(`  工作目录: ${process.cwd()}\n`);

  // 检查命令
  log('🔍 检查 FFmpeg 组件', 'cyan');
  const ffmpegOk = checkCommand('ffmpeg', 'FFmpeg');
  const ffprobeOk = checkCommand('ffprobe', 'FFprobe');
  const ffplayOk = checkCommand('ffplay', 'FFplay (可选)');
  log('');

  // 检查路径
  log('📍 FFmpeg 路径', 'cyan');
  const ffmpegPath = checkPath();
  if (ffmpegPath) {
    log(`  ${ffmpegPath}`, 'green');
  } else {
    log('  未找到 FFmpeg', 'red');
  }
  log('');

  // 检查编码器
  if (ffmpegOk) {
    log('🎬 检查常用编码器', 'cyan');
    const encoders = [
      { name: 'libx264', description: 'H.264 (推荐)' },
      { name: 'libx265', description: 'H.265/HEVC' },
      { name: 'libvpx', description: 'VP8' },
      { name: 'libvpx-vp9', description: 'VP9' },
      { name: 'aac', description: 'AAC 音频' },
      { name: 'libmp3lame', description: 'MP3 音频' },
    ];

    encoders.forEach(({ name, description }) => {
      const available = checkEncoder(name);
      const status = available ? '✓' : '✗';
      const color = available ? 'green' : 'yellow';
      log(`  ${status} ${description} (${name})`, color);
    });
    log('');
  }

  // 测试视频生成
  log('🧪 测试视频生成能力', 'cyan');
  try {
    const testCmd = 'ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1 -pix_fmt yuv420p -y /tmp/test_ffmpeg.mp4 2>&1';
    execSync(testCmd, { stdio: 'pipe' });
    
    // 检查输出文件
    const fs = require('fs');
    if (fs.existsSync('/tmp/test_ffmpeg.mp4')) {
      log('  ✓ 视频生成测试成功', 'green');
      const stats = fs.statSync('/tmp/test_ffmpeg.mp4');
      log(`  文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
      
      // 清理测试文件
      fs.unlinkSync('/tmp/test_ffmpeg.mp4');
    } else {
      log('  ✗ 视频生成测试失败', 'red');
    }
  } catch (error) {
    log('  ✗ 视频生成测试失败', 'red');
    log(`  错误: ${error.message.split('\n')[0]}`, 'yellow');
  }
  log('');

  // 总结
  log('📊 检查总结', 'cyan');
  if (ffmpegOk && ffprobeOk) {
    log('  ✓ FFmpeg 已正确安装', 'green');
    log('  ✓ 可以使用视频导出功能', 'green');
    log('\n✨ 一切就绪！你可以开始使用 AI 漫剧剧本生成器了。\n', 'green');
  } else {
    log('  ✗ FFmpeg 未正确安装', 'red');
    log('  请参考 FFMPEG_GUIDE.md 完成安装配置', 'yellow');
    log('\n📖 快速安装命令:', 'yellow');
    
    if (process.platform === 'win32') {
      log('  Windows (Chocolatey): choco install ffmpeg -y', 'cyan');
      log('  Windows (Scoop): scoop install ffmpeg', 'cyan');
    } else if (process.platform === 'darwin') {
      log('  macOS (Homebrew): brew install ffmpeg', 'cyan');
    } else if (process.platform === 'linux') {
      log('  Linux (Ubuntu): sudo apt-get install ffmpeg -y', 'cyan');
      log('  Linux (Fedora): sudo dnf install ffmpeg -y', 'cyan');
      log('  Linux (Arch): sudo pacman -S ffmpeg', 'cyan');
    }
    log('');
  }

  // 环境变量
  log('🔧 环境变量', 'cyan');
  log(`  PATH: ${process.env.PATH ? '已设置' : '未设置'}`, 'cyan');
  log(`  FFMPEG_PATH: ${process.env.FFMPEG_PATH || '未设置'}`, 'cyan');
  log('');

  // 获取帮助
  log('❓ 获取帮助', 'cyan');
  log('  📖 详细指南: 查看项目中的 FFMPEG_GUIDE.md');
  log('  🌐 官方文档: https://ffmpeg.org/documentation.html');
  log('  💬 常见问题: 查看 FFMPEG_GUIDE.md 中的故障排除部分');
  log('');
}

main();
