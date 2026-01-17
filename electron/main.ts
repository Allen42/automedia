import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { initializeDatabase, saveProject, loadProject, getAllProjects, deleteProject } from './db.js';
// videoExporter 使用动态导入，因为它依赖 canvas 模块可能有兼容性问题
import { getAppConfig, setAppConfig } from './config.js';

// ES 模块兼容：定义 __dirname 和 __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

// 创建应用窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../client/dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用启动
app.on('ready', () => {
  initializeDatabase();
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 创建菜单
function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: '关于 AI漫剧剧本生成器',
              message: 'AI漫剧剧本生成器 v1.0.0',
              detail: '一个基于 Gemini Pro 的专业桌面应用，将小说自动转换为漫剧分镜剧本。',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC 处理 - 项目管理
ipcMain.handle('project:save', async (event, projectData) => {
  try {
    saveProject(projectData);
    return { success: true };
  } catch (error) {
    console.error('保存项目失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('project:load', async (event, projectId) => {
  try {
    const project = loadProject(projectId);
    return { success: true, data: project };
  } catch (error) {
    console.error('加载项目失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('project:getAll', async () => {
  try {
    const projects = getAllProjects();
    return { success: true, data: projects };
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('project:delete', async (event, projectId) => {
  try {
    deleteProject(projectId);
    return { success: true };
  } catch (error) {
    console.error('删除项目失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

// IPC 处理 - 文件操作
ipcMain.handle('file:selectDirectory', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('file:saveFile', async (event, filename, content) => {
  if (!mainWindow) return null;

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
  });

  if (result.canceled) return null;

  try {
    const fs = require('fs').promises;
    await fs.writeFile(result.filePath, content);
    return result.filePath;
  } catch (error) {
    console.error('保存文件失败:', error);
    throw error;
  }
});

// IPC 处理 - 视频导出
ipcMain.handle('video:export', async (event, storyboards, outputPath) => {
  try {
    // 动态导入 videoExporter，避免 canvas 模块兼容性问题影响应用启动
    const { exportVideo } = await import('./videoExporter.js');
    const videoPath = await exportVideo(storyboards, outputPath);
    return { success: true, path: videoPath };
  } catch (error) {
    console.error('导出视频失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

// IPC 处理 - 配置管理
ipcMain.handle('config:get', async (event, key) => {
  try {
    const value = getAppConfig(key);
    return { success: true, value };
  } catch (error) {
    console.error('获取配置失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('config:set', async (event, key, value) => {
  try {
    setAppConfig(key, value);
    return { success: true };
  } catch (error) {
    console.error('设置配置失败:', error);
    return { success: false, error: (error as Error).message };
  }
});

// IPC 处理 - 打开文件夹
ipcMain.handle('shell:openPath', async (event, path) => {
  const { shell } = require('electron');
  try {
    await shell.openPath(path);
    return { success: true };
  } catch (error) {
    console.error('打开文件夹失败:', error);
    return { success: false, error: (error as Error).message };
  }
});
