import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 IPC 接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 项目管理
  project: {
    save: (projectData: any) => ipcRenderer.invoke('project:save', projectData),
    load: (projectId: string) => ipcRenderer.invoke('project:load', projectId),
    getAll: () => ipcRenderer.invoke('project:getAll'),
    delete: (projectId: string) => ipcRenderer.invoke('project:delete', projectId),
  },

  // 文件操作
  file: {
    selectDirectory: () => ipcRenderer.invoke('file:selectDirectory'),
    saveFile: (filename: string, content: string) =>
      ipcRenderer.invoke('file:saveFile', filename, content),
  },

  // 视频导出
  video: {
    export: (storyboards: any, outputPath: string) =>
      ipcRenderer.invoke('video:export', storyboards, outputPath),
  },

  // 配置管理
  config: {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
  },

  // 文件系统
  shell: {
    openPath: (path: string) => ipcRenderer.invoke('shell:openPath', path),
  },
});

// 声明全局类型
declare global {
  interface Window {
    electronAPI: {
      project: {
        save: (projectData: any) => Promise<{ success: boolean; error?: string }>;
        load: (projectId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
        getAll: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
        delete: (projectId: string) => Promise<{ success: boolean; error?: string }>;
      };
      file: {
        selectDirectory: () => Promise<string | null>;
        saveFile: (filename: string, content: string) => Promise<string | null>;
      };
      video: {
        export: (storyboards: any, outputPath: string) => Promise<{ success: boolean; path?: string; error?: string }>;
      };
      config: {
        get: (key: string) => Promise<{ success: boolean; value?: any; error?: string }>;
        set: (key: string, value: any) => Promise<{ success: boolean; error?: string }>;
      };
      shell: {
        openPath: (path: string) => Promise<{ success: boolean; error?: string }>;
      };
    };
  }
}
