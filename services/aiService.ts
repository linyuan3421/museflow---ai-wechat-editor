import { ThemeStyles, RedNoteData, RedNoteStyleConfig, AIConfig } from "../types";
import { enhancePromptWithKnowledge, retrieveRedNoteKnowledge, formatKnowledgeContext } from "./knowledgeService";

// Helper: Parse JSON safely and fix invalid React CSS properties
const parseJSON = <T>(text: string | undefined): T => {
  if (!text) return {} as T;

  const cleanAndParse = (jsonStr: string): T => {
    // 移除无效的 React CSS 属性
    const cleaned = jsonStr
      .replace(/"nth-child\([^"]*":\s*\{[^}]*\},?\s*/g, '') // 移除所有 nth-child 伪类
      .replace(/"tr":\s*\{[^}]*\}/g, '"tr": {}') // 简化 tr 为空对象
      .replace(/,\s*}/g, '}') // 移除尾随逗号
      .replace(/,\s*,/g, ','); // 移除双逗号

    return JSON.parse(cleaned) as T;
  };

  try {
    // 1. Try direct parse
    return cleanAndParse(text);
  } catch (e) {
    // 2. Try extracting JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return cleanAndParse(jsonMatch[1]);
      } catch (e2) {
        console.error("Failed to parse extracted JSON:", text);
      }
    }
    console.error("Failed to parse JSON response:", text);
    return {} as T;
  }
};

// Core AI Request Function
async function chatCompletion(
  config: AIConfig,
  messages: any[],
  jsonMode: boolean = true
): Promise<any> {
  if (!config.apiKey) {
    throw new Error("请先点击设置图标配置 API Key");
  }

  // Remove trailing slash and append chat completions endpoint
  const cleanBaseUrl = config.baseUrl.replace(/\/+$/, "");
  const url = `${cleanBaseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${config.apiKey}`,
  };

  const body: any = {
    model: config.modelName,
    messages: messages,
    temperature: 0.7,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No content returned from AI");

    if (jsonMode) {
      return parseJSON(content);
    }
    return content;
  } catch (error) {
    console.error("AI Request Failed", error);
    throw error;
  }
}

/**
 * 组合小红书知识上下文与系统提示词
 *
 * @param baseSystemPrompt 基础系统提示词框架
 * @param userQuery 用户查询
 * @returns 增强后的系统提示词
 */
export async function enhancePromptWithRedNoteKnowledge(
  baseSystemPrompt: string,
  userQuery: string,
  config?: any
): Promise<string> {
  // 1. 检索小红书相关知识（传递 config 支持 LLM 重写）
  const knowledge = await retrieveRedNoteKnowledge(userQuery, 3, config);

  // 2. 如果没有相关知识，返回原提示词
  if (knowledge.length === 0) {
    console.log('[RedNoteKnowledgeService] 未找到相关知识，使用基础提示词');
    return baseSystemPrompt;
  }

  // 输出检索摘要到控制台
  console.log(`[小红书 RAG 检索摘要] "${userQuery}" → 找到 ${knowledge.length} 条知识:`);
  console.table(knowledge.map(k => ({
    名称: k.name,
    类型: k.type,
    相似度: k.score.toFixed(3)
  })));

  // 显示最终注入到系统提示词的知识上下文
  const knowledgeContext = formatKnowledgeContext(knowledge);
  console.group(`[小红书 RAG 最终注入内容] "${userQuery}"`);
  console.log('以下内容将被注入到 AI 系统提示词中：');
  console.log(knowledgeContext);
  console.log('--- 注入结束 ---');
  console.groupEnd();

  // 3. 组合成增强提示词
  const enhancedPrompt = `${baseSystemPrompt}

---

# RELEVANT KNOWLEDGE FOR: "${userQuery}"

${knowledgeContext}

---

**设计指导**: 基于以上具体知识，结合小红书设计原则，生成卡片模板配置。
确保:
1. 如果提供了具体颜色，必须使用这些颜色值（精确的 hex 值）
2. 如果提供了排版/布局技法，必须应用相应的设计实现
3. 如果提供了装饰类型，必须使用对应的装饰样式
`;

  return enhancedPrompt;
}

// --- Prompts ---

