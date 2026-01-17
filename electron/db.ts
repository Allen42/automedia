import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

let db: Database.Database | null = null;

// 获取数据库路径
function getDatabasePath(): string {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'projects.db');
  
  // 确保目录存在
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }
  
  return dbPath;
}

// 初始化数据库
export function initializeDatabase() {
  try {
    const dbPath = getDatabasePath();
    db = new Database(dbPath);
    
    // 启用外键约束
    db.pragma('foreign_keys = ON');
    
    // 创建表
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        novelContent TEXT,
        scriptContent TEXT,
        storyboardsText TEXT,
        storyboards TEXT,
        rhythmPlan TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS storyboards (
        id TEXT PRIMARY KEY,
        projectId TEXT NOT NULL,
        number INTEGER NOT NULL,
        time TEXT,
        location TEXT,
        shotType TEXT,
        action TEXT,
        result TEXT,
        emotion TEXT,
        duration INTEGER DEFAULT 5,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);
    
    console.log('数据库初始化成功:', dbPath);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 保存项目
export function saveProject(projectData: any) {
  if (!db) throw new Error('数据库未初始化');

  try {
    const {
      id,
      name,
      novelContent,
      scriptContent,
      storyboardsText,
      storyboards,
      rhythmPlan,
    } = projectData;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO projects (
        id, name, novelContent, scriptContent, storyboardsText, storyboards, rhythmPlan, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(
      id,
      name,
      novelContent || null,
      scriptContent || null,
      storyboardsText || null,
      JSON.stringify(storyboards || []),
      rhythmPlan || null
    );

    console.log('项目保存成功:', id);
  } catch (error) {
    console.error('保存项目失败:', error);
    throw error;
  }
}

// 加载项目
export function loadProject(projectId: string) {
  if (!db) throw new Error('数据库未初始化');

  try {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = stmt.get(projectId) as any;

    if (project) {
      project.storyboards = JSON.parse(project.storyboards || '[]');
    }

    return project;
  } catch (error) {
    console.error('加载项目失败:', error);
    throw error;
  }
}

// 获取所有项目
export function getAllProjects() {
  if (!db) throw new Error('数据库未初始化');

  try {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY updatedAt DESC');
    const projects = stmt.all() as any[];

    return projects.map((project) => ({
      ...project,
      storyboards: JSON.parse(project.storyboards || '[]'),
    }));
  } catch (error) {
    console.error('获取项目列表失败:', error);
    throw error;
  }
}

// 删除项目
export function deleteProject(projectId: string) {
  if (!db) throw new Error('数据库未初始化');

  try {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(projectId);
    console.log('项目删除成功:', projectId);
  } catch (error) {
    console.error('删除项目失败:', error);
    throw error;
  }
}

// 获取配置
export function getConfig(key: string): string | null {
  if (!db) throw new Error('数据库未初始化');

  try {
    const stmt = db.prepare('SELECT value FROM config WHERE key = ?');
    const result = stmt.get(key) as any;
    return result ? result.value : null;
  } catch (error) {
    console.error('获取配置失败:', error);
    throw error;
  }
}

// 设置配置
export function setConfig(key: string, value: string) {
  if (!db) throw new Error('数据库未初始化');

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO config (key, value, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(key, value);
    console.log('配置保存成功:', key);
  } catch (error) {
    console.error('保存配置失败:', error);
    throw error;
  }
}

// 关闭数据库
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('数据库已关闭');
  }
}
