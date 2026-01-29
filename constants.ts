import { AppTheme, CardTemplate } from './types';

export const INITIAL_MARKDOWN = `# 浮光 · 掠影

在这里，**灵感**被赋予了形状。

## 核心理念

1.  **自然灵感**：上传一张风景图，AI 自动提取山川草木的配色。
2.  **纯粹书写**：支持从飞书/文档直接粘贴，一键清洗格式。
3.  **极致美学**：告别千篇一律的排版，回归阅读本质。

> “浮光掠影间，万物皆有诗意。我们捕捉稍纵即逝的美，将其定格于文字之中。”

点击右侧「灵感工坊」，让 AI 为你的文字披上设计的“外衣”。

### 示例代码
\`\`\`javascript
const mood = "creative";
if (mood === "creative") {
  return "Capture the moment";
}
\`\`\`
`;

const BASE_STYLES = {
  lineHeight: '1.8',
  letterSpacing: '0.05em',
  marginBottom: '1.5em',
  wordBreak: 'break-word' as const,
  textAlign: 'justify' as const,
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
      li: { fontSize: '15px', marginBottom: '8px', lineHeight: '1.7' },
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
      li: { fontSize: '15px', marginBottom: '8px', lineHeight: '1.7', color: '#4b5563' },
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
      li: { fontSize: '15px', marginBottom: '8px', lineHeight: '1.7', color: '#475569' },
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
      li: { fontSize: '16px', marginBottom: '8px', lineHeight: '1.8' },
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
      li: { fontSize: '15px', marginBottom: '8px', lineHeight: '1.7' },
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
      li: { fontSize: '16px', marginBottom: '8px', lineHeight: '1.7' },
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
    description: '磨砂玻璃质感，辉光渐变，高级的未来科技感。',
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