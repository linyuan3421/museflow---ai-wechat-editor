/**
 * 本地历史记录工具函数
 */

import { IndexedDB, HistoryDocument } from '../services/indexedDB';

// 配置常量
export const AUTO_SAVE_INTERVAL = 30000; // 30秒自动保存一次
export const MAX_HISTORY_VERSIONS = 20; // 最多保留20个版本
export const DOCUMENT_ID = 'current'; // 当前文档ID

let db: IndexedDB | null = null;

/**
 * 初始化 IndexedDB
 */
export async function initHistoryDB(): Promise<IndexedDB> {
  if (db) {
    return db;
  }

  try {
    db = new IndexedDB({
      name: 'museflow-history',
      storeName: 'documents',
      storeOptions: { keyPath: 'id', autoIncrement: true },
    });

    await db.init();
    return db;
  } catch (error) {
    console.error('[History] 初始化数据库失败:', error);
    throw error;
  }
}

/**
 * 保存文档到历史记录
 * @param content 文档内容
 * @param isRecent 是否为最近保存（更新最后一个版本）
 */
export async function saveToHistory(
  content: string,
  isRecent: boolean = false
): Promise<void> {
  if (!db) {
    await initHistoryDB();
  }

  if (!content.trim()) {
    return; // 空内容不保存
  }

  try {
    const allHistory = await db!.getAll(DOCUMENT_ID);

    if (isRecent && allHistory.length > 0) {
      // 更新最新的版本
      const latest = allHistory[0];
      const updatedDoc: HistoryDocument = {
        ...latest,
        content,
        saveTime: new Date(),
      };
      await db!.update(updatedDoc);
    } else {
      // 添加新版本
      const newDoc: HistoryDocument = {
        content,
        documentId: DOCUMENT_ID,
        saveTime: new Date(),
      };

      await db!.add(newDoc);

      // 清理旧版本
      await cleanupOldVersions();
    }
  } catch (error) {
    console.error('[History] 保存失败:', error);
  }
}

/**
 * 清理旧版本，保留最新的 N 个
 */
async function cleanupOldVersions(): Promise<void> {
  const allHistory = await db!.getAll(DOCUMENT_ID);

  if (allHistory.length > MAX_HISTORY_VERSIONS) {
    // 删除多余的版本（保留最新的 MAX_HISTORY_VERSIONS 个）
    const toDelete = allHistory.slice(MAX_HISTORY_VERSIONS);

    for (const doc of toDelete) {
      if (doc.id) {
        await db!.delete(doc.id);
      }
    }

    console.log(`[History] 清理了 ${toDelete.length} 个旧版本`);
  }
}

/**
 * 获取所有历史记录
 */
export async function getHistoryList(): Promise<HistoryDocument[]> {
  if (!db) {
    await initHistoryDB();
  }

  return db!.getAll(DOCUMENT_ID);
}

/**
 * 获取指定版本的内容
 */
export async function getHistoryContent(id: number): Promise<string | null> {
  if (!db) {
    await initHistoryDB();
  }

  const doc = await db!.get(id);
  return doc?.content || null;
}

/**
 * 删除指定版本
 */
export async function deleteHistoryVersion(id: number): Promise<void> {
  if (!db) {
    await initHistoryDB();
  }

  await db!.delete(id);
}

/**
 * 清空所有历史记录
 */
export async function clearAllHistory(): Promise<void> {
  if (!db) {
    await initHistoryDB();
  }

  await db!.clear();
}

/**
 * 格式化时间显示
 */
export function formatSaveTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

/**
 * 生成 diff HTML（简化版）
 * 实际项目中可以使用 diff-match-patch 等库
 */
export function generateDiffHtml(
  _oldContent: string,
  newContent: string
): string {
  // 简单实现：直接显示新内容
  // 完整实现可以使用 diff-match-patch 库
  return `<pre>${escapeHtml(newContent)}</pre>`;
}

/**
 * HTML 转义
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}
