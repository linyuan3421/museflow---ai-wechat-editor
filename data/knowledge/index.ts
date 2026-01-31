import colors from './colors.json';
import textures from './textures.json';
import scenes from './scenes.json';
import styles from './structure.json';
import techniques from './techniques.json';
import emotions from './emotions.json';

import type { KnowledgeEntry } from '../../services/knowledgeService';

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  ...colors,
  ...textures,
  ...scenes,
  ...styles,
  ...techniques,
  ...emotions
];

export default KNOWLEDGE_BASE;
