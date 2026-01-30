import { CSSProperties } from 'react';

// Defines the structure of a Theme applied to Markdown elements
export interface ThemeStyles {
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
  pre?: CSSProperties; // Added to support code block styling
  img: CSSProperties;
  hr: CSSProperties;
}

export interface AppTheme {
  id: string;
  name: string;
  description: string;
  styles: ThemeStyles;
  isCustom?: boolean;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

// --- RedNote / Xiaohongshu specific types ---

export type EditorMode = 'wechat' | 'rednote';

export type CardLayoutType = 'cover' | 'list' | 'quote' | 'summary' | 'keyword';

export interface SlideContent {
  title: string;
  content: string[]; 
  footer?: string;
  layout: CardLayoutType;
  highlight?: string; // For keywords or big numbers
}

export interface RedNoteData {
  slides: SlideContent[];
}

// Configuration for AI-generated RedNote styles
export interface RedNoteStyleConfig {
  fontFamily: string;
  background: string; // CSS background property (color or gradient)
  textColor: string;
  accentColor: string; // For numbers, highlights
  borderColor: string;
  titleStyle: CSSProperties; // Specific overrides for the big title
  numberStyle: CSSProperties; // For the "01", "02" markers
  decoration: 'none' | 'noise' | 'grid' | 'gradient-blob'; // Background texture
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  isCustom?: boolean;
  styleConfig?: RedNoteStyleConfig; // Only present for custom themes
}

// --- AI Configuration ---

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  modelName: string;
}