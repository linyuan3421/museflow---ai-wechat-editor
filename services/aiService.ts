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

// --- Prompts ---

const THEME_SYSTEM_PROMPT = `
You are a World-Class UI/UX Creative Director specializing in WeChat Official Account (公众号) Aesthetics.
Your goal is to create Magazine-Quality layouts that feel premium, breathable, and artistic.

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
  a: CSSProperties;
  code: CSSProperties;
  pre?: CSSProperties; // Code block container style
  img: CSSProperties;
  hr: CSSProperties;
}
Return ONLY valid JSON. No markdown fencing.
`;

const REDNOTE_SYSTEM_PROMPT = `
You are a Graphic Designer specializing in Xiaohongshu (RedNote) viral posts.
Create a visually stunning card template configuration.
Return a JSON matching the RedNoteStyleConfig schema.
Return ONLY valid JSON.
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