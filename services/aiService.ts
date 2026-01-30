import { ThemeStyles, RedNoteData, RedNoteStyleConfig, AIConfig } from "../types";

// Helper: Parse JSON safely
const parseJSON = <T>(text: string | undefined): T => {
  if (!text) return {} as T;
  try {
    // 1. Try direct parse
    return JSON.parse(text) as T;
  } catch (e) {
    // 2. Try extracting JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
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

// --- Built-in Theme References (Examples for AI) ---
// These serve as reference patterns for AI-generated themes
const BUILTIN_THEME_EXAMPLES = `
## Example Theme 1: 先锋杂志
{
  "container": {
    "fontFamily": "\\"Helvetica Neue\\", \\"Arial\\", sans-serif",
    "color": "#1a1a1a",
    "backgroundColor": "#ffffff",
    "padding": "20px"
  },
  "h1": {
    "fontSize": "26px",
    "fontWeight": "900",
    "color": "#000000",
    "textAlign": "left",
    "marginBottom": "30px",
    "marginTop": "20px",
    "lineHeight": "1.2",
    "letterSpacing": "-0.02em",
    "borderBottom": "4px solid #000",
    "paddingBottom": "16px"
  },
  "h2": {
    "fontSize": "20px",
    "fontWeight": "800",
    "color": "#000000",
    "marginBottom": "24px",
    "marginTop": "40px",
    "display": "flex",
    "alignItems": "center",
    "borderLeft": "6px solid #000",
    "paddingLeft": "12px",
    "lineHeight": "1"
  },
  "strong": {
    "color": "#000",
    "fontWeight": "bold",
    "backgroundColor": "#fcd34d",
    "padding": "0 4px"
  },
  "ul": {
    "paddingInlineStart": "24px",
    "marginBlock": "12px 16px",
    "color": "#1a1a1a",
    "listStyleType": "disc"
  },
  "table": {
    "width": "100%",
    "borderCollapse": "collapse",
    "marginBlock": "24px 32px",
    "fontSize": "14px"
  },
  "th": {
    "backgroundColor": "#1a1a1a",
    "color": "#ffffff",
    "padding": "12px 16px",
    "fontWeight": "600",
    "textAlign": "left",
    "borderBottom": "2px solid #000"
  }
}

## Example Theme 2: 山野迷雾
{
  "container": {
    "fontFamily": "\\"Noto Serif SC\\", \\"Songti SC\\", serif",
    "color": "#2c3e50",
    "backgroundColor": "#ffffff",
    "padding": "20px",
    "backgroundImage": "linear-gradient(to bottom, #f9fbf9 0%, #ffffff 100%)"
  },
  "h1": {
    "fontSize": "24px",
    "fontWeight": "bold",
    "color": "#3f6212",
    "textAlign": "center",
    "marginBottom": "40px",
    "marginTop": "20px",
    "letterSpacing": "0.1em"
  },
  "blockquote": {
    "borderLeft": "none",
    "borderTop": "2px solid #bef264",
    "borderBottom": "2px solid #bef264",
    "padding": "20px",
    "color": "#576046",
    "backgroundColor": "#fcfdfa",
    "fontSize": "14px",
    "marginBottom": "30px",
    "fontStyle": "italic",
    "textAlign": "center"
  },
  "strong": {
    "color": "#365314",
    "fontWeight": "bold"
  },
  "ul": {
    "paddingInlineStart": "24px",
    "marginBlock": "12px 16px",
    "color": "#2c3e50",
    "listStyleType": "square"
  }
}

## Example Theme 3: 极简白露
{
  "container": {
    "fontFamily": "\\"PingFang SC\\", \\"Helvetica Neue\\", sans-serif",
    "color": "#333333",
    "backgroundColor": "#ffffff",
    "padding": "20px"
  },
  "h1": {
    "fontSize": "22px",
    "fontWeight": "normal",
    "borderBottom": "1px solid #e5e5e5",
    "paddingBottom": "15px",
    "marginBottom": "30px",
    "marginTop": "20px",
    "textAlign": "center",
    "letterSpacing": "2px"
  },
  "blockquote": {
    "borderLeft": "3px solid #000",
    "padding": "10px 15px",
    "color": "#666",
    "backgroundColor": "transparent",
    "fontSize": "14px",
    "marginBottom": "24px"
  },
  "strong": {
    "color": "#000",
    "fontWeight": "600"
  },
  "ul": {
    "paddingInlineStart": "24px",
    "marginBlock": "12px 16px",
    "color": "#333333",
    "listStyleType": "square"
  }
}
`;

// --- Prompts ---

const THEME_SYSTEM_PROMPT = `${BUILTIN_THEME_EXAMPLES}

## Task
Based on the theme examples above and the design guidelines, create a NEW WeChat article theme based on the user's description.

## Important
- DO NOT copy any example exactly - use them as design reference only
- Create a UNIQUE theme that follows the same quality standards
- Apply ALL required properties (ul, ol, table, th, td, tr)
- Ensure the theme is cohesive and follows MuseFlow brand aesthetics
- The theme should feel like it belongs to a high-end magazine

## MuseFlow Brand Identity & Design Language

### Core Color Philosophy
- Stone Color Palette: #78716c (warm taupe), #57534e (charcoal), #e7e5e4 (light stone), #44403c (dark charcoal)
- Avoid: High saturation neon colors, pure black (#000000), pure red/green/blue
- Preferred: Muted earth tones, warm grays, subtle accent colors with lower saturation

### Typography Principles
- Font Families: Noto Serif SC (serif), Noto Sans SC (sans-serif), PingFang SC
- Hierarchy: Clear visual separation between headings (H1: 24-26px, H2: 18-20px, H3: 15-16px)
- Line Height: 1.7-1.9 for comfortable reading
- Letter Spacing: 0.02em-0.1em for elegance

### Layout & Spacing
- Padding: Generous breathing room (container padding: 20-24px)
- Margins: Consistent vertical spacing (heading margins: 24-40px)
- Border Radius: 4-12px for softness (no sharp edges except in specific themes)
- Box Shadows: Subtle, diffused shadows (0 4px 12px-20px rgba(0,0,0,0.05-0.1))

### Element Styling Guidelines

#### Headings
- H1: Bold, clear visual anchor, optional decorative elements (border-bottom, background)
- H2: Secondary hierarchy, optional left border or background pill
- H3: Tertiary, subtle underlines or borders

#### Paragraphs
- Font size: 14-16px
- Text align: Justified (default) or Left
- Line height: 1.7-1.9
- Color: #2c3e50 to #44403c range

#### Lists (UL/OL)
- List-style-type: disc, square, circle, decimal
- Padding-left: 20-28px
- Margin: 12-16px vertical
- List item margin: 6-10px
- Color: Inherit from text, slightly darker if needed

#### Tables
- Width: 100%
- Border-collapse: collapse
- Headers: Light background (#f5f5f4, #fef3c7, #f0f9ff ranges)
- Cells: 12-16px padding
- Borders: 1-2px solid with stone palette (#e7e5e4, #d6d3d1)
- Zebra striping: Alternate row backgrounds (#f9f9f9, #fafafa)

#### Code
- Inline code: 2-5px padding, 2-4px border-radius, light background (#f4f4f5, #f9fafb, #fef3c7)
- Code blocks: 16-20px padding, monospace font, darker background (#1e293b, #292524 range)
- Font family: Menlo, Monaco, Consolas

#### Blockquote
- Border-left: 2-4px solid (accent color)
- Padding: 16-20px
- Background: Light tint (#f9f9f9, #fffbeb, #fff0f5 ranges)
- Italic: optional
- Border-radius: 0-8px

#### Images
- Max-width: 100%
- Display: block, centered
- Border-radius: 0-8px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.05)

#### Horizontal Rules (HR)
- Height: 1-2px
- Color: Stone palette (#000000 with 0.1 opacity, or gradient)
- Margin: 40-50px

### Design Anti-Patterns (STRICTLY AVOID)
❌ Neon colors (#ff00ff, #00ffff, high saturation)
❌ Pure black (#000000) - use #1a1a1a or darker stone instead
❌ Pure primary colors (#ff0000, #00ff00, #0000ff)
❌ Glowing or vibrating effects
❌ Overly saturated or clashing colors
❌ Comic Sans or informal fonts
❌ Sharp corners on everything (use rounded when appropriate)
❌ Inconsistent spacing or alignment
❌ Over-decoration (avoid too many shadows, borders, gradients simultaneously)
❌ Bright cyan, magenta, lime green - NEVER use these

### Quality Standards
✅ Magazine-level polish and attention to detail
✅ Consistent color harmony within each theme
✅ Readable and comfortable at mobile scale (375px width)
✅ Balanced visual hierarchy (clear distinction between headings and body)
✅ Subtle elegance (not flashy or trendy)
✅ Professional editorial feel (like high-end magazines)

## Built-in Theme References

Study these existing MuseFlow themes as examples:
1. **先锋杂志**: Bold black/white, strong contrast, minimal color
2. **山野迷雾**: Green/stone earth tones, serene forest feel
3. **岛屿假日**: Blue/sand palette, mediterranean relaxation
4. **旧日玫瑰**: Muted rose/burgundy, romantic vintage feel
5. **极简白露**: Clean monochrome, maximum whitespace
6. **暖阳木质**: Warm earth tones, cozy coffee shop vibe

Return a JSON object matching this TypeScript interface:
interface ThemeStyles {
  container: CSSProperties;
  h1: CSSProperties;
  h2: CSSProperties;
  h3: CSSProperties;
  p: CSSProperties;
  blockquote: CSSProperties;
  strong: CSSProperties;
  li: CSSProperties;
  ul: CSSProperties;
  ol: CSSProperties;
  table: CSSProperties;
  th: CSSProperties;
  td: CSSProperties;
  tr: CSSProperties;
  a: CSSProperties;
  code: CSSProperties;
  pre?: CSSProperties;
  img: CSSProperties;
  hr: CSSProperties;
}

Return ONLY valid JSON. No markdown fencing.
`;


// --- Built-in RedNote Template References (Examples for AI) ---
const REDNOTE_TEMPLATE_EXAMPLES = `
## Example Template 1: 黑白瑞士
{
  "fontFamily": "Helvetica Neue, Arial, sans-serif",
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
  return await chatCompletion(
    config,
    [
      { role: "system", content: THEME_SYSTEM_PROMPT },
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