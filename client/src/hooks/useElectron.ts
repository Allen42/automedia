import { useCallback } from 'react';

/**
 * Electron IPC 通信 Hook
 */
export function useElectron() {
  const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;

  // 项目管理
  const saveProject = useCallback(
    async (projectData: any) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.project.save(projectData);
    },
    [isElectron]
  );

  const loadProject = useCallback(
    async (projectId: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.project.load(projectId);
    },
    [isElectron]
  );

  const getAllProjects = useCallback(async () => {
    if (!isElectron) throw new Error('Not in Electron environment');
    return (window as any).electronAPI.project.getAll();
  }, [isElectron]);

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.project.delete(projectId);
    },
    [isElectron]
  );

  // 文件操作
  const selectDirectory = useCallback(async () => {
    if (!isElectron) throw new Error('Not in Electron environment');
    return (window as any).electronAPI.file.selectDirectory();
  }, [isElectron]);

  const saveFile = useCallback(
    async (filename: string, content: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.file.saveFile(filename, content);
    },
    [isElectron]
  );

  // 视频导出
  const exportVideo = useCallback(
    async (storyboards: any, outputPath: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.video.export(storyboards, outputPath);
    },
    [isElectron]
  );

  // 配置管理
  const getConfig = useCallback(
    async (key: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.config.get(key);
    },
    [isElectron]
  );

  const setConfig = useCallback(
    async (key: string, value: any) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.config.set(key, value);
    },
    [isElectron]
  );

  // 文件系统
  const openPath = useCallback(
    async (path: string) => {
      if (!isElectron) throw new Error('Not in Electron environment');
      return (window as any).electronAPI.shell.openPath(path);
    },
    [isElectron]
  );

  return {
    isElectron,
    project: {
      save: saveProject,
      load: loadProject,
      getAll: getAllProjects,
      delete: deleteProject,
    },
    file: {
      selectDirectory,
      saveFile,
    },
    video: {
      export: exportVideo,
    },
    config: {
      get: getConfig,
      set: setConfig,
    },
    shell: {
      openPath,
    },
  };
}
