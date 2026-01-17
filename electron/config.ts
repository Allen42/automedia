import { getConfig, setConfig } from './db.js';
import { app } from 'electron';
import path from 'path';

// 应用配置键
export const CONFIG_KEYS = {
  OUTPUT_DIRECTORY: 'output_directory',
  AUTO_SAVE: 'auto_save',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// 获取应用配置
export function getAppConfig(key: string): any {
  try {
    const value = getConfig(key);
    
    if (!value) {
      // 返回默认值
      switch (key) {
        case CONFIG_KEYS.OUTPUT_DIRECTORY:
          return app.getPath('documents');
        case CONFIG_KEYS.AUTO_SAVE:
          return true;
        case CONFIG_KEYS.THEME:
          return 'dark';
        case CONFIG_KEYS.LANGUAGE:
          return 'zh-CN';
        default:
          return null;
      }
    }

    // 尝试解析 JSON
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error('获取配置失败:', error);
    return null;
  }
}

// 设置应用配置
export function setAppConfig(key: string, value: any): void {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    setConfig(key, stringValue);
  } catch (error) {
    console.error('设置配置失败:', error);
    throw error;
  }
}

// 获取输出目录
export function getOutputDirectory(): string {
  return getAppConfig(CONFIG_KEYS.OUTPUT_DIRECTORY) || app.getPath('documents');
}

// 设置输出目录
export function setOutputDirectory(directory: string): void {
  setAppConfig(CONFIG_KEYS.OUTPUT_DIRECTORY, directory);
}