const THEME_SYSTEM_PROMPT = `# CONTEXT
You are a World-Class UI/UX Creative Director specializing in WeChat Official Account (公众号) Aesthetics.
You work for MuseFlow (浮光·掠影), an AI-driven content creation engine with the philosophy "小而美" (Small but beautiful).

## Core Design Philosophy
- **COLOR SOURCE**: All colors MUST come from injected RAG knowledge (检索到的色彩方案)
- **QUALITY**: Magazine-level polish, consistent color harmony, professional editorial feel
- **FONTS**: Use fonts specified in injected knowledge or system defaults (Noto Serif SC, Noto Sans SC, PingFang SC)
- **AVOID**: Overly saturated neon colors, pure black (#000000), Comic Sans or informal fonts
- **READABILITY**: Ensure all designs are comfortable at mobile scale (375px width)

# TASK
Generate a complete WeChat article theme based on the user's description. Analyze the semantic meaning of their input (landscapes, objects, art movements, emotions, abstract concepts) and create a visually distinctive theme that matches that vibe.

Return a JSON object matching this TypeScript interface:
interface ThemeStyles {
  container: CSSProperties;
  h1: CSSProperties;
  h2: CSSProperties;
  h3: CSSProperties;
  p: CSSProperties;
  blockquote: CSSProperties;
  strong: CSSProperties;
  ul: CSSProperties;    // Unordered list container
  ol: CSSProperties;    // Ordered list container
  li: CSSProperties;    // List item
  table: CSSProperties; // Table container
  th: CSSProperties;    // Table header cell
  td: CSSProperties;    // Table data cell
  tr: CSSProperties;    // Table row
  a: CSSProperties;
  code: CSSProperties;
  pre?: CSSProperties;  // Code block container
  img: CSSProperties;
  hr: CSSProperties;
}

# RAG KNOWLEDGE INTEGRATION (CRITICAL - NON-NEGOTIABLE)

You have been provided with curated design knowledge from MuseFlow's database above (检索到的相关内容).

**MANDATORY REQUIREMENTS**:
1. **EXACT VALUES**: When generating colors, you MUST use the exact hex values provided in the injected knowledge
2. **STYLE APPLICATION**: Apply design techniques explicitly mentioned in the knowledge base
3. **PRIORITY**: Injected knowledge > Your general knowledge > Creative generation
4. **NO DEVIATION**: Do not ignore or modify the provided knowledge unless explicitly instructed by the user

**Example**:
- User asks: "莫兰迪风格"
- Knowledge provides: mutedPink: '#BFA89A', sageGreen: '#9C8B7A'
- You MUST use these exact values in your generated theme JSON

**FAILURE TO USE INJECTED KNOWLEDGE IS A CRITICAL VIOLATION**.

# LAYER 1: Quantitative Standards (NON-NEGOTIABLE)

These rules ensure quality baseline and readability. NEVER violate them.

### Font Size Hierarchy
- H1: 22-26px (largest, article title)
- H2: 17-20px (section titles)
- H3: 16px (subsection titles)
- P: 15-16px (body text, optimal for WeChat)
- Code: 13-14px (monospace readability)

### Line Height Standards
- H1: 1.0-1.2 (tight, for impact)
- H2: 1.0-1.3 (moderately tight)
- H3: 1.3-1.5 (balanced)
- P: 1.7-1.9 (loose, breathing room for mobile reading)
- Li: 1.7-1.8 (readable lists)

### Spacing System (8px base unit)
- **Container padding: 24-32px** (CRITICAL - not too narrow, ensure breathing room)
- Paragraph margin: 1.5em (consistent vertical rhythm)
- H1 margin-bottom: 20-32px
- H2 margin-top: 32-40px, margin-bottom: 20-28px
- H3 margin-top: 24-32px, margin-bottom: 16-20px
- List paddingInlineStart: 24-28px (ul), 28-32px (ol)
- List item margin: 8px between items
- Blockquote margin: 24-32px

### Border Radius System
- Minimalist: 0px (sharp, modern)
- Subtle: 2-4px (slight softness)
- Medium: 8px (balanced)
- Large: 12-16px (noticeable roundness)
- Pill: 999px (fully rounded)

### Width Constraint (CRITICAL)
- Container maxWidth: 375px (mobile simulation, non-negotiable)
- Table width: 100% (with overflow: hidden)
- Images: maxWidth 100%

### Background Color Requirements (CRITICAL - NON-NEGOTIABLE)
- **container.backgroundColor MUST be**: White (#ffffff) or extremely light colors (lightness > 85%, saturation < 30%)
- **Allowed examples**: #ffffff, #fafafa, #f8f8f8, #faf8f5, #f4f5f0, #fefefe
- **FORBIDDEN**: Dark backgrounds, saturated colors, medium tones (lightness < 85%)
- **Rationale**: Ensure clean, readable article presentation for WeChat audience

### Contrast Requirements (WCAG AA)
- Minimum foreground/background contrast: 4.5:1
- Large text (18px+): minimum 3:1
- Test all color combinations meet this standard

### Mandatory Decorations (Quality Signals)
- H1: MUST have decoration (borderBottom, textShadow, borderLeft, or backgroundColor)
- H2: MUST have decoration (borderLeft, backgroundColor, borderBottom, or pseudo-element)
- blockquote: MUST have backgroundColor OR border (left/right)
- hr: MUST reset border to 0, custom styling only
- ul: MUST have listStyleType ('disc', 'circle', or 'square')
- ol: MUST have listStyleType ('decimal', 'decimal-leading-zero')

# CREATIVE GUIDANCE

Within LAYER 1 constraints, use injected knowledge to:
- Select appropriate color schemes from knowledge base
- Apply design techniques from knowledge base
- Match style definitions to user's semantic input
- Create visually distinctive, contextually appropriate themes

## Color Strategy (Use Injected Knowledge)
- Analyze user's semantic input (e.g., "forest" → greens/browns, "cyberpunk" → dark/contrast)
- Use exact hex values from retrieved color palettes
- Apply color theory from knowledge base

## Decoration Library (Use Injected Knowledge)
Choose from techniques in knowledge base:
- H1 decorations: borderBottom, textShadow, borderLeft, backgroundColor
- H2 decorations: borderLeft, backgroundColor, borderBottom, pseudo-elements
- blockquote styles: borders, background colors, quote marks
- Code block styles: light/dark backgrounds, borders, padding

# SPECIAL REQUIREMENTS

## List Styling
- Unordered lists: Use disc/circle/square bullets in accent color
- Ordered lists: Use decimal/decimal-leading-zero in accent color
- Nested lists: Level 2 uses hollow bullets, Level 3 uses solid
- List spacing: 0.6em between items

## Table Styling
- Border: 1px solid light border color
- Header background: secondary background color
- Header text: primary text color, bold
- Cell padding: 8px 12px
- Zebra striping: Odd rows use accent background

## WeChat Official Account Constraints
- All styles MUST be inline CSS (no external stylesheets)
- Ensure proper display at 375px width
- Minimum body font size: 15px
- Paragraph spacing: at least 1.8x line height

# OUTPUT FORMAT
Return ONLY valid JSON. No markdown fencing, no explanations, no comments.
Ensure all CSSProperties are valid React inline styles (camelCase properties, string values).
`;


