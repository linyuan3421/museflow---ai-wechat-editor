import React, { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'guide'>('intro');

  const tabs = [
    { id: 'intro' as const, label: '产品介绍', icon: '✨' },
    { id: 'guide' as const, label: '快速开始', icon: '🚀' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-800/50 backdrop-blur-sm p-4">
      <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e5e0d8] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e0d8] bg-white flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.732 0 1.32.597 1.32 1.333v2.667c0 .736.357.32.597 1.32 1.32h1.326c.735 0 1.334-.597 1.333-1.332v2.667c0-.735-.357-1.333-.597-1.333H8.228c-.732 0-1.32-.597-1.32-1.333V9.333c0-.736.357-1.32.597-1.32h1.326c.735 0 1.334.597 1.333 1.332V6.667c0-.735-.357-1.333-.597-1.333H8.228c-.732 0-1.32-.597-1.32-1.333V9.333c0-.736.357-1.32.597-1.32h1.326c.735 0 1.334.597 1.333 1.332v2.667c0-.735.357-1.333.597-1.333H8.228z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 014 4 4 0 018 8 0z" /></svg>
            使用帮助
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e5e0d8] bg-white">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-stone-800 border-b-2 border-stone-800 bg-stone-50'
                  : 'text-stone-500 border-b-2 border-transparent hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#fcfaf7]">
          {activeTab === 'intro' && (
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <span className="text-3xl">🌊</span>
                </div>
                <h3 className="text-2xl font-bold text-stone-800">浮光 · 掠影</h3>
                <p className="text-stone-600 mt-2">
                  不仅仅是编辑器，更是你的 AI 设计伙伴。<br/>
                  <span className="font-medium text-stone-700">让 AI 为你的文字赋予设计美学。</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-stone-700">核心理念</h4>
                
                <div className="grid gap-4 mt-4">
                  <div className="bg-white p-4 rounded-xl border border-[#e5e0d8]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎨</span>
                      <span className="font-bold text-stone-700">双模渲染</span>
                    </div>
                    <p className="text-sm text-stone-600">
                      <span className="font-medium">公众号</span>：所见即所得的移动端仿真预览<br/>
                      <span className="font-medium">小红书</span>：智能拆解为竖屏卡片
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e5e0d8]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🤖</span>
                      <span className="font-bold text-stone-700">AI 灵感工坊</span>
                    </div>
                    <p className="text-sm text-stone-600">
                      文生主题 · 图生主题 · 智能格式清洗<br/>
                      <span className="text-stone-400 text-xs">BYOK：你的 API Key，本地存储</span>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e5e0d8]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔒</span>
                      <span className="font-bold text-stone-700">隐私优先</span>
                    </div>
                    <p className="text-sm text-stone-600">
                      所有数据存储在浏览器 LocalStorage<br/>
                      不经过任何中间服务器
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">配置 AI API Key</h4>
                    <p className="text-sm text-stone-600">
                      点击左侧栏顶部的 <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded">⚙️</span> 设置图标，输入 API Key。<br/>
                      <span className="text-stone-500 text-xs">支持 OpenAI 兼容接口（如 DeepSeek、通义千问等国内模型）</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold">2</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">开始创作</h4>
                    <p className="text-sm text-stone-600">
                      在中间 Markdown 编辑器中输入内容，支持标准 Markdown 语法。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold">3</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">应用主题</h4>
                    <p className="text-sm text-stone-600">
                      选择预设主题或使用 AI 生成个性化主题。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold">4</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">生成小红书卡片</h4>
                    <p className="text-sm text-stone-600">
                      切换到小红书模式，点击生成按钮，AI 自动将文章拆解为精美卡片。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="font-bold text-stone-800 mb-1">小贴士</p>
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <div className="flex items-center gap-2">
                        <img 
                          src="/assets/qrcode.jpg" 
                          alt="公众号二维码" 
                          className="w-20 h-20 rounded-lg border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex flex-col">
                          <p className="text-xs text-stone-500 mb-2">
                            扫码关注公众号
                          </p>
                          <span className="text-sm text-stone-600 font-medium">反时钟效率笔记</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e0d8] flex justify-between items-center">
          <a 
            href="https://github.com/linyuan3421/museflow---ai-wechat-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12v5.333c0-6.626 5.373-12 12-12h-2.523c-2.272-1.646-4.667-1.646-4.381 0-8.023 3.682-4.667 8.023v-2.523c0-2.272 1.646-4.667 1.646-4.381 0-8.023-3.682-4.667-8.023 2.272-0 4.667 1.646 4.667 4.381 0 8.023 3.682 4.667v2.523c0 2.272-1.646 4.667-1.646 4.381 0 8.023-3.682 4.667 8.023zM12 13.333c-2.917 0-5.638-1.167-7.638-2.853v1.646c1.686 3.099 2.853 6.768 2.853 6.768 2.853 1.686 3.099 2.853 6.768 2.853 6.768 2.853 1.686 3.099 2.853 6.768 2.853zM19.078 8.377c.976 0 1.771-.804 1.771-1.771v-6.389c0-.976-.804-1.771-1.771-1.771h-1.607v6.389c0 .976.804 1.771 1.771 1.771h1.607v-6.389c0-.976.804-1.771 1.771-1.771h-1.607z"/></svg>
            GitHub
          </a>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
