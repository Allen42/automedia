# Gemini Pro API 集成指南

本指南详细说明如何配置和使用 Gemini Pro API，以及如何自定义提示词模板。

## API 配置

### 获取 API Key

1. 访问 [Google AI Studio](https://aistudio.google.com)
2. 点击"Get API Key"按钮
3. 选择或创建一个 Google Cloud 项目
4. 复制生成的 API Key

### 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
# Gemini Pro API Key
VITE_FRONTEND_FORGE_API_KEY=your-api-key-here

# Gemini Pro API 端点
VITE_FRONTEND_FORGE_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### 验证配置

启动开发服务器后，打开浏览器控制台。如果配置正确，应该不会看到任何 API 相关的错误。

## API 调用流程

### 1. 小说转剧本

**函数**：`convertNovelToScript(novelContent: string)`

**流程**：
1. 接收小说内容作为输入
2. 使用"小说转剧本"提示词模板
3. 调用 Gemini Pro API
4. 返回改写后的第一人称剧本

**示例**：

```typescript
import { convertNovelToScript } from '@/lib/geminiService';

const novelContent = "这是一部长篇小说...";
const script = await convertNovelToScript(novelContent);
console.log(script); // 输出改写后的剧本
```

### 2. 分镜拆解

**函数**：`decomposeToStoryboards(scriptContent: string)`

**流程**：
1. 接收剧本内容作为输入
2. 使用"分镜拆解"提示词模板
3. 调用 Gemini Pro API
4. 返回标准化的分镜方案

**示例**：

```typescript
import { decomposeToStoryboards } from '@/lib/geminiService';

const scriptContent = "改写后的剧本...";
const storyboards = await decomposeToStoryboards(scriptContent);
console.log(storyboards); // 输出分镜方案
```

### 3. 节奏规划

**函数**：`planRhythm(storyboards: string)`

**流程**：
1. 接收分镜文本作为输入
2. 使用"节奏规划"提示词模板
3. 调用 Gemini Pro API
4. 返回前 8 集的节奏规划

**示例**：

```typescript
import { planRhythm } from '@/lib/geminiService';

const storyboardsText = "分镜方案...";
const rhythmPlan = await planRhythm(storyboardsText);
console.log(rhythmPlan); // 输出节奏规划
```

## 提示词模板

### 小说转剧本模板

**位置**：`client/src/lib/geminiService.ts` 中的 `PROMPTS.novelToScript`

**关键要素**：

```
【角色】资深编剧，精通网络文学改编和短剧创作
【任务】将小说改写为第一人称短剧剧本
【格式】人物自述 OS + 角色台词
【要求】
- 保留原小说的核心情节和人物性格
- 改写为第一人称视角
- 字数控制在原小说的 50-70%
- 适合短剧制作（每集 60 秒左右）
```

**自定义方法**：

编辑 `geminiService.ts` 文件中的 `PROMPTS.novelToScript`，修改提示词内容以适应不同的创意需求。

### 分镜拆解模板

**位置**：`client/src/lib/geminiService.ts` 中的 `PROMPTS.storyboardDecomposition`

**关键要素**：

```
【角色】资深影视分镜师，精通罗伯特·麦基的镜头拆解理论
【任务】将剧本按独立动作单元拆解为分镜头方案
【六要素】
1. 时间：清晨/午后/深夜/具体时分+环境光效
2. 地点：场景名称+具体方位+空间特征
3. 镜头设计：景别+运镜
4. 人物行为：单一动词指令
5. 画面结果：动作的即时后果
6. 观众情绪：情绪类型+强度+落点
```

**自定义方法**：

根据不同的影视风格或创意需求，修改分镜六要素的定义和输出格式。

### 节奏规划模板

**位置**：`client/src/lib/geminiService.ts` 中的 `PROMPTS.rhythmPlanning`

**关键要素**：

```
【角色】资深短剧导演，精通爽文节奏和观众心理
【套路】反派嘲讽 → 主角心理活动 → 打脸开始 → 对手反扑 → 终极碾压
【要求】
- 为前 8 集分别规划分镜镜头的展示顺序
- 每集时长约 60 秒
- 遵循爽文套路的节奏
- 确保观众的情绪起伏
```

**自定义方法**：

根据不同的故事类型或观众喜好，修改节奏套路和规划要求。

## 错误处理

### API 错误类型

| 错误类型 | 原因 | 解决方案 |
|---------|------|---------|
| 401 Unauthorized | API Key 无效或过期 | 检查 API Key 是否正确，重新生成 |
| 429 Too Many Requests | API 请求过于频繁 | 等待一段时间后重试 |
| 500 Internal Server Error | 服务器错误 | 联系 Google 支持 |
| Network Error | 网络连接问题 | 检查网络连接 |

### 错误处理示例

```typescript
import { convertNovelToScript } from '@/lib/geminiService';

try {
  const script = await convertNovelToScript(novelContent);
  console.log(script);
} catch (error) {
  if (error instanceof Error) {
    console.error('API 错误:', error.message);
    // 处理错误，显示用户提示
  }
}
```

## 性能优化

### 请求优化

- **批量处理**：对于大型项目，考虑分批调用 API 而不是一次性处理
- **缓存结果**：缓存 API 响应，避免重复请求相同的内容
- **异步处理**：使用异步操作，不阻塞 UI 线程

### 响应优化

- **流式响应**：对于长文本，考虑使用流式 API 以改进用户体验
- **增量更新**：逐步更新 UI，而不是等待完整响应

## 成本管理

### API 配额

Google AI Studio 提供免费的 API 配额。检查配额使用情况：

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 选择你的项目
3. 导航到"API & Services" > "Quotas"
4. 查看 Generative Language API 的配额使用

### 成本优化

- 使用较短的提示词
- 减少 API 调用频率
- 缓存常用的结果

## 高级用法

### 自定义 API 端点

如果需要使用不同的 API 端点或模型，修改 `geminiService.ts` 中的 API 配置：

```typescript
const GEMINI_API_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
```

### 扩展 API 功能

添加新的 API 调用函数：

```typescript
export async function customFunction(input: string): Promise<string> {
  const prompt = `自定义提示词 ${input}`;
  return callGeminiAPI(prompt);
}
```

### 集成其他 AI 模型

如需集成其他 AI 模型（如 Claude、GPT-4），修改 `callGeminiAPI` 函数以支持不同的 API 格式。

## 故障排除

### API 请求失败

**症状**：点击"转换为剧本"时出现错误

**调试步骤**：
1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签中的 API 请求
3. 检查响应状态码和错误信息
4. 验证 API Key 和端点配置

### 生成内容质量不佳

**症状**：生成的剧本、分镜或节奏规划质量不理想

**改进方法**：
1. 调整提示词模板
2. 提供更高质量的输入内容
3. 尝试使用不同的提示词参数

### 性能问题

**症状**：API 请求响应缓慢

**优化方法**：
1. 检查网络连接
2. 减少输入内容的长度
3. 使用缓存减少重复请求

## 最佳实践

### 提示词设计

- **清晰的角色定义**：明确指定 AI 的角色和专业背景
- **具体的任务描述**：详细说明需要完成的任务
- **明确的输出格式**：指定期望的输出格式和结构
- **示例和参考**：提供示例以帮助 AI 理解需求

### API 使用

- **错误处理**：始终实现完整的错误处理和用户提示
- **超时管理**：设置合理的请求超时时间
- **日志记录**：记录 API 调用以便调试和优化
- **速率限制**：实现速率限制以避免超过 API 配额

### 用户体验

- **加载指示**：在 API 请求期间显示加载动画
- **进度反馈**：对于长时间运行的操作，提供进度更新
- **错误消息**：显示清晰的错误消息和恢复建议
- **重试机制**：实现自动重试机制处理临时错误

## 参考资源

- [Google AI Studio](https://aistudio.google.com)
- [Gemini Pro API 文档](https://ai.google.dev/tutorials/python_quickstart)
- [提示词工程最佳实践](https://ai.google.dev/tips)

---

**最后更新**：2024-01-16  
**版本**：1.0.0