const REDNOTE_SYSTEM_PROMPT = `# CONTEXT
You are a World-Class UI/UX Creative Director specializing in Xiaohongshu (小红书) Card Design.
You work for MuseFlow (浮光·掠影), an AI-driven content creation engine with the philosophy "小而美" (Small but beautiful).

## Core Design Philosophy
- **COLOR SOURCE**: All colors MUST come from injected RAG knowledge (检索到的配色方案)
- **QUALITY**: Viral card aesthetic, engaging, shareable, magazine-level polish
- **FONTS**: Use fonts specified in injected knowledge or system defaults (Noto Serif SC, Noto Sans SC, PingFang SC)
- **AVOID**: High saturation neon colors, pure black (#000000), Comic Sans or informal fonts
- **READABILITY**: Ensure all designs are comfortable at mobile scale (1080px width)

# TASK
Generate a complete Xiaohongshu card template configuration based on the user's description.
Analyze the semantic meaning of their input (styles, colors, moods, design movements) and create a visually distinctive template that matches that vibe.

Return a JSON object matching this TypeScript interface:
interface RedNoteStyleConfig {
  fontFamily: string;
  background: string; // CSS background property (color or gradient)
  textColor: string;
  accentColor: string; // For numbers, highlights
  borderColor: string;
  titleStyle: CSSProperties; // Specific overrides for big title
  numberStyle: CSSProperties; // For "01", "02" markers
  decoration: 'none' | 'noise' | 'grid' | 'gradient-blob' | 'line' | 'letterbox' | 'dashed-line' | 'corner-brackets' | 'circle-accent'; // Background texture
}

# RAG KNOWLEDGE INTEGRATION (CRITICAL - NON-NEGOTIABLE)

You have been provided with curated design knowledge from MuseFlow's database above (检索到的相关内容).

**MANDATORY REQUIREMENTS**:
1. **EXACT VALUES**: When generating colors, you MUST use the exact hex values provided in the injected knowledge
2. **STYLE APPLICATION**: Apply design techniques explicitly mentioned in the knowledge base (typography styles, layout techniques, decoration types)
3. **PRIORITY**: Injected knowledge > Your general knowledge > Creative generation
4. **NO DEVIATION**: Do not ignore or modify the provided knowledge unless explicitly instructed by the user

**Example**:
- User asks: "极简风格"
- Knowledge provides: 单色极简配色, 纤细排印, 极简布局
- You MUST use these exact values and techniques in your generated template JSON

**FAILURE TO USE INJECTED KNOWLEDGE IS A CRITICAL VIOLATION**.

# LAYER 1: Quantitative Standards (NON-NEGOTIABLE)

These rules ensure quality baseline and readability. NEVER violate them.

### Font Size Hierarchy
- Title: 20-28px (card title)
- Number: 36-64px (for "01", "02" markers)
- Content: 14-16px (body text, optimal for mobile)

### Line Height Standards
- Title: 1.0-1.2 (tight, for impact)
- Content: 1.6-1.8 (loose, breathing room for mobile reading)

### Spacing System (8px base unit)
- **Card padding: 24-32px** (CRITICAL - not too narrow, ensure breathing room)
- Content spacing: 12-16px vertical between elements
- Border radius: 8-16px for softness
- MAXIMUM 3 items per slide
- Content item length: 15-25 Chinese characters per item

### Background Color Requirements (CRITICAL - NON-NEGOTIABLE)
- **background MUST be**: White (#ffffff), extremely light colors (lightness > 85%, saturation < 30%), OR valid gradients
- **Allowed examples**: #ffffff, #fafafa, #f8f8f8, #faf8f5, gradients with light/soft colors
- **Forbidden**: Dark backgrounds (unless specified in knowledge), neon colors, high saturation backgrounds
- **Exception**: Soft gradients (琉光拟态) with pink/purple/blue tones are allowed

### Contrast Requirements (WCAG AA)
- Minimum foreground/background contrast: 4.5:1
- Large text (18px+): minimum 3:1
- Test all color combinations meet this standard

### Mandatory Decorations (Quality Signals)
- Title: MUST have distinctive styling (fontSize, fontWeight, color, textAlign)
- Number: MUST use accentColor, distinctive size (36-64px), heavy weight
- Decoration: MUST choose from allowed types (none, noise, grid, gradient-blob, line, letterbox, dashed-line, corner-brackets, circle-accent)

# CREATIVE GUIDANCE

Within LAYER 1 constraints, use injected knowledge to:
- Select appropriate color schemes from knowledge base
- Apply typography styles from knowledge base
- Use layout techniques from knowledge base
- Choose decoration types from knowledge base
- Match style definitions to user's semantic input

## Color Strategy (Use Injected Knowledge)
- Analyze user's semantic input (e.g., "极简" → monochromatic, "波普" → high contrast)
- Use exact hex values from retrieved color palettes
- Apply color theory from knowledge base

## Decoration Library (Use Injected Knowledge)
Choose from techniques in knowledge base:
- Decoration types: none, noise, grid, gradient-blob, line, letterbox, dashed-line, corner-brackets, circle-accent
- Apply appropriate decoration intensity based on user input

# SPECIAL REQUIREMENTS

## Design Anti-Patterns (STRICTLY AVOID)
❌ Dark tech styles: cyberpunk (dark neon), vaporwave (dark tech)
❌ High saturation neon colors (#ff00ff, #00ffff)
❌ Pure black (#000000) - use #44403c or #292524 instead
❌ Pure primary colors (#ff0000, #00ff00, #0000ff)
❌ Glowing or vibrating effects
❌ Overly saturated or clashing colors
❌ Comic Sans or informal fonts
❌ Content with more than 3 items per slide
❌ Content items longer than 25 characters

## Quality Standards
✅ Viral card aesthetic (engaging, shareable)
✅ Consistent color harmony within each template
✅ Readable and comfortable at mobile scale
✅ Balanced visual hierarchy (title > numbers > content)
✅ Subtle elegance (not flashy or trendy)
✅ Professional editorial feel
✅ Magazine-level polish

# OUTPUT FORMAT
Return ONLY valid JSON. No markdown fencing, no explanations, no comments.
Ensure all CSSProperties are valid React inline styles (camelCase properties, string values).
`;

