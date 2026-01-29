import React, { useState, useEffect } from 'react';
import { AIConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

// Updated presets without parentheses in names
const PRESETS = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelName: 'gpt-4o'
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    modelName: 'deepseek-chat'
  },
  {
    name: 'Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    modelName: 'moonshot-v1-8k'
  },
  {
    name: 'Aliyun',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelName: 'qwen-plus'
  }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
    }
  }, [isOpen, config]);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setLocalConfig({
      ...localConfig,
      baseUrl: preset.baseUrl,
      modelName: preset.modelName
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-800/50 backdrop-blur-sm p-4">
      <div className="bg-[#fcfaf7] w-full max-w-md rounded-2xl shadow-2xl border border-[#e5e0d8] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e0d8] bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            AI 模型配置
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
           
           {/* Presets */}
           <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">快速预设</label>
              <div className="grid grid-cols-2 gap-2">
                 {PRESETS.map(p => (
                   <button 
                     key={p.name}
                     onClick={() => handleApplyPreset(p)}
                     className={`text-xs p-2 rounded-lg border transition-all text-left truncate ${localConfig.baseUrl === p.baseUrl ? 'bg-stone-100 border-stone-400 text-stone-800 font-bold' : 'bg-white border-[#e5e0d8] text-stone-500 hover:border-stone-300'}`}
                   >
                     {p.name}
                   </button>
                 ))}
              </div>
           </div>

           <div className="w-full h-px bg-[#e5e0d8]"></div>

           {/* Manual Config */}
           <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">API Base URL</label>
                <input 
                  type="text" 
                  value={localConfig.baseUrl}
                  onChange={(e) => setLocalConfig({...localConfig, baseUrl: e.target.value})}
                  placeholder="https://api.openai.com/v1"
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg p-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all font-mono placeholder:text-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">Model Name</label>
                <input 
                  type="text" 
                  value={localConfig.modelName}
                  onChange={(e) => setLocalConfig({...localConfig, modelName: e.target.value})}
                  placeholder="gpt-4o, deepseek-chat..."
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg p-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all font-mono placeholder:text-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5">API Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={localConfig.apiKey}
                    onChange={(e) => setLocalConfig({...localConfig, apiKey: e.target.value})}
                    placeholder="sk-..."
                    className="w-full bg-white border border-[#d6d3d1] rounded-lg p-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all font-mono placeholder:text-stone-300"
                  />
                  <div className="absolute right-2 top-2.5 text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                     本地存储
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e0d8]">
          {/* Version Info */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-stone-400">
              MuseFlow v1.0.0 · 2025年1月29日发布
            </span>
            <span className="text-xs text-stone-300">
              小而美的 AI 编辑伙伴
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => onSave(localConfig)}
              className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[#44403c] hover:bg-[#292524] transition-all shadow-md active:scale-95"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
