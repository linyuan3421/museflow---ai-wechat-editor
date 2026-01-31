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

// 使用全局单例模式，避免模块重载导致重复初始化
// 浏览器环境使用 window
function getDBStore() {
  if (!(window as any).__museflowKnowledgeDB) {
    (window as any).__museflowKnowledgeDB = {
      db: null,
      isInitialized: false
    };
  }
  return (window as any).__museflowKnowledgeDB;
}

/**
 * 初始化知识库数据库
 */
export async function initKnowledgeDB(): Promise<void> {
  const store = getDBStore();

  // 双重检查：使用全局实例检查
  if (store.isInitialized || store.db !== null) {
    return;
  }

  try {
    // 导入知识库数据
    const knowledgeBaseModule = await import('../data/knowledge');
    const KNOWLEDGE_BASE = (knowledgeBaseModule.default || knowledgeBaseModule) as unknown as KnowledgeEntry[];

    // 创建 Orama 数据库
    // 注意：data 字段不加入 schema（不会索引但仍然存储和返回）
    const db = await create({
      schema: {
        id: 'string',
        type: 'string',
        keywords: 'string',
        name: 'string',
        description: 'string'
        // data 字段不在 schema 中，但仍会随搜索结果返回
      }
    });

    // 索引所有知识条目
    for (const entry of KNOWLEDGE_BASE) {
      try {
        await insert(db, {
          id: entry.id,
          type: entry.type,
          keywords: entry.keywords.join(' '), // 用空格连接关键词
          name: entry.name,
          description: entry.description,
          data: entry.data // data 字段会完整存储并返回
        });
      } catch (insertError: any) {
        // 忽略已存在的文档错误（并发初始化保护）
        if (!insertError.message?.includes('already exists')) {
          throw insertError;
        }
      }
    }

    // 在所有插入成功后再赋值到全局存储
    store.db = db;
    store.isInitialized = true;
    console.log(`[KnowledgeService] 成功初始化知识库，已索引 ${KNOWLEDGE_BASE.length} 条知识`);
  } catch (error: unknown) {
    console.error('[KnowledgeService] 初始化失败:', error);
    throw error;
  }
}

/**
 * 使用 LLM 智能重写查询
 *
 * @param query 用户原始查询
 * @param config AI 配置（用于调用 LLM）
 * @returns AI 扩展后的查询字符串
 */
async function rewriteQueryWithLLM(query: string, config?: any): Promise<string> {
  // 如果没有提供 AI 配置，返回原查询（降级方案）
  if (!config || !config.apiKey) {
    console.log('[Query Rewrite] 未提供 AI 配置，使用原查询');
    return query;
  }

  try {
    const systemPrompt = `你是一个搜索引擎查询优化专家。你的任务是将用户的简短查询扩展为更丰富的搜索关键词。

**重要规则**：
1. 只生成 5-8 个最相关的关键词（不要太多）
2. 只输出关键词，用空格分隔，不要其他任何文字
3. 不要输出"英文翻译"、"关键词"、"扩展"等标注
4. 不要使用管道符或其他标点符号
5. 包括同义词和相关概念的中英文

**示例**：
输入: 日照金山
输出: 日照金山 golden hour 日出 日落 雪山 alpine glow

输入: 莫兰迪
输出: 莫兰迪 morandi 灰粉 低饱和 muted 高级灰

输入: 森林咖啡馆
输出: 森林 forest 绿色 nature cafe coffee 咖啡馆

现在，请优化以下查询（只输出关键词）：`;

    const response = await fetch(`${config.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API Error: ${response.status}`);
    }

    const data = await response.json();
    const rewrittenQuery = data.choices?.[0]?.message?.content?.trim() || query;

    // 清理 AI 返回的内容（移除多余字符和标注）
    const cleanedQuery = rewrittenQuery
      .replace(/[，、。；：|\\\-]/g, ' ')  // 标点和管道符替换为空格
      .replace(/英文翻译|翻译|keywords|关键词|扩展|输出|输入/gi, '')  // 移除标注
      .replace(/\s+/g, ' ')  // 多个空格压缩为一个
      .split(' ')  // 分割成数组
      .filter((word: string) => word.length > 0)  // 移除空词
      .slice(0, 15)  // 限制最多15个关键词
      .join(' ')
      .trim();

    console.log(`[LLM Query Rewrite] "${query}" → "${cleanedQuery}"`);
    return cleanedQuery;

  } catch (error) {
    console.warn('[Query Rewrite] LLM 重写失败，使用原查询:', error);
    return query;
  }
}

