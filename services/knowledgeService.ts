/**
 * RAG (Retrieval-Augmented Generation) Knowledge Service
 * 
 * 使用 Orama.js 实现浏览器端的语义检索
 * 将相关知识动态注入到 AI 提示词中
 */

import { create, insert, search } from '@orama/orama';

// 知识库条目接口
export interface KnowledgeEntry {
  id: string;
  type: string;
  keywords: string[];
  name: string;
  description: string;
  data: Record<string, any>;
}

// 检索结果接口
export interface RetrievalResult {
  id: string;
  type: string;
  name: string;
  description: string;
  data: Record<string, any>;
  score: number;
}

// Orama 数据库实例
let knowledgeDB: any = null;
let isInitialized = false;

/**
 * 初始化知识库数据库
 */
export async function initKnowledgeDB(): Promise<void> {
  if (isInitialized) {
    return;
  }

  try {
    // 导入知识库数据
    const knowledgeBaseModule = await import('../data/knowledge');
    const KNOWLEDGE_BASE = (knowledgeBaseModule.default || knowledgeBaseModule) as unknown as KnowledgeEntry[];

    // 创建 Orama 数据库
    // 注意：由于 Orama 的类型定义问题，这里使用 any 绕过
    knowledgeDB = await create({
      schema: {
        id: 'string',
        type: 'string',
        keywords: 'string',
        name: 'string',
        description: 'string',
        data: 'any'
      }
    } as any); // 使用 any 来兼容 Orama 的类型要求

    // 索引所有知识条目
    for (const entry of KNOWLEDGE_BASE) {
      await insert(knowledgeDB, {
        id: entry.id,
        type: entry.type,
        keywords: entry.keywords.join(' '), // 用空格连接关键词
        name: entry.name,
        description: entry.description,
        data: entry.data as any // 转换为 any 以兼容 Orama
      });
    }

    isInitialized = true;
    console.log(`[KnowledgeService] 成功初始化知识库，已索引 ${KNOWLEDGE_BASE.length} 条知识`);
  } catch (error: unknown) {
    console.error('[KnowledgeService] 初始化失败:', error);
    throw error;
  }
}

/**
 * 语义检索：根据用户查询返回相关知识
 * 
 * @param query 用户的查询文本（如"莫兰迪色系的咖啡馆"）
 * @param topK 返回前 K 个最相关的结果
 * @returns 检索结果列表
 */
export async function retrieveKnowledge(
  query: string,
  topK: number = 5
): Promise<RetrievalResult[]> {
  // 确保数据库已初始化
  if (!isInitialized) {
    await initKnowledgeDB();
  }

  try {
    // 使用 Orama 进行语义搜索
    const searchResults = await search(knowledgeDB, {
      term: query,
      limit: topK,
      properties: ['keywords', 'name', 'description'],
      threshold: 0.1 // 相似度阈值，过滤低相关结果
    });

    // 转换为统一格式
    const results: RetrievalResult[] = searchResults.hits.map((hit: any) => ({
      id: hit.id,
      type: hit.result.type,
      name: hit.result.name,
      description: hit.result.description,
      data: hit.result.data,
      score: hit.score
    }));

    console.log(`[KnowledgeService] 检索 "${query}" 找到 ${results.length} 条相关知识`);
    return results;
  } catch (error) {
    console.error('[KnowledgeService] 检索失败:', error);
    return [];
  }
}

/**
 * 将检索到的知识格式化为 AI 提示词上下文
 * 
 * @param results 检索结果列表
 * @returns 格式化的知识上下文字
 */
export function formatKnowledgeContext(results: RetrievalResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const formatted = results.map((result, index) => `
## 知识 ${index + 1}: ${result.name} (${result.type})

**描述**: ${result.description}

**具体数据**:
\`\`\`json
${JSON.stringify(result.data, null, 2)}
\`\`\`
  `).join('\n\n');

  return formatted;
}

/**
 * 组合知识上下文与系统提示词
 * 
 * @param baseSystemPrompt 基础系统提示词框架
 * @param userQuery 用户查询
 * @returns 增强后的系统提示词
 */
export async function enhancePromptWithKnowledge(
  baseSystemPrompt: string,
  userQuery: string
): Promise<string> {
  // 1. 检索相关知识
  const knowledge = await retrieveKnowledge(userQuery, 3);
  
  // 2. 如果没有相关知识，返回原提示词
  if (knowledge.length === 0) {
    console.log('[KnowledgeService] 未找到相关知识，使用基础提示词');
    return baseSystemPrompt;
  }

  // 3. 格式化知识上下文
  const knowledgeContext = formatKnowledgeContext(knowledge);

  // 4. 组合成增强提示词
  const enhancedPrompt = `${baseSystemPrompt}

---
# RELEVANT KNOWLEDGE FOR: "${userQuery}"

${knowledgeContext}

---

**设计指导**: 基于以上具体知识，结合设计原则，生成主题设计。
确保:
1. 如果提供了具体颜色，必须使用这些颜色值（精确的 hex 值）
2. 如果提供了质感/技法要求，必须应用相应的 CSS 实现
3. 如果提供了场景/情绪，必须体现相应的氛围特征
`;

  return enhancedPrompt;
}

/**
 * 获取知识库统计信息（用于调试）
 */
export async function getKnowledgeStats(): Promise<{
  totalEntries: number;
  types: Record<string, number>;
  sampleEntries: string[];
}> {
  if (!isInitialized) {
    await initKnowledgeDB();
  }

  const knowledgeBaseModule = await import('../data/knowledge');
  const KNOWLEDGE_BASE = (knowledgeBaseModule.default || knowledgeBaseModule) as unknown as KnowledgeEntry[];
  
  const typeCount: Record<string, number> = {};
  KNOWLEDGE_BASE.forEach((entry: any) => {
    typeCount[entry.type] = (typeCount[entry.type] || 0) + 1;
  });

  return {
    totalEntries: KNOWLEDGE_BASE.length,
    types: typeCount,
    sampleEntries: KNOWLEDGE_BASE.slice(0, 5).map((e: any) => e.name)
  };
}
