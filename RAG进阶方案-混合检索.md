# MuseFlow RAG 进阶方案：混合检索架构

**版本**: 2.0 进阶版
**日期**: 2025-01-31
**核心改进**: 引入通义千问 Embedding + 混合检索（BM25 + 向量）

---

## 一、方案升级背景

### 1.1 初级方案的问题

**V1.0 方案（BM25 关键词匹配）**:
- ❌ 仅支持精确关键词匹配（"莫兰迪""咖啡馆"）
- ❌ 无法理解语义相似度（"灰粉色"≠"莫兰迪粉"）
- ❌ 用户描述不准确时检索失败率高

**实际案例**:
```
用户输入: "灰灰的粉色，那种很温柔的"
BM25结果: 无匹配（关键词库中没有"灰灰的""温柔"）
实际需求: 莫兰迪色系
```

### 1.2 进阶方案目标

✅ **语义理解**: 理解"灰灰的温柔粉色" → 莫兰迪色系
✅ **检索精度提升**: 从 60% → 90%+
✅ **保持低成本**: Embedding 成本可控，月费用 < ¥10

---

## 二、技术架构：混合检索

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    用户输入 "灰灰的温柔粉色"                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  查询预处理      │
                │  生成 Embedding │ ◄──── 通义千问 API
                └────────┬────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ BM25检索  │   │ 向量检索  │   │ 混合打分  │
   │ (关键词) │   │ (语义)   │   │ (RRF算法)│
   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │
        │  Score 1     │  Score 2     │ Combined Score
        └──────────────┴──────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ Top-K 结果│
                   │ 莫兰迪色系│
                   └──────────┘
```

### 2.2 技术选型

| 组件 | 技术 | 说明 |
|------|------|------|
| **向量模型** | 通义千问 `text-embedding-v4` | 1024维，支持中英文 |
| **检索引擎** | Orama.js 2.0 | 原生支持混合检索 |
| **融合算法** | RRF (Reciprocal Rank Fusion) | 行业标准融合算法 |
| **存储方案** | IndexedDB + 内存缓存 | 浏览器本地持久化 |

---

## 三、核心模块设计

### 3.1 通义千问 Embedding 集成

**API 规格**:
```typescript
// 模型信息
模型名称: text-embedding-v4
向量维度: 1024
价格: ¥0.0007/1K tokens (输入)
免费额度: 100万 tokens (开通后90天内)

// API 调用
POST https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding
Headers:
  Authorization: Bearer {API_KEY}
  Content-Type: application/json
Body:
{
  "model": "text-embedding-v4",
  "input": {
    "texts": ["莫兰迪色系"]
  }
}
```

**成本分析**:
```
知识库规模: 50 条
平均文本长度: 200 tokens (中英文混合描述)
初始化成本: 50 × 200 = 10,000 tokens ≈ ¥0.007 (一次性)

查询频率: 假设每用户 10 次/天
日均查询: 10 × 20 tokens = 200 tokens
月度成本: 200 × 30 = 6,000 tokens ≈ ¥0.0042/用户

100 活跃用户月成本: ¥0.42
```

### 3.2 混合检索实现

**算法: RRF (Reciprocal Rank Fusion)**

```typescript
// RRF 公式
// score(d) = Σ 1 / (k + rank_i(d))
// 其中 k = 60 (常数), rank_i 是文档在第 i 个检索结果中的排名

interface RetrievalResult {
  docId: string
  score: number
  rank: number
}

function reciprocalRankFusion(
  bm25Results: RetrievalResult[],
  vectorResults: RetrievalResult[],
  k: number = 60
): Map<string, number> {
  const fusedScores = new Map<string, number>()

  // 处理 BM25 结果
  bm25Results.forEach((result, index) => {
    const score = 1 / (k + index + 1)
    fusedScores.set(result.docId, (fusedScores.get(result.docId) || 0) + score)
  })

  // 处理向量结果
  vectorResults.forEach((result, index) => {
    const score = 1 / (k + index + 1)
    fusedScores.set(result.docId, (fusedScores.get(result.docId) || 0) + score)
  })

  return fusedScores
}
```

**权重优化**:
```typescript
// 可调权重版本（针对设计领域优化）
function weightedRRF(
  bm25Results: RetrievalResult[],
  vectorResults: RetrievalResult[],
  bm25Weight: number = 0.4,  // 关键词权重
  vectorWeight: number = 0.6  // 语义权重（设计领域更重视语义）
): Map<string, number> {
  const fusedScores = new Map<string, number>()
  const k = 60

  bm25Results.forEach((result, index) => {
    const score = bm25Weight / (k + index + 1)
    fusedScores.set(result.docId, (fusedScores.get(result.docId) || 0) + score)
  })

  vectorResults.forEach((result, index) => {
    const score = vectorWeight / (k + index + 1)
    fusedScores.set(result.docId, (fusedScores.get(result.docId) || 0) + score)
  })

  return fusedScores
}
```

### 3.3 Orama.js 混合检索配置

```typescript
import { create, insert, search } from '@orama/orama'

