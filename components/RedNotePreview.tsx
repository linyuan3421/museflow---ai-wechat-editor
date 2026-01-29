import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { RedNoteData, SlideContent, ThemeStyles, CardTemplate, RedNoteStyleConfig } from '../types';

interface RedNotePreviewProps {
  data: RedNoteData | null;
  onUpdateSlide: (index: number, newSlide: SlideContent) => void;
  templateId: string;
  themeStyles?: ThemeStyles;
  customTemplates?: CardTemplate[];
  isGenerating: boolean;
}

const RedNotePreview: React.FC<RedNotePreviewProps> = ({ 
  data, 
  onUpdateSlide,
  templateId, 
  customTemplates = [], 
  isGenerating 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // --- EDIT HANDLERS ---
  
  const handleBlurTitle = (e: React.FocusEvent<HTMLElement>, slide: SlideContent, index: number) => {
    const newText = e.currentTarget.innerText;
    if (newText !== slide.title) {
      onUpdateSlide(index, { ...slide, title: newText });
    }
  };

  const handleBlurHighlight = (e: React.FocusEvent<HTMLElement>, slide: SlideContent, index: number) => {
    const newText = e.currentTarget.innerText;
    if (newText !== slide.highlight) {
      onUpdateSlide(index, { ...slide, highlight: newText });
    }
  };

  const handleBlurContentItem = (e: React.FocusEvent<HTMLElement>, slide: SlideContent, index: number, itemIndex: number) => {
    const newText = e.currentTarget.innerText;
    const newContent = [...(slide.content || [])];
    if (newContent[itemIndex] !== newText) {
      newContent[itemIndex] = newText;
      onUpdateSlide(index, { ...slide, content: newContent });
    }
  };

  // --- TEMPLATE RENDERERS ---

  // 1. SWISS GRID (黑白瑞士)
  const renderSwissGrid = (slide: SlideContent, index: number) => {
    const content = slide.content || [];
    return (
      <div className="w-full h-full bg-white text-black p-6 flex flex-col relative overflow-hidden border border-stone-200" style={{fontFamily: '"Inter", "Noto Sans SC", sans-serif'}}>
         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-10" 
              style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
         
         {/* Top Bar */}
         <div className="flex justify-between border-b-4 border-black pb-4 mb-6 z-10">
            <span className="font-bold text-xs tracking-widest uppercase">SWISS / GRID</span>
            <span className="font-bold text-xs bg-black text-white px-2 py-0.5 rounded-sm">0{index+1}</span>
         </div>

         {/* Content */}
         <div className="flex-1 flex flex-col z-10">
            {slide.layout === 'cover' ? (
              <div className="flex-1 flex flex-col justify-center">
                 <h1 
                    className="text-5xl font-black leading-tight tracking-tighter mb-4 outline-none focus:bg-stone-100/50"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                 >
                   {slide.title}
                 </h1>
                 <div className="w-20 h-2 bg-black mb-6"></div>
                 <p 
                    className="text-lg font-medium opacity-60 max-w-[90%] leading-relaxed outline-none focus:bg-stone-100/50"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                 >
                   {content[0] || ''}
                 </p>
              </div>
            ) : slide.layout === 'keyword' ? (
               <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <span 
                    className="text-8xl font-black tracking-tighter mb-2 scale-110 outline-none focus:bg-stone-100/50"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurHighlight(e, slide, index)}
                  >
                    {slide.highlight || index+1}
                  </span>
                  <h2 
                    className="text-xl font-bold uppercase tracking-widest border-t-2 border-black pt-4 w-full mt-4 outline-none focus:bg-stone-100/50"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                    {slide.title}
                  </h2>
               </div>
            ) : (
              <>
                <h2 
                  className="text-3xl font-black mb-8 border-l-[6px] border-black pl-4 leading-none uppercase tracking-tight outline-none focus:bg-stone-100/50"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlurTitle(e, slide, index)}
                >
                  {slide.title}
                </h2>
                <ul className="space-y-6">
                  {content.map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                       <span className="font-mono font-bold text-sm mt-1.5 opacity-50">0{i+1}</span>
                        <p 
                          className="font-medium text-base leading-relaxed text-[#111] outline-none focus:bg-stone-100/50"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                        >
                          {item}
                        </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
         </div>

         {/* Footer */}
         <div className="mt-auto pt-6 border-t border-black flex justify-between text-[10px] font-mono opacity-60 z-10 uppercase">
            <span>MuseFlow Design System</span>
            <span>{new Date().getFullYear()} Edition</span>
         </div>
      </div>
    );
  };

  // 2. GLASSMORPHISM (琉光拟态 - 极光版)
  const renderGlassmorphism = (slide: SlideContent, index: number) => {
    const content = slide.content || [];
    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col p-4 text-slate-800" style={{fontFamily: '"Lato", "Noto Sans SC", sans-serif'}}>
        {/* Soft Aurora Background (Mesh Gradient) */}
        <div className="absolute inset-0 bg-[#f8fafc]">
           <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-rose-200/60 rounded-full blur-[80px] mix-blend-multiply opacity-80"></div>
           <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-indigo-200/60 rounded-full blur-[80px] mix-blend-multiply opacity-80"></div>
           <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-sky-200/60 rounded-full blur-[80px] mix-blend-multiply opacity-80"></div>
        </div>

        {/* Frosted Glass Card Container */}
        <div className="relative z-10 flex-1 bg-white/30 backdrop-blur-xl border border-white/60 rounded-[24px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
           
           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

           {/* Header */}
           <div className="relative flex items-center justify-between mb-5 shrink-0">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-100 to-indigo-100 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {index+1}
                 </div>
                 <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-400">Aurora</span>
              </div>
              <div className="w-12 h-1.5 rounded-full bg-white/50 backdrop-blur-md"></div>
           </div>

           {/* Content */}
           <div className="flex-1 relative flex flex-col min-h-0">
             {slide.layout === 'cover' ? (
                <div className="flex flex-col h-full justify-center">
                  <div className="inline-flex self-start items-center gap-1 px-3 py-1 rounded-full bg-white/60 border border-white text-slate-500 text-[10px] font-bold mb-6 shadow-sm shrink-0">
                     <span>✨</span>
                     <span>INSIGHTS</span>
                  </div>
                  <h1 
                    className="text-[36px] font-bold leading-[1.15] mb-4 text-slate-800 tracking-tight drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-br from-slate-700 to-slate-500 outline-none focus:text-slate-900"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                    {slide.title}
                  </h1>
                  <p 
                    className="text-slate-600 font-medium leading-relaxed text-base outline-none focus:bg-white/40 rounded-lg overflow-y-auto max-h-full"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                  >
                    {content[0] || ''}
                  </p>
                </div>
             ) : (
                <>
                  <h2 
                    className="text-xl font-bold mb-4 text-slate-800 leading-snug outline-none focus:bg-white/40 rounded-lg shrink-0"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                    {slide.title}
                  </h2>
                  <div className="space-y-3 overflow-y-auto pr-1 pb-1 -mr-1 custom-scrollbar">
                    {content.map((item, i) => (
                      <div key={i} className="group flex gap-3 p-3 rounded-xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all shadow-sm shrink-0">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
                         <p 
                            className="text-[14px] font-medium leading-relaxed text-slate-600 tracking-wide outline-none focus:text-slate-800"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                         >
                            {item}
                         </p>
                      </div>
                    ))}
                  </div>
                </>
             )}
           </div>
           
           <div className="mt-auto pt-4 flex justify-center items-center opacity-40 shrink-0">
              <div className="w-16 h-1 rounded-full bg-slate-300"></div>
           </div>
        </div>
      </div>
    );
  };

  // 3. NEO-POP (新波普)
  const renderNeoPop = (slide: SlideContent, index: number) => {
    const bgColors = ['#FEF3C7', '#DBEAFE', '#FCE7F3', '#D1FAE5'];
    const accentColors = ['#F59E0B', '#3B82F6', '#EC4899', '#10B981'];
    const currentBg = bgColors[index % bgColors.length];
    const currentAccent = accentColors[index % accentColors.length];
    const content = slide.content || [];

    return (
      <div className="w-full h-full p-6 flex flex-col relative overflow-hidden" style={{backgroundColor: currentBg, fontFamily: '"Noto Sans SC", sans-serif'}}>
         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

         <div className="flex-1 border-4 border-black bg-white shadow-[8px_8px_0_0_#000] p-6 flex flex-col relative z-10 rounded-sm">
            
            <div className="absolute -top-5 -right-5 bg-black text-white px-4 py-2 font-black transform rotate-6 text-sm border-2 border-white shadow-lg z-20" style={{fontFamily: '"Oswald", sans-serif'}}>
               POP!
            </div>

            <div className="mb-8 border-b-4 border-black pb-6">
               <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-bold mb-3 transform -rotate-1">PART 0{index+1}</span>
               <h1 
                 className="text-4xl font-bold leading-[0.9] uppercase tracking-tighter text-black outline-none focus:bg-yellow-100"
                 style={{fontFamily: '"Oswald", sans-serif', textShadow: `2px 2px 0 ${currentAccent}`}}
                 contentEditable
                 suppressContentEditableWarning
                 onBlur={(e) => handleBlurTitle(e, slide, index)}
               >
                  {slide.title}
               </h1>
            </div>

            <div className="flex-1 space-y-5">
              {slide.layout === 'keyword' ? (
                 <div className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                    <span 
                        className="text-7xl font-black text-white transform -rotate-6 z-10 outline-none focus:underline" 
                        style={{fontFamily: '"Oswald", sans-serif'}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurHighlight(e, slide, index)}
                    >
                        {slide.highlight}
                    </span>
                 </div>
              ) : (
                content.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                     <div className="w-6 h-6 rounded-none border-2 border-black flex-shrink-0 flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110 group-hover:rotate-12" style={{backgroundColor: currentAccent}}>
                       {i+1}
                     </div>
                     <p 
                        className="font-bold text-[15px] leading-snug pt-0.5 outline-none focus:bg-yellow-100"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                     >
                         {item}
                     </p>
                  </div>
                ))
              )}
            </div>
         </div>
         
         <div className="mt-5 text-center font-black text-xs uppercase tracking-[0.2em] relative z-10 opacity-50" style={{fontFamily: '"Oswald", sans-serif'}}>
           MuseFlow / Pop Art Series
         </div>
      </div>
    );
  };

  // 4. ELEGANT NOTE (优雅笔记)
  const renderElegantNote = (slide: SlideContent, index: number) => {
    const content = slide.content || [];
    return (
      <div className="w-full h-full bg-[#fdfbf7] p-8 flex flex-col relative" style={{fontFamily: '"Noto Serif SC", serif'}}>
         <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(#444 1px, transparent 1px)', backgroundSize: '100% 32px', marginTop: '32px'}}></div>
         
         <div className="w-full flex justify-between items-start mb-10 border-b border-[#d6d3d1] pb-4">
            <span className="text-[#a8a29e] text-[10px] tracking-[0.2em] uppercase mt-1">Volume. {new Date().getMonth() + 1}</span>
            <div className="w-8 h-8 rounded-full border border-[#8c7a6b] flex items-center justify-center text-[#8c7a6b] text-sm italic font-serif">
               {index+1}
            </div>
         </div>

         <div className="flex-1 relative z-10">
            {slide.layout === 'cover' ? (
               <div className="text-center mt-8">
                  <h1 
                    className="text-4xl text-[#292524] leading-tight mb-8 italic outline-none focus:border-b focus:border-[#d6d3d1]" 
                    style={{fontFamily: '"Playfair Display", serif'}}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                     {slide.title}
                  </h1>
                  <div className="w-px h-16 bg-[#d6d3d1] mx-auto mb-8"></div>
                  <p 
                    className="text-[#57534e] text-base leading-loose font-light outline-none focus:bg-white"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                  >
                      {content[0] || ''}
                  </p>
               </div>
            ) : (
               <>
                  <h2 
                    className="text-2xl text-[#44403c] mb-8 relative inline-block pl-6 outline-none focus:bg-white" 
                    style={{fontFamily: '"Playfair Display", serif'}}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                     <span className="absolute left-0 top-0 text-4xl text-[#d6d3d1] opacity-50 -ml-2 -mt-2" contentEditable={false}>“</span>
                     {slide.title}
                  </h2>
                   <div className="space-y-6 pl-2">
                     {content.map((item, i) => (
                        <div key={i} className="relative">
                           <p 
                             className="text-[#44403c] text-[15px] leading-8 font-light outline-none focus:bg-white"
                             contentEditable
                             suppressContentEditableWarning
                             onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                           >
                              {item}
                           </p>
                        </div>
                     ))}
                  </div>
               </>
            )}
         </div>

         <div className="mt-auto text-center text-[#d6d3d1] text-[10px] uppercase tracking-widest font-sans">
            MuseFlow Studio
         </div>
      </div>
    );
  };

  // 5. INK RHYME (水墨气韵)
  const renderInkRhyme = (slide: SlideContent, index: number) => {
    const content = slide.content || [];
    return (
      <div className="w-full h-full bg-[#fdfbf7] flex flex-col relative overflow-hidden text-[#2c2926]" style={{fontFamily: '"Noto Serif SC", serif'}}>
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
         
         {/* Ink Wash Decoration - Subtle gradient blob */}
         <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none mix-blend-multiply" 
              style={{background: 'radial-gradient(circle, #2c2926 0%, transparent 70%)'}}></div>

         {/* Vertical Decoration Line */}
         <div className="absolute top-12 bottom-12 right-6 w-[1px] bg-[#e7e5e4]"></div>
         <div className="absolute top-12 right-[22px] text-[10px] text-[#a8a29e] font-serif writing-mode-vertical" style={{writingMode: 'vertical-rl'}}>
            浮光掠影 · 第{index+1}章
         </div>

         <div className="flex-1 p-8 pr-12 relative z-10 flex flex-col">
            {slide.layout === 'cover' ? (
               <div className="flex-1 flex flex-col justify-center">
                  {/* Red Seal */}
                  <div className="w-8 h-8 bg-[#b91c1c] text-[#fdfbf7] flex items-center justify-center font-serif rounded-sm shadow-sm mb-6 opacity-90">
                     <span className="font-bold text-sm">壹</span>
                  </div>
                  
                  <h1 
                    className="text-4xl leading-tight mb-8 text-[#1c1917] outline-none focus:bg-stone-100/30" 
                    style={{fontFamily: '"ZCOOL XiaoWei", "Ma Shan Zheng", serif'}}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurTitle(e, slide, index)}
                  >
                     {slide.title}
                  </h1>
                  
                  <div className="w-12 h-[2px] bg-[#b91c1c] mb-8 opacity-50"></div>
                  
                  <p 
                    className="text-base leading-loose text-[#44403c] font-light outline-none focus:bg-stone-100/30"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                  >
                      {content[0] || ''}
                  </p>
               </div>
            ) : (
               <>
                 <div className="mb-8 flex items-end gap-3 pb-4 border-b border-[#e7e5e4]">
                    <span className="text-4xl font-serif text-[#e7e5e4] leading-none">0{index+1}</span>
                    <h2 
                        className="text-2xl text-[#1c1917] outline-none focus:bg-stone-100/30 mb-1" 
                        style={{fontFamily: '"ZCOOL XiaoWei", serif'}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurTitle(e, slide, index)}
                    >
                        {slide.title}
                    </h2>
                 </div>
                 
                 <div className="space-y-6">
                    {content.map((item, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="mt-2 w-1.5 h-1.5 bg-[#b91c1c] rounded-full opacity-60 shrink-0"></div>
                          <p 
                            className="text-[#44403c] text-[15px] leading-loose font-light outline-none focus:bg-stone-100/30"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                          >
                             {item}
                          </p>
                       </div>
                    ))}
                 </div>
               </>
            )}
         </div>

         <div className="absolute bottom-6 left-8 right-12 flex justify-between items-end opacity-40">
            <div className="w-8 h-8 border border-[#2c2926] rounded-full flex items-center justify-center">
               <span className="text-[10px] font-serif">印</span>
            </div>
         </div>
      </div>
    );
  };

  // 6. FILM STORY (胶片故事)
  const renderFilmStory = (slide: SlideContent, index: number) => {
    const content = slide.content || [];
    return (
      <div className="w-full h-full bg-[#f5f5f4] flex flex-col relative overflow-hidden" style={{fontFamily: '"Lato", sans-serif'}}>
         {/* Heavy Grain Overlay */}
         <div className="absolute inset-0 opacity-40 pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

         {/* Cinematic Bars (Letterboxing) */}
         <div className="absolute top-0 left-0 right-0 h-8 bg-[#1c1917] z-10 flex items-center justify-between px-3">
             <span className="text-[8px] text-white/50 font-mono tracking-widest">ISO 400</span>
             <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-white/20"></div>
                <div className="w-1 h-1 rounded-full bg-white/20"></div>
                <div className="w-1 h-1 rounded-full bg-red-500/80 animate-pulse"></div>
             </div>
         </div>
         <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1c1917] z-10 flex items-center justify-center">
             <span className="text-[8px] text-white/50 font-mono tracking-[0.3em]">MUSEFLOW CINEMA</span>
         </div>

         <div className="flex-1 p-8 pt-16 flex flex-col relative z-0">
            {/* Timestamp */}
            <div className="absolute top-12 right-6 font-mono text-xs text-[#d97706] tracking-widest opacity-80">
               00:0{index+1}:14:28
            </div>

            {slide.layout === 'cover' ? (
                <div className="flex-1 flex flex-col justify-center text-center">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-[#a8a29e]">Scene {index+1}</span>
                    <h1 
                        className="text-4xl italic text-[#1c1917] mb-8 leading-tight outline-none focus:bg-stone-200/50" 
                        style={{fontFamily: '"Playfair Display", serif'}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurTitle(e, slide, index)}
                    >
                        {slide.title}
                    </h1>
                    <div className="relative inline-block mx-auto">
                        <div className="absolute -left-4 -top-4 text-4xl text-[#d97706] opacity-30 font-serif">“</div>
                        <p 
                            className="text-base text-[#44403c] font-medium leading-loose max-w-[90%] mx-auto outline-none focus:bg-stone-200/50"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                        >
                            {content[0] || ''}
                        </p>
                        <div className="absolute -right-4 -bottom-4 text-4xl text-[#d97706] opacity-30 font-serif rotate-180">“</div>
                    </div>
                </div>
            ) : (
                <>
                    <h2 
                        className="text-2xl italic font-bold text-[#1c1917] mb-8 border-b-2 border-[#1c1917] pb-4 inline-block self-start outline-none focus:bg-stone-200/50"
                        style={{fontFamily: '"Playfair Display", serif'}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurTitle(e, slide, index)}
                    >
                        {slide.title}
                    </h2>
                    <div className="space-y-6">
                        {content.map((item, i) => (
                            <div key={i} className="flex gap-4 items-baseline">
                                <span className="font-mono text-xs text-[#d97706] font-bold">0{i+1}</span>
                                <p 
                                    className="text-[15px] font-medium text-[#292524] leading-relaxed outline-none focus:bg-stone-200/50"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                                >
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
         </div>
      </div>
    );
  };

  // 7. UNIVERSAL DYNAMIC RENDERER (For AI Custom Templates)
  const renderDynamicCard = (slide: SlideContent, index: number, config: RedNoteStyleConfig) => {
    const content = slide.content || [];
    
    // Determine decoration overlay
    let decorationOverlay = null;
    if (config.decoration === 'noise') {
        decorationOverlay = <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>;
    } else if (config.decoration === 'grid') {
        decorationOverlay = <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: `linear-gradient(${config.textColor} 1px, transparent 1px), linear-gradient(90deg, ${config.textColor} 1px, transparent 1px)`, backgroundSize: '40px 40px'}}></div>;
    } else if (config.decoration === 'gradient-blob') {
        decorationOverlay = (
            <div className="absolute inset-0 pointer-events-none opacity-50">
               <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[80px]" style={{backgroundColor: config.accentColor, opacity: 0.3}}></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[80px]" style={{backgroundColor: config.borderColor, opacity: 0.3}}></div>
            </div>
        );
    }

    return (
      <div className="w-full h-full p-6 flex flex-col relative overflow-hidden" 
           style={{
               background: config.background, 
               fontFamily: config.fontFamily || '"Noto Sans SC", sans-serif',
               color: config.textColor
           }}>
         
         {decorationOverlay}

         {/* Header */}
         <div className="relative z-10 flex justify-between items-center mb-4 border-b pb-3 shrink-0" style={{borderColor: config.borderColor || 'rgba(0,0,0,0.1)'}}>
             <span className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-60">
                MuseFlow / {new Date().getFullYear()}
             </span>
             <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold" 
                  style={{
                      backgroundColor: config.accentColor, 
                      color: '#fff',
                      ...config.numberStyle
                  }}>
                {index + 1}
             </div>
         </div>

         {/* Body */}
         <div className="relative z-10 flex-1 flex flex-col min-h-0">
             {slide.layout === 'cover' ? (
                 <div className="flex-1 flex flex-col justify-center">
                    <h1 
                        className="text-4xl leading-tight mb-4 outline-none focus:opacity-50" 
                        style={{...config.titleStyle}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurTitle(e, slide, index)}
                    >
                        {slide.title}
                    </h1>
                    <div className="w-16 h-1 mb-4 shrink-0" style={{backgroundColor: config.accentColor}}></div>
                    <p 
                        className="text-lg opacity-80 font-medium leading-relaxed outline-none focus:opacity-100 overflow-y-auto custom-scrollbar"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurContentItem(e, slide, index, 0)}
                    >
                        {content[0] || ''}
                    </p>
                 </div>
             ) : (
                 <>
                    <h2 
                        className="text-2xl mb-4 leading-snug outline-none focus:opacity-50 shrink-0" 
                        style={{...config.titleStyle}}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlurTitle(e, slide, index)}
                    >
                        {slide.title}
                    </h2>
                    <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {content.map((item, i) => (
                            <li key={i} className="flex gap-3">
                                <span className="text-xs font-bold mt-1.5 opacity-50 shrink-0" style={{color: config.accentColor}}>0{i+1}</span>
                                <p 
                                    className="flex-1 text-[15px] leading-relaxed opacity-90 font-medium outline-none focus:opacity-100"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlurContentItem(e, slide, index, i)}
                                >
                                    {item}
                                </p>
                            </li>
                        ))}
                    </ul>
                 </>
             )}
         </div>
      </div>
    );
  };

  // --- MAIN RENDER LOGIC ---

  const renderCard = (slide: SlideContent, index: number) => {
     // Check if it's a custom template
     const customTpl = customTemplates.find(t => t.id === templateId);
     if (customTpl && customTpl.styleConfig) {
         return renderDynamicCard(slide, index, customTpl.styleConfig);
     }

     switch (templateId) {
        case 'glass-morphism': return renderGlassmorphism(slide, index);
        case 'neo-pop': return renderNeoPop(slide, index);
        case 'elegant-note': return renderElegantNote(slide, index);
        case 'ink-rhyme': return renderInkRhyme(slide, index);
        case 'film-story': return renderFilmStory(slide, index);
        case 'swiss-grid': 
        default: return renderSwissGrid(slide, index);
     }
  };

  const handleDownload = async () => {
    if (!containerRef.current) return;
    setDownloading(true);

    const cards = containerRef.current.querySelectorAll('.xhs-card-capture');
    
    try {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const canvas = await html2canvas(card, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });
        
        const link = document.createElement('a');
        link.download = `museflow-slide-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error("Download failed", err);
      alert("图片生成失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#f4f5f0] gap-4">
        <div className="w-12 h-12 border-4 border-[#e5e0d8] border-t-[#44403c] rounded-full animate-spin"></div>
        <p className="text-stone-500 text-sm font-medium animate-pulse">AI 正在设计卡片...</p>
      </div>
    );
  }

  // Safe check for data and data.slides
  if (!data || !data.slides || data.slides.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#f4f5f0] p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
          <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-lg font-bold text-stone-600 mb-2">小红书卡片模式</h3>
        <p className="text-sm text-stone-400 max-w-xs">
          点击左下角「生成小红书卡片」按钮，AI 将您的文章拆解为精美的 3:4 竖屏卡片组。
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#f4f5f0] flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-[#e5e0d8]">
        <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-700">预览: {data.slides.length} 张卡片</span>
            <span className="text-xs text-stone-400">
               {customTemplates.find(t => t.id === templateId)?.name || `模版: ${templateId}`}
            </span>
        </div>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="bg-[#ff2442] hover:bg-[#e61e3b] text-white text-xs font-bold py-2 px-6 rounded-full shadow-lg shadow-red-100 transition-all flex items-center gap-2 transform active:scale-95"
        >
          {downloading ? '保存中...' : '下载全部'}
          {!downloading && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center p-8 gap-8 snap-x snap-mandatory scroll-smooth custom-scrollbar">
        <div ref={containerRef} className="flex gap-8 px-4 h-full items-center">
            {data.slides.map((slide, index) => (
                <div key={index} className="snap-center shrink-0 flex flex-col gap-3 group">
                    {/* The Card Capture Target */}
                    <div 
                        className="xhs-card-capture w-[320px] h-[426px] shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        style={{transformStyle: 'preserve-3d'}}
                    >
                        {renderCard(slide, index)}
                    </div>
                    <span className="text-center text-xs text-stone-400 font-mono group-hover:text-[#ff2442] transition-colors">
                      {index + 1} / {data.slides.length}
                    </span>
                </div>
            ))}
            {/* Spacer for easier scrolling */}
            <div className="w-8 shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default RedNotePreview;