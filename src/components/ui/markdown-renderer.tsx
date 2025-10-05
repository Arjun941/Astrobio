"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// CSS imported in globals.css

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Pre-process content to clean up formatting
  const processedContent = content
    .replace(/^BODY SECTIONS$/gm, '') // Remove "BODY SECTIONS" lines
    .replace(/\n\n\n+/g, '\n\n') // Clean up excessive line breaks
    .trim();

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none overflow-hidden break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customize heading styles - all same size for uniform appearance
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold mb-4 mt-6 text-foreground border-b border-border pb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-4 mt-6 text-foreground border-b border-border pb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-4 mt-6 text-foreground border-b border-border pb-2">{children}</h3>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="mb-4 text-foreground leading-relaxed break-words overflow-wrap-anywhere">{children}</p>
          ),
          // Customize code blocks
          code: ({ className, children, ...props }: any) => {
            const isInline = !className?.includes('language-');
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono break-all" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words" {...props}>
                {children}
              </code>
            );
          },
          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 italic">
              {children}
            </blockquote>
          ),
          // Customize lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
          ),
          // Customize links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary underline hover:text-primary/80 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Customize tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 max-w-full">
              <table className="min-w-full border border-border rounded-lg table-fixed">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-medium break-words overflow-hidden">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 break-words overflow-hidden">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}