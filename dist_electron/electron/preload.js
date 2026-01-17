import { contextBridge, ipcRenderer } from 'electron';
// 暴露安全的 IPC 接口
contextBridge.exposeInMainWorld('electronAPI', {
    // 项目管理
    project: {
        save: (projectData) => ipcRenderer.invoke('project:save', projectData),
        load: (projectId) => ipcRenderer.invoke('project:load', projectId),
        getAll: () => ipcRenderer.invoke('project:getAll'),
        delete: (projectId) => ipcRenderer.invoke('project:delete', projectId),
    },
    // 文件操作
    file: {
        selectDirectory: () => ipcRenderer.invoke('file:selectDirectory'),
        saveFile: (filename, content) => ipcRenderer.invoke('file:saveFile', filename, content),
    },
    // 视频导出
    video: {
        export: (storyboards, outputPath) => ipcRenderer.invoke('video:export', storyboards, outputPath),
    },
    // 配置管理
    config: {
        get: (key) => ipcRenderer.invoke('config:get', key),
        set: (key, value) => ipcRenderer.invoke('config:set', key, value),
    },
    // 文件系统
    shell: {
        openPath: (path) => ipcRenderer.invoke('shell:openPath', path),
    },
});
