/**
 * Gemini Pro API 集成服务
 * 处理小说转剧本、分镜拆解、节奏规划的 AI 功能
 */

// Gemini Pro API Key 配置
const GEMINI_API_KEY = '';
// 从官方 Quickstart 文档获取的准确 URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';
// Gemini Image Generation API URL
const GEMINI_IMAGE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

// 提示词模板
export const PROMPTS = {
  // 第一步：小说转剧本
  novelToScript: `【角色】你是一位资深编剧，精通网络文学改编和短剧创作。

【任务】将以下小说改写为第一人称的短剧剧本，采用"人物自述 OS + 角色台词"的形式。

【原小说内容】
{novelContent}

【改写要求】
1. 保留原小说的核心情节和人物性格
2. 改写为第一人称视角（主角的内心独白 + 台词）
3. 格式：[人物名]OS：内心独白 → [人物名]：台词
4. 字数控制在原小说的 50-70%
5. 保留关键的情感节点和冲突点
6. 适合短剧制作（每集 60 秒左右）

【输出格式】
直接输出改写后的剧本，不需要其他说明。`,

  // 第二步：分镜拆解
  storyboardDecomposition: `【角色】你是一位资深影视分镜师，精通罗伯特·麦基的镜头拆解理论，擅长构建情绪节奏。

【任务】将小说剧本按**独立动作单元**拆解为分镜头方案。

【剧本原文】
{scriptContent}

【分镜六要素】每个镜头聚焦单一动作，禁止多动作堆砌：

1. **时间**：[清晨/午后/深夜/具体时分+环境光效]
2. **地点**：[场景名称+具体方位+空间特征]
3. **镜头设计**：[景别：特写/近景/中景/全景] + [运镜：固定/推轨/摇移/手持]
4. **人物行为**：**单一动词指令**，只描述[谁+做了什么/说了什么关键台词]
5. **画面结果**：动作的即时后果，提供[视觉证据/氛围变化]
6. **观众情绪**：[情绪类型]（[强度：↑↑↑/↑↑/↑/→/↓] + [落点：悬置/释放/反转]）

【拆解原则】（必须遵守）
// ❌ 错误：多动作堆砌
"杰克走进餐厅，把提包扔在地上，看到纸条，揉成一团..."

// ✅ 正确：独立动作单元
- 镜头1：杰克推门走进，静止环顾空房间 → 确立环境压迫感
- 镜头2：他举起提包过肩，猛砸向古董椅 → 特写冲击力
- 镜头3：他动作骤停，听见异响 → 中景停顿，悬念铺垫
- 镜头4：特写纸条写着他的名字 → 视觉焦点，信息揭露
- 镜头5：杰克回身，手指不安地拧弄婚戒 → 微表情泄露内心

【输出格式】
镜头[编号]·[景别] | [时间]·[地点] | 动作：[人物]+[单一行为] → 结果：[画面后果] | 情绪：[类型]（[强度/落点]）

┌─ 示例 ──────────────────────────────────┐
│ 镜头047·全景          │ 深夜·废弃码头仓库（潮湿/积水泥泞） │
│ 动作：陈峥撬开保险箱门，铁锈簌簌落下        → 结果：门弹开，里面空无一物 │
│ 情绪：好奇感↑（悬置）                       │
├─────────────────────────────────────────┤
│ 镜头048·特写          │ 同时间·箱内底部                   │
│ 动作：陈峥伸手摸出一枚冰冷子弹，举到眼前    → 结果：底座警号"001984"在电筒光下刺目 │
│ 情绪：震撼感↑↑↑（反转引爆）                 │
├─────────────────────────────────────────┤
│ 镜头049·近景+推轨     │ 接immediately·他颤抖的面部        │
│ 动作：陈峥瞳孔骤缩，雨水混冷汗下颌滴落      → 结果：手机铃声尖锐响起（画外音） │
│ 情绪：压迫感↑↑（悬置叠加）                  │
└─────────────────────────────────────────┘

【特殊指示】
- **动作洁癖**：每个镜头只允许[1个主动词]，禁止"走进并坐下"这类连动
- **情绪节拍**：每[3]个镜头必须包含[↑/↓/→]变化，避免情绪平坦
- **标点规范**：动作与结果用[→]分隔，情绪强度用[↑↑↑]类箭头
- **首次登场**：人物首次出现标注[姓名+年龄+身份+标志性特征]
- **重点强调**：需在景别后标注[+慢镜/+特写延长/+声音前置]

请生成[前30个]镜头，确保每个画面可独立绘制分镜图。`,

  // 第三步：节奏规划
  rhythmPlanning: `【角色】你是一位资深短剧导演，精通爽文节奏和观众心理。

【任务】根据爽文套路规划分镜镜头的展示顺序，并标注每个镜头的时长。

【已生成的分镜镜头】
{storyboards}

【爽文套路】
反派嘲讽/打压主角（冲突出现）
→ 主角心理活动（比如穿书/系统等金手指的出现）
→ 主角打脸开始（一般是言语对峙或者肢体冲突等）
→ 对手反扑（一般还有炮灰的画外音补充）
→ 主角的终极碾压

【规划要求】
1. 为前 8 集分别规划分镜镜头的展示顺序
2. 每集时长约 60 秒，根据镜头内容分配时长
3. 标注选择哪些镜头、具体的镜头时长
4. 遵循爽文套路的节奏，确保观众的情绪起伏
5. 每集应有明确的开始、冲突、高潮和结尾

【输出格式】
第一集：
- 选择镜头：[镜头编号列表]
- 总时长：60 秒
- 节奏规划：
  * 开场（0-10秒）：[镜头编号] - [描述]
  * 冲突（10-35秒）：[镜头编号] - [描述]
  * 高潮（35-55秒）：[镜头编号] - [描述]
  * 结尾（55-60秒）：[镜头编号] - [描述]

请为前 8 集生成完整的节奏规划。`,
};