// --- Exported Functions ---

export const generateThemeFromPrompt = async (config: AIConfig, prompt: string): Promise<ThemeStyles> => {
  // Enhance system prompt with relevant knowledge from RAG
  // 注意：传递 config 以支持 LLM 查询重写
  const enhancedSystemPrompt = await enhancePromptWithKnowledge(THEME_SYSTEM_PROMPT, prompt, config);

  return await chatCompletion(
    config,
    [
      { role: "system", content: enhancedSystemPrompt },
      { role: "user", content: `Create a WeChat article theme based on this description: "${prompt}". Return strict JSON.` }
    ],
    true
  );
};

export const generateRedNoteTemplateFromPrompt = async (config: AIConfig, prompt: string): Promise<RedNoteStyleConfig> => {
  // Enhance system prompt with relevant RedNote knowledge from RAG
  // 注意：传递 config 以支持 LLM 查询重写
  const enhancedSystemPrompt = await enhancePromptWithRedNoteKnowledge(REDNOTE_SYSTEM_PROMPT, prompt, config);

  return await chatCompletion(
    config,
    [
      { role: "system", content: enhancedSystemPrompt },
      { role: "user", content: `Create a RedNote card template based on this vibe: "${prompt}". Return strict JSON.` }
    ],
    true
  );
};

