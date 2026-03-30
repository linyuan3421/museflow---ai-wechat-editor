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
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.732 0 1.32.597 1.32 1.333v2.667c0 .736.357.32.597 1.32 1.32h1.326c.735 0 1.334-.597 1.333-1.332v2.667c0-.735-.357-1.333-.597-1.333H8.228c-.732 0-1.32-.597-1.32-1.333V9.333c0-.736.357-1.32.597-1.32h1.326c.735 0 1.334.597 1.333 1.332V6.667c0-.735-.357-1.333-.597-1.333H8.228c-.732 0-1.32-.597-1.32-1.333V9.333c0-.736.357-1.32.597-1.32h1.326c.735 0 1.334.597 1.333 1.332v2.667c0-.735.357-1.333.597-1.333H8.228z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 014 4 4 4 0 018 8 0z" /></svg>
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
            <div className="p-8">
              {/* Hero Section */}
              <div className="text-center mb-10">
                <div className="w-14 h-14 bg-[#44403c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-xl font-serif-sc font-bold">光</span>
                </div>
                <h3 className="text-2xl font-serif-sc font-bold text-[#44403c] mb-2">浮光 · 掠影</h3>
                <p className="text-stone-500 text-sm">
                  写 Markdown，一键变身为公众号排版或小红书卡片
                </p>
              </div>

              {/* Features - Simple List, No Cards */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#44403c] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1">双平台输出</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      写一份内容，切到公众号模式复制到微信，或切到小红书模式导出为图片卡。不用维护两个版本。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#44403c] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1">AI 生成主题</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      输入"秋天的咖啡馆"或上传一张喜欢的图，AI 实时生成配色方案。每次都是独一无二的设计。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#44403c] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1">数据在你手里</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      API Key、草稿、自定义主题都存在你浏览器里。不经过任何服务器，你拥有完全控制权。
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Models */}
              <div className="mt-10 pt-6 border-t border-[#e5e0d8]">
                <p className="text-xs text-stone-400 mb-3 uppercase tracking-wider font-medium">支持的 AI 服务商</p>
                <div className="flex flex-wrap gap-2">
                  {['OpenAI', 'DeepSeek', 'Moonshot', '通义千问', 'Kimi', '其他 OpenAI 兼容接口'].map(name => (
                    <span key={name} className="px-3 py-1.5 text-xs bg-white border border-[#e5e0d8] rounded-full text-stone-600">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold shrink-0">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">配置 API Key</h4>
                    <p className="text-sm text-stone-600">
                      点击左侧 <span className="font-mono text-xs bg-stone-100 px-2 py-0.5 rounded">⚙️</span> 设置图标，选择服务商并填入你的 Key。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold shrink-0">2</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">写内容</h4>
                    <p className="text-sm text-stone-600">
                      在 Markdown 编辑器里写文章。支持标题、列表、引用、代码块等标准语法。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold shrink-0">3</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">选一个主题</h4>
                    <p className="text-sm text-stone-600">
                      左侧「样式库」有预设主题，也可以在「灵感工坊」让 AI 生成。喜欢就点收藏。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800 text-white font-bold shrink-0">4</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-800 mb-1">发布</h4>
                    <p className="text-sm text-stone-600">
                      公众号模式：点「复制到微信公众号」，直接粘贴到微信编辑器。<br/>
                      小红书模式：点「生成小红书卡片」，AI 拆解后可导出图片。
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl border border-[#e5e0d8] p-5">
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/qrcode.jpg" 
                    alt="公众号二维码" 
                    className="w-24 h-24 rounded-lg border border-[#e5e0d8]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-stone-700 mb-1">反时钟效率笔记</p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      关注公众号获取更新、教程和更多效率工具。
                    </p>
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