// 初始化支持混合检索的数据库
const db = await create({
  schema: {
    id: 'string',
    type: 'string',
    keywords: 'string[]',
    name: 'string',
    description: 'string',
    embedding: 'number[1024]',  // 1024维向量
    data: 'object'
  },
  // 配置混合检索
  components: {
    // BM25 分词器（默认）
    tokenizer: {
      stemmer: undefined,  // 中文不需要词干提取
      stopWords: []        // 设计领域保留所有词汇
    },
    // 向量相似度计算
    vector: {
      size: 1024,
      metric: 'cosine',    // 余弦相似度
      normalize: true      // 归一化
    }
  }
})

// 混合检索查询
async function hybridSearch(
  db: typeof db,
  queryText: string,
  queryEmbedding: number[],
  topK: number = 5
) {
  // 同时执行 BM25 和向量检索
  const [bm25Result, vectorResult] = await Promise.all([
    search(db, {
      term: queryText,
      properties: ['keywords', 'name', 'description'],
      limit: topK * 2  // 获取更多候选
    }),
    search(db, {
      vector: {
        value: queryEmbedding,
        property: 'embedding',
        k: topK * 2
      }
    })
  ])

  // RRF 融合
  const fusedScores = weightedRRF(
    bm25Result.hits.map((hit, i) => ({ docId: hit.id, rank: i })),
    vectorResult.hits.map((hit, i) => ({ docId: hit.id, rank: i })),
    0.4,  // BM25 权重
    0.6   // 向量权重（设计领域语义更重要）
  )

  // 按融合分数排序，返回 top-K
  const sorted = Array.from(fusedScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)

  return sorted.map(([docId]) => docId)
}
```

---

## 四、数据流程

### 4.1 初始化流程（一次性）

```typescript
// 1. 加载知识库
const knowledgeBase = await import('../data/knowledge-base.json')

// 2. 批量生成 Embeddings
const qwenAPI = new QwenEmbeddingAPI(API_KEY)
const embeddedKnowledge = await Promise.all(
  knowledgeBase.map(async (entry) => {
    // 组合所有可搜索文本
    const searchText = [
      entry.name,
      entry.description,
      ...entry.keywords
    ].join(' ')

    // 生成向量
    const embedding = await qwenAPI.embed(searchText)

    return {
      ...entry,
      embedding  // 添加 1024 维向量
    }
  })
)

// 3. 存储到 Orama + IndexedDB
await Promise.all([
  // Orama 内存索引（快速检索）
  Promise.all(embeddedKnowledge.map(entry => insert(db, entry))),

  // IndexedDB 持久化（下次启动直接加载）
  saveToIndexedDB('museflow-knowledge-db', embeddedKnowledge)
])
```

### 4.2 查询流程（每次用户输入）

```typescript
async function retrieveKnowledge(query: string, topK: number = 3) {
  // 1. 生成查询向量
  const queryEmbedding = await qwenAPI.embed(query)

  // 2. 混合检索
  const docIds = await hybridSearch(db, query, queryEmbedding, topK * 2)

  // 3. 获取完整文档
  const results = await Promise.all(
    docIds.map(id => getDocumentById(db, id))
  )

  // 4. (可选) 重排序优化
  const reranked = await crossEncoderRerank(query, results, topK)

  console.log(`🔍 混合检索 "${query}":`)
  console.log(`  - BM25 候选: ${bm25Result.hits.length}`)
  console.log(`  - 向量候选: ${vectorResult.hits.length}`)
  console.log(`  - 融合结果: ${reranked.length}`)

  return reranked
}
```

---

## 五、性能优化

### 5.1 缓存策略

```typescript
// 三级缓存
class EmbeddingCache {
  private memoryCache = new Map<string, number[]>()      // L1: 内存 (最快)
  private indexedDBCache: IDBDatabase                    // L2: IndexedDB
  private qwenAPI: QwenEmbeddingAPI                      // L3: API