/**
 * 语义检索：根据用户查询返回相关知识
 *
 * @param query 用户的查询文本（如"莫兰迪色系的咖啡馆"）
 * @param topK 返回前 K 个最相关的结果
 * @param config AI 配置（可选，用于 LLM 查询重写）
 * @returns 检索结果列表
 */
export async function retrieveKnowledge(
  query: string,
  topK: number = 5,
  config?: any
): Promise<RetrievalResult[]> {
  const store = getDBStore();

  // 确保数据库已初始化
  if (!store.isInitialized || !store.db) {
    await initKnowledgeDB();
  }

  try {
    // LLM 智能查询重写（如果提供 AI 配置）
    const expandedQuery = await rewriteQueryWithLLM(query, config);

    // 使用 Orama 进行全文搜索
    const searchResults = await search(store.db, {
      term: expandedQuery,
      limit: topK,
      properties: ['keywords', 'name', 'description'],
      threshold: 0.05, // 降低阈值以提高召回率（原 0.1 → 0.05）
      exact: false  // 允许模糊匹配
    });

    // 调试：输出原始搜索结果
    console.log(`[Orama Search] 查询: "${expandedQuery}"`);
    console.log(`[Orama Search] 原始结果数量: ${searchResults.hits.length}`);
    if (searchResults.hits.length > 0) {
      console.log(`[Orama Search] 第一条结果:`, searchResults.hits[0]);
    }

    // 转换为统一格式（过滤掉 result 为 undefined 的项）
    const validHits = searchResults.hits.filter((hit: any) => hit && hit.result);
    console.log(`[Orama Search] 有效结果数量: ${validHits.length}/${searchResults.hits.length}`);
    
    const results: RetrievalResult[] = validHits.map((hit: any) => ({
      id: hit.id,
      type: hit.result.type,
      name: hit.result.name,
      description: hit.result.description,
      data: hit.result.data,
      score: hit.score
    }));

    console.log(`[KnowledgeService] 检索 "${expandedQuery}" 找到 ${results.length} 条相关知识`);
    console.log(`[KnowledgeService] 检索结果:`, results.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      score: r.score
    })));

    // 输出详细的知识内容（便于调试）
    if (results.length > 0) {
      console.group(`[RAG 知识详情] "${query}"`);
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name} (${result.type}) - 相似度: ${result.score.toFixed(3)}`);
        console.log(`   描述: ${result.description}`);
        console.log(`   数据:`, result.data);
      });
      console.groupEnd();
    }

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
  userQuery: string,
  config?: any
): Promise<string> {
  // 1. 检索相关知识（传递 config 支持 LLM 重写）
  const knowledge = await retrieveKnowledge(userQuery, 3, config);

  // 2. 如果没有相关知识，返回原提示词
  if (knowledge.length === 0) {
    console.log('[KnowledgeService] 未找到相关知识，使用基础提示词');
    return baseSystemPrompt;
  }

  // 输出检索摘要到控制台
  console.log(`[RAG 检索摘要] "${userQuery}" → 找到 ${knowledge.length} 条知识:`);
  console.table(knowledge.map(k => ({
    名称: k.name,
    类型: k.type,
    相似度: k.score.toFixed(3)
  })));

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
  const store = getDBStore();

  if (!store.isInitialized || !store.db) {
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
