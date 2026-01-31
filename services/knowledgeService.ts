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
 * 查询扩展：丰富用户查询词，提升检索召回率
 *
 * @param query 用户原始查询
 * @returns 扩展后的查询字符串
 */
function expandQuery(query: string): string {
  const expansions: string[] = [query];

  // 1. 颜色相关扩展
  const colorExpansions: Record<string, string[]> = {
    '日照金山': ['golden hour', 'alpine glow', 'sunrise', '日出', '朝霞', 'sunset', 'dawn'],
    '日出': ['sunrise', 'dawn', 'morning', '清晨', '朝霞', 'golden hour'],
    '日落': ['sunset', 'dusk', 'evening', '黄昏', '晚霞', 'golden hour'],
    '莫兰迪': ['morandi', 'muted', '低饱和', 'gray', '高级灰', 'oil painting'],
    '赛博朋克': ['cyberpunk', 'neon', 'futuristic', 'tech', '霓虹', '科幻'],
    '森林': ['forest', 'green', 'nature', 'woods', '自然', '绿'],
    '雪山': ['snow mountain', 'alpine', '雪景', 'winter'],
    '咖啡': ['coffee', 'cafe', 'brown', 'warm', ' warmth'],
    '海洋': ['ocean', 'sea', 'blue', 'marine', 'marine'],
    '复古': ['vintage', 'retro', 'nostalgic', 'classic', '经典'],
    '极简': ['minimal', 'minimalism', 'simple', 'clean', '简约'],
  };

  // 2. 检查是否包含扩展词
  for (const [key, synonyms] of Object.entries(colorExpansions)) {
    if (query.includes(key)) {
      expansions.push(...synonyms);
      console.log(`[Query Expansion] "${key}" → 扩展: ${synonyms.join(', ')}`);
    }
  }

  // 3. 通用中英互译扩展
  const commonTranslations: Record<string, string> = {
    '温暖': 'warm',
    '冷': 'cold',
    '明亮': 'bright',
    '暗': 'dark',
    '柔和': 'soft',
    '强烈': 'bold',
    '优雅': 'elegant',
    '现代': 'modern',
  };

  for (const [cn, en] of Object.entries(commonTranslations)) {
    if (query.includes(cn)) {
      expansions.push(en);
    }
  }

  // 4. 去重并返回扩展查询（用空格连接）
  const expandedQuery = [...new Set(expansions)].join(' ');
  console.log(`[Query Expansion] "${query}" → "${expandedQuery}"`);

  return expandedQuery;
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
  const store = getDBStore();

  // 确保数据库已初始化
  if (!store.isInitialized || !store.db) {
    await initKnowledgeDB();
  }

  try {
    // 查询扩展：丰富搜索词
    const expandedQuery = expandQuery(query);

    // 使用 Orama 进行语义搜索
    const searchResults = await search(store.db, {
      term: expandedQuery,
      limit: topK,
      properties: ['keywords', 'name', 'description'],
      threshold: 0.05 // 降低阈值以提高召回率（原 0.1 → 0.05）
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
  userQuery: string
): Promise<string> {
  // 1. 检索相关知识
  const knowledge = await retrieveKnowledge(userQuery, 3);

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
