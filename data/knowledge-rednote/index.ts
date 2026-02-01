/**
 * RedNote Knowledge Base
 * 小红书卡片设计知识库聚合文件
 *
 * 组织结构：
 * - 配色方案 (color-rednote.json): 30条配色方案
 * - 字体排印 (typography-rednote.json): 20条字体排印方案
 * - 布局技法 (layout-rednote.json): 15条布局技法
 * - 装饰技法 (decoration-rednote.json): 10条装饰技法
 *
 * 总计: 75条知识条目
 *
 * 使用方式：
 * import redNoteKnowledge from '@/data/knowledge-rednote';
 * const { colors, typography, layouts, decorations } = redNoteKnowledge;
 */

import colors from './color-rednote.json';
import typography from './typography-rednote.json';
import layouts from './layout-rednote.json';
import decorations from './decoration-rednote.json';

/**
 * RedNote Knowledge Base
 * 聚合所有小红书设计知识
 */
const redNoteKnowledge = [
  ...colors,
  ...typography,
  ...layouts,
  ...decorations,
] as const;

export default redNoteKnowledge;

/**
 * 分类导出（便于类型访问）
 */
export const redNoteColors = colors;
export const redNoteTypography = typography;
export const redNoteLayouts = layouts;
export const redNoteDecorations = decorations;