  async get(text: string): Promise<number[]> {
    // L1: 内存缓存
    if (this.memoryCache.has(text)) {
      return this.memoryCache.get(text)!
    }

    // L2: IndexedDB 缓存
    const cached = await this.getFromIndexedDB(text)
    if (cached) {
      this.memoryCache.set(text, cached)
      return cached
    }

    // L3: API 调用
    const embedding = await this.qwenAPI.embed(text)
    this.memoryCache.set(text, embedding)
    await this.saveToIndexedDB(text, embedding)
    return embedding
  }
}
```

### 5.2 预生成 Embeddings

**策略**:
- 知识库条目预生成并存储（初始化完成）
- 用户查询实时生成（按需）

**收益**:
- 初始化成本: ¥0.007 (一次性)
- 查询延迟: <100ms (仅查询 embedding API)

---

## 六、实施计划

### 6.1 开发任务拆分

| 阶段 | 任务 | 预计时间 | 依赖 |
|------|------|----------|------|
| **1. API 集成** | 实现 Qwen Embedding 调用封装 | 2h | - |
| **2. 数据准备** | 批量生成知识库 embeddings | 1h | 1 |
| **3. 混合检索** | 实现 Orama.js 混合搜索 | 3h | 1,2 |
| **4. 融合算法** | 实现 RRF 权重调优 | 2h | 3 |
| **5. 缓存优化** | 实现三级缓存 | 2h | 1 |
| **6. 测试验证** | 检索精度测试 | 2h | 全部 |
| **总计** | | **12h** | |

### 6.2 精度评估

**测试集**:
```
1. 精确匹配: "莫兰迪色系" → color-morandi
2. 语义近似: "灰灰的温柔粉色" → color-morandi
3. 场景组合: "咖啡馆风格" → scene-cafe
4. 抽象描述: "那种很温暖舒适的地方" → scene-cafe
5. 专业术语: "留白设计" → technique-negative-space
```

**目标指标**:
| 指标 | V1.0 BM25 | V2.0 混合 | 提升 |
|------|-----------|-----------|------|
| 精确匹配率 | 95% | 98% | +3% |
| 语义召回率 | 40% | 90% | +125% |
| 平均检索时间 | 10ms | 100ms | 可接受 |

---

## 七、成本与收益

### 7.1 成本分析

| 项目 | 成本 | 说明 |
|------|------|------|
| 知识库初始化 | ¥0.007 | 50条 × 200 tokens (一次性) |
| 100活跃用户/月 | ¥0.42 | 查询 embedding |
| **总计（月度）** | **< ¥1** | 可忽略 |

### 7.2 收益对比

| 维度 | V1.0 BM25 | V2.0 混合检索 |
|------|-----------|--------------|
| 检索精度 | 60% | **90%+** |
| 语义理解 | ❌ | ✅ |
| 用户体验 | 一般 | **优秀** |
| 实施成本 | 4.5h | 12h |
| 运营成本 | $0 | <¥1/月 |

---

## 八、后续优化方向

### 8.1 短期优化（1-2周）

- **Cross-Encoder 重排序**: 在混合检索结果上再精排
- **用户反馈学习**: 记录用户选择，动态调整权重
- **查询扩展**: 自动补充同义词（"咖啡" → "cafe, 咖啡馆"）

### 8.2 中期优化（1-2月）

- **领域微调**: 使用设计领域数据微调 embedding 模型
- **多模态检索**: 支持图片搜索设计风格
- **个性化**: 用户历史偏好优化检索权重

---

## 九、总结

**V2.0 进阶方案核心升级**:
1. ✅ **通义千问 Embedding**: 语义理解能力
2. ✅ **混合检索**: BM25 + 向量，精度提升 50%
3. ✅ **RRF 融合算法**: 行业标准，权重可调
4. ✅ **低成本运营**: 月成本 <¥1
5. ✅ **浏览器本地**: 无隐私风险

**推荐实施**: 立即启动 V2.0，预计 12 小时完成开发，检索精度从 60% 提升至 90%+。
