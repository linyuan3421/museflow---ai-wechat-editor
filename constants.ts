import { AppTheme, CardTemplate } from './types';

export const INITIAL_MARKDOWN = `# MuseFlow · 浮光掠影

**让灵感自由流淌，让设计触手可及。**

在这里，Markdown 不仅仅是一种格式，它是一种让思想优雅呈现的方式。

---

## 一、排版美学

### 1.1 标题层级

Markdown 提供了 **6 级标题**，从大到小构建清晰的内容结构。

\`\`\`
# 一级标题：文章主标题
## 二级标题：主要章节
### 三级标题：次要章节
#### 四级标题：子节
##### 五级标题：细分点
###### 六级标题：最细分
\`\`\`

### 1.2 文本强调

让关键信息脱颖而出，**引导读者视线**。

| 语法 | 效果 |
|------|------|
| \`**粗体**\` | **粗体** |
| \`*斜体*\` | *斜体* |
| \`***粗斜体***\` | ***粗斜体*** |
| \`~~删除线~~\` | ~~删除线~~ |

> 💡 **提示**：在学术写作或技术文档中，合理使用强调可以提升阅读效率。

---

## 二、内容组织

### 2.1 列表与层次

列表是组织信息的最佳方式，**支持无限嵌套**。

**无序列表：**
- 第一点核心观点
- 第二点支撑论据
  - 子论据 A
  - 子论据 B
- 第三点总结

**有序列表：**
1. 首先，确立核心问题
2. 然后，收集相关数据
3. 接着，分析找出规律
4. 最后，得出解决方案

**任务列表：**
- [x] 完成需求分析
- [ ] 设计产品原型
- [ ] 开发核心功能
- [ ] 进行用户测试

### 2.2 引用与分隔

使用引用块突出重要内容，使用分隔线划分段落。

> "设计不仅仅是外观，更是功能。"
> 
> —— 史蒂夫·乔布斯

---

> 多行引用：
>
> 第一行内容
> 第二行内容
> 第三行内容

---

## 三、多媒体元素

### 3.1 链接与图片

**链接**：
- 内部链接：[返回顶部](#museflow-浮光掠影)
- 外部链接：[MuseFlow GitHub](https://github.com/linyuan3421/museflow---ai-wechat-editor)
- 带标题的链接：[访问我们的网站](https://museflow.app "MuseFlow 官网")

**图片**：

![图片描述](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop)

> 🖼️ 图片语法：\`![替代文本](图片URL "可选标题")\`

### 3.2 表格

表格是展示对比数据的理想工具。

| 功能 | 微信公众号 | 小红书 | 备注说明 |
|------|-----------|--------|----------|
| 排版渲染 | ✅ 富文本 | ❌ 不支持 | 微信支持复杂样式 |
| 图文混排 | ✅ | ✅ | 两者都支持 |
| 卡片设计 | ❌ | ✅ | 小红书特有格式 |
| 字数限制 | 2000 字 | 1000 字 | 按平台调整 |

### 3.3 代码展示

技术文档必备，支持语法高亮。

**行内代码**：使用 \`print("Hello World")\` 打印输出。

**代码块：**

\`\`\`javascript
// 前端框架示例
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

**Python 示例：**

\`\`\`python
# 数据处理示例
import pandas as pd

def process_data(file_path):
    # 读取 CSV 文件
    df = pd.read_csv(file_path)

    # 数据清洗
    df = df.dropna()
    df = df.drop_duplicates()

    # 返回处理后的数据
    return df

# 使用示例
data = process_data('dataset.csv')
print(f"处理了 {len(data)} 条记录")
\`\`\`

---

## 四、高级技巧

### 4.1 转义字符

如果需要在文本中显示特殊符号，使用反斜杠转义：

- \`\\* 显示星号而不是斜体 *\`
- \`\\# 显示井号而不是标题 #\`

### 4.2 HTML 支持

在 Markdown 中可以使用原生 HTML 标签，实现更复杂的效果：

<div style="background: linear-gradient(135deg, #78716c 0%, #44403c 100%); padding: 24px; border-radius: 16px; color: #fafaf9; text-align: center; font-family: 'Noto Sans SC', sans-serif; box-shadow: 0 4px 20px rgba(68, 64, 60, 0.15);">
  <h3 style="margin: 0 0 12px 0; font-weight: 600; color: #fff;">✨ 高级效果示例</h3>
  <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.6;">通过 HTML 标签实现 Markdown 无法直接支持的复杂样式</p>
</div>

---

## 写在最后

Markdown 的核心在于：**简单、专注、通用**。

你不需要记忆复杂的快捷键，只需要掌握几个基础语法，就能专注于内容本身。

开始你的创作之旅吧！点击右侧的「灵感工坊」，让 AI 为你的文字穿上设计的"外衣"。

---

**MuseFlow** · 浮光掠影  
*捕捉灵感，定格美好*
`;

