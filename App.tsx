import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import Editor from './components/Editor';
import Preview from './components/Preview';
import RedNotePreview from './components/RedNotePreview';
import ToolsPanel from './components/ToolsPanel';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import HistoryModal from './components/HistoryModal';
import { INITIAL_MARKDOWN, DEFAULT_THEMES, CARD_TEMPLATES } from './constants';
import { AppTheme, EditorMode, RedNoteData, CardTemplate, SlideContent, AIConfig } from './types';
import * as AIService from './services/aiService';
import { initHistoryDB, saveToHistory, AUTO_SAVE_INTERVAL } from './utils/historyUtils';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(INITIAL_MARKDOWN);
  const [mode, setMode] = useState<EditorMode>('wechat');

  // --- PERSISTENCE STATE ---
  
  // Load saved themes from local storage
  const [savedThemes, setSavedThemes] = useState<AppTheme[]>(() => {
    try {
      const saved = localStorage.getItem('museflow_saved_themes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load themes", e);
      return [];
    }
  });

  // Load saved templates from local storage
  const [savedTemplates, setSavedTemplates] = useState<CardTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('museflow_saved_templates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load templates", e);
      return [];
    }
  });

  // Load AI Config
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    try {
      const saved = localStorage.getItem('museflow_ai_config');
      return saved ? JSON.parse(saved) : {
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        modelName: 'gpt-4o'
      };
    } catch (e) {
      return { apiKey: '', baseUrl: 'https://api.openai.com/v1', modelName: 'gpt-4o' };
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load sync scroll preference from local storage
  const [syncScrollEnabled, setSyncScrollEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('museflow_sync_scroll');
      return saved !== null ? JSON.parse(saved) : true; // Default: enabled
    } catch (e) {
      console.error("Failed to load sync scroll preference", e);
      return true;
    }
  });

  // Save to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('museflow_saved_themes', JSON.stringify(savedThemes));
  }, [savedThemes]);

  useEffect(() => {
    localStorage.setItem('museflow_saved_templates', JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  useEffect(() => {
    localStorage.setItem('museflow_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useEffect(() => {
    localStorage.setItem('museflow_sync_scroll', JSON.stringify(syncScrollEnabled));
  }, [syncScrollEnabled]);

  // --- HISTORY AUTO-SAVE ---
  useEffect(() => {
    let timer: number;
 
    // Initialize IndexedDB and setup auto-save
    const initAutoSave = async () => {
      try {
        await initHistoryDB();

        // Periodic auto-save (every 30 seconds)
        timer = setInterval(() => {
          saveToHistory(markdown, false);
        }, AUTO_SAVE_INTERVAL);
      } catch (error) {
        console.error('[App] Failed to initialize history:', error);
      }
    };

    initAutoSave();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [markdown]);


  const [theme, setTheme] = useState<AppTheme>(DEFAULT_THEMES[0]);
  
  // RedNote State
  const [redNoteData, setRedNoteData] = useState<RedNoteData | null>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(CARD_TEMPLATES[0].id);
  const [isGeneratingRedNote, setIsGeneratingRedNote] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null); // Ref for Editor textarea
  const previewScrollRef = useRef<HTMLDivElement>(null); // Ref for Preview scroll container
  const [copyFeedback, setCopyFeedback] = useState(false);

  // --- Layout Resizing State ---
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px
  const [editorPercentage, setEditorPercentage] = useState(50); // Default 50% of remaining space
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingEditor, setIsDraggingEditor] = useState(false);
  
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  // Refs for tracking initial drag state
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(0);
 
  // --- Resizing Handlers ---
  
  const startResizingSidebar = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSidebar(true);
    dragStartXRef.current = e.clientX;
    dragStartWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);
  
  const startResizingEditor = useCallback(() => setIsDraggingEditor(true), []);
  
  const stopResizing = useCallback(() => {
    setIsDraggingSidebar(false);
    setIsDraggingEditor(false);
  }, []);
 
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingSidebar) {
      // Calculate delta from drag start
      const deltaX = e.clientX - dragStartXRef.current;
      const newWidth = dragStartWidthRef.current + deltaX;
      
      // Limit sidebar width between 200px and 500px
      const clampedWidth = Math.max(200, Math.min(newWidth, 500));
      setSidebarWidth(clampedWidth);
    } else if (isDraggingEditor && rightPanelRef.current) {
      // Calculate percentage based on right panel's width
      const panelRect = rightPanelRef.current.getBoundingClientRect();
      const relativeX = e.clientX - panelRect.left;
      const newPercentage = (relativeX / panelRect.width) * 100;
      
      // Limit editor to 20% - 80% of right panel
      const constrainedPercentage = Math.max(20, Math.min(newPercentage, 80));
      setEditorPercentage(constrainedPercentage);
    }
  }, [isDraggingSidebar, isDraggingEditor]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };
    
    const onMouseUp = () => {
      stopResizing();
    };

    if (isDraggingSidebar || isDraggingEditor) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      // Disable text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingSidebar, isDraggingEditor, handleMouseMove, stopResizing]);


  // --- App Logic ---

  const handleCopy = async () => {
    if (!previewRef.current) return;
    const contentNode = previewRef.current.firstElementChild as HTMLElement; 
    if (!contentNode) return;

    try {
      const clone = contentNode.cloneNode(true) as HTMLElement;
      if (clone.lastElementChild && clone.lastElementChild.className.includes('h-20')) {
        clone.removeChild(clone.lastElementChild);
      }
      const htmlContent = clone.outerHTML;
      const plainText = clone.innerText || '';
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const plainTextBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': plainTextBlob
      });
      await navigator.clipboard.write([item]);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      alert("复制失败，请手动全选预览区内容复制");
    }
  };

  const handleRedNoteGenerate = async () => {
    if (!markdown.trim()) return;
    
    if (!aiConfig.apiKey) {
        setIsSettingsOpen(true);
        return;
    }

    setIsGeneratingRedNote(true);
    setMode('rednote');
    try {
      const data = await AIService.generateRedNoteSlides(aiConfig, markdown);
      setRedNoteData(data);
    } catch (error: any) {
      console.error(error);
      alert("卡片生成失败: " + error.message);
    } finally {
      setIsGeneratingRedNote(false);
    }
  };

  const handleSlideUpdate = (index: number, newSlide: SlideContent) => {
    setRedNoteData(prev => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      newSlides[index] = newSlide;
      return { ...prev, slides: newSlides };
    });
  };

  // --- SAVE / DELETE HANDLERS ---

  const handleAddCustomTemplate = (newTemplate: CardTemplate) => {
    if (savedTemplates.some(t => t.id === newTemplate.id)) return;
    setSavedTemplates(prev => [newTemplate, ...prev]);
    setCurrentTemplateId(newTemplate.id);
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个模版吗？')) {
      setSavedTemplates(prev => prev.filter(t => t.id !== id));
      if (currentTemplateId === id) {
        setCurrentTemplateId(CARD_TEMPLATES[0].id);
      }
    }
  };

  const handleSaveTheme = (themeToSave: AppTheme) => {
    if (savedThemes.some(t => t.id === themeToSave.id)) return;
    setSavedThemes(prev => [themeToSave, ...prev]);
  };

  const handleDeleteTheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个主题吗？')) {
      setSavedThemes(prev => prev.filter(t => t.id !== id));
      if (theme.id === id) {
        setTheme(DEFAULT_THEMES[0]);
      }
    }
  };

  // --- HISTORY HANDLERS ---

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleRestoreFromHistory = (content: string) => {
    setMarkdown(content);
    // Save the restored content as a new version
    saveToHistory(content, false);
  };

  return (
    <ScrollSync enabled={syncScrollEnabled} proportional={true} vertical={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#f4f5f0] text-stone-700 font-sans">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={(newConfig) => {
          setAiConfig(newConfig);
          setIsSettingsOpen(false);
        }}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        currentContent={markdown}
        onRestore={handleRestoreFromHistory}
      />

      {/* 1. Left Sidebar: Tools & Themes */}
      <aside 
        className="shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        <ToolsPanel
          currentTheme={theme}
          onThemeSelect={setTheme}
          onMarkdownUpdate={(md) => setMarkdown(md)}
          onCopyHtml={handleCopy}
          mode={mode}
          onModeChange={setMode}
          onRedNoteGenerate={handleRedNoteGenerate}
          isGeneratingRedNote={isGeneratingRedNote}
          currentTemplateId={currentTemplateId}
          onTemplateSelect={setCurrentTemplateId}

          savedThemes={savedThemes}
          onSaveTheme={handleSaveTheme}
          onDeleteTheme={handleDeleteTheme}

           savedTemplates={savedTemplates}
           onAddCustomTemplate={handleAddCustomTemplate}
           onDeleteTemplate={handleDeleteTemplate}

             aiConfig={aiConfig}
             onOpenSettings={() => setIsSettingsOpen(true)}
             onOpenHelp={() => setIsHelpOpen(true)}
             onOpenHistory={handleOpenHistory}

             syncScrollEnabled={syncScrollEnabled}
             onSyncScrollToggle={() => setSyncScrollEnabled(!syncScrollEnabled)}
          />
      </aside>

      {/* DRAG HANDLE 1: Sidebar <-> Right Panel */}
      <div
        className={`w-[4px] hover:w-[6px] -ml-[2px] z-30 cursor-col-resize flex items-center justify-center hover:bg-blue-400 active:bg-blue-600 transition-colors ${isDraggingSidebar ? 'bg-blue-600 w-[6px]' : 'bg-transparent'}`}
        onMouseDown={startResizingSidebar}
      />

      {/* 2. Right Panel (Editor + Preview) */}
      <main ref={rightPanelRef} className="flex-1 flex flex-row relative h-full overflow-hidden">
        
        {/* Editor Area */}
        <div
          className="h-full overflow-hidden"
          style={{ width: `${editorPercentage}%` }}
        >
          {syncScrollEnabled ? (
            <ScrollSyncPane group="markdown-editor" attachTo={editorRef}>
              <Editor ref={editorRef} value={markdown} onChange={setMarkdown} />
            </ScrollSyncPane>
          ) : (
            <Editor value={markdown} onChange={setMarkdown} />
          )}
        </div>

        {/* DRAG HANDLE 2: Editor <-> Preview */}
        <div
            className={`w-[4px] hover:w-[6px] -ml-[2px] z-30 cursor-col-resize flex items-center justify-center hover:bg-blue-400 active:bg-blue-600 transition-colors border-l border-[#e5e0d8] ${isDraggingEditor ? 'bg-blue-600 w-[6px]' : 'bg-[#f4f5f0]'}`}
            onMouseDown={startResizingEditor}
        />

        {/* Preview Area */}
        <div className="flex-1 h-full overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full z-0">
             {syncScrollEnabled && mode === 'wechat' ? (
               <ScrollSyncPane group="markdown-editor" attachTo={previewScrollRef}>
                 <Preview
                   ref={previewRef}
                   scrollRef={previewScrollRef}
                   markdown={markdown}
                   themeStyles={theme.styles}
                 />
               </ScrollSyncPane>
             ) : mode === 'wechat' ? (
               <Preview
                 ref={previewRef}
                 markdown={markdown}
                 themeStyles={theme.styles}
               />
             ) : (
               <RedNotePreview
                 data={redNoteData}
                 onUpdateSlide={handleSlideUpdate}
                 themeStyles={theme.styles}
                 templateId={currentTemplateId}
                 customTemplates={savedTemplates}
                 isGenerating={isGeneratingRedNote}
               />
             )}
           </div>
           
           {/* Toast */}
           {copyFeedback && mode === 'wechat' && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#3f6212] text-white px-6 py-2 rounded-full shadow-lg text-sm font-semibold animate-bounce flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               已复制到剪贴板
             </div>
           )}
         </div>
       </main>
     </div>
    </ScrollSync>
  );
};

export default App;
