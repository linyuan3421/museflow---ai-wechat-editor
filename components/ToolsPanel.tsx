import React, { useState, useRef } from 'react';
import { AppTheme, GenerationStatus, EditorMode, CardTemplate, AIConfig } from '../types';
import { DEFAULT_THEMES, CARD_TEMPLATES } from '../constants';
import * as AIService from '../services/aiService';

interface ToolsPanelProps {
  currentTheme: AppTheme;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onThemeSelect: (theme: AppTheme) => void;
  onTemplateSelect: (templateId: string) => void;
  currentTemplateId: string;
  
  savedThemes: AppTheme[];
  onSaveTheme: (theme: AppTheme) => void;
  onDeleteTheme: (id: string, e: React.MouseEvent) => void;
  
  savedTemplates: CardTemplate[];
  onAddCustomTemplate: (template: CardTemplate) => void;
  onDeleteTemplate: (id: string, e: React.MouseEvent) => void;
  
  onMarkdownUpdate: (md: string) => void;
  onRedNoteGenerate: () => void;
  isGeneratingRedNote: boolean;
  onCopyHtml: () => void;
  
  // New props for config
  aiConfig: AIConfig;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ 
  currentTheme, 
  mode,
  onModeChange,
  onThemeSelect,
  onTemplateSelect,
  currentTemplateId,
  
  savedThemes,
  onSaveTheme,
  onDeleteTheme,
  
  savedTemplates,
  onAddCustomTemplate,
  onDeleteTemplate,
  
  onMarkdownUpdate,
  onRedNoteGenerate,
  isGeneratingRedNote,
  onCopyHtml,
  
  aiConfig,
  onOpenSettings,
  onOpenHelp
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'ai'>('themes');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [genStatus, setGenStatus] = useState<GenerationStatus>('idle');
  
