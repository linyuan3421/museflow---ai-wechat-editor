import React, { useState, useEffect } from 'react';
import { HistoryDocument } from '../services/indexedDB';
import { getHistoryList, formatSaveTime, generateDiffHtml } from '../utils/historyUtils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onRestore: (content: string) => void;
}

type ViewMode = 'preview' | 'diff';

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onRestore,
}) => {
  const [historyList, setHistoryList] = useState<HistoryDocument[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<HistoryDocument | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isLoading, setIsLoading] = useState(false);

  // 加载历史记录
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const list = await getHistoryList();
      setHistoryList(list);

      // 默认选择最新的版本
      if (list.length > 0 && !selectedVersion) {
        setSelectedVersion(list[0]);
      }
    } catch (error) {
      console.error('[HistoryModal] 加载历史记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVersionSelect = (version: HistoryDocument) => {
    setSelectedVersion(version);
  };

  const handleRestore = () => {
    if (selectedVersion) {
      onRestore(selectedVersion.content);
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (!confirm('确定要删除这个版本吗？')) {
      return;
    }

    try {
      const { deleteHistoryVersion } = await import('../utils/historyUtils');
      await deleteHistoryVersion(id);

      // 重新加载列表
      await loadHistory();

      // 如果删除的是当前选中的版本，选中第一个
      if (selectedVersion?.id === id && historyList.length > 1) {
        setSelectedVersion(historyList[1]);
      }
    } catch (error) {
      console.error('[HistoryModal] 删除版本失败:', error);
      alert('删除失败，请重试');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      const { clearAllHistory } = await import('../utils/historyUtils');
      await clearAllHistory();
      setHistoryList([]);
      setSelectedVersion(null);
    } catch (error) {
      console.error('[HistoryModal] 清空历史记录失败:', error);
      alert('清空失败，请重试');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-800/50 backdrop-blur-sm p-4">
      <div className="bg-[#fcfaf7] w-full max-w-5xl h-[700px] rounded-2xl shadow-2xl border border-[#e5e0d8] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e0d8] bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-700 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            本地历史记录
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Version List */}
          <div className="w-72 border-r border-[#e5e0d8] bg-white/50 flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#e5e0d8] flex justify-between items-center">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                历史版本
              </span>
              <span className="text-xs text-stone-400">
                {historyList.length} 个版本
              </span>
            </div>

            {/* Version List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin"></div>
                </div>
              ) : historyList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-stone-400">
                  <svg
                    className="w-12 h-12 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">暂无历史记录</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {historyList.map((version, index) => (
                    <div
                      key={version.id}
                      onClick={() => handleVersionSelect(version)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 relative ${
                        selectedVersion?.id === version.id
                          ? 'bg-[#57534e] text-white shadow-md'
                          : 'hover:bg-[#e7e5e4] text-stone-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-medium block ${
                            selectedVersion?.id === version.id ? 'text-white' : 'text-stone-700'
                          }`}>
                            {index === 0 ? '最新' : `版本 ${index + 1}`}
                          </span>
                          <span className={`text-[10px] block mt-0.5 ${
                            selectedVersion?.id === version.id ? 'text-stone-300' : 'text-stone-400'
                          }`}>
                            {formatSaveTime(new Date(version.saveTime))}
                          </span>
                        </div>

                        {/* Delete Button */}
                        {version.id && (
                          <button
                            onClick={(e) => handleDelete(e, version.id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                              selectedVersion?.id === version.id
                                ? 'hover:bg-stone-600 text-stone-300'
                                : 'hover:bg-red-100 text-stone-400 hover:text-red-500'
                            }`}
                            title="删除此版本"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Content Preview */}
                      <p className={`text-[10px] line-clamp-2 leading-relaxed ${
                        selectedVersion?.id === version.id ? 'text-stone-300' : 'text-stone-400'
                      }`}>
                        {version.content.substring(0, 80)}
                        {version.content.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All Button */}
            {historyList.length > 0 && (
              <div className="p-3 border-t border-[#e5e0d8]">
                <button
                  onClick={handleClearAll}
                  className="w-full py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  清空所有历史
                </button>
              </div>
            )}
          </div>

          {/* Right Preview Area */}
          <div className="flex-1 flex flex-col bg-[#fcfaf7]">
            {/* View Mode Toggle */}
            {selectedVersion && (
              <div className="px-4 py-3 border-b border-[#e5e0d8] bg-white/50 flex items-center gap-4">
                <div className="flex bg-[#e7e5e4] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'preview'
                        ? 'bg-white text-[#44403c] shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    全文预览
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'diff'
                        ? 'bg-white text-[#44403c] shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    对比当前
                  </button>
                </div>

                <span className="text-xs text-stone-400">
                  {formatSaveTime(new Date(selectedVersion.saveTime))}
                </span>
              </div>
            )}

            {/* Content Preview */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {!selectedVersion ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <svg
                    className="w-16 h-16 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">请选择一个历史版本查看</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#e5e0d8] p-6 shadow-sm">
                  {viewMode === 'preview' ? (
                    <pre className="text-sm text-stone-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedVersion.content}
                    </pre>
                  ) : (
                    <div
                      className="text-sm text-stone-700 whitespace-pre-wrap font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: generateDiffHtml(currentContent, selectedVersion.content),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e0d8] flex justify-between items-center">
          <span className="text-xs text-stone-400">
            最多保留 20 个版本，每 30 秒自动保存
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleRestore}
              disabled={!selectedVersion}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[#44403c] hover:bg-[#292524] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              恢复此版本
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
