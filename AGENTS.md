# MuseFlow - Agent Development Guide

## Build & Development

### Commands
```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Build production: tsc + vite build
npm run preview   # Preview production build locally
```

### Testing
**No test framework configured.** This project is in early development without tests. When adding tests:
- Consider Vitest (Vite-native) or Jest
- Configure before writing first test
- Follow existing component structure

## TypeScript Configuration

**Strict mode is enabled** (`strict: true`). All type errors must be resolved.

**Compiler options enforced:**
- `noUnusedLocals`: Unused local variables are errors
- `noUnusedParameters`: Unused parameters are errors
- `noFallthroughCasesInSwitch`: Break required in switch cases
- JSX: `react-jsx` (automatic runtime)
- Target: ES2020, Module: ESNext

**Never use:**
- `as any` - Type assertions must be specific
- `@ts-ignore` - Fix the actual type error
- `@ts-expect-error` - Only for intentionally invalid code

## Code Style Guidelines

### Import Ordering
```typescript
// 1. React hooks & libraries
import React, { useState, useEffect } from 'react';

// 2. Local components (alphabetical)
import Editor from './components/Editor';
import Preview from './components/Preview';

// 3. Constants & types
import { INITIAL_MARKDOWN, DEFAULT_THEMES } from './constants';
import { AppTheme, EditorMode } from './types';

// 4. Services & utilities
import * as AIService from './services/aiService';
```

### Naming Conventions
- **Components**: PascalCase - `Editor`, `Preview`, `RedNotePreview`
- **Functions**: camelCase - `handleCopy`, `generateTheme`, `startResizing`
- **Interfaces/Types**: PascalCase - `EditorProps`, `AIConfig`, `ThemeStyles`
- **Constants**: UPPER_SNAKE_CASE - `INITIAL_MARKDOWN`, `DEFAULT_THEMES`
- **Event handlers**: `handle` prefix - `handleSave`, `handleChange`, `handleSubmit`

### Component Structure
```typescript
import React from 'react';

interface ComponentProps {
  // Required props first
  value: string;
  onChange: (val: string) => void;
  // Optional props last with default values
  disabled?: boolean;
}

const Component: React.FC<ComponentProps> = ({ value, onChange, disabled = false }) => {
  // 1. Hooks (useState, useRef, useEffect)
  // 2. Event handlers
  // 3. Helper functions
  // 4. JSX return
  return <div>{/* content */}</div>;
};

export default Component;
```

### Error Handling Patterns
```typescript
// Async functions: throw with descriptive messages
async function fetchData() {
  if (!config.apiKey) {
    throw new Error("请先点击设置图标配置 API Key");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${await response.text()}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Operation failed:", error);
    throw error; // Re-throw for caller handling
  }
}

// In components: user-facing alerts
const handleAction = async () => {
  try {
    await doSomething();
  } catch (error: any) {
    console.error(error);
    alert("操作失败: " + error.message);
  }
};
```

### State Management Patterns
```typescript
// LocalStorage persistence pattern
const [data, setData] = useState<T>(() => {
  try {
    const saved = localStorage.getItem('museflow_data');
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error("Failed to load data", e);
    return defaultValue;
  }
});

useEffect(() => {
  localStorage.setItem('museflow_data', JSON.stringify(data));
}, [data]);
```

### Type Definitions
- Centralize in `types.ts`
- Export all interfaces and types
- Use `interface` for object shapes, `type` for unions/primitives
- Mark optional properties with `?`

```typescript
// types.ts
export interface AppTheme {
  id: string;
  name: string;
  description: string;
  styles: ThemeStyles;
  isCustom?: boolean;
}

export type EditorMode = 'wechat' | 'rednote';
```

## Styling

- **Framework**: Tailwind CSS 3.x via PostCSS
- **Approach**: Utility-first classes
- **Custom colors**: Use project palette from design (stone, neutral tones)
- **Responsive**: Mobile-first (see WeChat preview at 375px)

Example:
```tsx
<div className="flex h-screen w-screen overflow-hidden bg-[#f4f5f0] text-stone-700 font-sans">
  <aside className="shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    {/* content */}
  </aside>
</div>
```

## Architecture Notes

### Project Structure
```
/
├── components/      # React components
├── services/        # API services (AI integration)
├── types.ts         # TypeScript interfaces
├── constants.ts     # Constants and default configs
├── App.tsx          # Main application component
└── index.tsx        # Entry point
```

### Key Patterns
- **Service layer**: AI operations in `services/aiService.ts`
- **Type safety**: All props typed, no implicit `any`
- **LocalStorage**: User config, themes, templates persisted locally
- **BYOK**: Users bring own API keys, stored in LocalStorage

## Development Workflow

1. **Type check before committing**: Run `npm run build` to catch TS errors
2. **Test in dev mode**: Vite HMR is fast, use it
3. **Local browser storage**: Clear if testing fresh state
4. **AI integration**: Configure API key in Settings modal first

## Adding Features

When adding new functionality:
1. Define types in `types.ts`
2. Create service in `services/` if async/AI involved
3. Build component in `components/`
4. Integrate in `App.tsx` state
5. Persist in LocalStorage if user data
6. Add to ToolsPanel if UI action needed

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm + rehype-raw
- **Export**: html2canvas
- **AI**: Native fetch (OpenAI-compatible API)
