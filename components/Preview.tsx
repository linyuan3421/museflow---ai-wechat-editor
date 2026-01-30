import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ThemeStyles } from '../types';

interface PreviewProps {
  markdown: string;
  themeStyles: ThemeStyles;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ markdown, themeStyles }, ref) => {
  
  // Custom renderers to apply the ThemeStyles inline
  const components = {
    h1: ({ node, ...props }: any) => <h1 style={themeStyles.h1} {...props} />,
    h2: ({ node, ...props }: any) => <h2 style={themeStyles.h2} {...props} />,
    h3: ({ node, ...props }: any) => <h3 style={themeStyles.h3} {...props} />,
    p: ({ node, ...props }: any) => <p style={themeStyles.p} {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote style={themeStyles.blockquote} {...props} />,
    strong: ({ node, ...props }: any) => <strong style={themeStyles.strong} {...props} />,
    li: ({ node, ...props }: any) => <li style={themeStyles.li} {...props} />,
    ul: ({ node, ...props }: any) => <ul style={themeStyles.ul} {...props} />,
    ol: ({ node, ...props }: any) => <ol style={themeStyles.ol} {...props} />,
    a: ({ node, ...props }: any) => <a style={themeStyles.a} {...props} />,
    table: ({ node, ...props }: any) => <table style={themeStyles.table} {...props} />,
    thead: ({ node, ...props }: any) => <thead {...props} />,
    tbody: ({ node, ...props }: any) => <tbody {...props} />,
    tr: ({ node, ...props }: any) => <tr style={themeStyles.tr} {...props} />,
    th: ({ node, ...props }: any) => <th style={themeStyles.th} {...props} />,
    td: ({ node, ...props }: any) => <td style={themeStyles.td} {...props} />,
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return <code style={themeStyles.code} {...props} />;
      }
      
      const defaultPreStyles: React.CSSProperties = {
        padding: '16px',
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px', 
        overflowX: 'auto', 
        marginBottom: '24px',
        color: '#333'
      };
      
      // Use themeStyles.pre if available, otherwise default
      const preStyles = themeStyles.pre ? { ...defaultPreStyles, ...themeStyles.pre } : defaultPreStyles;

      return (
        <pre style={preStyles}>
          <code 
            style={{
               ...themeStyles.code, 
               backgroundColor: 'transparent', 
               padding: 0, 
               color: 'inherit',
               border: 'none',
               borderRadius: 0,
               fontSize: 'inherit'
            }} 
            {...props} 
          />
        </pre>
      );
    },
    img: ({ node, ...props }: any) => <img style={themeStyles.img} {...props} alt={props.alt || ''} />,
    hr: ({ node, ...props }: any) => <hr style={themeStyles.hr} {...props} />,
  };

  // Merge container styles with layout safety styles to prevent truncation
  const containerStyle = {
    ...themeStyles.container,
    height: 'auto', // Force auto height to allow growth
    minHeight: '100%',
    overflow: 'visible' // Prevent clipping inside the content
  };

  return (
    <div className="h-full w-full bg-[#f4f5f0] overflow-y-auto flex justify-center p-4 md:p-8">
      {/* Mobile Phone Simulator Container */}
      <div 
        className="w-[375px] min-h-[667px] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative flex flex-col"
        id="preview-container"
        ref={ref}
        style={{ height: 'max-content' }} // Ensure the div takes up the space of its content
      >
        {/* Actual Content Area */}
        <div 
          className="flex-1"
          style={containerStyle}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {markdown}
          </ReactMarkdown>

          {/* Footer spacer */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;