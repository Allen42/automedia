import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

/**
 * FFmpeg 配置和初始化模块
 */

interface FFmpegConfig {
  ffmpeg: {
    path: string;
    ffprobe: string;
    timeout: number;
    encoding: {
      preset: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
      crf: number;
      framerate: number;
      resolution: string;
      pixelFormat: string;
    };
    advanced: {
      threads: number;
      bufsize: string;
      maxrate: string;
    };
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    file: string;
  };
}

// 默认配置
const DEFAULT_CONFIG: FFmpegConfig = {
  ffmpeg: {
    path: '',
    ffprobe: '',
    timeout: 300000, // 5 分钟
    encoding: {
      preset: 'medium',
      crf: 23,
      framerate: 30,
      resolution: '1920x1080',
      pixelFormat: 'yuv420p',
    },
    advanced: {
      threads: 4,
      bufsize: '1835k',
      maxrate: '5000k',
    },
  },
  logging: {
    enabled: true,
    level: 'info',
    file: './logs/ffmpeg.log',
  },
};

/**
 * 查找 FFmpeg 可执行文件
 */
function findFFmpeg(): string {
  try {
    // 尝试在 PATH 中查找
    if (process.platform === 'win32') {
      execSync('where ffmpeg', { stdio: 'pipe' });
      return 'ffmpeg';
    } else {
      execSync('which ffmpeg', { stdio: 'pipe' });
      return 'ffmpeg';
    }
  } catch {
    // 尝试常见路径
    const commonPaths = [
      '/usr/local/bin/ffmpeg',
      '/usr/bin/ffmpeg',
      'C:\\ffmpeg\\bin\\ffmpeg.exe',
      'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
    ];

    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    throw new Error('FFmpeg 未找到。请安装 FFmpeg 或设置 FFMPEG_PATH 环境变量。');
  }
}

/**
 * 查找 FFprobe 可执行文件
 */
function findFFprobe(): string {
  try {
    if (process.platform === 'win32') {
      execSync('where ffprobe', { stdio: 'pipe' });
      return 'ffprobe';
    } else {
      execSync('which ffprobe', { stdio: 'pipe' });
      return 'ffprobe';
    }
  } catch {
    const commonPaths = [
      '/usr/local/bin/ffprobe',
      '/usr/bin/ffprobe',
      'C:\\ffmpeg\\bin\\ffprobe.exe',
      'C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe',
    ];

    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    throw new Error('FFprobe 未找到。请安装 FFmpeg 或设置 FFMPEG_PATH 环境变量。');
  }
}

/**
 * 加载配置文件
 */
function loadConfig(): FFmpegConfig {
  const configPath = path.join(process.cwd(), '.ffmpeg-config.json');

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('配置文件解析失败，使用默认配置:', error);
    }
  }

  return DEFAULT_CONFIG;
}

/**
 * 初始化 FFmpeg
 */
export function initializeFFmpeg(): FFmpegConfig {
  try {
    const config = loadConfig();

    // 如果未设置路径，自动查找
    if (!config.ffmpeg.path) {
      config.ffmpeg.path = findFFmpeg();
    }

    if (!config.ffmpeg.ffprobe) {
      config.ffmpeg.ffprobe = findFFprobe();
    }

    // 设置 FFmpeg 路径
    ffmpeg.setFfmpegPath(config.ffmpeg.path);
    ffmpeg.setFfprobePath(config.ffmpeg.ffprobe);

    console.log('✓ FFmpeg 初始化成功');
    console.log(`  FFmpeg: ${config.ffmpeg.path}`);
    console.log(`  FFprobe: ${config.ffmpeg.ffprobe}`);

    return config;
  } catch (error) {
    console.error('✗ FFmpeg 初始化失败:', error);
    throw error;
  }
}

/**
 * 验证 FFmpeg 安装
 */
export function verifyFFmpeg(): boolean {
  try {
    const config = loadConfig();
    const ffmpegPath = config.ffmpeg.path || findFFmpeg();
    const result = execSync(`"${ffmpegPath}" -version`, { encoding: 'utf-8' });
    return result.includes('ffmpeg');
  } catch {
    return false;
  }
}

/**
 * 获取 FFmpeg 版本
 */
export function getFFmpegVersion(): string {
  try {
    const config = loadConfig();
    const ffmpegPath = config.ffmpeg.path || findFFmpeg();
    const result = execSync(`"${ffmpegPath}" -version`, { encoding: 'utf-8' });
    return result.split('\n')[0];
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * 获取配置
 */
export function getFFmpegConfig(): FFmpegConfig {
  return loadConfig();
}

/**
 * 保存配置
 */
export function saveFFmpegConfig(config: FFmpegConfig): void {
  const configPath = path.join(process.cwd(), '.ffmpeg-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('配置已保存:', configPath);
}

/**
 * 获取编码选项
 */
export function getEncodingOptions(config: FFmpegConfig): string[] {
  const { encoding, advanced } = config.ffmpeg;

  return [
    '-c:v', 'libx264',
    '-preset', encoding.preset,
    '-crf', String(encoding.crf),
    '-r', String(encoding.framerate),
    '-pix_fmt', encoding.pixelFormat,
    '-threads', String(advanced.threads),
    '-bufsize', advanced.bufsize,
    '-maxrate', advanced.maxrate,
  ];
}

/**
 * 检查编码器支持
 */
export function checkEncoderSupport(encoder: string): boolean {
  try {
    const config = loadConfig();
    const ffmpegPath = config.ffmpeg.path || findFFmpeg();
    execSync(`"${ffmpegPath}" -encoder ${encoder}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    ffmpegVersion: getFFmpegVersion(),
    ffmpegAvailable: verifyFFmpeg(),
  };
}