export const generateThemeFromImage = async (config: AIConfig, base64Data: string, mimeType: string): Promise<ThemeStyles> => {
  // Construct standard OpenAI Vision payload
  const messages = [
    { role: "system", content: THEME_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Analyze the aesthetic, color palette, and mood of this image. Create a matching WeChat article theme (React CSSProperties JSON)." },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Data}`
          }
        }
      ]
    }
  ];
  return await chatCompletion(config, messages, true);
};

export const generateRedNoteTemplateFromImage = async (config: AIConfig, base64Data: string, mimeType: string): Promise<RedNoteStyleConfig> => {
  const messages = [
    { role: "system", content: REDNOTE_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Extract the visual style and color palette from this image to create a RedNote card template configuration." },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Data}`
          }
        }
      ]
    }
  ];
  return await chatCompletion(config, messages, true);
};

export const transformTextToMarkdown = async (config: AIConfig, text: string): Promise<string> => {
  return await chatCompletion(
    config,
    [
      { role: "system", content: "You are an expert Markdown formatter. Reformat the user input into clean, structured Markdown. Use H1, H2, Bold, Lists. Do not summarize, keep original content meaning." },
      { role: "user", content: `Reformat this text:\n\n${text}` }
    ],
    false
  );
};

export const generateRedNoteSlides = async (config: AIConfig, markdown: string): Promise<RedNoteData> => {
  const schemaPrompt = `
  Convert article into Xiaohongshu slides JSON.
  Structure:
  {
    "slides": [
      {
        "title": "string",
        "content": ["string", "string"],
        "layout": "cover" | "list" | "quote" | "summary" | "keyword",
        "highlight": "string (optional)"
      }
    ]
  }

  ## MuseFlow Content Quality Standards
  - Extract KEY POINTS only (main ideas, core messages)
  - Cut minor details, examples, redundant explanations
  - Prioritize substance over length
  - Make content engaging and scannable

  ## Content Constraints (STRICT)
  - Each slide's "content" array MUST have MAXIMUM 3 items (list points)
  - Each content item should be 15-25 Chinese characters (concise but meaningful)
  - Total characters per slide: 45-75 Chinese characters (3 items × 15-25 chars)
  - Titles: 8-15 Chinese characters
  - Focus: One key message per slide

  ## Content Guidelines
  ✅ Engaging hook sentences (not generic "Introduction")
  ✅ Action-oriented or insight-driven content
  ✅ Clear structure (Problem → Solution, or Concept → Application)
  ✅ Memorable and shareable points
  ❌ Paragraph-style long explanations
  ❌ Multiple examples for same point
  ❌ Generic filler phrases ("Firstly", "Secondly", "In conclusion")

  ## Slide Layout Types
  - **cover**: Title + brief subtitle (1-2 sentences max)
  - **list**: 2-3 bullet points, each 15-25 characters
  - **quote**: 1 inspiring quote + 1 brief insight
  - **summary**: Key takeaways in 2-3 points
  - **keyword**: 2-3 related keywords or tags

  Important Constraints:
  - Each slide's "content" array MUST have MAXIMUM 3 items (list points)
  - Each content item should be 15-25 Chinese characters (concise but meaningful)
  - Keep content engaging, prioritize key points, cut minor details
  `;

  return await chatCompletion(
    config,
    [
      { role: "system", content: schemaPrompt },
      { role: "user", content: `Markdown Content:\n${markdown}` }
    ],
    true
  );
};