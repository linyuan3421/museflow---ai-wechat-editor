import { forwardRef } from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ value, onChange }, ref) => {
  return (
    <div className="h-full w-full flex flex-col bg-white border-r border-[#e5e0d8]">
      <div className="px-5 py-4 border-b border-[#e5e0d8] flex justify-between items-center bg-[#fdfbf7]">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Markdown 编辑
        </span>
      </div>
      <textarea
        ref={ref}
        className="flex-1 w-full bg-white text-stone-700 p-8 resize-none focus:outline-none font-mono text-sm leading-loose placeholder:text-stone-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# 开始创作，或粘贴内容..."
        spellCheck={false}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;