const BASE_STYLES = {
  lineHeight: '1.8',
  letterSpacing: '0.05em',
  marginBottom: '1.5em',
  wordBreak: 'break-word' as const,
  textAlign: 'justify' as const,
};

// 基础列表样式
const BASE_LIST_STYLES = {
  ul: {
    paddingInlineStart: '24px',
    marginBlock: '12px 16px',
    color: '#44403c',
  },
  ol: {
    paddingInlineStart: '28px',
    marginBlock: '12px 16px',
    color: '#44403c',
  },
  li: {
    marginBottom: '8px',
    lineHeight: '1.8',
  },
};

// 基础表格样式
const BASE_TABLE_STYLES = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBlock: '24px 32px',
    fontSize: '14px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#f5f5f4',
    padding: '12px 16px',
    fontWeight: '600',
    color: '#292524',
    textAlign: 'left' as const,
    borderBottom: '2px solid #d6d3d1',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e7e5e4',
    color: '#44403c',
  },
  tr: {
    transition: 'background-color 0.15s',
  },
};

export const DEFAULT_THEMES: AppTheme[] = [
  {
    id: 'modern-editorial',
    name: '先锋杂志',
    description: '极简黑白，大胆的排版与留白，强调阅读的呼吸感。',
    styles: {
      container: { 
        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
        color: '#1a1a1a', 
        backgroundColor: '#ffffff',
        padding: '20px',
      },
      h1: { 
        fontSize: '26px', 
        fontWeight: '900', 
        color: '#000000',
        textAlign: 'left',
        marginBottom: '30px', 
        marginTop: '20px',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
        borderBottom: '4px solid #000',
        paddingBottom: '16px'
      },
      h2: { 
        fontSize: '20px', 
        fontWeight: '800', 
        color: '#000000',
        marginBottom: '24px', 
        marginTop: '40px',
        display: 'flex',
        alignItems: 'center',
        borderLeft: '6px solid #000',
        paddingLeft: '12px',
        lineHeight: '1'
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#000000',
        marginBottom: '16px', 
        marginTop: '24px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      p: { ...BASE_STYLES, fontSize: '15px', color: '#262626', lineHeight: '1.8', textAlign: 'justify' },
      blockquote: { 
        borderLeft: '2px solid #000',
        padding: '16px 20px', 
        color: '#404040', 
        fontSize: '15px',
        fontWeight: '500',
        marginBottom: '32px',
        backgroundColor: '#f9f9f9',
        fontStyle: 'italic'
      },
      strong: { 
        color: '#000', 
        fontWeight: 'bold',
        backgroundColor: '#fcd34d', // Subtle highlighter
        padding: '0 4px',
      },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'disc',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'decimal',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '15px', lineHeight: '1.7', color: '#1a1a1a' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#1a1a1a', color: '#ffffff' },
      td: { ...BASE_TABLE_STYLES.td, color: '#1a1a1a' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#000', fontWeight: 'bold', textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '4px' },
      code: { 
        backgroundColor: '#f4f4f5', 
        padding: '2px 5px', 
        borderRadius: '2px', 
        fontSize: '13px', 
        color: '#09090b', 
        fontFamily: '"Menlo", "Monaco", monospace', 
        fontWeight: '600' 
      },
      pre: {
        backgroundColor: '#1c1917', // Dark background for block
        color: '#e7e5e4', // Light text
        padding: '20px',
        borderRadius: '0', // Sharp corners
        overflowX: 'auto',
        marginBottom: '32px',
        fontFamily: '"Menlo", "Monaco", monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        borderLeft: '4px solid #000' // Stylish accent
      },
      img: { borderRadius: '0', maxWidth: '100%', height: 'auto', display: 'block', margin: '32px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      hr: { border: '0', height: '1px', backgroundColor: '#000', margin: '50px 0', opacity: '0.1' }
    }
  },
  {
    id: 'forest-breath',
    name: '山野迷雾',
    description: '森系配色，低饱和度的绿与灰，如同清晨的森林。',
    styles: {
      container: { 
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        color: '#2c3e50',
        backgroundColor: '#ffffff',
        padding: '20px',
        backgroundImage: 'linear-gradient(to bottom, #f9fbf9 0%, #ffffff 100%)'
      },
      h1: { 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#3f6212', // Moss green
        textAlign: 'center',
        marginBottom: '40px', 
        marginTop: '20px',
        letterSpacing: '0.1em'
      },
      h2: { 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#4d7c0f',
        borderLeft: '4px solid #84cc16', 
        paddingLeft: '12px', 
        marginBottom: '24px', 
        marginTop: '40px',
        backgroundColor: '#f7fee7',
        padding: '8px 12px',
        borderRadius: '0 8px 8px 0'
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#65a30d',
        marginBottom: '16px', 
        marginTop: '24px',
        paddingBottom: '4px',
        borderBottom: '1px dashed #d9f99d'
      },
      p: { ...BASE_STYLES, fontSize: '15px', color: '#4b5563' },
      blockquote: { 
        borderLeft: 'none',
        borderTop: '2px solid #bef264',
        borderBottom: '2px solid #bef264',
        padding: '20px', 
        color: '#576046', 
        backgroundColor: '#fcfdfa', 
        fontSize: '14px',
        marginBottom: '30px',
        fontStyle: 'italic',
        textAlign: 'center'
      },
      strong: { color: '#365314', fontWeight: 'bold' },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'square',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'decimal',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '15px', lineHeight: '1.7', color: '#2c3e50' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#f0fdf4', color: '#365314', borderBottom: '2px solid #84cc16' },
      td: { ...BASE_TABLE_STYLES.td, color: '#2c3e50' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#4d7c0f', textDecoration: 'underline', textUnderlineOffset: '4px' },
      code: { backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#166534' },
      img: { borderRadius: '4px', maxWidth: '100%', height: 'auto', display: 'block', margin: '30px auto', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' },
      hr: { border: '0', height: '1px', backgroundImage: 'linear-gradient(to right, transparent, #ecfccb, transparent)', margin: '50px 0' }
    }
  },
  {
    id: 'island-daydream',
    name: '岛屿假日',
    description: '蔚蓝与流沙的交响，地中海式的清爽与松弛感。',
    styles: {
      container: { 
        fontFamily: '"PingFang SC", sans-serif',
        color: '#334155',
        backgroundColor: '#f8fafc', // Very light blue-grey
        padding: '20px',
      },
      h1: { 
        fontSize: '22px', 
        fontWeight: 'normal', 
        color: '#0369a1', // Azure Blue
        textAlign: 'center',
        marginBottom: '32px',
        marginTop: '20px',
        borderBottom: '2px dashed #bae6fd',
        paddingBottom: '16px',
        letterSpacing: '2px'
      },
      h2: { 
        fontSize: '17px', 
        fontWeight: 'bold', 
        color: '#0284c7',
        marginTop: '32px',
        marginBottom: '20px',
        display: 'table',
        backgroundColor: '#e0f2fe', // Light sky blue
        padding: '6px 16px',
        borderRadius: '999px', // Pill shape
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: '600', 
        color: '#0ea5e9',
        marginBottom: '12px', 
        marginTop: '24px',
        paddingLeft: '10px',
        borderLeft: '4px solid #7dd3fc'
      },
      p: { ...BASE_STYLES, fontSize: '15px', color: '#475569', lineHeight: '1.8' },
      blockquote: { 
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '24px', 
        color: '#334155', 
        fontSize: '14px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      },
      strong: { color: '#0284c7', fontWeight: 'bold' },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'circle',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'decimal',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '15px', lineHeight: '1.7', color: '#334155' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#e0f2fe', color: '#0369a1', borderBottom: '2px solid #0284c7' },
      td: { ...BASE_TABLE_STYLES.td, color: '#334155' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#0284c7', textDecoration: 'none', borderBottom: '1px solid #0284c7' },
      code: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#0f172a' },
      img: { borderRadius: '16px', maxWidth: '100%', height: 'auto', display: 'block', margin: '24px auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' },
      hr: { border: '0', borderTop: '2px dashed #cbd5e1', margin: '48px 0' }
    }
  },
  {
    id: 'vintage-rose',
    name: '旧日玫瑰',
    description: '莫兰迪粉与勃艮第红，复古胶片般的浪漫质感。',
    styles: {
      container: { 
        fontFamily: '"Noto Serif SC", serif',
        color: '#500724', // Deep Burgundy Text
        backgroundColor: '#fff1f2', // Very light rose
        padding: '20px',
        backgroundImage: 'radial-gradient(#ffe4e6 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      },
      h1: { 
        fontSize: '26px', 
        fontWeight: 'bold', 
        color: '#881337', // Rose 900
        textAlign: 'center',
        marginBottom: '40px', 
        marginTop: '20px',
        textShadow: '2px 2px 0px rgba(253, 164, 175, 0.5)'
      },
      h2: { 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#9f1239',
        borderBottom: '2px solid #fda4af', // Rose 300
        paddingBottom: '8px',
        marginBottom: '24px', 
        marginTop: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#be123c',
        marginBottom: '16px', 
        marginTop: '24px' 
      },
      p: { ...BASE_STYLES, fontSize: '16px', color: '#4c0519', lineHeight: '1.9' },
      blockquote: { 
        backgroundColor: '#fff0f5', // Lavender blush
        borderLeft: '3px solid #be123c',
        padding: '16px 20px', 
        color: '#881337', 
        fontSize: '15px',
        fontStyle: 'italic',
        marginBottom: '32px',
        borderRadius: '0 8px 8px 0'
      },
      strong: { color: '#881337', fontWeight: '800', background: 'linear-gradient(to top, #fecdd3 50%, transparent 50%)' },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'disc',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'decimal',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '16px', lineHeight: '1.8', color: '#500724' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#ffe4e6', color: '#881337', borderBottom: '2px solid #fb7185' },
      td: { ...BASE_TABLE_STYLES.td, color: '#500724' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#be123c', fontWeight: 'bold' },
      code: { backgroundColor: '#ffe4e6', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', color: '#881337' },
      img: { borderRadius: '2px', maxWidth: '100%', height: 'auto', display: 'block', margin: '32px auto', border: '8px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
      hr: { border: '0', height: '1px', background: '#fb7185', margin: '40px 0', opacity: '0.5' }
    }
  },
  {
    id: 'minimal-zen',
    name: '极简白露',
    description: '大面积留白，克制的字体排印，适合现代散文。',
    styles: {
      container: { 
        fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
        color: '#333333',
        backgroundColor: '#ffffff',
        padding: '20px',
      },
      h1: { 
        fontSize: '22px', 
        fontWeight: 'normal', 
        borderBottom: '1px solid #e5e5e5', 
        paddingBottom: '15px', 
        marginBottom: '30px', 
        marginTop: '20px',
        textAlign: 'center',
        letterSpacing: '2px'
      },
      h2: { 
        fontSize: '17px', 
        fontWeight: 'bold', 
        marginBottom: '20px', 
        marginTop: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginBottom: '16px', 
        marginTop: '24px' 
      },
      p: { ...BASE_STYLES, fontSize: '15px', color: '#262626', lineHeight: '1.85' },
      blockquote: { 
        borderLeft: '3px solid #000', 
        padding: '10px 15px', 
        color: '#666', 
        backgroundColor: 'transparent', 
        fontSize: '14px',
        marginBottom: '24px'
      },
      strong: { color: '#000', fontWeight: '600' },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'square',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'lower-alpha',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '15px', lineHeight: '1.7', color: '#333333' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#f5f5f5', color: '#333333', borderBottom: '1px solid #e5e5e5' },
      td: { ...BASE_TABLE_STYLES.td, color: '#333333', borderBottom: '1px solid #fafafa' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#525252', textDecoration: 'underline' },
      code: { backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '2px', fontSize: '13px', color: '#171717' },
      img: { borderRadius: '0', maxWidth: '100%', height: 'auto', display: 'block', margin: '20px auto', filter: 'grayscale(20%)' },
      hr: { border: '0', borderTop: '1px solid #f0f0f0', margin: '40px 0' }
    }
  },
  {
    id: 'warm-wood',
    name: '暖阳木质',
    description: '大地色系，温暖怀旧，如午后的咖啡馆。',
    styles: {
      container: { 
        fontFamily: '"Noto Serif SC", serif',
        color: '#433422',
        backgroundColor: '#fffcf5',
        padding: '20px',
      },
      h1: { 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#78350f',
        textAlign: 'center',
        marginBottom: '30px',
        marginTop: '10px',
      },
      h2: { 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#92400e',
        borderBottom: '2px solid #fcd34d',
        display: 'inline-block',
        paddingBottom: '4px',
        marginBottom: '24px',
        marginTop: '32px'
      },
      h3: { 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#b45309',
        marginBottom: '16px', 
        marginTop: '24px' 
      },
      p: { ...BASE_STYLES, fontSize: '16px', color: '#574534' },
      blockquote: { 
        backgroundColor: '#fffbeb',
        border: '1px dashed #d97706',
        padding: '20px', 
        color: '#92400e', 
        fontSize: '14px',
        borderRadius: '8px',
        marginBottom: '24px',
      },
      strong: { color: '#451a03', fontWeight: 'bold' },
      ul: { 
        ...BASE_LIST_STYLES.ul,
        listStyleType: 'disc',
      },
      ol: { 
        ...BASE_LIST_STYLES.ol,
        listStyleType: 'decimal',
      },
      li: { ...BASE_LIST_STYLES.li, fontSize: '16px', lineHeight: '1.7', color: '#433422' },
      table: { ...BASE_TABLE_STYLES.table },
      th: { ...BASE_TABLE_STYLES.th, backgroundColor: '#fef3c7', color: '#78350f', borderBottom: '2px solid #fcd34d' },
      td: { ...BASE_TABLE_STYLES.td, color: '#433422', borderBottom: '1px solid #fde68a' },
      tr: BASE_TABLE_STYLES.tr,
      a: { color: '#b45309', textDecoration: 'underline', textUnderlineOffset: '2px' },
      code: { backgroundColor: '#fef3c7', padding: '2px 4px', borderRadius: '4px', fontSize: '14px', color: '#9a3412' },
      img: { borderRadius: '8px', maxWidth: '100%', height: 'auto', display: 'block', margin: '20px auto', border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
      hr: { border: '0', height: '1px', background: '#e7e5e4', margin: '40px 0' }
    }
  }
];

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'swiss-grid',
    name: '黑白瑞士',
    description: '极高对比度，网格对齐，雕塑感的文字排版 (Swiss-Blur)。',
    previewColor: '#000000'
  },
  {
    id: 'glass-morphism',
    name: '琉光拟态',
    description: '柔和渐变背景与半透明毛玻璃卡片的融合，轻盈通透的现代美学。',
    previewColor: '#3b82f6'
  },
  {
    id: 'neo-pop',
    name: '新波普',
    description: '高饱和撞色，粗黑边框，复古拼贴艺术风格。',
    previewColor: '#ff4030'
  },
  {
    id: 'elegant-note',
    name: '优雅笔记',
    description: '纸张纹理，衬线体，如同一张精心设计的信纸。',
    previewColor: '#fefdfb'
  },
  {
    id: 'ink-rhyme',
    name: '水墨气韵',
    description: '东方留白美学，写意山水般的淡雅与从容，书法体点缀。',
    previewColor: '#44403c'
  },
  {
    id: 'film-story',
    name: '胶片故事',
    description: '电影字幕般的叙事感，颗粒噪点，记录时光的温暖滤镜。',
    previewColor: '#9a3412'
  }
];