  const [magicStatus, setMagicStatus] = useState<GenerationStatus>('idle');
  const [magicText, setMagicText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const checkConfig = () => {
    if (!aiConfig.apiKey) {
        onOpenSettings();
        return false;
    }
    return true;
  }

  const handleAiThemeGenerate = async () => {
    if (!aiPrompt.trim()) return;
    if (!checkConfig()) return;

    setGenStatus('generating');
    try {
      if (mode === 'wechat') {
        const styles = await AIService.generateThemeFromPrompt(aiConfig, aiPrompt);
        const newTheme: AppTheme = {
          id: `custom-${Date.now()}`,
          name: `AI: ${aiPrompt.substring(0, 10)}...`,
          description: 'AI 自动生成',
          styles: styles,
          isCustom: true
        };
        onThemeSelect(newTheme);
      } else {
        // REDNOTE MODE
        const styleConfig = await AIService.generateRedNoteTemplateFromPrompt(aiConfig, aiPrompt);
        const newTemplate: CardTemplate = {
          id: `custom-card-${Date.now()}`,
          name: `AI: ${aiPrompt.substring(0, 8)}...`,
          description: 'AI 专属定制设计',
          previewColor: styleConfig.accentColor || '#333',
          isCustom: true,
          styleConfig: styleConfig
        };
        onAddCustomTemplate(newTemplate);
      }
      setGenStatus('success');
    } catch (e: any) {
      console.error(e);
      setGenStatus('error');
      alert(`生成失败: ${e.message}`);
    }
  };

  const processImageFile = async (file: File) => {
    if (!checkConfig()) return;

    setGenStatus('generating');
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        
        if (mode === 'wechat') {
            const styles = await AIService.generateThemeFromImage(aiConfig, base64String, file.type);
            const newTheme: AppTheme = {
              id: `img-${Date.now()}`,
              name: '图片提取主题',
              description: '基于上传图片分析生成',
              styles: styles,
              isCustom: true
            };
            onThemeSelect(newTheme);
        } else {
            // REDNOTE MODE
            const styleConfig = await AIService.generateRedNoteTemplateFromImage(aiConfig, base64String, file.type);
            const newTemplate: CardTemplate = {
              id: `custom-card-img-${Date.now()}`,
              name: '图片提取模版',
              description: '基于图片氛围生成',
              previewColor: styleConfig.accentColor || '#333',
              isCustom: true,
              styleConfig: styleConfig
            };
            onAddCustomTemplate(newTemplate);
        }
        setGenStatus('success');
      } catch (error: any) {
        console.error(error);
        setGenStatus('error');
        alert(`生成失败: ${error.message} (注意：部分模型不支持图片上传)`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
    e.target.value = ''; // Reset input
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault(); // Prevent default paste behavior
        }
        break; // Process only the first image
      }
    }
  };

  const handleMagicConvert = async () => {
    if(!magicText.trim()) return;
    if (!checkConfig()) return;

    setMagicStatus('generating');
    try {
      const markdown = await AIService.transformTextToMarkdown(aiConfig, magicText);
      onMarkdownUpdate(markdown);
      setMagicText('');
      setMagicStatus('success');
      setTimeout(() => setMagicStatus('idle'), 2000);
    } catch (e: any) {
        console.error(e);
        setMagicStatus('error');
        alert(`转换失败: ${e.message}`);
    }
  };

  // Helper to check if current theme is saved
  const isCurrentThemeSaved = savedThemes.some(t => t.id === currentTheme.id);

  // --- Render Components ---

  return (
    <div className="w-80 h-full bg-[#fcfaf7] border-r border-[#e5e0d8] flex flex-col text-[#5a5046] relative">
      
      {/* Header & Mode Switcher */}
      <div className="p-5 border-b border-[#e5e0d8] bg-white/50 space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-serif-sc font-bold tracking-tight flex items-center gap-2 text-[#44403c]">
            <span className="bg-[#44403c] text-[#fcfaf7] w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm">光</span>
            浮光 · 掠影
            </h1>
            
            {/* Settings Button */}
            <button 
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
              title="设置 API Key"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
        </div>
        
        {/* Mode Toggle */}
        <div className="bg-[#e7e5e4] p-1 rounded-lg flex">
           <button 
             onClick={() => onModeChange('wechat')}
             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'wechat' ? 'bg-white text-[#44403c] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
           >
             公众号
           </button>
           <button 
             onClick={() => onModeChange('rednote')}
             className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${mode === 'rednote' ? 'bg-white text-[#ff2442] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <span className={mode === 'rednote' ? 'text-[#ff2442]' : 'text-stone-400'}>●</span> 小红书
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5e0d8] bg-white">
        <button 
          onClick={() => setActiveTab('themes')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'themes' ? 'text-[#44403c] font-bold' : 'text-stone-400 hover:text-stone-600'}`}
        >
          {mode === 'wechat' ? '样式库' : '卡片模版'}
          {activeTab === 'themes' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#44403c]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'ai' ? 'text-[#44403c] font-bold' : 'text-stone-400 hover:text-stone-600'}`}
        >
          灵感工坊
          {activeTab === 'ai' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#44403c]"></div>}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#fcfaf7]">
        
        {/* THEMES / TEMPLATES TAB */}
        {activeTab === 'themes' && (
          <div className="space-y-6">
            
            {mode === 'wechat' ? (
              // WECHAT THEMES
              <>
                 {/* 1. Saved / Custom Themes */}
                 {savedThemes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">我的收藏</h3>
                      <div className="space-y-2">
                        {savedThemes.map(theme => (
                          <div 
                            key={theme.id}
                            onClick={() => onThemeSelect(theme)}
                            className={`group p-4 rounded-xl cursor-pointer border transition-all duration-300 shadow-sm relative ${currentTheme.id === theme.id ? 'bg-white border-[#57534e] ring-1 ring-[#57534e] shadow-md' : 'bg-white border-[#e7e5e4] hover:border-[#a8a29e]'}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`font-bold text-sm ${currentTheme.id === theme.id ? 'text-[#292524]' : 'text-stone-700'}`}>{theme.name}</span>
                              {currentTheme.id === theme.id && <div className="w-2 h-2 rounded-full bg-[#44403c]"></div>}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">{theme.description}</p>
                            
                            {/* Delete Button */}
                            <button 
                               onClick={(e) => onDeleteTheme(theme.id, e)}
                               className="absolute top-2 right-2 p-1.5 rounded-md text-stone-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                               title="删除"
                            >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                 )}

                 {/* 2. Current Custom (Unsaved) */}
                 {currentTheme.isCustom && !isCurrentThemeSaved && (
                    <div className="border border-dashed border-[#57534e] bg-[#fafaf9] rounded-xl p-4">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs text-stone-500 block mb-1">当前生成</span>
                            <span className="font-bold text-sm text-[#292524]">{currentTheme.name}</span>
                          </div>
                          <button 
                             onClick={() => onSaveTheme(currentTheme)}
                             className="text-xs bg-[#57534e] text-white px-3 py-1.5 rounded-md hover:bg-[#292524] transition-colors flex items-center gap-1 shadow-sm"
                          >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                             收藏
                          </button>
                       </div>
                       <p className="text-xs text-stone-400">{currentTheme.description}</p>
                    </div>
                 )}

                 {/* 3. Default Themes */}
                 <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 mt-2">精选主题</h3>
                    <div className="space-y-2">
                      {DEFAULT_THEMES.map(theme => (
                        <div 
                          key={theme.id}
                          onClick={() => onThemeSelect(theme)}
                          className={`group p-4 rounded-xl cursor-pointer border transition-all duration-300 shadow-sm ${currentTheme.id === theme.id ? 'bg-white border-[#57534e] ring-1 ring-[#57534e] shadow-md' : 'bg-white border-[#e7e5e4] hover:border-[#a8a29e]'}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold text-sm ${currentTheme.id === theme.id ? 'text-[#292524]' : 'text-stone-700'}`}>{theme.name}</span>
                            {currentTheme.id === theme.id && <div className="w-2 h-2 rounded-full bg-[#44403c]"></div>}
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{theme.description}</p>
                        </div>
                      ))}
                    </div>
                 </div>
              </>
            ) : (
              // REDNOTE TEMPLATES
              <>
                {/* 1. Saved Templates */}
                {savedTemplates.length > 0 && (
                   <div>
                      <h3 className="text-xs font-bold text-stone-400 uppercase mb-2">我的收藏</h3>
                      <div className="space-y-2">
                        {savedTemplates.map(tpl => (
                          <div 
                            key={tpl.id}
                            onClick={() => onTemplateSelect(tpl.id)}
                            className={`group p-4 rounded-xl cursor-pointer border transition-all duration-300 shadow-sm relative ${currentTemplateId === tpl.id ? 'bg-white border-[#57534e] ring-1 ring-[#57534e] shadow-md' : 'bg-white border-[#e7e5e4] hover:border-[#a8a29e]'}`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-bold text-sm ${currentTemplateId === tpl.id ? 'text-[#292524]' : 'text-stone-700'}`}>{tpl.name}</span>
                              <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{backgroundColor: tpl.previewColor}}></div>
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">{tpl.description}</p>

                             {/* Delete Button */}
                             <button 
                               onClick={(e) => onDeleteTemplate(tpl.id, e)}
                               className="absolute top-2 right-2 p-1.5 rounded-md text-stone-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                               title="删除"
                            >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>
                )}

                {/* 2. Default Templates */}
                <div>
                   <h3 className="text-xs font-bold text-stone-400 uppercase mb-2 mt-2">设计模版</h3>
                   <div className="space-y-2">
                      {CARD_TEMPLATES.map(tpl => (
                         <div 
                          key={tpl.id}
                          onClick={() => onTemplateSelect(tpl.id)}
                          className={`group p-4 rounded-xl cursor-pointer border transition-all duration-300 shadow-sm ${currentTemplateId === tpl.id ? 'bg-white border-[#57534e] ring-1 ring-[#57534e] shadow-md' : 'bg-white border-[#e7e5e4] hover:border-[#a8a29e]'}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-bold text-sm ${currentTemplateId === tpl.id ? 'text-[#292524]' : 'text-stone-700'}`}>{tpl.name}</span>
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: tpl.previewColor}}></div>
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{tpl.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* AI STUDIO TAB (UNIFIED for both modes) */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            
            {/* 1. Magic Convert (Common for both) */}
            <section>
                 <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   智能格式清洗
                 </h3>
                 <div className="bg-white p-4 rounded-xl border border-[#e5e5e5] shadow-sm">
                    <textarea 
                      value={magicText}
                      onChange={(e) => setMagicText(e.target.value)}
                      placeholder="在此粘贴飞书文档、纯文本..."
                      className="w-full bg-[#f9fafb] border border-[#e5e5e5] rounded-lg p-3 text-xs text-stone-600 focus:border-[#57534e] focus:outline-none mb-3 min-h-[80px] placeholder:text-stone-300 resize-none"
                    />
                    <button 
                      onClick={handleMagicConvert}
                      disabled={magicStatus === 'generating' || !magicText.trim()}
                      className="w-full py-2 rounded-lg bg-[#57534e] hover:bg-[#292524] text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-sm"
                    >
                      {magicStatus === 'generating' ? 'AI 整理中...' : '一键转为 Markdown'}
                    </button>
                    {magicStatus === 'success' && <p className="text-[10px] text-green-600 mt-2 text-center flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      转换成功
                    </p>}
                 </div>
              </section>

            {/* 2. Text to Theme (Adaptive) */}
            <section>
              <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 flex items-center gap-1">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                 {mode === 'wechat' ? '文字生成排版主题' : '文字生成卡片模版'}
               </h3>
              <div className="space-y-2">
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={mode === 'wechat' ? "例如：'莫兰迪色系的油画质感'" : "例如：'赛博朋克霓虹' 或 '极简咖啡馆'"}
                  className="w-full bg-white border border-[#e5e5e5] rounded-lg p-3 text-xs text-stone-600 focus:border-[#57534e] focus:outline-none min-h-[80px] placeholder:text-stone-300 resize-none shadow-sm"
                />
                <button 
                  onClick={handleAiThemeGenerate}
                  disabled={genStatus === 'generating' || !aiPrompt.trim()}
                  className="w-full py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold border border-stone-200 transition-colors disabled:opacity-50"
                >
                  {genStatus === 'generating' ? '设计中...' : mode === 'wechat' ? '生成主题' : '生成卡片'}
                </button>
              </div>
            </section>

            {/* 3. Image to Theme (Adaptive) */}
            <section>
              <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                图片提取{mode === 'wechat' ? '风格' : '设计'}
              </h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                onPaste={handlePaste}
                tabIndex={0}
                className="border-2 border-dashed border-[#e5e5e5] hover:border-[#57534e] hover:bg-[#fafaf9] focus:border-[#57534e] focus:bg-[#fafaf9] focus:outline-none rounded-xl p-6 text-center cursor-pointer transition-all group bg-white relative"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#e7e5e4] transition-colors">
                  <svg className="w-5 h-5 text-stone-400 group-hover:text-[#44403c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-xs font-medium text-stone-500 group-hover:text-[#292524]">
                  点击上传 或 Ctrl+V 粘贴
                </p>
                <p className="text-[10px] text-stone-400 mt-1">AI 自动提取配色与质感</p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Button - Always visible, context aware */}
      <div className="p-5 border-t border-[#e5e0d8] bg-white">
        {mode === 'wechat' ? (
          <button 
            onClick={onCopyHtml}
            className="w-full py-3 bg-[#44403c] hover:bg-[#292524] text-white font-bold rounded-xl shadow-lg shadow-stone-400/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>复制到微信公众号</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          </button>
        ) : (
          <button 
            onClick={onRedNoteGenerate}
            disabled={isGeneratingRedNote}
            className="w-full py-3 bg-[#ff2442] hover:bg-[#e61e3b] text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isGeneratingRedNote ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>AI 设计中...</span>
              </>
            ) : (
              <>
                <span>✨ 生成小红书卡片</span>
              </>
            )}
          </button>
        )}

         {/* Help Button */}
         <div className="mt-3">
            <button
              onClick={onOpenHelp}
              className="w-full py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
              title="使用帮助"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.732 0 1.32.597 1.32 1.333v2.667c0 .736.357.32.597 1.32h1.326c.735 0 1.334-.597 1.333 1.332v2.667c0-.735-.357-1.333-.597-1.333H8.228c-.732 0-1.32-.597-1.32-1.333V9.333c0-.736.357-1.32.597-1.32h1.326c.735 0 1.334.597 1.333 1.332V6.667c0-.735-.357-1.333-.597-1.333H8.228z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 014 4 4 0 018 8 0z" /></svg>
              使用帮助
            </button>
         </div>

         {/* Branding Footer */}
         <div className="mt-4 pt-3 border-t border-dashed border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 block mb-0.5">Created by</span>
            <span className="font-serif-sc font-bold text-xs text-stone-600 hover:text-stone-800 transition-colors cursor-default">反时钟效率笔记</span>
         </div>
       </div>
    </div>
  );
};

export default ToolsPanel;
