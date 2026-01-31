import { ThemeStyles, RedNoteData, RedNoteStyleConfig, AIConfig } from "../types";
import { enhancePromptWithKnowledge } from "./knowledgeService";

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


// --- Built-in RedNote Template References (Examples for AI) ---
const REDNOTE_TEMPLATE_EXAMPLES = `
## Example Template 1: 黑白瑞士
{
  "fontFamily": "Helvetica, Arial, sans-serif",
  "background": "#ffffff",
  "textColor": "#000000",
  "accentColor": "#000000",
  "borderColor": "#000000",
  "titleStyle": {
    "fontSize": "28px",
    "fontWeight": "900",
    "textAlign": "left"
  },
  "numberStyle": {
    "fontSize": "64px",
    "fontWeight": "900",
    "color": "#000000"
  },
  "decoration": "none"
}

## Example Template 2: 琉光拟态
{
  "fontFamily": "Noto Sans SC, sans-serif",
  "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "textColor": "#ffffff",
  "accentColor": "#ffffff",
  "borderColor": "rgba(255,255,255,0.2)",
  "titleStyle": {
    "fontSize": "22px",
    "fontWeight": "bold",
    "color": "#ffffff"
  },
  "numberStyle": {
    "fontSize": "48px",
    "fontWeight": "bold",
    "color": "rgba(255,255,255,0.8)"
  },
  "decoration": "noise"
}

## Example Template 3: 新波普
{
  "fontFamily": "PingFang SC, sans-serif",
  "background": "#ffffff",
  "textColor": "#1a1a1a",
  "accentColor": "#ff4030",
  "borderColor": "#ff4030",
  "titleStyle": {
    "fontSize": "20px",
    "fontWeight": "bold",
    "color": "#000000"
  },
  "numberStyle": {
    "fontSize": "36px",
    "fontWeight": "900",
    "color": "#ff4030"
  },
  "decoration": "none"
}
`;


const REDNOTE_SYSTEM_PROMPT = `${REDNOTE_TEMPLATE_EXAMPLES}

## Task
Based on the template examples above and design guidelines, create a NEW Xiaohongshu card template configuration.

## Important
- DO NOT copy any example exactly - use them as design reference only
- Create a UNIQUE template that follows the same quality standards
- Apply ALL required properties correctly
- Ensure the template feels cohesive and follows MuseFlow brand aesthetics

## MuseFlow RedNote Design Principles

### Core Color Philosophy
- Stone Color Palette: #78716c (warm taupe), #57534e (charcoal), #e7e5e4 (light stone), #44403c (dark charcoal)
- Avoid: High saturation neon colors, pure black (#000000)
- Preferred: Muted earth tones, warm grays, subtle accent colors

### Typography Principles
- Font Families: Noto Serif SC (serif), Noto Sans SC (sans-serif), PingFang SC
- Content Font Size: 14-16px for readability
- Title Font Size: 20-28px
- Number Font Size: 36-64px (for "01", "02" markers)
- Line Height: 1.6-1.8 for comfortable reading

### Layout & Spacing
- Card Padding: 24-32px for breathing room
- Content Spacing: 12-16px vertical between elements
- Border Radius: 8-16px for softness
- Content List Items: MAXIMUM 3 items per slide
- Content Item Length: 15-25 Chinese characters per item (concise but meaningful)

### Decoration Types
- "none": Clean, minimal, focus on typography
- "noise": Subtle grain/texture overlay (use light opacity: 0.03-0.05)
- "grid": Subtle dot pattern (small dots, low contrast)
- "gradient-blob": Soft organic shape background

### Color Harmony Guidelines
- Background: Should be #fcfaf7 (off-white), #ffffff, or light stone gradient
- Text: #44403c, #57534e, or #292524 (high readability)
- Accent: Muted earth tones (#78716c, #d6d3d1, #a8a29e)
- Border: #e7e5e4, #d6d3d1, or #a8a29e
- Avoid: Neon (#00ffff, #ff00ff), pure primary (#ff0000, #00ff00, #0000ff)

### Design Anti-Patterns (STRICTLY AVOID)
❌ Neon colors (#ff00ff, #00ffff, high saturation)
❌ Pure black (#000000) - use #44403c or #292524 instead
❌ Pure primary colors (#ff0000, #00ff00, #0000ff)
❌ Glowing or vibrating effects
❌ Overly saturated or clashing colors
❌ Comic Sans or informal fonts
❌ Content with more than 3 items per slide
❌ Content items longer than 25 characters

### Quality Standards
✅ Viral card aesthetic (engaging, shareable)
✅ Consistent color harmony within each template
✅ Readable and comfortable at mobile scale
✅ Balanced visual hierarchy (title > numbers > content)
✅ Subtle elegance (not flashy or trendy)
✅ Professional editorial feel

## Built-in Template References

Study these existing MuseFlow RedNote templates as examples:
1. **黑白瑞士**: Extreme contrast, grid alignment, sculptural typography
2. **琉光拟态**: Glassmorphism, luminous gradients, high-tech future feel
3. **新波普**: High saturation contrast, bold black borders, retro collage art style

Return a JSON object matching RedNoteStyleConfig schema:
interface RedNoteStyleConfig {
  fontFamily: string;
  background: string; // CSS background property (color or gradient)
  textColor: string;
  accentColor: string; // For numbers, highlights
  borderColor: string;
  titleStyle: CSSProperties; // Specific overrides for big title
  numberStyle: CSSProperties; // For "01", "02" markers
  decoration: 'none' | 'noise' | 'grid' | 'gradient-blob'; // Background texture
}

Return ONLY valid JSON. No markdown fencing.
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
  return await chatCompletion(
    config,
    [
      { role: "system", content: REDNOTE_SYSTEM_PROMPT },
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