// Gemini API 配置已在顶部设置

interface SafetySetting {
  category: string;
  threshold: string;
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  safetySettings?: SafetySetting[];
  generationConfig?: {
      responseModalities?: string[];
      imageConfig?: {
          aspectRatio?: string;
          imageSize?: string;
      }
  }
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
        inlineData?: {
            mimeType: string;
            data: string; // Base64
        }
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

/**
 * 调用 Gemini API (支持文本和图片生成)
 */
async function callGeminiAPI(prompt: string, isImageGeneration = false): Promise<string> {
  if (!GEMINI_API_KEY || !GEMINI_API_URL) {
    throw new Error("Gemini API 配置缺失");
  }

  const endpoint = isImageGeneration ? GEMINI_IMAGE_API_URL : GEMINI_API_URL;
  
  const request: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  if (isImageGeneration) {
      request.generationConfig = {
          responseModalities: ["IMAGE"],
          imageConfig: {
              aspectRatio: "16:9",
              imageSize: "2K"
          }
      };
  }

  try {
    const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
         const errorJson = JSON.parse(errorText);
         console.error("Gemini API Error Detail:", errorJson);
         throw new Error(`API 请求失败: ${response.status} ${response.statusText} - ${errorJson.error?.message || errorText}`);
      } catch (e) {
         throw new Error(`API 请求失败: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      console.error("API 返回数据无 candidates:", data);
      const feedback = data.promptFeedback ? `(BlockReason: ${data.promptFeedback.blockReason})` : "";
      throw new Error(`API 返回数据为空，可能是被安全策略拦截 ${feedback}`);
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason && candidate.finishReason !== "STOP") {
       console.warn("Gemini 生成非正常结束:", candidate.finishReason);
    }

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
       console.error("API 返回 Candidate 但无内容:", candidate);
       throw new Error("API 返回 Candidate 但无内容");
    }

    // 处理图片返回
    if (isImageGeneration) {
        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            // 返回 base64 数据 URI
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        throw new Error("API 未返回图片数据");
    }

    const text = candidate.content.parts[0].text;
    return text || "";
  } catch (error) {
    console.error("Gemini API 错误:", error);
    throw error;
  }
}

/**
 * 小说转剧本
 */
export async function convertNovelToScript(novelContent: string): Promise<string> {
  const prompt = PROMPTS.novelToScript.replace("{novelContent}", novelContent);
  return callGeminiAPI(prompt);
}

/**
 * 分镜拆解
 */
export async function decomposeToStoryboards(scriptContent: string): Promise<string> {
  const prompt = PROMPTS.storyboardDecomposition.replace(
    "{scriptContent}",
    scriptContent
  );
  return callGeminiAPI(prompt);
}

/**
 * 节奏规划
 */
export async function planRhythm(storyboards: string): Promise<string> {
  const prompt = PROMPTS.rhythmPlanning.replace("{storyboards}", storyboards);
  return callGeminiAPI(prompt);
}

/**
 * 生成分镜图片
 */
export async function generateStoryboardImage(storyboard: any): Promise<string> {
  const prompt = `Visualization of a movie storyboard:
Shot: ${storyboard.shotType}
Location: ${storyboard.location}
Action: ${storyboard.action}
Visual Result: ${storyboard.result}
Mood: ${storyboard.emotion}

Style: High quality, cinematic, detailed noir comic style, black and white sketch but with atmosphere.`;

  return callGeminiAPI(prompt, true);
}

/**
 * 解析分镜文本为结构化数据
 */
/**
 * 解析分镜文本为结构化数据 (支持多行格式)
 */
export function parseStoryboards(text: string) {
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line);
  const storyboards = [];
  
  let currentStoryboard: any = {};
  
  for (const rawLine of lines) {
    // 移除可能的 Markdown 标记 (**, ##, - )
    const line = rawLine.replace(/[\*\#]/g, "").trim();

    // 匹配第一行: 镜头001·全景 | 午后·渝州城酒楼
    // 宽松匹配: 只要包含 "镜头" 和 数字
    const shotMatch = line.match(/镜头\s*(\d+)/);
    
    // 判定为新镜头的条件：匹配到"镜头+数字"，且看起来像是一个标题行(包含分隔符或长度适中)
    // 或者即使无法完全确认，只要出现了 "镜头XXX"，我们就认为可能是新的一开始
    if (shotMatch) {
       // 如果已有还在处理的，先归档
       // 只有当旧的有实质内容(action)时才归档，避免因为误判标题导致空对象加入
       if (currentStoryboard.id && (currentStoryboard.action || currentStoryboard.location)) {
           storyboards.push(currentStoryboard);
           currentStoryboard = {}; // 重置
       } else if (currentStoryboard.id && !currentStoryboard.action) {
           // 这是一个边缘情况：如果上一个只有ID没有内容，可能是解析错误，覆盖它而不是push
           // 但通常不需要特殊处理，直接覆盖currentStoryboard属性即可，因为下面会重置
       }
       
       // 如果 currentStoryboard 已经被置空（或刚开始），初始化它
       if (!currentStoryboard.id) {
            currentStoryboard = { duration: 2 };
            currentStoryboard.number = parseInt(shotMatch[1]);
            currentStoryboard.id = `sb-${shotMatch[1]}`;
       }
       
       // 尝试解析这一行剩下的信息
       // 典型格式: 镜头001·全景 | 时间·地点
       // 或者: 镜头 01: 全景, 地点...
       
       // 移除 "镜头001" 部分，分析剩余
       let rest = line.substring(line.indexOf(shotMatch[0]) + shotMatch[0].length);
       
       // 移除可能的分隔符
       rest = rest.replace(/^[ ·:：\.|]+/, ""); 
       
       // 尝试按 | 分割
       const parts = rest.split(/\|/).map(p => p.trim());
       
       if (parts.length > 0 && parts[0]) {
           // 假设第一部分是 景别 (如果有点号分割，则是 景别·其他)
           // 很多时候格式是: 镜头001·全景
           // 所以 rest 可能是 "全景 | 午后·地点"
           // 或者是 "全景" (如果原句是 镜头001·全景)
           currentStoryboard.shotType = parts[0].split(/[·\s]/)[0]; // 取第一个词
       }
       
       if (parts.length > 1) {
           // 第二部分通常是 时间·地点
           const timeLoc = parts[1];
           const tlParts = timeLoc.split(/[·\s]/).filter(s => s);
           if (tlParts.length >= 2) {
               currentStoryboard.time = tlParts[0];
               currentStoryboard.location = tlParts.slice(1).join(" ");
           } else if (tlParts.length === 1) {
               currentStoryboard.location = tlParts[0];
               currentStoryboard.time = "未知";
           }
       }
       
       continue; // 处理完标题行，跳过后续匹配
    }
    
    // 匹配动作行
    if (line.includes("动作") || line.includes("Action")) {
        // 清理前缀
        let content = line.replace(/^(?:[-*] )?(?:动作|Action)[:：]\s*/i, "");
        
        // 检查是否有 "结果" 或 "->"
        const arrowIndex = content.indexOf("→");
        const resIndex = content.indexOf("结果：");
        
        if (arrowIndex > -1) {
            currentStoryboard.action = content.substring(0, arrowIndex).trim();
            currentStoryboard.result = content.substring(arrowIndex + 1).replace(/^结果[:：]?/, "").trim();
        } else if (resIndex > -1) {
             currentStoryboard.action = content.substring(0, resIndex).trim();
             currentStoryboard.result = content.substring(resIndex + 3).trim();
        } else {
            currentStoryboard.action = content;
            currentStoryboard.result = "";
        }
    }
    
    // 匹配情绪行
    if (line.includes("情绪") || line.includes("Mood")) {
         currentStoryboard.emotion = line.replace(/^(?:[-*] )?(?:情绪|Mood)[:：]\s*/i, "").trim();
    }
    
    // 补充：假如没有明确的"动作："前缀，但我们在一个分镜块里，且当前行不是标题
    // 这可能是多行描述？ 暂时忽略，保持简单
  }
  
  // 循环结束，归档最后一个
  if (currentStoryboard.id && (currentStoryboard.action || currentStoryboard.location)) {
      storyboards.push(currentStoryboard);
  }

  return storyboards;
}
